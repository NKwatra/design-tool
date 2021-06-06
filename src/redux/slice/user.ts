import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDocument } from "../../types/document";
import { SignupDetails } from "../../types/network";
import { RootState } from "../store";

interface UserState {
  firstName: string | undefined;
  lastName: string | undefined;
  documents: UserDocument[];
}

const initialState: UserState = {
  firstName: undefined,
  lastName: undefined,
  documents: [],
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

    setDocuments: (state, action: PayloadAction<UserDocument[]>) => {
      state.documents = action.payload;
    },
  },
});

export const selectUserFirstName = (state: RootState) => state.user.firstName;
export const selectUserDocuments = (state: RootState) => state.user.documents;

export const { setUserDetails, setDocuments } = userSlice.actions;
export default userSlice.reducer;
