import { parseZero } from "@/helpers/parseZero";

describe("parseZero", () => {
  describe("single digit numbers", () => {
    it("should return '00' for 0", () => {
      expect(parseZero(0)).toBe("00");
    });

    it("should return '01' for 1", () => {
      expect(parseZero(1)).toBe("01");
    });

    it("should return '09' for 9", () => {
      expect(parseZero(9)).toBe("09");
    });

    it("should prepend zero to any number less than 10", () => {
      expect(parseZero(5)).toMatch(/^0/);
    });
  });

  describe("multi digit numbers", () => {
    it("should return '10' for 10 without zero prefix", () => {
      expect(parseZero(10)).toBe("10");
    });

    it("should return '59' for 59 without zero prefix", () => {
      expect(parseZero(59)).toBe("59");
    });

    it("should return '100' for 100 without zero prefix", () => {
      expect(parseZero(100)).toBe("100");
    });
  });

  describe("return type", () => {
    it("should always return a string", () => {
      expect(typeof parseZero(0)).toBe("string");
      expect(typeof parseZero(5)).toBe("string");
      expect(typeof parseZero(15)).toBe("string");
    });
  });
});
