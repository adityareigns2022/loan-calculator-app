import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Something Went Wrong!
      </Typography>
      <Typography variant="body1" paragraph>
        Oops! It seems there was an issue with the application. Please try again later.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link} 
        to="/"
      >
        Go Home
      </Button>
    </Box>
  );
}
