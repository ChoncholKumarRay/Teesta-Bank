import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/DashboardPage.css";

const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const navigate = useNavigate();

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // If there's no token, redirect to the login page
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/admin/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUsers(data); // Set the users data to state
        } else {
          setErrorMessage(data.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrorMessage("An error occurred while fetching users.");
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Bank Account User Info</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="user-table">
        <div className="table-header">
          <div>Username</div>
          <div>Bank Account</div>
          <div>Balance</div>
        </div>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map((user) => (
            <div className="table-row" key={user._id}>
              <div className="table-username">{user.username}</div>
              <div>{user.bank_account}</div>
              <div>${user.balance}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
