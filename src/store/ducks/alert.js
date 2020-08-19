import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "alert",
  initialState: {
    showAlert: false,
    alertType: "",
    alertMessage: "",
  },
  reducers: {
    hiddenAlert: (alert) => {
      alert.showAlert = false;
      alert.alertType = "";
      alert.alertMessage = "danger";
    },

    shownAlert: (alert, action) => {
      alert.showAlert = true;
      alert.alertType = action.payload.type;
      alert.alertMessage = action.payload.message;
    },
  },
});

export default slice.reducer;

const { hiddenAlert, shownAlert } = slice.actions;

export const showAlert = (type, message) => {
  return (dispatch) => {
    dispatch(show(type, message));
    setTimeout(() => {
      dispatch(hide());
    }, 3000);
  };
};

const show = (type, message) => ({
  type: shownAlert.type,
  payload: { type, message },
});

const hide = () => ({ type: hiddenAlert.type });
