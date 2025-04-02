import { createSlice } from "@reduxjs/toolkit";
import {
  createOpportunity,
  fetchOpportunities,
  fetchOpportunityDetails,
  updateOpportunity,
  deleteOpportunity
} from "./opportunityAction";

const initialState = {
  opportunities: [],
  opportunityDetails: null,
  loading: false,
  error: null,
};

const isOpportunityDetailsDifferent = (current, incoming) => {
  if (!current || !incoming) return true;
  const comparableFields = ['publicId', 'title', 'status', 'description'];
  return comparableFields.some(field => current[field] !== incoming[field]);
};

const opportunitySlice = createSlice({
  name: "opportunity",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetOpportunityDetails: (state) => {
      state.opportunityDetails = null;
    },
    cacheOpportunityDetails: (state, action) => {
      if (!state.opportunityCache) state.opportunityCache = {};
      state.opportunityCache[action.payload.publicId] = action.payload;
    },
    updateOpportunitiesList: (state, action) => {
      state.opportunities = action.payload.map(opportunity => ({
        publicId: opportunity.publicId,
        clientName: opportunity.clientName,
        dateOfInterview: opportunity.dateOfInterview,
        jobDescription: opportunity.jobDescription,
        totalRounds: opportunity.totalRounds,
        clearedRounds: opportunity.clearedRounds,
        finalResult: opportunity.finalResult,
        clientFeedback: opportunity.clientFeedback,
      }));
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Opportunity
      .addCase(createOpportunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOpportunity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOpportunity.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Opportunities
      .addCase(fetchOpportunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunities.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.opportunities = payload.map(opportunity => ({
          publicId: opportunity.publicId,
          clientName: opportunity.clientName,
          dateOfInterview: opportunity.dateOfInterview,
          jobDescription: opportunity.jobDescription,
          totalRounds: opportunity.totalRounds,
          clearedRounds: opportunity.clearedRounds,
          finalResult: opportunity.finalResult,
          clientFeedback: opportunity.clientFeedback,
        }));
      })
      .addCase(fetchOpportunities.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Opportunity Details
      .addCase(fetchOpportunityDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunityDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (isOpportunityDetailsDifferent(state.opportunityDetails, payload)) {
          state.opportunityDetails = {
            publicId: payload.publicId,
            title: payload.title,
            status: payload.status,
            description: payload.description,
            createdDate: payload.createdDate,
          };
        }
      })
      .addCase(fetchOpportunityDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Update Opportunity
      .addCase(updateOpportunity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOpportunity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateOpportunity.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Delete Opportunity
      .addCase(deleteOpportunity.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOpportunity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteOpportunity.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  }
});

export const { clearError, resetOpportunityDetails, cacheOpportunityDetails, updateOpportunitiesList } = opportunitySlice.actions;
export default opportunitySlice.reducer;
