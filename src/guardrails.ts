/**
 * Small guardrail helpers for LLM-powered apps.
 * Patterns I use when putting AI agents near real users.
 */

export interface GuardrailResult {
  ok: boolean;
  reasons: string[];
}

const PRICE_PATTERN = /\$\s?\d/;
const URL_PATTERN = /https?:\/\/\S+/;
const PHONE_PATTERN = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/;
const EMAIL_PATTERN = /\b[\w.-]+@[\w.-]+\.\w+\b/g;

/** Remove PII from text before logging or displaying it. */
export function redactPII(text: string): string {
  return text
    .replace(EMAIL_PATTERN, "[redacted]")
    .replace(PHONE_PATTERN, "[redacted]");
}

/** Check an agent reply for facts it may have invented (prices, URLs, phone numbers). */
export function validateNoInventions(reply: string): GuardrailResult {
  const reasons: string[] = [];
  if (PRICE_PATTERN.test(reply)) reasons.push("reply contains a price the agent may have invented");
  if (URL_PATTERN.test(reply)) reasons.push("reply contains a URL the agent may have invented");
  if (PHONE_PATTERN.test(reply)) reasons.push("reply contains a phone number the agent may have invented");
  return { ok: reasons.length === 0, reasons };
}

/** Decide whether a conversation should be handed off to a human. */
export function shouldEscalateToHuman(message: string): boolean {
  const triggers = [
    /emergency|urgent|asap/i,
    /speak to (a )?human|real person|someone real/i,
    /complaint|angry|frustrat/i,
  ];
  return triggers.some((t) => t.test(message));
}

/** Basic input sanitation: trim, collapse whitespace, cap length. */
export function sanitizeInput(input: string, maxLength = 2000): string {
  return input.replace(/\s+/g, " ").trim().slice(0, maxLength);
}
