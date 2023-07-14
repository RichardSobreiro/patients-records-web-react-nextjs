/** @format */

import React, { useRef, useEffect } from "react";

type Props = {
  ref: any;
  callback: any;
};

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideAlerter({ ref, callback }: Props) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        //alert("You clicked outside of me!");
        callback();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
