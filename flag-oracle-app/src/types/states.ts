import type { Flag, Mode, UserTop } from "@/types/app";

export interface GeneralState {
  loading: boolean;
  error: string | null;
}

export type TopUsersState = {
  users: UserTop[];
} & GeneralState;

export type ModesState = {
  modes: Mode[];
} & GeneralState;

export type ModeState = {
  mode: Mode | null;
} & GeneralState;

export type FlagsState = {
  flags: Flag[];
} & GeneralState;
