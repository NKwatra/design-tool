import { UserDocument } from "./document";

export interface SignupDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SigninDetails {
  email: string;
  password: string;
}

interface AuthSuccessResponse {
  success: true;
  user: Pick<SignupDetails, "firstName" | "lastName">;
}

interface AuthFailureResponse {
  success: false;
}

export interface UserDocumentsSuccess {
  redirect: false;
  documents: UserDocument[];
}

interface UserDocumentSessionExpired {
  redirect: true;
}

interface UserDocumentFailure {
  redirect: false;
}

export type UserDocumentsResponse =
  | UserDocumentFailure
  | UserDocumentsSuccess
  | UserDocumentSessionExpired;

export type AuthResponse = AuthSuccessResponse | AuthFailureResponse;
