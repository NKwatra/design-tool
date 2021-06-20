import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDocument } from "../../types/document";
import { RootState } from "../store";

interface UserState {
  documents: UserDocument[];
}

const initialState: UserState = {
  documents: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setDocuments: (state, action: PayloadAction<UserDocument[]>) => {
      state.documents = action.payload;
    },

    addDocument: (state, action: PayloadAction<UserDocument>) => {
      state.documents.push(action.payload);
    },

    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(
        (doc) => doc.id !== action.payload
      );
    },

    resetState: () => {
      return initialState;
    },
  },
});

export const selectUserDocuments = (state: RootState) => state.user.documents;

export const { setDocuments, addDocument, resetState, deleteDocument } =
  userSlice.actions;
export default userSlice.reducer;
