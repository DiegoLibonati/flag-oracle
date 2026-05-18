import { http, HttpResponse } from "msw";

import type { User } from "@/types/app";
import type { UserAddPayload, UserUpdatePayload } from "@/types/payloads";

import userService from "@/services/userService";

import { mockMswServer } from "@tests/__mocks__/mswServer.mock";
import { mockUsersTop } from "@tests/__mocks__/usersTop.mock";

const mockUser: User = {
  _id: "1",
  username: "user",
  password: "pass",
  total_score: 100,
  scores: {},
};

const updatePayload: UserUpdatePayload = {
  username: "user",
  password: "pass",
  score: 100,
  mode_id: "mode-1",
};

const addPayload: UserAddPayload = {
  username: "newuser",
  password: "pass",
  score: 200,
  mode_id: "mode-1",
};

describe("userService", () => {
  describe("getTopGeneral", () => {
    it("should return top users data on a successful response", async () => {
      mockMswServer.use(
        http.get("/api/v1/users/top_global", () => {
          return HttpResponse.json({
            message: "ok",
            code: "SUCCESS_GET_GLOBAL_TOP_USER",
            data: mockUsersTop,
          });
        })
      );

      const result = await userService.getTopGeneral();

      expect(result.data).toEqual(mockUsersTop);
    });

    it("should throw an HTTP error when response is 500", async () => {
      mockMswServer.use(
        http.get("/api/v1/users/top_global", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(userService.getTopGeneral()).rejects.toThrow("HTTP error! status: 500");
    });
  });

  describe("updateByUsername", () => {
    it("should return user data on a successful response", async () => {
      mockMswServer.use(
        http.patch("/api/v1/users/", () => {
          return HttpResponse.json({
            message: "updated",
            code: "SUCCESS_UPDATE_USER",
            data: mockUser,
          });
        })
      );

      const result = await userService.updateByUsername(updatePayload);

      expect(result.data).toEqual(mockUser);
    });

    it("should send the payload as a JSON body", async () => {
      let receivedBody: unknown;
      mockMswServer.use(
        http.patch("/api/v1/users/", async ({ request }) => {
          receivedBody = await request.json();
          return HttpResponse.json({ message: "updated", code: "S001", data: mockUser });
        })
      );

      await userService.updateByUsername(updatePayload);

      expect(receivedBody).toEqual(updatePayload);
    });

    it("should throw with the error message from the response body when not ok", async () => {
      mockMswServer.use(
        http.patch("/api/v1/users/", () => {
          return HttpResponse.json(
            { code: "AUTH_ERROR", message: "Wrong password" },
            { status: 401 }
          );
        })
      );

      await expect(userService.updateByUsername(updatePayload)).rejects.toThrow("Wrong password");
    });
  });

  describe("add", () => {
    it("should return user data on a successful response", async () => {
      mockMswServer.use(
        http.post("/api/v1/users/", () => {
          return HttpResponse.json(
            { message: "created", code: "SUCCESS_ADD_USER", data: mockUser },
            { status: 201 }
          );
        })
      );

      const result = await userService.add(addPayload);

      expect(result.data).toEqual(mockUser);
    });

    it("should send the payload as a JSON body", async () => {
      let receivedBody: unknown;
      mockMswServer.use(
        http.post("/api/v1/users/", async ({ request }) => {
          receivedBody = await request.json();
          return HttpResponse.json(
            { message: "created", code: "S001", data: mockUser },
            { status: 201 }
          );
        })
      );

      await userService.add(addPayload);

      expect(receivedBody).toEqual(addPayload);
    });

    it("should throw with the error message from the response body when not ok", async () => {
      mockMswServer.use(
        http.post("/api/v1/users/", () => {
          return HttpResponse.json(
            { code: "CONFLICT", message: "Username already exists" },
            { status: 409 }
          );
        })
      );

      await expect(userService.add(addPayload)).rejects.toThrow("Username already exists");
    });
  });
});
