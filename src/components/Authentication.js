import React from "react";
import Signup from "./Signup";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfileSetting from "./ProfileSetting";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import Dashboard from "./Dashboard/Dashboard";
import SingleProject from "./Dashboard/SingleProject";
export default function Authentication() {
  return (
    <>
      <AuthProvider>
        {/* <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "50vh" }}
        >
          <div className="w-100" style={{ maxWidth: "600px" }}> */}
        <Router>
          <Routes>
            {/* <Route path="/" element={<Dashboard />} />
              <Route path="/private" element={<PrivateRoute></PrivateRoute>} /> */}
            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route
              path="/"
              element={
                <PrivateRoute redirectTo="/login">
                  <ProfileSetting />
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
              path="/update-profile"
              element={
                <PrivateRoute redirectTo="/login">
                  <UpdateProfile />
                </PrivateRoute>
              }
            />
            {/* <Route path="/update-profile" element={<UpdateProfile />} /> */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Router>
        {/* </div>
        </Container> */}
      </AuthProvider>
    </>
  );
}
