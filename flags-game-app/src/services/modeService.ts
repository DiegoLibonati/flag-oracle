import type { Mode, UserTop } from "@/types/app";

const modeService = {
  getAll: async (): Promise<{
    message: string;
    code: string;
    data: Mode[];
  }> => {
    const response = await fetch(`/api/v1/modes/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as {
      message: string;
      code: string;
      data: Mode[];
    };
  },
  getById: async (
    id: string
  ): Promise<{
    message: string;
    code: string;
    data: Mode;
  }> => {
    const response = await fetch(`/api/v1/modes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as {
      message: string;
      code: string;
      data: Mode;
    };
  },
  getTopMode: async (
    idMode: string
  ): Promise<{
    message: string;
    code: string;
    data: UserTop[];
  }> => {
    const response = await fetch(`/api/v1/modes/${idMode}/top`);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as {
      message: string;
      code: string;
      data: UserTop[];
    };
  },
};

export default modeService;
