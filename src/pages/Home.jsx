import React, { useState, useEffect } from "react";
import {Button,TextField,Box,Typography,MenuItem,Select,InputLabel,FormControl,
} from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { useCurrencyConversion } from "../hooks/useCurrencyConversion";

export default function Home() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [termYears, setTermYears] = useState("");
  const [convertedEMI, setConvertedEMI] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [monthlyEMI, setMonthlyEMI] = useState(null);
  const [originalSchedule, setOriginalSchedule] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [errors, setErrors] = useState({
    loanAmount: false,
    interestRate: false,
    termYears: false,
  });

  const { darkMode } = useTheme();
  const { getExchangeRate } = useCurrencyConversion();

  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
    if (field === "loanAmount") setLoanAmount(value);
    if (field === "interestRate") setInterestRate(value);
    if (field === "termYears") setTermYears(value);
  };

  const calculateEMI = () => {
    const newErrors = {
      loanAmount: loanAmount === "",
      interestRate: interestRate === "",
      termYears: termYears === "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) return;

    const monthlyRate = interestRate / 100 / 12;
    const months = termYears * 12;

    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    setMonthlyEMI(emi.toFixed(2));
    getConvertedEMI(emi);
    generateAmortizationSchedule(emi);
    setIsCalculated(true);
  };

  const getConvertedEMI = async (emi) => {
    const conversionRate = await getExchangeRate(currency);
    const convertedAmount = (emi * conversionRate).toFixed(2);
    setConvertedEMI(convertedAmount);
  };

  const generateAmortizationSchedule = (emi) => {
    const schedule = [];
    let balance = loanAmount;

    for (let month = 1; month <= termYears * 12; month++) {
      const interest = (balance * (interestRate / 100) / 12).toFixed(2);
      const principal = (emi - interest).toFixed(2);
      balance -= principal;

      schedule.push({
        month,
        principal: parseFloat(principal),
        interest: parseFloat(interest),
        balance: parseFloat(balance.toFixed(2)),
      });
    }

    setOriginalSchedule(schedule);
    setAmortizationSchedule(schedule);
  };

  useEffect(() => {
    const convertSchedule = async () => {
      if (originalSchedule.length === 0 || !currency) return;

      const rate = await getExchangeRate(currency);
      const converted = originalSchedule.map((row) => ({
        month: row.month,
        principal: (row.principal * rate).toFixed(2),
        interest: (row.interest * rate).toFixed(2),
        balance: (row.balance * rate).toFixed(2),
      }));

      setAmortizationSchedule(converted);
      if (monthlyEMI) {
        setConvertedEMI((monthlyEMI * rate).toFixed(2));
      }
    };

    convertSchedule();
  }, [currency, originalSchedule, monthlyEMI]);

  const resetTable = () => {
    setMonthlyEMI(null);
    setConvertedEMI(null);
    setAmortizationSchedule([]);
    setLoanAmount("");
    setInterestRate("");
    setTermYears("");
    setCurrency("USD");
    setIsCalculated(false);
  };

  const tableTextColor = darkMode ? "#ffffff" : "#000000";
  const tableBackgroundColor = darkMode ? "#1e1e1e" : "#ffffff";
  const headerBackgroundColor = darkMode ? "#333333" : "#f5f5f5";
  const rowEvenBackground = darkMode ? "#2a2a2a" : "#f9f9f9";
  const rowOddBackground = darkMode ? "#1e1e1e" : "#ffffff";

  return (
    <Box sx={{ padding: 3, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Loan Calculator Dashboard
      </Typography>

      <Box sx={{ marginBottom: 3 }}>
        <TextField
          label="Loan Amount"
          type="number"
          value={loanAmount}
          onChange={(e) => handleInputChange("loanAmount", e.target.value)}
          error={errors.loanAmount}
          helperText={errors.loanAmount ? "Required" : ""}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Interest Rate (%)"
          type="number"
          value={interestRate}
          onChange={(e) => handleInputChange("interestRate", e.target.value)}
          error={errors.interestRate}
          helperText={errors.interestRate ? "Required" : ""}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Term (Years)"
          type="number"
          value={termYears}
          onChange={(e) => handleInputChange("termYears", e.target.value)}
          error={errors.termYears}
          helperText={errors.termYears ? "Required" : ""}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
      </Box>

      <Button variant="contained" color="primary" onClick={calculateEMI}>
        CALCULATE
      </Button>

      {isCalculated && monthlyEMI && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">Monthly EMI: ${monthlyEMI}</Typography>

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={currency}
              label="Currency"
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
              <MenuItem value="INR">INR</MenuItem>
              <MenuItem value="AUD">AUD</MenuItem>
              <MenuItem value="JPY">JPY</MenuItem>
              <MenuItem value="CAD">CAD</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Converted EMI: {convertedEMI} {currency}
          </Typography>

          <Button
            variant="outlined"
            color="info"
            sx={{ marginTop: 2 }}
            onClick={resetTable}
          >
            RESET TABLE
          </Button>
        </Box>
      )}

      {isCalculated && amortizationSchedule.length > 0 && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Amortization Schedule ({currency})
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <table
              style={{
                width: "80%",
                borderCollapse: "collapse",
                margin: "0 auto",
                textAlign: "center",
                backgroundColor: tableBackgroundColor,
                color: tableTextColor,
              }}
            >
              <thead>
                <tr style={{ backgroundColor: headerBackgroundColor }}>
                  <th style={{ padding: "8px 16px", border: "1px solid #ddd" }}>
                    Month
                  </th>
                  <th style={{ padding: "8px 16px", border: "1px solid #ddd" }}>
                    Principal
                  </th>
                  <th style={{ padding: "8px 16px", border: "1px solid #ddd" }}>
                    Interest
                  </th>
                  <th style={{ padding: "8px 16px", border: "1px solid #ddd" }}>
                    Remaining Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {amortizationSchedule.map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? rowEvenBackground : rowOddBackground,
                    }}
                  >
                    <td style={{ padding: "8px 16px", border: "1px solid #ddd" }}>
                      {row.month}
                    </td>
                    <td style={{ padding: "8px 16px", border: "1px solid #ddd" }}>
                      {row.principal} {currency}
                    </td>
                    <td style={{ padding: "8px 16px", border: "1px solid #ddd" }}>
                      {row.interest} {currency}
                    </td>
                    <td style={{ padding: "8px 16px", border: "1px solid #ddd" }}>
                      {row.balance} {currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          <Box sx={{ marginTop: 3 }}>
            <Button variant="outlined" color="info" onClick={resetTable}>
              Reset Table
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
