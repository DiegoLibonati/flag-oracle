import flagService from "@/services/flagService";

import { mockFlag } from "@tests/__mocks__/flags.mock";

describe("flagService", () => {
  const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should call the correct endpoint and return data", async () => {
      const mockFetchJson = jest.fn();
      const mockResponse = { message: "OK", code: "SUCCESS", data: [mockFlag] };
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: mockFetchJson.mockResolvedValue(mockResponse),
      } as unknown as Response);

      const result = await flagService.getAll();

      expect(mockedFetch).toHaveBeenCalledWith(
        "/api/v1/flags/",
        expect.objectContaining({ method: "GET" })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when the response is not ok", async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as unknown as Response);

      await expect(flagService.getAll()).rejects.toThrow("HTTP error! status: 500");
    });
  });

  describe("getRandoms", () => {
    it("should call the correct endpoint with the given quantity", async () => {
      const mockFetchJson = jest.fn();
      const mockResponse = { message: "OK", code: "SUCCESS", data: [mockFlag] };
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: mockFetchJson.mockResolvedValue(mockResponse),
      } as unknown as Response);

      const result = await flagService.getRandoms(5);

      expect(mockedFetch).toHaveBeenCalledWith(
        "/api/v1/flags/random/5",
        expect.objectContaining({ method: "GET" })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when the response is not ok", async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as unknown as Response);

      await expect(flagService.getRandoms(5)).rejects.toThrow("HTTP error! status: 404");
    });
  });
});
