import React, { useState } from "react";
import axios from "axios";
import TableComponent from "./TableComponent";
import './App.css';
import {FaThermometerHalf, FaLightbulb, FaRunning, FaClock} from "react-icons/fa";

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
  const fetchSortedData = (sortColumn, sortOrder) => {
    if (!data || data.length === 0) {
      console.log("No data available to sort.");
      return;
    }
  
    const sortedData = [...data].sort((a, b) => {
      const order = sortOrder === "ASC" ? 1 : -1;
  
      if (a[sortColumn] < b[sortColumn]) return -1 * order;
      if (a[sortColumn] > b[sortColumn]) return 1 * order;
      return 0;
    });
  
    console.log("Sorted Data:", sortedData);
    setData(sortedData); // Update the table with sorted data
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
          <TableComponent data={data} onSort={fetchSortedData} />

          {summary && (
            <div
              style={{
                marginTop: "20px",
                backgroundColor: "#f9f9f9",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ color: "#007bff", marginBottom: "15px" }}>Summary</h2>
              <div>
                <p>
                  <strong>Record Count:</strong> {summary.record_count}
                </p>

                <h4>
                  <FaThermometerHalf style={{ color: "#ff6f61", marginRight: "8px" }} />
                  Temperature
                </h4>
                <p>
                  <strong>Min:</strong> {summary.temperature.min}
                </p>
                <p>
                  <strong>Max:</strong> {summary.temperature.max}
                </p>
                <p>
                  <strong>Avg:</strong> {summary.temperature.avg.toFixed(2)}
                </p>

                <h4>
                  <FaRunning style={{ color: "#6f42c1", marginRight: "8px" }} />
                  Motion
                </h4>
                <p>
                  <strong>Min:</strong> {summary.motion.min}
                </p>
                <p>
                  <strong>Max:</strong> {summary.motion.max}
                </p>
                <p>
                  <strong>Avg:</strong> {summary.motion.avg.toFixed(2)}
                </p>

                <h4>
                  <FaLightbulb style={{ color: "#ffc107", marginRight: "8px" }} />
                  Light
                </h4>
                <p>
                  <strong>Min:</strong> {summary.light.min}
                </p>
                <p>
                  <strong>Max:</strong> {summary.light.max}
                </p>
                <p>
                  <strong>Avg:</strong> {summary.light.avg.toFixed(2)}
                </p>

                <h4>
                  <FaClock style={{ color: "#17a2b8", marginRight: "8px" }} />
                  Timestamp Range
                </h4>
                <p>
                  <strong>Earliest:</strong>{" "}
                  {new Date(summary.timestamp_range.earliest).toLocaleString()}
                </p>
                <p>
                  <strong>Latest:</strong>{" "}
                  {new Date(summary.timestamp_range.latest).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
