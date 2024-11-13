import React, { useState } from "react";
import axios from "axios";
import TableComponent from "./TableComponent";
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null); // State for summary data
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    device_id: "",
    start_date_date: "",
    start_date_time: "",
    end_date_date: "",
    end_date_time: "",
    motion: "",
    sort_column: "timestamp", // Default sorting column
    sort_order: "ASC",        // Default sorting order
  });

  // Function to fetch all data
  const fetchAllData = () => {
    setLoading(true);
    axios
      .get("https://81y8fheo1k.execute-api.us-east-2.amazonaws.com/dev/FetchData")
      .then((response) => {
        console.log("All Data API Response:", response.data); // Debugging
        const parsedData = JSON.parse(response.data.body); // Parse the body
        setData(Array.isArray(parsedData) ? parsedData : []); // Ensure it's an array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching all data:", error);
        setLoading(false);
      });
  };

  // Function to fetch filtered data
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

  // Function to fetch summary data
  const fetchSummary = () => {
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

    const queryString = new URLSearchParams(formattedFilters).toString();
    console.log("Query String for Summary:", queryString); // Debugging

    axios
      .get(
        `https://81y8fheo1k.execute-api.us-east-2.amazonaws.com/dev/FetchSummary?${queryString}`
      )
      .then((response) => {
        console.log("Summary API Response:", response.data); // Debugging
        setSummary(response.data); // Set summary state
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching summary data:", error);
        setLoading(false);
      });
  };

  // Function to fetch sorted data
  const fetchSortedData = () => {
    if (!data || data.length === 0) {
      console.log("No data available to sort.");
      return;
    }
  
    setLoading(true);
  
    const sortedData = [...data].sort((a, b) => {
      const column = filters.sort_column;
      const order = filters.sort_order === "ASC" ? 1 : -1;
  
      // Compare values based on the column and sort order
      if (a[column] < b[column]) return -1 * order;
      if (a[column] > b[column]) return 1 * order;
      return 0; // Equal values
    });
  
    console.log("Sorted Data Locally:", sortedData);
  
    setData(sortedData);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div>
      <h1>Device Data Table</h1>

      {/* Button to Fetch All Data */}
      <button onClick={fetchAllData} style={{ marginBottom: "10px" }}>
        Fetch All Data
      </button>

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

        {/* Sorting Controls */}
        <div style={{ marginTop: "10px" }}>
          <label>Sort By:</label>
          <select
            name="sort_column"
            value={filters.sort_column}
            onChange={handleInputChange}
          >
            <option value="timestamp">Timestamp</option>
            <option value="temperature">Temperature</option>
            <option value="light">Light</option>
            <option value="motion">Motion</option>
          </select>
          <select
            name="sort_order"
            value={filters.sort_order}
            onChange={handleInputChange}
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>

        <button onClick={fetchFilteredData} style={{ marginLeft: "10px" }}>
          Filter Data
        </button>
        <button onClick={fetchSummary} style={{ marginLeft: "10px" }}>
          Fetch Summary
        </button>
        <button onClick={fetchSortedData} style={{ marginLeft: "10px" }}>
          Sort Fetched Data
        </button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <TableComponent data={data} />
          {summary && (
            <div style={{ marginTop: "20px" }}>
              <h2>Summary</h2>
              <pre>{JSON.stringify(summary, null, 2)}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
