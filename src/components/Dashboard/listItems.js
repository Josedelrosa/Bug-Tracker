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
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.js";
import { Link, useNavigate } from "react-router-dom";

// const { logout } = useAuth();
// const history = useNavigate();

// async function handleLogout() {
//   try {
//     await logout();
//     history("/login");
//   } catch (error) {
//     setError("Failed to log out");
//   }
// }
export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Customers" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
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
    {/* <ListItem
      button
      onClick={() => {
        alert("sup");
      }}
      sx={{
        bgcolor: "#B23B3B",
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
    </ListItem> */}
  </div>
);
export default function LogoutButton() {
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const history = useNavigate();

  async function handleLogout() {
    setError("");
    try {
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
          bgcolor: "#B23B3B",
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
