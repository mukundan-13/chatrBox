// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isAuthenticated: false,
//   id: "",
//   name: "",
//   phoneNumber: "",
//   about: "",
//   profileImageUrl: "",
//   token: localStorage.getItem("authToken") || "",
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     loginSuccess: (state, action) => {
//       state.isAuthenticated = true;
//       state.id = action.payload.id;
//       state.name = action.payload.name;
//       state.phoneNumber = action.payload.phoneNumber;
//       state.about = action.payload.about;
//       state.profileImageUrl = action.payload.profileImageUrl;
//       state.token = action.payload.token;
//       localStorage.setItem("authToken", action.payload.token);
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.user = initialState.user;
//       state.token = initialState.token;
//       localStorage.removeItem("authToken");
//     },
//     setToken: (state, action) => {
//       state.token = action.payload;
//       localStorage.setItem("authToken", action.payload.token);
//     },
//   },
// });

// export const { loginSuccess, logout, setToken } = userSlice.actions;
// export const userData = (state) => state.user;
// export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  id: "",
  name: "",
  phoneNumber: "",
  about: "",
  profileImageUrl: "",
  token: localStorage.getItem("authToken") || "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.phoneNumber = action.payload.phoneNumber;
      state.about = action.payload.about;
      state.profileImageUrl = action.payload.profileImageUrl;
      state.token = action.payload.token;
      // localStorage.setItem("authToken", action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.id = "";
      state.name = "";
      state.phoneNumber = "";
      state.about = "";
      state.profileImageUrl = "";
      state.token = "";
      localStorage.removeItem("authToken");
    },
    setToken: (state, action) => {
      state.token = action.payload;
      // localStorage.setItem("authToken", action.payload);
    },
  },
});

export const { loginSuccess, logout, setToken } = userSlice.actions;
export const userData = (state) => state.user;
export default userSlice.reducer;
