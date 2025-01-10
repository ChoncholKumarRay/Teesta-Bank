import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/DashboardPage.css";

const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("teesta-admin-token");

      if (!token) {
        // If there's no token, redirect to the login page
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://teesta.cam-sust.org/api/admin/get-users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUsers(data);
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
          <p className="loading-dashboard">No users found.</p>
        ) : (
          users.map((user) => (
            <div className="table-row" key={user._id}>
              <div className="table-username">{user.username}</div>
              <div>{user.bank_account}</div>
              <div className="table-balance">${user.balance}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
