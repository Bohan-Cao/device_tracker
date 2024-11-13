import React, { useState } from "react";

const TableComponent = ({ data, onSort }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ASC",
  });

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ASC" ? "DESC" : "ASC";
    setSortConfig({ key, direction });
    onSort(key, direction); // Notify parent to sort the data
  };

  // Check if `data` is not an array
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <table border="1">
      <thead>
        <tr>
          <th onClick={() => handleSort("data_id")}>
            Data ID {sortConfig.key === "data_id" && (sortConfig.direction === "ASC" ? "▲" : "▼")}
          </th>
          <th onClick={() => handleSort("device_id")}>
            Device ID {sortConfig.key === "device_id" && (sortConfig.direction === "ASC" ? "▲" : "▼")}
          </th>
          <th onClick={() => handleSort("timestamp")}>
            Timestamp {sortConfig.key === "timestamp" && (sortConfig.direction === "ASC" ? "▲" : "▼")}
          </th>
          <th onClick={() => handleSort("motion")}>
            Motion {sortConfig.key === "motion" && (sortConfig.direction === "ASC" ? "▲" : "▼")}
          </th>
          <th onClick={() => handleSort("temperature")}>
            Temperature {sortConfig.key === "temperature" && (sortConfig.direction === "ASC" ? "▲" : "▼")}
          </th>
          <th onClick={() => handleSort("light")}>
            Light {sortConfig.key === "light" && (sortConfig.direction === "ASC" ? "▲" : "▼")}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.data_id}>
            <td>{row.data_id}</td>
            <td>{row.device_id}</td>
            <td>{new Date(row.timestamp).toLocaleString()}</td>
            <td>{row.motion}</td>
            <td>{row.temperature}</td>
            <td>{row.light}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
