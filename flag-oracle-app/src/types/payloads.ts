import type { User } from "@/types/app";

export interface UserAdd extends Pick<User, "username" | "password"> {
  score: number;
  mode_id: string;
}

export interface UserUpdate extends Pick<User, "username" | "password"> {
  score: number;
  mode_id: string;
}
