# llm-guardrails-ts

Small TypeScript helpers for putting LLM agents near real users: PII redaction, invented-fact checks, human-handoff triggers, input sanitation.

## Why

An AI demo is easy. A system people trust needs guardrails: never invent prices or URLs, never leak PII into logs, and hand off to a human when things get urgent.

## Install and test

```bash
npm install
npm test
npm run build
```

## API

- `redactPII(text)` — replace emails and phone numbers with `[redacted]`
- `validateNoInventions(reply)` — flag agent replies containing prices, URLs, or phone numbers the model may have invented; returns `{ ok, reasons }`
- `shouldEscalateToHuman(message)` — true when the message looks urgent, angry, or explicitly asks for a human
- `sanitizeInput(input, maxLength?)` — trim, collapse whitespace, cap length

## Tests

Jest suite in `tests/` covers every helper. Run with `npm test`.
