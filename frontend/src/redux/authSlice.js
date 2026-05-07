import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isLoggedIn: false,
        resumeData: null, // Full analyzed data yahan aayega
        token: localStorage.getItem("token") || null,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.resumeData = action.payload.resumeData;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            localStorage.removeItem('token')
            state.resumeData = null;
        },
        setResumeData: (state, action) => {
            state.resumeData = action.payload;
        }
    },
});

export const { loginSuccess, logout, setResumeData } = authSlice.actions;
export default authSlice.reducer;