import type { Alert, Flag, Mode, UserTop } from "@/types/app";
import type { FlagsState, ModesState, ModeState, TopUsersState } from "@/types/states";

export interface FlagsContext {
  flags: FlagsState;
  handleSetFlags: (flags: Flag[]) => void;
  handleClearFlags: () => void;
  handleStartFetchFlags: () => void;
  handleEndFetchFlags: () => void;
  handleSetErrorFlags: (error: string) => void;
}

export interface UiContext {
  navbar: boolean;
  handleManageNavbar: () => void;
}

export interface UsersContext {
  topUsers: TopUsersState;
  handleSetTopUsers: (users: UserTop[]) => void;
  handleClearTopUsers: () => void;
  handleStartFetchUsers: () => void;
  handleEndFetchUsers: () => void;
  handleSetErrorUsers: (error: string) => void;
}

export interface ModesContext {
  modes: ModesState;
  handleSetModes: (modes: Mode[]) => void;
  handleClearModes: () => void;
  handleStartFetchModes: () => void;
  handleEndFetchModes: () => void;
  handleSetErrorModes: (error: string) => void;
}

export interface ModeContext {
  mode: ModeState;
  handleSetMode: (mode: Mode) => void;
  handleClearMode: () => void;
  handleStartFetchMode: () => void;
  handleEndFetchMode: () => void;
  handleSetErrorMode: (error: string) => void;
}

export interface AlertContext {
  alert: Alert;
  handleSetAlert: (alert: Alert) => void;
  handleClearAlert: () => void;
}

export interface GameContext {
  currentFlagToGuess: Flag | null;
  completeGuess: boolean;
  score: number;
  handleNextFlagToGuess: (flags: Flag[]) => void;
  handleSetScore: (score: number) => void;
  handleSetFlagToGuess: (flag: Flag) => void;
  handleClearCurrentFlagToGuess: () => void;
}
