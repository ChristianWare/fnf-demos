/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/stripe.ts
import Stripe from "stripe";
import { db } from "@/lib/db";
import { decrypt } from "./encryption";
import { getLiveDemo } from "@/lib/platform/context";

const STRIPE_API_VERSION = "2025-12-15.clover";

// ── Demos ──
//
// Every demo uses the one F&F Demos Stripe account (STRIPE_SECRET_KEY,
// test mode) and its one webhook, whatever is saved in the demo's own
// Payment Settings. Everything a demo creates in Stripe carries its id in
// the metadata (fnf_demo), so the webhook knows whose payment it is
// (src/app/api/stripe/webhook/route.ts).

/** The metadata key that names the demo a Stripe object belongs to. */
export const DEMO_METADATA_KEY = "fnf_demo";

async function liveDemoId(): Promise<string | null> {
  try {
    return (await getLiveDemo())?.id ?? null;
  } catch {
    return null;
  }
}

/** Adds the demo's id to the metadata of everything this client creates. */
function tagDemo(client: Stripe, demoId: string): Stripe {
  const tag = (metadata: unknown) => ({
    ...((metadata as Record<string, string>) ?? {}),
    [DEMO_METADATA_KEY]: demoId,
  });
  const wrap = (resource: any, add: (params: any) => any) => {
    const create = resource.create.bind(resource);
    resource.create = (params: any = {}, ...rest: any[]) =>
      create(add({ ...params, metadata: tag(params.metadata) }), ...rest);
  };
  const same = (p: any) => p;
  wrap(client.paymentIntents, same);
  wrap(client.setupIntents, same);
  wrap(client.customers, same);
  wrap(client.invoices, same);
  // A Checkout session makes its own payment or setup intent: tag it too.
  wrap(client.checkout.sessions, (p: any) =>
    p.mode === "setup"
      ? {
          ...p,
          setup_intent_data: {
            ...p.setup_intent_data,
            metadata: tag(p.setup_intent_data?.metadata),
          },
        }
      : p.mode === "subscription"
        ? p
        : {
            ...p,
            payment_intent_data: {
              ...p.payment_intent_data,
              metadata: tag(p.payment_intent_data?.metadata),
            },
          },
  );
  return client;
}

/**
 * Get a Stripe client instance.
 *
 * Priority:
 *  1. Database (CompanySettings.stripeSecretKeyEncrypted)
 *  2. Environment variable (STRIPE_SECRET_KEY)
 *
 * Always creates a fresh instance since the key could change.
 */
export async function getStripe(): Promise<Stripe> {
  const demoId = await liveDemoId();
  if (demoId) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key)
      throw new Error("Demos need STRIPE_SECRET_KEY (the F&F Demos test key).");
    return tagDemo(new Stripe(key, { apiVersion: STRIPE_API_VERSION }), demoId);
  }

  // 1. Try database first
  try {
    const settings = await db.companySettings.findUnique({
      where: { id: "default" },
      select: { stripeSecretKeyEncrypted: true },
    });

    if (settings?.stripeSecretKeyEncrypted) {
      const secretKey = decrypt(settings.stripeSecretKeyEncrypted);
      if (secretKey && secretKey.startsWith("sk_")) {
        return new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });
      }
    }
  } catch (e) {
    console.warn("[getStripe] Failed to load from DB, falling back to env:", e);
  }

  // 2. Fall back to env
  const envKey = process.env.STRIPE_SECRET_KEY;
  if (!envKey) {
    throw new Error(
      "No Stripe secret key configured. Add one in Admin → Earnings → Payment Settings, or set STRIPE_SECRET_KEY in .env",
    );
  }

  return new Stripe(envKey, { apiVersion: STRIPE_API_VERSION });
}

/**
 * Get the Stripe webhook secret.
 *
 * Priority:
 *  1. Database (CompanySettings.stripeWebhookSecretEncrypted)
 *  2. Environment variable (STRIPE_WEBHOOK_SECRET)
 */
export async function getStripeWebhookSecret(): Promise<string> {
  try {
    const settings = await db.companySettings.findUnique({
      where: { id: "default" },
      select: { stripeWebhookSecretEncrypted: true },
    });

    if (settings?.stripeWebhookSecretEncrypted) {
      const secret = decrypt(settings.stripeWebhookSecretEncrypted);
      if (secret && secret.startsWith("whsec_")) {
        return secret;
      }
    }
  } catch (e) {
    console.warn(
      "[getStripeWebhookSecret] Failed to load from DB, falling back to env:",
      e,
    );
  }

  const envSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!envSecret) {
    throw new Error(
      "No Stripe webhook secret configured. Add one in Admin → Earnings → Payment Settings, or set STRIPE_WEBHOOK_SECRET in .env",
    );
  }

  return envSecret;
}

/**
 * Get the Stripe publishable key for client-side usage.
 *
 * Priority:
 *  1. Database (CompanySettings.stripePublishableKey)
 *  2. Environment variable (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
 */
export async function getStripePublishableKey(): Promise<string | null> {
  // Demos: the shared F&F Demos account.
  if (await liveDemoId()) {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null;
  }
  try {
    const settings = await db.companySettings.findUnique({
      where: { id: "default" },
      select: { stripePublishableKey: true },
    });

    if (
      settings?.stripePublishableKey &&
      settings.stripePublishableKey.startsWith("pk_")
    ) {
      return settings.stripePublishableKey;
    }
  } catch (e) {
    console.warn(
      "[getStripePublishableKey] Failed to load from DB, falling back to env:",
      e,
    );
  }

  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null;
}

// ─────────────────────────────────────────────────────
// LEGACY: Keep a sync export during transition.
// Files that import { stripe } will still work with env vars.
// Migrate these to `await getStripe()` over time.
// ─────────────────────────────────────────────────────

const envKey = process.env.STRIPE_SECRET_KEY;
export const stripe = envKey
  ? new Stripe(envKey, { apiVersion: STRIPE_API_VERSION })
  : (null as unknown as Stripe);
