import type { FlagProps } from "@/types/props";

import type { JSX } from "react";

import "@/components/Flag/Flag.css";

const Flag = ({ image, name }: FlagProps): JSX.Element => {
  return <img src={image} alt={name} className="flag"></img>;
};

export default Flag;
