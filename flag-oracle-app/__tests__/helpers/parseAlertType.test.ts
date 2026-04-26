import { parseAlertType } from "@/helpers/parseAlertType";

describe("parseAlertType", () => {
  it("should return 'alert--error' for 'alert-auth-error'", () => {
    expect(parseAlertType("alert-auth-error")).toBe("alert--error");
  });

  it("should return 'alert--success' for 'alert-auth-success'", () => {
    expect(parseAlertType("alert-auth-success")).toBe("alert--success");
  });

  it("should return 'unknown' for empty string", () => {
    expect(parseAlertType("")).toBe("unknown");
  });

  it("should return a string for all valid alert types", () => {
    expect(typeof parseAlertType("alert-auth-error")).toBe("string");
    expect(typeof parseAlertType("alert-auth-success")).toBe("string");
    expect(typeof parseAlertType("")).toBe("string");
  });
});
