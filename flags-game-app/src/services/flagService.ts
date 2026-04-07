import type { Flag } from "@/types/app";

const flagService = {
  getAll: async (): Promise<{
    message: string;
    code: string;
    data: Flag[];
  }> => {
    const response = await fetch(`/api/v1/flags/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as {
      message: string;
      code: string;
      data: Flag[];
    };
  },
  getRandoms: async (
    quantity: number
  ): Promise<{
    message: string;
    code: string;
    data: Flag[];
  }> => {
    const response = await fetch(`/api/v1/flags/random/${quantity}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as {
      message: string;
      code: string;
      data: Flag[];
    };
  },
};

export default flagService;
