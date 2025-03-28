import { createSlice } from "@reduxjs/toolkit";
import { createResource, fetchResources , fetchResourceDetails } from "./resourceAction";

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
      .addCase(createResource.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.resources.unshift({
          publicId: payload.public_id,
          employeeName: payload.employee_name,
          joiningDate: payload.joining_date,
          designation: payload.designation,
          status: payload.status
        });
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
        state.resources = payload.map(resource => ({
          publicId: resource.public_id,
          employeeName: resource.employee_name,
          joiningDate: resource.joining_date,
          designation: resource.designation,
          status: resource.status
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
          publicId: payload.public_id,
          employeeName: payload.employee_name,
          employeeId: payload.employee_id,
          designation: payload.designation,
          businessGroup: payload.business_group,
          businessUnit: payload.business_unit,
          location: payload.location,
          phoneNumber: payload.phone_number,
          email: payload.email,
          joiningDate: payload.joiningDate,
          status: payload.status,
          grade: payload.grade,
          experience: payload.experience
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
2