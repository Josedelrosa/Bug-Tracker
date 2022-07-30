import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import LibraryBooksSharpIcon from "@mui/icons-material/LibraryBooksSharp";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.js";
import { useNavigate, NavLink } from "react-router-dom";

const navLinkStyles = ({ isActive }) => {
  return {
    color: "white",
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
  };
};

export const mainListItems = (
  <div>
    <NavLink to={"/dashboard"} style={navLinkStyles}>
      <ListItem button>
        <ListItemIcon sx={{ color: "white" }}>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText disableTypography primary="Dashboard" />
      </ListItem>
    </NavLink>
    <NavLink to={"/tickets"} style={navLinkStyles}>
      <ListItem button>
        <ListItemIcon sx={{ color: "white" }}>
          <LibraryBooksSharpIcon />
        </ListItemIcon>
        <ListItemText disableTypography primary="Tickets" />
      </ListItem>
    </NavLink>
    <ListItem button>
      <ListItemIcon sx={{ color: "white" }}>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Administration" sx={{ color: "#FFFFFF" }} />
    </ListItem>
  </div>
);

export default function LogoutButton() {
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const history = useNavigate();

  async function handleLogout() {
    try {
      setError("");
      await logout();
      history("/login");
    } catch (error) {
      setError("Failed to log out");
    }
  }
  return (
    <div>
      <ListItem
        button
        onClick={handleLogout}
        sx={{
          bgcolor: "#C51F5D",
          width: "70%",
          borderRadius: "12px",
          ml: "15%",
          "&.MuiButtonBase-root:hover": {
            bgcolor: "#B23B3B",
          },
        }}
      >
        <ListItemIcon>
          <LogoutIcon sx={{ color: "#FFFFFF" }} />
        </ListItemIcon>
        <ListItemText primary="LOGOUT" sx={{ color: "#FFFFFF" }} />
      </ListItem>
    </div>
  );
}
