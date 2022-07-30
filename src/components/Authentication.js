import React from "react";
import Signup from "./Signup";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import Dashboard from "./Dashboard/Dashboard";
import SingleProject from "./Dashboard/SingleProject";
import UserTickets from "./Dashboard/UserTickets";

export default function Authentication() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute redirectTo="/login">
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute redirectTo="/login">
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/:id"
              element={
                <PrivateRoute redirectTo="/login">
                  <SingleProject />
                </PrivateRoute>
              }
            />
            <Route
              path="/tickets"
              element={
                <PrivateRoute redirectTo="/login">
                  <UserTickets />
                </PrivateRoute>
              }
            />
            <Route
              path="/update-profile"
              element={
                <PrivateRoute redirectTo="/login">
                  <UpdateProfile />
                </PrivateRoute>
              }
            />
            {/* public routes*/}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}
