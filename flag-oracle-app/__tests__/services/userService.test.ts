import type { User } from "@/types/app";

import userService from "@/services/userService";

import { mockUsersTop } from "@tests/__mocks__/usersTop.mock";

const mockFetchSuccess = (data: unknown): void => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => await data,
  } as Response);
};

const mockFetchErrorWithBody = (status: number, errorBody: unknown): void => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => await errorBody,
  } as Response);
};

describe("userService", () => {
  describe("getTopGeneral", () => {
    it("should call fetch for /api/v1/users/top_global with GET", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockUsersTop });
      await userService.getTopGeneral();
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/users/top_global",
        expect.objectContaining({ method: "GET" })
      );
    });

    it("should return top users data on success", async () => {
      mockFetchSuccess({ message: "ok", code: "S001", data: mockUsersTop });
      const result = await userService.getTopGeneral();
      expect(result.data).toEqual(mockUsersTop);
    });

    it("should throw when response is not ok", async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 } as Response);
      await expect(userService.getTopGeneral()).rejects.toThrow();
    });
  });

  describe("updateByUsername", () => {
    const body: Pick<User, "username" | "password"> & { score: number; mode_id: string } = {
      username: "user",
      password: "pass",
      score: 100,
      mode_id: "mode-1",
    };

    it("should call fetch with PATCH method", async () => {
      mockFetchSuccess({ message: "updated", code: "S002", data: {} });
      await userService.updateByUsername(body);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/users/",
        expect.objectContaining({ method: "PATCH" })
      );
    });

    it("should send the body as JSON string", async () => {
      mockFetchSuccess({ message: "updated", code: "S002", data: {} });
      await userService.updateByUsername(body);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/users/",
        expect.objectContaining({ body: JSON.stringify(body) })
      );
    });

    it("should include Content-Type application/json header", async () => {
      mockFetchSuccess({ message: "updated", code: "S002", data: {} });
      await userService.updateByUsername(body);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/users/",
        expect.objectContaining({
          headers: expect.objectContaining({ "Content-Type": "application/json" }),
        })
      );
    });

    it("should return response data on success", async () => {
      const mockUser: User = {
        _id: "1",
        username: "user",
        password: "pass",
        total_score: 100,
        scores: {},
      };
      mockFetchSuccess({ message: "updated", code: "S002", data: mockUser });
      const result = await userService.updateByUsername(body);
      expect(result.data).toEqual(mockUser);
    });

    it("should throw with error message from response when not ok", async () => {
      mockFetchErrorWithBody(401, { code: "AUTH_ERROR", message: "Wrong password" });
      await expect(userService.updateByUsername(body)).rejects.toThrow("Wrong password");
    });
  });

  describe("add", () => {
    const body: Pick<User, "username" | "password"> & { score: number; mode_id: string } = {
      username: "newuser",
      password: "pass",
      score: 200,
      mode_id: "mode-1",
    };

    it("should call fetch with POST method", async () => {
      mockFetchSuccess({ message: "created", code: "S001", data: {} });
      await userService.add(body);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/users/",
        expect.objectContaining({ method: "POST" })
      );
    });

    it("should send the body as JSON string", async () => {
      mockFetchSuccess({ message: "created", code: "S001", data: {} });
      await userService.add(body);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/users/",
        expect.objectContaining({ body: JSON.stringify(body) })
      );
    });

    it("should return response data on success", async () => {
      const mockUser: User = {
        _id: "2",
        username: "newuser",
        password: "pass",
        total_score: 200,
        scores: {},
      };
      mockFetchSuccess({ message: "created", code: "S001", data: mockUser });
      const result = await userService.add(body);
      expect(result.data).toEqual(mockUser);
    });

    it("should throw with error message from response when not ok", async () => {
      mockFetchErrorWithBody(409, { code: "CONFLICT", message: "Username already exists" });
      await expect(userService.add(body)).rejects.toThrow("Username already exists");
    });
  });
});
