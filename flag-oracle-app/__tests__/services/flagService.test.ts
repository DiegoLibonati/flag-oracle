import { http, HttpResponse } from "msw";

import flagService from "@/services/flagService";

import { mockFlags } from "@tests/__mocks__/flags.mock";
import { mockMswServer } from "@tests/__mocks__/mswServer.mock";

describe("flagService", () => {
  describe("getAll", () => {
    it("should return flags data on a successful response", async () => {
      mockMswServer.use(
        http.get("/api/v1/flags/", () => {
          return HttpResponse.json({
            message: "Flags retrieved",
            code: "SUCCESS_GET_ALL_FLAGS",
            data: mockFlags,
          });
        })
      );

      const result = await flagService.getAll();

      expect(result.data).toEqual(mockFlags);
    });

    it("should return code and message on a successful response", async () => {
      mockMswServer.use(
        http.get("/api/v1/flags/", () => {
          return HttpResponse.json({
            message: "Flags retrieved",
            code: "SUCCESS_GET_ALL_FLAGS",
            data: mockFlags,
          });
        })
      );

      const result = await flagService.getAll();

      expect(result.message).toBe("Flags retrieved");
      expect(result.code).toBe("SUCCESS_GET_ALL_FLAGS");
    });

    it("should throw an HTTP error when response status is 500", async () => {
      mockMswServer.use(
        http.get("/api/v1/flags/", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(flagService.getAll()).rejects.toThrow("HTTP error! status: 500");
    });

    it("should throw an HTTP error with the correct status when response is 404", async () => {
      mockMswServer.use(
        http.get("/api/v1/flags/", () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(flagService.getAll()).rejects.toThrow("HTTP error! status: 404");
    });
  });

  describe("getRandoms", () => {
    it("should return the requested quantity of flags on success", async () => {
      mockMswServer.use(
        http.get("/api/v1/flags/random/:quantity", ({ params }) => {
          const quantity = Number(params.quantity);
          return HttpResponse.json({
            message: "ok",
            code: "SUCCESS_GET_ALL_FLAGS",
            data: mockFlags.slice(0, quantity),
          });
        })
      );

      const result = await flagService.getRandoms(2);

      expect(result.data).toHaveLength(2);
    });

    it("should return flag objects with the expected shape", async () => {
      mockMswServer.use(
        http.get("/api/v1/flags/random/:quantity", () => {
          return HttpResponse.json({ message: "ok", code: "S001", data: [mockFlags[0]] });
        })
      );

      const result = await flagService.getRandoms(1);

      expect(result.data[0]).toEqual(mockFlags[0]);
    });

    it("should throw an HTTP error when response is 404", async () => {
      mockMswServer.use(
        http.get("/api/v1/flags/random/:quantity", () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(flagService.getRandoms(5)).rejects.toThrow("HTTP error! status: 404");
    });

    it("should use the provided quantity in the URL path", async () => {
      let capturedQuantity: string | undefined;
      mockMswServer.use(
        http.get("/api/v1/flags/random/:quantity", ({ params }) => {
          capturedQuantity = String(params.quantity);
          return HttpResponse.json({ message: "ok", code: "S001", data: [] });
        })
      );

      await flagService.getRandoms(7);

      expect(capturedQuantity).toBe("7");
    });
  });
});
