import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Switch } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme(); 

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" component="div">
          Loan Calculator
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/exchange-rates">
            Exchange Rates
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/error">
            Error Page
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Switch checked={darkMode} onChange={toggleTheme} />
          <Typography variant="body2" color="inherit" sx={{ marginLeft: 1 }}>
            {darkMode ? "Dark Mode" : "Light Mode"}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
