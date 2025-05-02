import { createSlice } from "@reduxjs/toolkit";
import {
  createIntern,
  fetchInterns,
  fetchInternDetails,
  updateIntern,
  deleteIntern
} from "./internAction";

const initialState = {
  interns: [],
  internDetails: null,
  loading: false,
  error: null,
};

const isInternDetailsDifferent = (current, incoming) => {
  if (!current || !incoming) return true;
  const comparableFields = ["publicId", "name", "email", "startDate", "endDate", "mentor", "status", "competency", "feedback", "remark", "location", "rating"];
  return comparableFields.some(field => current[field] !== incoming[field]);
};

const internSlice = createSlice({
  name: "intern",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetInternDetails: (state) => {
      state.internDetails = null;
    },
    cacheInternDetails: (state, action) => {
      if (!state.internCache) state.internCache = {};
      state.internCache[action.payload.publicId] = action.payload;
    },
    updateInternsList: (state, action) => {
      state.interns = action.payload.map(intern => ({
        publicId: intern.publicId,
        name: intern.name,
        email: intern.email,
        startDate: intern.startDate,
        endDate: intern.endDate,
        mentor: intern.mentor,
        status: intern.status,
        competency: intern.competency,
        hiredCompetency: intern.hiredCompetency,
        location: intern.location,
        rating: intern.rating,
        feedback: intern.feedback,
        remark: intern.remark,
        mentorId: intern.mentorId,
        competencyId: intern.competencyId,
    }));
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Intern
      .addCase(createIntern.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIntern.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createIntern.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Interns
      .addCase(fetchInterns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterns.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.interns = payload?.interns?.map(intern => ({
          id: intern.id,
          publicId: intern.publicId,
          name: intern.name,
          email: intern.email,
          startDate: intern.startDate,
          endDate: intern.endDate,
          mentor: intern.mentor,
          status: intern.status,
          competency: intern.competency,
          hiredCompetency: intern.hiredCompetency,
          location: intern.location,
          rating: intern.rating,
          feedback: intern.feedback,
          remark: intern.remark,
          mentorId: intern.mentorId,
          competencyId: intern.competencyId,
          isOffered: intern.isOffered,
        }));
      })
      .addCase(fetchInterns.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Intern Details
      .addCase(fetchInternDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInternDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (isInternDetailsDifferent(state.internDetails, payload)) {
          state.internDetails = {
            id: payload.id,
            publicId: payload.publicId,
            name: payload.name,
            email: payload.email,
            startDate: payload.startDate,
            endDate: payload.endDate,
            mentor: payload.mentor,
            status: payload.status,
            competency: payload.competency,
            location: payload.location,
            rating: payload.rating,
            feedback: payload.feedback,
            remark: payload.remark,
            mentorId: payload.mentorId,
            isOffered: payload.isOffered,
            lastWorkingDay: payload.lastWorkingDay,
            hiredCompetency: payload.hiredCompetency,
            competencyId: payload.competencyId,
            profileImage: payload.profileImage
          };
        }
      })
      .addCase(fetchInternDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Update intern
      .addCase(updateIntern.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateIntern.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateIntern.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Delete Intern
      .addCase(deleteIntern.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteIntern.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteIntern.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  }
});

export const { clearError, resetInternDetails, cacheInternDetails, updateInternsList } = internSlice.actions;
export default internSlice.reducer;
