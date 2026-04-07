import modeService from "@/services/modeService";

import { mockMode } from "@tests/__mocks__/modes.mock";
import { mockUserTop } from "@tests/__mocks__/usersTop.mock";

describe("modeService", () => {
  const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should call the correct endpoint and return all modes", async () => {
      const mockResponse = { message: "OK", code: "SUCCESS", data: [mockMode] };
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as unknown as Response);

      const result = await modeService.getAll();

      expect(mockedFetch).toHaveBeenCalledWith(
        "/api/v1/modes/",
        expect.objectContaining({ method: "GET" })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when the response is not ok", async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as unknown as Response);

      await expect(modeService.getAll()).rejects.toThrow("HTTP error! status: 500");
    });
  });

  describe("getById", () => {
    it("should call the correct endpoint with the given id", async () => {
      const mockResponse = { message: "OK", code: "SUCCESS", data: mockMode };
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as unknown as Response);

      const result = await modeService.getById(mockMode._id);

      expect(mockedFetch).toHaveBeenCalledWith(
        `/api/v1/modes/${mockMode._id}`,
        expect.objectContaining({ method: "GET" })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when the response is not ok", async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as unknown as Response);

      await expect(modeService.getById(mockMode._id)).rejects.toThrow("HTTP error! status: 404");
    });
  });

  describe("getTopMode", () => {
    it("should call the correct endpoint and return top users for the mode", async () => {
      const mockResponse = { message: "OK", code: "SUCCESS", data: [mockUserTop] };
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as unknown as Response);

      const result = await modeService.getTopMode(mockMode._id);

      expect(mockedFetch).toHaveBeenCalledWith(`/api/v1/modes/${mockMode._id}/top`);
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when the response is not ok", async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as unknown as Response);

      await expect(modeService.getTopMode(mockMode._id)).rejects.toThrow("HTTP error! status: 404");
    });
  });
});
