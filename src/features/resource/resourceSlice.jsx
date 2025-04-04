import { createSlice } from "@reduxjs/toolkit";
import {
  createResource,
  fetchResources,
  fetchResourceDetails,
  fetchDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  fetchCompetencies,
  createCompetency,
  updateCompetency,
  deleteCompetency
} from "./resourceAction";

const initialState = {
  resources: [],
  resourceDetails: null,
  loading: false,
  error: null,
  designations: [],
  competencies: [],
  designationLoading: false,
  competencyLoading: false,
  createdResource: null 
};

const isResourceDetailsDifferent = (current, incoming) => {
  if (!current || !incoming) return true;
  const comparableFields = ['publicId', 'employeeName', 'employeeId', 'designation', 'status'];
  return comparableFields.some(field => current[field] !== incoming[field]);
};

const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetResourceDetails: (state) => {
      if (state.resourceDetails) {
        state.resourceDetails = null;
      }
    },
    resetCreatedResource: (state) => {
      state.createdResource = null;
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
        state.createdResource = payload;
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
        if (isResourceDetailsDifferent(state.resourceDetails, payload)) {
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
        }
      })
      .addCase(fetchResourceDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Designations
      .addCase(fetchDesignations.pending, (state) => {
        state.designationLoading = true;
      })
      .addCase(fetchDesignations.fulfilled, (state, { payload }) => {
        state.designationLoading = false;
        state.designations = payload.data?.designations?.map(item => ({
          publicId: item.publicId,
          name: item.name
        })) || [];
      })
      .addCase(fetchDesignations.rejected, (state, { payload }) => {
        state.designationLoading = false;
        state.error = payload;
      })

      .addCase(createDesignation.pending, (state) => {
        state.designationLoading = true;
      })
      .addCase(createDesignation.fulfilled, (state) => {
        state.designationLoading = false;
      })
      .addCase(createDesignation.rejected, (state, { payload }) => {
        state.designationLoading = false;
        state.error = payload;
      })

      .addCase(updateDesignation.pending, (state) => {
        state.designationLoading = true;
      })
      .addCase(updateDesignation.fulfilled, (state) => {
        state.designationLoading = false;
      })
      .addCase(updateDesignation.rejected, (state, { payload }) => {
        state.designationLoading = false;
        state.error = payload;
      })

      .addCase(deleteDesignation.pending, (state) => {
        state.designationLoading = true;
      })
      .addCase(deleteDesignation.fulfilled, (state) => {
        state.designationLoading = false;
      })
      .addCase(deleteDesignation.rejected, (state, { payload }) => {
        state.designationLoading = false;
        state.error = payload;
      })

      // Competencies
      .addCase(fetchCompetencies.pending, (state) => {
        state.competencyLoading = true;
      })
      .addCase(fetchCompetencies.fulfilled, (state, { payload }) => {
        state.competencyLoading = false;
        state.competencies = payload.data?.competencies?.map(item => ({
          publicId: item.publicId,
          name: item.name
        })) || [];
      })
      .addCase(fetchCompetencies.rejected, (state, { payload }) => {
        state.competencyLoading = false;
        state.error = payload;
      })

      .addCase(createCompetency.pending, (state) => {
        state.competencyLoading = true;
      })
      .addCase(createCompetency.fulfilled, (state) => {
        state.competencyLoading = false;
      })
      .addCase(createCompetency.rejected, (state, { payload }) => {
        state.competencyLoading = false;
        state.error = payload;
      })

      .addCase(updateCompetency.pending, (state) => {
        state.competencyLoading = true;
      })
      .addCase(updateCompetency.fulfilled, (state) => {
        state.competencyLoading = false;
      })
      .addCase(updateCompetency.rejected, (state, { payload }) => {
        state.competencyLoading = false;
        state.error = payload;
      })

      .addCase(deleteCompetency.pending, (state) => {
        state.competencyLoading = true;
      })
      .addCase(deleteCompetency.fulfilled, (state) => {
        state.competencyLoading = false;
      })
      .addCase(deleteCompetency.rejected, (state, { payload }) => {
        state.competencyLoading = false;
        state.error = payload;
      });
  }
});

export const { clearError, resetResourceDetails } = resourceSlice.actions;
export default resourceSlice.reducer;