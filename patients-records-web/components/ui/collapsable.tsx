/** @format */
import classes from "./collapsable.module.css";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  title: string | JSX.Element | JSX.Element[];
  children: string | JSX.Element | JSX.Element[];
  header?: JSX.Element | JSX.Element[];
  chevronRef?: any;
};

const Collapsable = ({ open, title, children, header, chevronRef }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(open);
  const [height, setHeight] = useState<number | undefined>(0);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen || open) setHeight(ref.current?.getBoundingClientRect().height);
    else setHeight(0);
  }, [isOpen, open]);

  return (
    <div className={classes.card}>
      {header ? (
        header
      ) : (
        <div className={classes.header}>
          <div>{title}</div>
          <button
            type={"button"}
            className={classes.chevron_button}
            onClick={() => {
              setIsOpen((prevIsOpen) => {
                return !prevIsOpen;
              });
            }}
            ref={chevronRef}
          >
            {isOpen ? (
              <Image
                className={classes.chevron_button}
                src={`/images/chevron_down.svg`}
                alt="Details Chevron Down"
                width={37}
                height={41}
              />
            ) : (
              <Image
                className={classes.chevron_button}
                src={`/images/chevron_right.svg`}
                alt="Details Chevron Right"
                width={37}
                height={41}
              />
            )}
          </button>
        </div>
      )}
      <div className={classes.collapse} style={{ height }}>
        <div style={{ overflow: "hidden" }} ref={ref}>
          {isOpen && <div style={{ overflow: "hidden" }}>{children}</div>}
        </div>
      </div>
    </div>
  );
};

export default Collapsable;
