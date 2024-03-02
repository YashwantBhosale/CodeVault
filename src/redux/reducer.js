import { createSlice } from "@reduxjs/toolkit";
import { auth } from '../components/firebase'

const initialState = {
    isLoggedIn: false,
    currentUser: {}
}

const loginStatus = createSlice({
    name: "loginStatus",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
        },
        logout: (state, action) => {
            state.isLoggedIn = false;
        }
    }
})

export const { login, logout } = loginStatus.actions
export default loginStatus.reducer;