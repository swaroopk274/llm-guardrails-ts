import {
  redactPII,
  validateNoInventions,
  shouldEscalateToHuman,
  sanitizeInput,
} from "../src/guardrails";

describe("redactPII", () => {
  it("redacts email addresses", () => {
    expect(redactPII("contact me at jane@example.com")).toBe(
      "contact me at [redacted]"
    );
  });

  it("redacts phone numbers", () => {
    expect(redactPII("call 555-123-4567")).toBe("call [redacted]");
  });

  it("leaves clean text untouched", () => {
    expect(redactPII("hello there")).toBe("hello there");
  });
});

describe("validateNoInventions", () => {
  it("flags invented prices", () => {
    const r = validateNoInventions("That will be $49.");
    expect(r.ok).toBe(false);
    expect(r.reasons.length).toBeGreaterThan(0);
  });

  it("flags invented URLs", () => {
    const r = validateNoInventions("See https://example.com/deal for details.");
    expect(r.ok).toBe(false);
  });

  it("passes clean replies", () => {
    expect(validateNoInventions("Thanks, I logged your request.").ok).toBe(true);
  });
});

describe("shouldEscalateToHuman", () => {
  it("escalates urgent messages", () => {
    expect(shouldEscalateToHuman("This is an emergency")).toBe(true);
  });

  it("escalates requests for a human", () => {
    expect(shouldEscalateToHuman("Can I speak to a human?")).toBe(true);
  });

  it("does not escalate routine messages", () => {
    expect(shouldEscalateToHuman("What are your hours?")).toBe(false);
  });
});

describe("sanitizeInput", () => {
  it("trims and collapses whitespace", () => {
    expect(sanitizeInput("  hello   world  ")).toBe("hello world");
  });

  it("caps length", () => {
    expect(sanitizeInput("abcdef", 3)).toBe("abc");
  });
});
