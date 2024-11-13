import React from "react";

const TableComponent = ({ data }) => {
  console.log("Table Data Received:", data); // Debugging

  // Check if `data` is not an array
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Data ID</th>
          <th>Device ID</th>
          <th>Timestamp</th>
          <th>Motion</th>
          <th>Temperature</th>
          <th>Light</th>
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
