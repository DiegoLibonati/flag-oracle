import { parseZero } from "@/helpers/parseZero";

describe("parseZero", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should pad 0 with a leading zero", () => {
    expect(parseZero(0)).toBe("00");
  });

  it("should pad single-digit numbers with a leading zero", () => {
    expect(parseZero(1)).toBe("01");
    expect(parseZero(5)).toBe("05");
    expect(parseZero(9)).toBe("09");
  });

  it("should not pad numbers 10 or greater", () => {
    expect(parseZero(10)).toBe("10");
    expect(parseZero(59)).toBe("59");
    expect(parseZero(100)).toBe("100");
  });
});
