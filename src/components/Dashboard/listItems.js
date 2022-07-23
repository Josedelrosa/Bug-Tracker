import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import LibraryBooksSharpIcon from "@mui/icons-material/LibraryBooksSharp";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.js";
import { useNavigate, NavLink, useLocation } from "react-router-dom";

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
      <ListItemText primary="Customers" sx={{ color: "#FFFFFF" }} />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
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
