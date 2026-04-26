import modeService from "@/services/modeService";

import { mockModes, mockMode } from "@tests/__mocks__/modes.mock";
import { mockUsersTop } from "@tests/__mocks__/usersTop.mock";

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

describe("modeService", () => {
  describe("getAll", () => {
    it("should call fetch for /api/v1/modes/ with GET", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockModes });
      await modeService.getAll();
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/modes/",
        expect.objectContaining({ method: "GET" })
      );
    });

    it("should return modes data on success", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockModes });
      const result = await modeService.getAll();
      expect(result.data).toEqual(mockModes);
    });

    it("should throw when response is not ok", async () => {
      mockFetchError(500);
      await expect(modeService.getAll()).rejects.toThrow("HTTP error! status: 500");
    });
  });

  describe("getById", () => {
    it("should call fetch with the mode id in the URL", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockMode });
      await modeService.getById("mode-id-123");
      expect(global.fetch).toHaveBeenCalledWith("/api/v1/modes/mode-id-123", expect.anything());
    });

    it("should call fetch with GET method", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockMode });
      await modeService.getById(mockMode._id);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/modes/"),
        expect.objectContaining({ method: "GET" })
      );
    });

    it("should return mode data on success", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockMode });
      const result = await modeService.getById(mockMode._id);
      expect(result.data).toEqual(mockMode);
    });

    it("should throw when response is not ok", async () => {
      mockFetchError(404);
      await expect(modeService.getById("invalid-id")).rejects.toThrow("HTTP error! status: 404");
    });
  });

  describe("getTopMode", () => {
    it("should call fetch with the mode id and /top suffix", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockUsersTop });
      await modeService.getTopMode("mode-id-123");
      expect(global.fetch).toHaveBeenCalledWith("/api/v1/modes/mode-id-123/top");
    });

    it("should return top users data on success", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockUsersTop });
      const result = await modeService.getTopMode(mockMode._id);
      expect(result.data).toEqual(mockUsersTop);
    });

    it("should throw when response is not ok", async () => {
      mockFetchError(404);
      await expect(modeService.getTopMode("invalid-id")).rejects.toThrow("HTTP error! status: 404");
    });
  });
});
