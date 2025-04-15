import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, TablePagination, Box
} from "@mui/material";
import { useTheme } from "../context/ThemeContext"; // Assuming you have a context for dark mode

const API_KEY = "069c8d5d3fa317b0361c9cf9";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

const ExchangeRates = () => {
  const [rates, setRates] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { darkMode } = useTheme(); // Get dark mode status from context

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(BASE_URL);
        const data = response.data.conversion_rates;
        const formattedRates = Object.entries(data).map(([currency, rate]) => ({
          currency,
          rate
        }));
        setRates(formattedRates);
      } catch (error) {
        console.error("Error fetching exchange rates", error);
      }
    };

    fetchRates();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Table header background color and text color based on dark mode
  const tableHeaderBgColor = darkMode ? "#333333" : "#f5f5f5";
  const tableTextColor = darkMode ? "#ffffff" : "#000000";
  const tableRowBgColor = darkMode ? "#1e1e1e" : "#ffffff";
  const tableRowHoverColor = darkMode ? "#444444" : "#f0f0f0";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Live Exchange Rates (Base: USD)
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 600, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: tableHeaderBgColor }}>
            <TableRow>
              <TableCell style={{ color: tableTextColor }}><strong>Currency</strong></TableCell>
              <TableCell align="right" style={{ color: tableTextColor }}><strong>Rate</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rates
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  key={row.currency}
                  sx={{
                    backgroundColor: tableRowBgColor,
                    "&:hover": {
                      backgroundColor: tableRowHoverColor,
                    },
                  }}
                >
                  <TableCell>{row.currency}</TableCell>
                  <TableCell align="right">{row.rate}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={rates.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>
    </Box>
  );
};

export default ExchangeRates;
