import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASELINE } from "../../config/Endpoints/Endpoints";

const baselineApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

baselineApiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token"); // Changed from localStorage to sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const fetchBaselineHistories = createAsyncThunk(
  "baseline/fetchBaselineHistories",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.get(
        `${BASELINE.BASELINE_LIST}/${userId}/baseline-list`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createBaseline = createAsyncThunk(
  "baseline/createBaseline",
  async ({ userId, baselineData }, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.post(
        BASELINE.BASELINE_CREATE,
        baselineData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateBaseline = createAsyncThunk(
  "baseline/updateBaseline",
  async ({ baselineId, baselineData }, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.patch(
        BASELINE.BASELINE_UPDATE(baselineId),
        baselineData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Certification Authority CRUD Operations
export const fetchCertificationAuthorities = createAsyncThunk(
  "baseline/fetchCertificationAuthorities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.get(BASELINE.LIST);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCertificationAuthority = createAsyncThunk(
  "baseline/createCertificationAuthority",
  async (name, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.post(
        BASELINE.CREATE,
        { name }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCertificationAuthority = createAsyncThunk(
  "baseline/updateCertificationAuthority",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.patch(
        `${BASELINE.UPDATE}/${id}`,
        { name }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCertificationAuthority = createAsyncThunk(
  "baseline/deleteCertificationAuthority",
  async (id, { rejectWithValue }) => {
    try {
      await baselineApiClient.delete(`${BASELINE.DELETE}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTechnologyCategoriesStack = createAsyncThunk(
  "baseline/fetchTechnologyCategoriesStack",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.get(BASELINE.CATEGORY_LIST_TECHNOLOGY);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Technology Category CRUD Operations
export const fetchTechnologyCategories = createAsyncThunk(
  "baseline/fetchTechnologyCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.get(BASELINE.CATEGORY_LIST);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createTechnologyCategory = createAsyncThunk(
  "baseline/createTechnologyCategory",
  async (name, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.post(
        BASELINE.CATEGORY_CREATE,
        { name }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTechnologyCategory = createAsyncThunk(
  "baseline/updateTechnologyCategory",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.patch(
        `${BASELINE.CATEGORY_UPDATE}/${id}`,
        { name }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTechnologyCategory = createAsyncThunk(
  "baseline/deleteTechnologyCategory",
  async (id, { rejectWithValue }) => {
    try {
      await baselineApiClient.delete(`${BASELINE.CATEGORY_DELETE}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Technology Stack CRUD Operations
export const fetchTechnologyStacks = createAsyncThunk(
  "baseline/fetchTechnologyStacks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.get(BASELINE.TECHNOLOGY_LIST);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createTechnologyStack = createAsyncThunk(
  "baseline/createTechnologyStack",
  async ({ name, technology_category }, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.post(
        BASELINE.TECHNOLOGY_CREATE,
        { name, technology_category }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTechnologyStack = createAsyncThunk(
  "baseline/updateTechnologyStack",
  async ({ id, name, technology_category }, { rejectWithValue }) => {
    try {
      const response = await baselineApiClient.patch(
        `${BASELINE.TECHNOLOGY_UPDATE}/${id}`,
        { name, technology_category }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTechnologyStack = createAsyncThunk(
  "baseline/deleteTechnologyStack",
  async (id, { rejectWithValue }) => {
    try {
      await baselineApiClient.delete(`${BASELINE.TECHNOLOGY_DELETE}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);