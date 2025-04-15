import { useState } from "react";
import axios from "axios";

const API_KEY = "069c8d5d3fa317b0361c9cf9";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

export const useCurrencyConversion = () => {
  const [exchangeRate, setExchangeRate] = useState({});

  const getExchangeRate = async (currency) => {
    try {
      const response = await axios.get(BASE_URL);
      const rates = response.data.conversion_rates;
      setExchangeRate(rates);
      return rates[currency];
    } catch (error) {
      console.error("Error fetching exchange rate", error);
      return 1;
    }
  };

  return { getExchangeRate, exchangeRate };
};
