import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_API } from "../../config/Endpoints/Endpoints";

const apiClient = axios.create({
  baseURL: AUTH_API.ADMIN_LOGIN,
  headers: {
    "Content-Type": "application/json",
  },
});

export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("", payload);
      const { success, data, message } = response.data;

      if (!success || !data.token) {
        throw new Error(message || "No token received from server");
      }

      return { token: data.token, data: {} };
      
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Admin login failed";
      return rejectWithValue(errorMessage);
    }
  }
);