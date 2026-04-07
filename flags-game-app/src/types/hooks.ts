import type {
  AlertContext,
  FlagsContext,
  GameContext,
  ModeContext,
  ModesContext,
  UiContext,
  UsersContext,
} from "@/types/contexts";

export interface UseCountdown {
  timerText: string;
  secondsLeft: number;
  endTime: boolean;
  onCountdownReset: () => void;
}

export interface UseForm<T> {
  formState: T;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onResetForm: () => void;
}

export type UseAlertContext = AlertContext;
export type UseFlagsContext = FlagsContext;
export type UseGameContext = GameContext;
export type UseModeContext = ModeContext;
export type UseModesContext = ModesContext;
export type UseUiContext = UiContext;
export type UseUsersContext = UsersContext;
