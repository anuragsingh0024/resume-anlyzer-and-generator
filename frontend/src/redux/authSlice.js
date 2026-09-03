import { createSlice } from '@reduxjs/toolkit';

const getInitialToken = () => {
    let token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined" || token === '""') {
        return null;
    }
    if (token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
    }
    if (!token || token === "null" || token === "undefined") {
        return null;
    }
    return token;
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isLoggedIn: !!getInitialToken(),
        resumeData: null,
        token: getInitialToken(),
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload.user || action.payload;
            state.resumeData = action.payload.resumeData || state.resumeData;
            state.token = action.payload.token || state.token || getInitialToken();
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
            state.resumeData = null;
            localStorage.removeItem('token');
            localStorage.removeItem('role');
        },
        setResumeData: (state, action) => {
            state.resumeData = action.payload;
        }
    },
});

export const { loginSuccess, setUser, logout, setResumeData } = authSlice.actions;
export default authSlice.reducer;