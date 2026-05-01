import type { User } from "@/types/app";

export interface UserAddPayload extends Pick<User, "username" | "password"> {
  score: number;
  mode_id: string;
}

export interface UserUpdatePayload extends Pick<User, "username" | "password"> {
  score: number;
  mode_id: string;
}
