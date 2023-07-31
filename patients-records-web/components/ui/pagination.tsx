/** @format */

import classes from "./pagination.module.css";

import { usePagination, DOTS } from "@/hooks/use-pagination";

type Props = {
  onPageChange: (currentPage: number | string) => void;
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  pageSize: number;
  className: string;
};

const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className,
}: Props) => {
  const paginationRange = usePagination({
    totalCount,
    siblingCount,
    pageSize,
    currentPage,
  });

  if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange
    ? paginationRange[paginationRange.length - 1]
    : 1;

  return (
    <ul className={`${classes.pagination_container} ${classes[className]}`}>
      <li
        className={`${classes.pagination_item} ${
          currentPage === 1 ? classes.disabled : ""
        }`}
        onClick={onPrevious}
      >
        <div className={`${classes.arrow} ${classes.left}`} />
      </li>
      {paginationRange &&
        paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <li
                key={index}
                className={`${classes.pagination_item} ${classes.dots}`}
              >
                &#8230;
              </li>
            );
          }

          return (
            <li
              key={index}
              className={`${classes.pagination_item} ${
                pageNumber === currentPage ? classes.selected : ""
              }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </li>
          );
        })}
      <li
        className={`${classes.pagination_item} ${
          currentPage === lastPage ? classes.disabled : ""
        }`}
        onClick={onNext}
      >
        <div className={`${classes.arrow} ${classes.right}`} />
      </li>
    </ul>
  );
};

export default Pagination;
