import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ROLE_API, FEATURE_API } from "../../config/Endpoints/Endpoints";


const rolesApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});


export const fetchRoles = createAsyncThunk(
  "resource/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await resourceApiClient.get( ROLE_API.LIST , {
        headers: {
          accept: "application/json"
        }
      });
      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to fetch technologies");
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch technologies";
      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchFeatures = createAsyncThunk(
  "resource/fetchFeatures",
  async (_, { rejectWithValue }) => {
    try {
      const response = await rolesApiClient.get( FEATURE_API.LIST , {
        headers: {
          accept: "application/json"
        }
      });
      const { success, data, message } = response;
      console.log(data, ">>>>>>>>>>>>>>>>>>>>>>")

      if (!success) {
        throw new Error(message || "Failed to fetch technologies");
      }

      return data?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch technologies";
      return rejectWithValue(errorMessage);
    }
  }
);