import type { User, UserTop } from "@/types/app";

const userService = {
  getTopGeneral: async (): Promise<{
    message: string;
    code: string;
    data: UserTop[];
  }> => {
    const response = await fetch(`/api/v1/users/top_global`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as {
      message: string;
      code: string;
      data: UserTop[];
    };
  },
  updateByUsername: async (
    body: Pick<User, "username" | "password"> & {
      score: number;
      mode_id: string;
    }
  ): Promise<{
    message: string;
    code: string;
    data: User;
  }> => {
    const response = await fetch(`/api/v1/users/`, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = (await response.json()) as { code: string; message: string };
      throw new Error(error.message);
    }

    return (await response.json()) as {
      message: string;
      code: string;
      data: User;
    };
  },
  add: async (
    body: Pick<User, "username" | "password"> & {
      score: number;
      mode_id: string;
    }
  ): Promise<{
    message: string;
    code: string;
    data: User;
  }> => {
    const response = await fetch(`/api/v1/users/`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = (await response.json()) as { code: string; message: string };
      throw new Error(error.message);
    }

    return (await response.json()) as {
      message: string;
      code: string;
      data: User;
    };
  },
};

export default userService;
