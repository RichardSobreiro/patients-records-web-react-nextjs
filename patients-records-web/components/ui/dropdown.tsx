/** @format */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import classes from "./dropdown.module.css";
import { useOutsideAlerter } from "@/hooks/use-outside-alerter";

export type Item = {
  id: string;
  description: string;
  selected: boolean;
  value: any;
};

type Props = {
  label: string;
  list: any;
  id: string;
  idPropertyName: string;
  descriptionPropertyName: string;
  value: Item | Item[] | undefined;
  onChangeHandler?: (selectedItem: Item | undefined) => void;
  onBlurHandler?: () => void;
  hasError?: boolean;
  errorMessage?: string;
  placeholder?: string;
};

const Dropdown = ({
  label,
  list,
  idPropertyName,
  descriptionPropertyName,
  id,
  hasError,
  errorMessage,
  placeholder,
  value,
  onChangeHandler,
  onBlurHandler,
}: Props) => {
  const [itemsList, setItemsList] = useState<Item[]>();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const wrapperRef = useRef(null);
  useOutsideAlerter({
    ref: wrapperRef,
    callback: () => setShowDropdown(false),
  });

  useEffect(() => {
    if (list) {
      const newItems: Item[] = [];
      list.forEach((element: any) => {
        newItems.push({
          selected: false,
          value: element,
          id: element[idPropertyName],
          description: element[descriptionPropertyName],
        });
      });
      setItemsList(newItems);
    }
  }, [list]);

  const getPlaceHolder = () => {
    if (value) return (value as Item).description;
    if (placeholder) return placeholder;
    else return "Selecione...";
  };

  const changeHandler = (e: any) => {
    let item = itemsList?.find((i) => i.id == e.target.value);
    if (item) {
      item.selected = true;
    }
    itemsList?.forEach((element) => {
      if (element.id != e.target.value) {
        element.selected = false;
      }
    });
    value = item;
    onChangeHandler && onChangeHandler(item);
  };

  const blurHandler = () => {
    if (isTouched) {
      onBlurHandler && onBlurHandler();
    }
  };

  return (
    <>
      <div
        ref={wrapperRef}
        className={classes.container}
        onMouseOver={() => setIsTouched(true)}
        onMouseOut={blurHandler}
      >
        <label className={classes.label} htmlFor={id}>
          {label}
        </label>
        <button
          className={classes.chevron_button}
          onClick={() => setShowDropdown((prevState) => !prevState)}
        >
          {getPlaceHolder()}
          <Image
            src={`/images/chevron_down_black.svg`}
            alt="Selecione o sexo do cliente..."
            width={25}
            height={25}
          />
        </button>
        {showDropdown && (
          <div className={classes.list}>
            {itemsList?.map((item) => (
              <div className={classes.list_item}>
                <input
                  name={id}
                  className={classes.list_item_input}
                  type="radio"
                  value={item.id}
                  onChange={changeHandler}
                  checked={item.id === (value as Item)?.id}
                />
                <p className={classes.list_item_description}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {hasError && <p className={classes.error_text}>{errorMessage}</p>}
    </>
  );
};

export default Dropdown;
