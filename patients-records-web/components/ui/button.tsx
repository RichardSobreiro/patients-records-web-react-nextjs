/** @format */

import { MouseEventHandler } from "react";
import classes from "./button.module.css";

export enum ButtonStyle {
  PRIMARY,
  PRIMARY_BODERED,
  PRIMARY_BODERED_SMALL,
  PRIMARY_SMALL,
  SECONDARY,
  SECONDARY_BORDERED,
  NEUTRAL,
  NEUTRAL_SMALL,
  SUCCESS,
  SUCCESS_BORDERED,
  SUCCESS_SMALL,
  SUCCESS_BORDERED_SMALL,
}

type Props = {
  children: string | JSX.Element | JSX.Element[];
  style: ButtonStyle;
  onClickHandler?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const Button = ({ children, style, onClickHandler, type, disabled }: Props) => {
  let ButtonStyleClass = "";
  let buttonSizeClass = "";
  switch (style) {
    case ButtonStyle.PRIMARY:
      ButtonStyleClass = `primary`;
      break;
    case ButtonStyle.PRIMARY_BODERED:
      ButtonStyleClass = "primary_bordered";
      break;
    case ButtonStyle.PRIMARY_BODERED_SMALL:
      ButtonStyleClass = "primary_bordered_small";
      break;
    case ButtonStyle.PRIMARY_SMALL:
      ButtonStyleClass = "primary_small";
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
    case ButtonStyle.SUCCESS_SMALL:
      ButtonStyleClass = "success_small";
      break;
    case ButtonStyle.SUCCESS_BORDERED:
      ButtonStyleClass = "success_bordered";
      break;
    case ButtonStyle.SUCCESS_BORDERED_SMALL:
      ButtonStyleClass = "success_bordered_small";
      break;
    case ButtonStyle.NEUTRAL_SMALL:
      ButtonStyleClass = "neutral_small";
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
          ? `${classes[ButtonStyleClass]}`
          : `${classes[ButtonStyleClass]} ${classes[buttonSizeClass]}`
      }
      onClick={onClickHandler}
      disabled={disabled !== undefined && disabled !== null ? disabled : false}
    >
      {children}
    </button>
  );
};

export default Button;
