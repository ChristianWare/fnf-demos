// Whether emails (and the text alerts sent through email) really go out.
//
// EMAIL_DELIVERY="off" is for demos: every send reports success, so the
// app carries on and its toasts say "sent", but nothing leaves the site.
// No Resend key or sender address is needed. Anything else (or unset)
// sends for real.
//
// Every email in the app gets its Resend client from createResend() and
// its sender from emailFrom(), so this one switch covers them all.

import { randomUUID } from "crypto";
import { Resend } from "resend";

export function emailDeliveryOff(): boolean {
  return (process.env.EMAIL_DELIVERY ?? "").trim().toLowerCase() === "off";
}

type SendPayload = { to?: string | string[]; subject?: string };

/** Answers like Resend does after a successful send. */
const sentOk = () => ({
  data: { id: `demo_${randomUUID()}` },
  error: null,
  headers: null,
});

// Stands in for the Resend client when delivery is off.
const notSent = {
  emails: {
    send: async (payload: SendPayload) => {
      const to = Array.isArray(payload?.to)
        ? payload.to.join(", ")
        : payload?.to;
      console.info(
        `[email off] Not sent: "${payload?.subject ?? ""}" to ${to ?? "?"}`,
      );
      return sentOk();
    },
  },
  batch: {
    send: async (payloads: SendPayload[]) => {
      console.info(`[email off] Not sent: a batch of ${payloads.length}`);
      return { data: { data: payloads.map(() => sentOk().data) }, error: null };
    },
  },
};

/** The Resend client, or one that sends nothing when delivery is off. */
export function createResend(): Resend {
  if (emailDeliveryOff()) return notSent as unknown as Resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing required env var: RESEND_API_KEY");
  return new Resend(key);
}

/** RESEND_FROM. When delivery is off it can be blank. */
export function emailFrom(): string {
  const from = (process.env.RESEND_FROM ?? "").trim();
  if (from) return from;
  if (emailDeliveryOff()) return "Demo <demo@example.com>";
  throw new Error("Missing required env var: RESEND_FROM");
}

/** For senders that fall back through several "from" settings. */
export function emailFromFallback(...candidates: (string | undefined)[]) {
  for (const c of candidates) {
    const v = (c ?? "").trim();
    if (v) return v;
  }
  return emailDeliveryOff() ? "Demo <demo@example.com>" : "";
}
