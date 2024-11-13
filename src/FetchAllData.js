import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "./TableComponent";

const FetchAllData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    setLoading(true);
    axios
      .get("https://81y8fheo1k.execute-api.us-east-2.amazonaws.com/dev/FetchData")
      .then((response) => {
        console.log("All Data API Response:", response.data);

        // Parse the response if it's a string
        const parsedData =
          typeof response.data.body === "string"
            ? JSON.parse(response.data.body)
            : response.data.body;

        setData(Array.isArray(parsedData) ? parsedData : []); // Ensure it's an array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching all data:", error);
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>All Data</h2>
      {loading ? <p>Loading data...</p> : <TableComponent data={data} />}
    </div>
  );
};

export default FetchAllData;
