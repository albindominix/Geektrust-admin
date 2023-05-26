import React, { useState } from "react";
import "./Pagination.css";

export default function usePagination({ filteredData, pagination }) {
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line
  const [itemsPerPage, setItemsPerPage] = useState(10); 

 // Get the total number of items in the filtered data
const totalItems = filteredData.length;

// Calculate the total number of pages needed to display all items
const totalPages = Math.ceil(totalItems / itemsPerPage);

// Calculate the starting index of the current page
const startIndex = (currentPage - 1) * itemsPerPage;

// Calculate the ending index of the current page
const endIndex = startIndex + itemsPerPage;

// Get the data for the current page by slicing the filtered data array
const currentData = filteredData.slice(startIndex, endIndex);


  return {
    currentData,
    currentPage,
    setCurrentPage,
    itemsPerPage,

    render: (
      <div className="paginate-container">
        <div className="paginate-wrapper">
          <button
            className={`skip-button ${currentPage > 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(1)}
          >
            {"<<"}
          </button>
          <button
            className={`skip-button ${currentPage > 1 ? "active" : ""}`}
            onClick={() => {
              currentPage > 1 && setCurrentPage(currentPage - 1);
            }}
          >
            {"<"}
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => pagination(index)}
              className={`pagination-button ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            className={`skip-button ${
              currentPage < totalPages ? "active" : ""
            }`}
            onClick={() => {
              currentPage < totalPages && setCurrentPage(currentPage + 1);
            }}
          >
            {">"}
          </button>
          <button
            className={`skip-button ${
              currentPage < totalPages ? "active" : ""
            }`}
            onClick={() => setCurrentPage(totalPages)}
          >
            {">>"}
          </button>
        </div>
      </div>
    ),
  };
}
