export type AlertType = "alert-auth-error" | "alert-auth-success" | "";

export interface Alert {
  type: AlertType;
  message: string;
}

export interface Flag {
  _id: string;
  image: string;
  name: string;
}

export interface Mode {
  _id: string;
  name: string;
  description: string;
  timeleft: number;
  multiplier: number;
}

export interface User {
  _id: string;
  username: string;
  password: string;
  total_score: number;
  scores: Record<string, number>;
}

export type UserTop = Pick<User, "_id" | "username"> & {
  score: number;
};

export type UserWithOutPassword = Omit<User, "password">;
