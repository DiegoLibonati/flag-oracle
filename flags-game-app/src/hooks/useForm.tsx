import { useState } from "react";

import type { UseForm } from "@/types/hooks";

export const useForm = <T,>(initialForm: T): UseForm<T> => {
  const [formState, setformState] = useState(initialForm);

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;

    setformState({
      ...formState,
      [name]: value,
    });
  };

  const onResetForm = (): void => {
    setformState(initialForm);
  };

  return {
    formState,
    onInputChange,
    onResetForm,
  };
};
