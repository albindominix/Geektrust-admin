import React, { useEffect, useState } from "react";
import Table from "./Table";
import "./Display.css";
import Modal from "./Modal";
import usePagination from "./Pagination";
import spinner from "../assets/Eclipse-1s-200px (2).svg";
export default function Display() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkBox, setCheckBox] = useState([]);
  const [rowToEdit, setrowToEdit] = useState([]);
  const [masterCheckbox, setMasterCheckbox] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tableData();
  }, []);

  //Function which make API call to the endpoint given to get the users data.
  const tableData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const result = await res.json();

      setRows(result);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  //Function to filter name or email or role.
  const filteredData = rows.filter((row) => {
    return (
      row.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      row.email.toLowerCase().includes(searchVal.toLowerCase()) ||
      row.role.toLowerCase().includes(searchVal.toLowerCase())
    );
  });

  // Destructuring values returned from the usePagination hook, which manages pagination logic
  const { render, currentData, currentPage, setCurrentPage, itemsPerPage } =
    usePagination({ filteredData, pagination });

  // Function to handle deleting rows.
  function handleDeleteRows(targetIndex) {
    setRows(rows.filter((item) => item.id !== targetIndex));
  }

  // Function to handle editing a row.
  function handleEditRow(index) {
    // Calculate the row index to edit based on the current page, items per page, and clicked index
    setrowToEdit((currentPage - 1) * itemsPerPage + index);

    setModalOpen(true); // Open the modal for editing the row
  }

  // Function to handle search input.
  const handleSearch = (event) => {
    setSearchVal(event.target.value);
    setMasterCheckbox(false);
    setCurrentPage(1);
    setCheckBox([]);
  };

  // Function to handle checkbox selection.
  function handleCheckBox(checked, index) {
    if (index === "master") {
      // If the "master" checkbox is clicked
      setMasterCheckbox(checked); // Set the state of masterCheckbox to the checked value

      if (checked) {
        // If the master checkbox is checked
        setCheckBox(
          currentData.map((item, index) => index < itemsPerPage && item.id)
          // Set the checkBox state to an array of IDs of the items in the current page,
          // up to the number of items per page (itemsPerPage)
        );
      } else {
        // If the master checkbox is unchecked
        setCheckBox([]); // Clear the checkBox state
      }
    } else {
      // If a regular checkbox (not "master") is clicked
      if (checked) {
        // If the checkbox is checked
        setCheckBox([...checkBox, index]); // Add the index to the checkBox state
      } else {
        // If the checkbox is unchecked
        setCheckBox(checkBox.filter((idx) => idx !== index));
        // Remove the index from the checkBox state
      }
      setMasterCheckbox(false); // Uncheck the masterCheckbox state
    }
  }

  // Function to delete checked rows.
  function deleteChecked() {
    const updatedRows = rows.filter((item) => !checkBox.includes(item.id));
    setRows(updatedRows);
    setCheckBox([]);
    setMasterCheckbox(false);
  }

// Function to handle form submission.
function handleSubmit(newData) {
  setRows(
    rows.map((currRow, index) => {
      if (index !== rowToEdit) {
        // If the current index doesn't match the rowToEdit index
        return currRow; // Keep the current row unchanged
      }
      return newData; // Replace the row with the new data (newRow)
    })
  );
}

  // Function for pagination.
  function pagination(index) {
    setCurrentPage(index + 1); // Set the current page based on the clicked index (+1 to adjust for 0-based index)

    if (currentPage !== index + 1) {
      // If the current page is not the same as the clicked index (+1)
      setMasterCheckbox(false); // Uncheck the masterCheckbox state
      setCheckBox([]); // Clear the checkBox state
    }
  }

  if (loading) {
    return <img src={spinner} alt="loader svg" />;
  }

  return (
    <div className="container">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          className="search-bar"
          type="text"
          placeholder="Search"
          value={searchVal}
          onChange={handleSearch}
        />
        <Table
          rows={currentData}
          deleteRow={handleDeleteRows}
          editRow={handleEditRow}
          checkBox={handleCheckBox}
          check={checkBox}
          masterCheckbox={masterCheckbox}
        />
      </div>
      <div className="delete-paginate">
        <div className="masterDelete-btn" onClick={deleteChecked}>
          Delete
        </div>

        {/* Pagination Controls */}
        {render}
        {/* Pagination Controls */}
      </div>
      {modalOpen && (
        <Modal
          modalClose={() => {
            setModalOpen(false);
          }}
          onSubmit={handleSubmit}
          defaultValue={filteredData[rowToEdit]}
        />
      )}
    </div>
  );
}
