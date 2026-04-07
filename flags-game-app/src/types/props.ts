import type { UserTop } from "@/types/app";

interface DefaultProps {
  children?: React.ReactNode;
  className?: string;
}

export interface FlagProps {
  image: string;
  name: string;
}

export interface FormGuessFlagProps {
  secondsLeft: number;
}

export interface HamburgerProps {
  navbar: boolean;
  manageNavbar: () => void;
}

export interface ListStatsProps {
  nameTop: string;
  arrayTop: UserTop[];
}

export type AlertProviderProps = DefaultProps;

export type FlagsProviderProps = DefaultProps;

export type GameProviderProps = DefaultProps;

export type ModeProviderProps = DefaultProps;

export type ModesProviderProps = DefaultProps;

export type UiProviderProps = DefaultProps;

export type UsersProviderProps = DefaultProps;
