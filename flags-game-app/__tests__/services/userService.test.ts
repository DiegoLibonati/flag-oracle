import userService from "@/services/userService";

import { mockUserTop } from "@tests/__mocks__/usersTop.mock";

describe("userService", () => {
  const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTopGeneral", () => {
    it("should call the correct endpoint and return top users", async () => {
      const mockResponse = { message: "OK", code: "SUCCESS", data: [mockUserTop] };
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as unknown as Response);

      const result = await userService.getTopGeneral();

      expect(mockedFetch).toHaveBeenCalledWith(
        "/api/v1/users/top_global",
        expect.objectContaining({ method: "GET" })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when the response is not ok", async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as unknown as Response);

      await expect(userService.getTopGeneral()).rejects.toThrow("HTTP error! status: 500");
    });
  });

  describe("add", () => {
    const body = { username: "testuser", password: "secret", score: 100, mode_id: "mode1" };

    it("should POST to the correct endpoint and return the created user", async () => {
      const mockResponse = { message: "Created", code: "USER_CREATED", data: {} };
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as unknown as Response);

      const result = await userService.add(body);

      expect(mockedFetch).toHaveBeenCalledWith(
        "/api/v1/users/",
        expect.objectContaining({ method: "POST", body: JSON.stringify(body) })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw with the server error message when the response is not ok", async () => {
      const errorBody = { code: "CONFLICT", message: "Username already exists" };
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue(errorBody),
      } as unknown as Response);

      await expect(userService.add(body)).rejects.toThrow("Username already exists");
    });
  });

  describe("updateByUsername", () => {
    const body = { username: "testuser", password: "secret", score: 200, mode_id: "mode1" };

    it("should PATCH to the correct endpoint and return the updated user", async () => {
      const mockResponse = { message: "Updated", code: "USER_UPDATED", data: {} };
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as unknown as Response);

      const result = await userService.updateByUsername(body);

      expect(mockedFetch).toHaveBeenCalledWith(
        "/api/v1/users/",
        expect.objectContaining({ method: "PATCH", body: JSON.stringify(body) })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw with the server error message when the response is not ok", async () => {
      const errorBody = { code: "NOT_FOUND", message: "User not found" };
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue(errorBody),
      } as unknown as Response);

      await expect(userService.updateByUsername(body)).rejects.toThrow("User not found");
    });
  });
});
