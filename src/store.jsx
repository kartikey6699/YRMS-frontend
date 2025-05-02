import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import resourceReducer from "./features/resource/resourceSlice";
import opportunityReducer from './features/opportunity/opportunitySlice';
import baselineReducer from "./features/baseline/baselineSlice";
import internReducer from "./features/intern/internSlice";
import programReducer from "./features/program/programSlice";
import roleReducer from "./features/role/roleSlice"
import InternTaskReducer from "./features/InternTask/internTaskSlice"
export const store = configureStore({
    reducer: {
        auth: authReducer,
        resource: resourceReducer,
        opportunity: opportunityReducer,
        baseline: baselineReducer,
        intern: internReducer,
        program: programReducer,
        role: roleReducer,
        internTask: InternTaskReducer,
    }
})