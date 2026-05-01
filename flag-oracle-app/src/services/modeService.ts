import type { Mode, UserTop } from "@/types/app";
import type { ResponseWithData } from "@/types/responses";

const modeService = {
  getAll: async (): Promise<ResponseWithData<Mode[]>> => {
    const response = await fetch(`/api/v1/modes/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as ResponseWithData<Mode[]>;
  },
  getById: async (id: string): Promise<ResponseWithData<Mode>> => {
    const response = await fetch(`/api/v1/modes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as ResponseWithData<Mode>;
  },
  getTopMode: async (idMode: string): Promise<ResponseWithData<UserTop[]>> => {
    const response = await fetch(`/api/v1/modes/${idMode}/top`);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as ResponseWithData<UserTop[]>;
  },
};

export default modeService;
