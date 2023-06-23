/** @format */

import { MouseEventHandler } from "react";
import classes from "./button.module.css";

export enum ButtonType {
  PRIMARY,
  PRIMARY_BODERED,
  PRIMARY_SMALL,
  SECONDARY,
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
  let buttonSizeClass = "";
  switch (type) {
    case ButtonType.PRIMARY:
      buttonTypeClass = "primary";
      break;
    case ButtonType.PRIMARY_BODERED:
      buttonTypeClass = "primary_bordered";
      break;
    case ButtonType.PRIMARY_SMALL:
      buttonTypeClass = "primary";
      buttonSizeClass = "small";
      break;
    case ButtonType.SECONDARY:
      buttonTypeClass = "secondary";
      break;
    case ButtonType.SECONDARY_BORDERED:
      buttonTypeClass = "secondary_bordered";
      break;
    default:
      buttonTypeClass = "neutral";
      break;
  }
  return (
    <button
      className={
        buttonSizeClass === ""
          ? classes[buttonTypeClass]
          : `${classes[buttonTypeClass]} ${classes[buttonSizeClass]}`
      }
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
};

export default Button;
