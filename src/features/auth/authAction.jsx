import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_API } from "../../config/Endpoints/Endpoints";

const apiClient = axios.create({
  baseURL: AUTH_API.ADMIN_LOGIN,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("", payload);
      const { success, data, message } = response.data;

      if (!success || !data.token) {
        throw new Error(message || "No token received from server");
      }

      return { 
        token: data.token, 
        data: {
          userName: data.userName,
          rolesName: data.rolesName,
          competencyName: data.competencyName ,
          publicId:data.publicId
        } 
      };
      
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Admin login failed";
      return rejectWithValue(errorMessage);
    }
  }
);