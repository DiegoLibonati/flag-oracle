import flagService from "@/services/flagService";

import { mockFlags } from "@tests/__mocks__/flags.mock";

const mockFetchSuccess = (data: unknown): void => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => await data,
  } as Response);
};

const mockFetchError = (status: number): void => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
  } as Response);
};

describe("flagService", () => {
  describe("getAll", () => {
    it("should call fetch with GET method", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockFlags });
      await flagService.getAll();
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/flags/",
        expect.objectContaining({ method: "GET" })
      );
    });

    it("should include Content-Type application/json header", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockFlags });
      await flagService.getAll();
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/flags/",
        expect.objectContaining({
          headers: expect.objectContaining({ "Content-Type": "application/json" }),
        })
      );
    });

    it("should return response data on success", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockFlags });
      const result = await flagService.getAll();
      expect(result.data).toEqual(mockFlags);
    });

    it("should return message and code on success", async () => {
      mockFetchSuccess({ message: "Flags retrieved", code: "S001", data: mockFlags });
      const result = await flagService.getAll();
      expect(result.message).toBe("Flags retrieved");
      expect(result.code).toBe("S001");
    });

    it("should throw an error when response is not ok", async () => {
      mockFetchError(500);
      await expect(flagService.getAll()).rejects.toThrow("HTTP error! status: 500");
    });

    it("should throw with the correct status code in the error message", async () => {
      mockFetchError(404);
      await expect(flagService.getAll()).rejects.toThrow("HTTP error! status: 404");
    });
  });

  describe("getRandoms", () => {
    it("should call fetch with the quantity in the URL", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockFlags });
      await flagService.getRandoms(5);
      expect(global.fetch).toHaveBeenCalledWith("/api/v1/flags/random/5", expect.anything());
    });

    it("should call fetch with GET method", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockFlags });
      await flagService.getRandoms(5);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/flags/random/"),
        expect.objectContaining({ method: "GET" })
      );
    });

    it("should return flags data on success", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockFlags });
      const result = await flagService.getRandoms(5);
      expect(result.data).toEqual(mockFlags);
    });

    it("should throw an error when response is not ok", async () => {
      mockFetchError(404);
      await expect(flagService.getRandoms(5)).rejects.toThrow("HTTP error! status: 404");
    });

    it("should use the provided quantity in the URL", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockFlags });
      await flagService.getRandoms(10);
      expect(global.fetch).toHaveBeenCalledWith("/api/v1/flags/random/10", expect.anything());
    });
  });
});
