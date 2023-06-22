/** @format */

import { MouseEventHandler } from "react";
import classes from "./button.module.css";

export enum ButtonType {
  PRIMARY,
  SECONDARY,
  PRIMARY_BODERED,
  SECONDARY_BORDERED,
  NEUTRAL,
}

type Props = {
  children: string | JSX.Element | JSX.Element[];
  type: ButtonType;
  onClickHandler: MouseEventHandler<HTMLButtonElement>;
};

const Button = ({ children, type, onClickHandler }: Props) => {
  let buttonTypeClass = "";
  switch (type) {
    case ButtonType.PRIMARY:
      buttonTypeClass = "primary";
      break;
    case ButtonType.SECONDARY:
      buttonTypeClass = "secondary";
      break;
    case ButtonType.PRIMARY_BODERED:
      buttonTypeClass = "primary_bordered";
      break;
    case ButtonType.SECONDARY_BORDERED:
      buttonTypeClass = "secondary_bordered";
      break;
    default:
      buttonTypeClass = "neutral";
      break;
  }
  return (
    <button className={classes[buttonTypeClass]} onClick={onClickHandler}>
      {children}
    </button>
  );
};

export default Button;
