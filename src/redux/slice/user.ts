import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SignupDetails } from "../../types/network";
import { RootState } from "../store";

interface UserState {
  firstName: string | undefined;
  lastName: string | undefined;
}

const initialState: UserState = {
  firstName: undefined,
  lastName: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (
      state,
      action: PayloadAction<Pick<SignupDetails, "firstName" | "lastName">>
    ) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
    },
  },
});

export const selectUserFirstName = (state: RootState) => state.user.firstName;

export const { setUserDetails } = userSlice.actions;
export default userSlice.reducer;
