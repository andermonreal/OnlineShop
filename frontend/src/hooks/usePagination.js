import { useState } from "react";

export const usePagination = (items = [], itemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return {
    currentItems,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    setCurrentPage,
  };
};
