import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import resourceReducer from "./features/resource/resourceSlice";
import opportunityReducer from './features/opportunity/opportunitySlice'; 
import baselineReducer from "./features/baseline/baselineSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        resource: resourceReducer,
        opportunity: opportunityReducer,
        baseline: baselineReducer 
    }
})