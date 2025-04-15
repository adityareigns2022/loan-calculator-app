import React from "react";
import { Typography, Box } from "@mui/material";

export default function About() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <Typography variant="h4" gutterBottom>
        About the Loan Calculator App
      </Typography>
      <Typography variant="body1" paragraph>
        This app helps users calculate their EMIs for loans, check the latest exchange rates, and provides other useful tools for financial planning.
      </Typography>
    </Box>
  );
}
