import { createSlice } from "@reduxjs/toolkit";
import { createResource, fetchResources, fetchResourceDetails } from "./resourceAction";

const initialState = {
  resources: [],
  resourceDetails: null,
  loading: false,
  error: null,
  designations: ["Software Engineer", "Backend Developer", "Project Manager"],
  competencies: ["Python", "Java", "Data Science"],
};

const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addDesignation: (state, { payload }) => {
      if (!state.designations.includes(payload)) {
        state.designations.push(payload);
      }
    },
    addCompetency: (state, { payload }) => {
      if (!state.competencies.includes(payload)) {
        state.competencies.push(payload);
      }
    },
    resetResourceDetails: (state) => {
      state.resourceDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Resource
      .addCase(createResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResource.fulfilled, (state) => {
        state.loading = false;
        // Don't modify resources here - we'll fetch fresh data
      })
      .addCase(createResource.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      
      // Fetch Resources
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.resources = payload.users.map(user => ({
          publicId: user.publicId,
          employeeName: user.employeeName,
          joiningDate: user.joiningDate,
          designation: user.designation,
          status: user.status || "pool",
          email: user.email,
          phoneNumber: user.phoneNumber,
          gender: user.gender,
          location: user.location,
          businessGroup: user.businessGroup,
          businessUnit: user.businessUnit,
          competency: user.competency,
          technologies: [],
          experience: 0,
          certifications: "",
          communication: ""
        }));
      })
      .addCase(fetchResources.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      
      // Fetch Resource Details
      .addCase(fetchResourceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResourceDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.resourceDetails = {
          publicId: payload.publicId,
          employeeName: payload.employeeName,
          employeeId: payload.employeeId,
          designation: payload.designation,
          businessGroup: payload.businessGroup,
          businessUnit: payload.businessUnit,
          location: payload.location,
          phoneNumber: payload.phoneNumber,
          email: payload.email,
          joiningDate: payload.joiningDate,
          status: payload.status || "pool",
          grade: payload.grade,
          experience: payload.experience || 0,
          competency: payload.competency
        };
      })
      .addCase(fetchResourceDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  }
});

export const { clearError, addDesignation, addCompetency, resetResourceDetails } = resourceSlice.actions;
export default resourceSlice.reducer;