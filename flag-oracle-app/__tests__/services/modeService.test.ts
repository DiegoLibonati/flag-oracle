import { http, HttpResponse } from "msw";

import modeService from "@/services/modeService";

import { mockMode, mockModes } from "@tests/__mocks__/modes.mock";
import { mockMswServer } from "@tests/__mocks__/mswServer.mock";
import { mockUsersTop } from "@tests/__mocks__/usersTop.mock";

describe("modeService", () => {
  describe("getAll", () => {
    it("should return modes data on a successful response", async () => {
      mockMswServer.use(
        http.get("/api/v1/modes/", () => {
          return HttpResponse.json({
            message: "ok",
            code: "SUCCESS_GET_ALL_MODES",
            data: mockModes,
          });
        })
      );

      const result = await modeService.getAll();

      expect(result.data).toEqual(mockModes);
    });

    it("should throw an HTTP error when response is 500", async () => {
      mockMswServer.use(
        http.get("/api/v1/modes/", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(modeService.getAll()).rejects.toThrow("HTTP error! status: 500");
    });
  });

  describe("getById", () => {
    it("should return mode data on a successful response", async () => {
      mockMswServer.use(
        http.get("/api/v1/modes/:id", () => {
          return HttpResponse.json({ message: "ok", code: "SUCCESS_GET_MODE", data: mockMode });
        })
      );

      const result = await modeService.getById(mockMode._id);

      expect(result.data).toEqual(mockMode);
    });

    it("should use the provided id in the URL path", async () => {
      let capturedId: string | undefined;
      mockMswServer.use(
        http.get("/api/v1/modes/:id", ({ params }) => {
          capturedId = String(params.id);
          return HttpResponse.json({ message: "ok", code: "S001", data: mockMode });
        })
      );

      await modeService.getById("mode-id-123");

      expect(capturedId).toBe("mode-id-123");
    });

    it("should throw an HTTP error when response is 404", async () => {
      mockMswServer.use(
        http.get("/api/v1/modes/:id", () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(modeService.getById("invalid-id")).rejects.toThrow("HTTP error! status: 404");
    });
  });

  describe("getTopMode", () => {
    it("should return top users data on a successful response", async () => {
      mockMswServer.use(
        http.get("/api/v1/modes/:id/top", () => {
          return HttpResponse.json({
            message: "ok",
            code: "SUCCESS_GET_TOP_MODE",
            data: mockUsersTop,
          });
        })
      );

      const result = await modeService.getTopMode(mockMode._id);

      expect(result.data).toEqual(mockUsersTop);
    });

    it("should use the provided idMode in the URL path", async () => {
      let capturedId: string | undefined;
      mockMswServer.use(
        http.get("/api/v1/modes/:id/top", ({ params }) => {
          capturedId = String(params.id);
          return HttpResponse.json({ message: "ok", code: "S001", data: [] });
        })
      );

      await modeService.getTopMode("mode-id-123");

      expect(capturedId).toBe("mode-id-123");
    });

    it("should throw an HTTP error when response is 404", async () => {
      mockMswServer.use(
        http.get("/api/v1/modes/:id/top", () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(modeService.getTopMode("invalid-id")).rejects.toThrow("HTTP error! status: 404");
    });
  });
});
