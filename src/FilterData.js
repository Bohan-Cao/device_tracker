import React, { useState } from "react";
import axios from "axios";
import TableComponent from "./TableComponent";

const FilterData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    device_id: "",
    start_date_date: "",
    start_date_time: "",
    end_date_date: "",
    end_date_time: "",
    motion: "",
  });

  const fetchFilteredData = () => {
    setLoading(true);

    // Combine date and time inputs into the required format
    const start_date =
      filters.start_date_date && filters.start_date_time
        ? `${filters.start_date_date}T${filters.start_date_time}`
        : "";
    const end_date =
      filters.end_date_date && filters.end_date_time
        ? `${filters.end_date_date}T${filters.end_date_time}`
        : "";

    const formattedFilters = {
      device_id: filters.device_id,
      start_date,
      end_date,
      motion: filters.motion,
    };

    // Remove empty filters
    const nonEmptyFilters = Object.fromEntries(
      Object.entries(formattedFilters).filter(([_, value]) => value)
    );

    const queryString = new URLSearchParams(nonEmptyFilters).toString();
    console.log("Query String Sent to API:", queryString); // Debugging

    axios
      .get(
        `https://81y8fheo1k.execute-api.us-east-2.amazonaws.com/dev/FilterFunction?${queryString}`
      )
      .then((response) => {
        console.log("Filtered API Response:", response.data); // Debugging
        setData(Array.isArray(response.data) ? response.data : []); // Ensure it's an array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching filtered data:", error);
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div>
      <h2>Filter Data</h2>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          name="device_id"
          placeholder="Device ID"
          value={filters.device_id}
          onChange={handleInputChange}
        />
        <div>
          <label>Start Date:</label>
          <input
            type="text"
            name="start_date_date"
            placeholder="YYYY-MM-DD"
            value={filters.start_date_date}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="start_date_time"
            placeholder="HH:mm"
            value={filters.start_date_time}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="text"
            name="end_date_date"
            placeholder="YYYY-MM-DD"
            value={filters.end_date_date}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="end_date_time"
            placeholder="HH:mm"
            value={filters.end_date_time}
            onChange={handleInputChange}
          />
        </div>
        <input
          type="number"
          name="motion"
          placeholder="Motion"
          value={filters.motion}
          onChange={handleInputChange}
        />
        <button onClick={fetchFilteredData} style={{ marginLeft: "10px" }}>
          Filter Data
        </button>
      </div>

      {loading ? <p>Loading data...</p> : <TableComponent data={data} />}
    </div>
  );
};

export default FilterData;
