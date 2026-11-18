import { createResend } from "@/lib/email/delivery";
import { SITE } from "@/config/site";

export async function sendAdminNotificationEmail(args: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const from =
    // RESEND_FROM first: it's the verified sender every other email uses.
    // EMAIL_FROM is an older fallback.
    process.env.RESEND_FROM ||
    process.env.EMAIL_FROM ||
    `${SITE.name} <${SITE.email.noReply}>`;

  const resend = createResend();

  await resend.emails.send({
    from,
    to: args.to,
    subject: args.subject,
    text: args.text,
    ...(args.html && { html: args.html }),
  });
}
