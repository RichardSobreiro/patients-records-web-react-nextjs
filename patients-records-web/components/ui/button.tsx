/** @format */

import { MouseEventHandler } from "react";
import classes from "./button.module.css";

export enum ButtonStyle {
  PRIMARY,
  PRIMARY_BODERED,
  PRIMARY_SMALL,
  SECONDARY,
  SECONDARY_BORDERED,
  NEUTRAL,
  SUCCESS,
}

type Props = {
  children: string | JSX.Element | JSX.Element[];
  style: ButtonStyle;
  onClickHandler?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
};

const Button = ({ children, style, onClickHandler, type }: Props) => {
  let ButtonStyleClass = "";
  let buttonSizeClass = "";
  switch (style) {
    case ButtonStyle.PRIMARY:
      ButtonStyleClass = "primary";
      break;
    case ButtonStyle.PRIMARY_BODERED:
      ButtonStyleClass = "primary_bordered";
      break;
    case ButtonStyle.PRIMARY_SMALL:
      ButtonStyleClass = "primary";
      buttonSizeClass = "small";
      break;
    case ButtonStyle.SECONDARY:
      ButtonStyleClass = "secondary";
      break;
    case ButtonStyle.SECONDARY_BORDERED:
      ButtonStyleClass = "secondary_bordered";
      break;
    case ButtonStyle.SUCCESS:
      ButtonStyleClass = "success";
      break;
    default:
      ButtonStyleClass = "neutral";
      break;
  }
  return (
    <button
      type={type ? type : "button"}
      className={
        buttonSizeClass === ""
          ? classes[ButtonStyleClass]
          : `${classes[ButtonStyleClass]} ${classes[buttonSizeClass]}`
      }
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
};

export default Button;
