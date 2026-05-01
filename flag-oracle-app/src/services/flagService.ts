import type { Flag } from "@/types/app";
import type { ResponseWithData } from "@/types/responses";

const flagService = {
  getAll: async (): Promise<ResponseWithData<Flag[]>> => {
    const response = await fetch(`/api/v1/flags/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as ResponseWithData<Flag[]>;
  },
  getRandoms: async (quantity: number): Promise<ResponseWithData<Flag[]>> => {
    const response = await fetch(`/api/v1/flags/random/${quantity}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as ResponseWithData<Flag[]>;
  },
};

export default flagService;
