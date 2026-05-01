import type { User, UserTop } from "@/types/app";
import type { UserAdd, UserUpdate } from "@/types/payloads";
import type { DefaultResponse, ResponseWithData } from "@/types/responses";

const userService = {
  getTopGeneral: async (): Promise<ResponseWithData<UserTop[]>> => {
    const response = await fetch(`/api/v1/users/top_global`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as ResponseWithData<UserTop[]>;
  },
  updateByUsername: async (body: UserUpdate): Promise<ResponseWithData<User>> => {
    const response = await fetch(`/api/v1/users/`, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = (await response.json()) as DefaultResponse;
      throw new Error(error.message);
    }

    return (await response.json()) as ResponseWithData<User>;
  },
  add: async (body: UserAdd): Promise<ResponseWithData<User>> => {
    const response = await fetch(`/api/v1/users/`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = (await response.json()) as DefaultResponse;
      throw new Error(error.message);
    }

    return (await response.json()) as ResponseWithData<User>;
  },
};

export default userService;
