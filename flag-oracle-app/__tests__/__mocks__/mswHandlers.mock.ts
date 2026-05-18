import { http, HttpResponse } from "msw";

import { mockFlags } from "@tests/__mocks__/flags.mock";
import { mockMode, mockModes } from "@tests/__mocks__/modes.mock";
import { mockUsersTop } from "@tests/__mocks__/usersTop.mock";

export const mockMswHandlers = [
  http.get("/api/v1/flags/", () => {
    return HttpResponse.json({ message: "ok", code: "SUCCESS_GET_ALL_FLAGS", data: mockFlags });
  }),
  http.get("/api/v1/flags/random/:quantity", ({ params }) => {
    const quantity = Number(params.quantity);
    return HttpResponse.json({
      message: "ok",
      code: "SUCCESS_GET_ALL_FLAGS",
      data: mockFlags.slice(0, quantity),
    });
  }),
  http.get("/api/v1/modes/", () => {
    return HttpResponse.json({ message: "ok", code: "SUCCESS_GET_ALL_MODES", data: mockModes });
  }),
  http.get("/api/v1/modes/:id", () => {
    return HttpResponse.json({ message: "ok", code: "SUCCESS_GET_MODE", data: mockMode });
  }),
  http.get("/api/v1/modes/:id/top", () => {
    return HttpResponse.json({
      message: "ok",
      code: "SUCCESS_GET_TOP_MODE",
      data: mockUsersTop,
    });
  }),
  http.get("/api/v1/users/top_global", () => {
    return HttpResponse.json({
      message: "ok",
      code: "SUCCESS_GET_GLOBAL_TOP_USER",
      data: mockUsersTop,
    });
  }),
  http.post("/api/v1/users/", () => {
    return HttpResponse.json(
      {
        message: "The user was successfully added.",
        code: "SUCCESS_ADD_USER",
        data: {},
      },
      { status: 201 }
    );
  }),
  http.patch("/api/v1/users/", () => {
    return HttpResponse.json({
      message: "The user was successfully updated.",
      code: "SUCCESS_UPDATE_USER",
      data: {},
    });
  }),
];
