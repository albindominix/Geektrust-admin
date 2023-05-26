import React from "react";
import "./Table.css";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
export default function Table({
  masterCheckbox,
  rows,
  deleteRow,
  editRow,
  checkBox,
  check,
}) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead style={{ height: "2em" }}>
          <tr>
            <th style={{ width: "3em" }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={masterCheckbox}
                  onChange={(e) => checkBox(e.target.checked, "master")}
                />
                <span className="checkmark"></span>
              </label>
            </th>
            <th>Name</th>
            <th style={{ width: "15em" }}>Email</th>
            <th>Role</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((item, index) => (
              <tr key={index}>
                <td>
                  <label className="checkbox-label" htmlFor={index}>
                    <input
                      type="checkbox"
                      checked={check.includes(item.id)}
                      id={index}
                      onChange={(e) => {
                        checkBox(e.target.checked, item.id);
                      }}
                    />
                    <span className="checkmark"></span>
                  </label>
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>
                  <span
                    className="actions"
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <div className="actionIcon">
                      {" "}
                      <BsFillTrashFill onClick={() => deleteRow(item.id)} />
                    </div>
                    <div className="actionIcon">
                      {" "}
                      <BsFillPencilFill onClick={() => editRow(index)} />
                    </div>
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colspan="5">
            <div className="no-rows">
            <h2>No Rows</h2>
            </div>
            </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
