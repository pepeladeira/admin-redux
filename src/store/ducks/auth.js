import * as AuthService from "../../services/auth";

import { createSlice } from "@reduxjs/toolkit";

import { showAlert } from "../middlewares/showAlert";

const slice = createSlice({
  name: "auth",
  initialState: {
    user: AuthService.getUser() || {},
    token: AuthService.getToken() || null,
    userLoggedIn: AuthService.getToken() ? true : false,
    role: AuthService.getUser() ? AuthService.getUser().role || null : null,
    isAdmin: AuthService.getUser()
      ? AuthService.getUser().role === "admin"
      : false,
    isLoading: false,
    error: null,
  },
  reducers: {
    tokenValidationRequested: (auth, action) => {
      auth.isLoading = true;
    },

    tokenValidationSucceed: (auth, action) => {
      auth.isLoading = false;
      auth.user = action.payload.user;
      auth.role = action.payload.user.role;
      auth.token = action.payload.token;
      auth.userLoggedIn = true;
    },

    tokenValidationFailed: (auth, action) => {
      auth.isLoading = false;
      auth.user = {};
      auth.error = action.payload;
    },

    tokenLogout: (auth, action) => {
      auth.user = {};
      auth.role = "";
      auth.token = "";
      auth.userLoggedIn = false;
      auth.isLoading = false;
    },

    isAdminChecked: (auth, action) => {
      auth.isLoading = true;
      auth.isAdmin = false;
    },

    isAdminConfirmed: (auth, action) => {
      auth.isLoading = false;
      auth.isAdmin = true;
    },
  },
});

export default slice.reducer;

const {
  tokenValidationRequested,
  tokenValidationSucceed,
  tokenValidationFailed,
  tokenLogout,
  isAdminChecked,
  isAdminConfirmed,
} = slice.actions;

export const testIfLoginTokenIsValid = (token) => {
  return async (dispatch) => {
    try {
      dispatch(request_validation_token_login());
      const { data } = await AuthService.checkAuth(token);
      if (data.user.isAdmin) {
        AuthService.setToken(data.token);
        AuthService.setUser(data.user);
        dispatch(validation_token_login_success(data.user, data.token));
      } else {
        throw Error("UNAUTHORIZED");
      }
      console.log("Login successfull!");
    } catch (error) {
      dispatch(showAlert("error", "You dont belong here 🔥"));
      dispatch(validation_token_login_error(error.response));
      dispatch(logout());
    }
  };
};

export const testIfUserIsAdmin = () => {
  return async (dispatch) => {
    try {
      dispatch(request_validation_jwt_admin());
      const { data } = await AuthService.checkIfIsAdmin();
      if (data.success) {
        dispatch(validation_jwt_success());
      } else {
        throw Error("UNAUTHORIZED");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      dispatch(
        showAlert("error", "Ops! You are not an Admin! Get out of here! 🚔")
      );
      dispatch(validation_token_login_error(error.response));
      dispatch(logout());
    }
  };
};

const request_validation_token_login = () => {
  return { type: tokenValidationRequested.type };
};

const request_validation_jwt_admin = () => {
  return { type: isAdminConfirmed.type };
};

const validation_jwt_success = () => {
  return { type: isAdminChecked.type };
};

const validation_token_login_success = (user, token) => {
  return { type: tokenValidationSucceed.type, payload: { user, token } };
};
const validation_token_login_error = (error) => {
  return { type: tokenValidationFailed.type, error };
};

export const logout = () => {
  console.log("entrei aqui");
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  return { type: tokenLogout.type };
};
