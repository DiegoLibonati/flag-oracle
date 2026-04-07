import { parseAlertType } from "@/helpers/parseAlertType";

describe("parseAlertType", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return "alert--error" for "alert-auth-error"', () => {
    expect(parseAlertType("alert-auth-error")).toBe("alert--error");
  });

  it('should return "alert--success" for "alert-auth-success"', () => {
    expect(parseAlertType("alert-auth-success")).toBe("alert--success");
  });

  it('should return "unknown" for an empty string', () => {
    expect(parseAlertType("")).toBe("unknown");
  });
});
