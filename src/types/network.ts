import { UserDocument, Version } from "./document";
import { IItem } from "./item";

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

export interface CreateDocumentSuccess {
  redirect: false;
  newDocument: UserDocument;
}

export interface UpdateDocumentSuccess {
  redirect: false;
  success: boolean;
}

export interface GetDocumentSuccess {
  redirect: false;
  data: {
    items: IItem[];
  };
  title: string;
}

interface UserDocumentSessionExpired {
  redirect: true;
}

interface UserDocumentFailure {
  redirect: false;
}

export interface GetDocumentVersionsSuccess {
  redirect: false;
  versions: Version[];
}

export interface CommitDocSuccess {
  redirect: false;
  version: Version;
}

export interface SwitchVersionSuccess {
  redirect: false;
  data: { items: IItem[] };
}

export type UserDocumentsResponse =
  | UserDocumentFailure
  | UserDocumentsSuccess
  | UserDocumentSessionExpired;

export type CreateDocumentResponse =
  | CreateDocumentSuccess
  | UserDocumentFailure
  | UserDocumentSessionExpired;

export type GetDocumentResponse =
  | UserDocumentFailure
  | GetDocumentSuccess
  | UserDocumentSessionExpired;

export type UpdateDocumentResponse =
  | UserDocumentFailure
  | UpdateDocumentSuccess
  | UserDocumentSessionExpired;

export type GetVersionsResponse =
  | GetDocumentVersionsSuccess
  | UserDocumentFailure
  | UserDocumentSessionExpired;

export type SwitchVersionResponse =
  | SwitchVersionSuccess
  | UserDocumentFailure
  | UserDocumentSessionExpired;

export type CommitDocResponse =
  | CommitDocSuccess
  | UserDocumentFailure
  | UserDocumentSessionExpired;

export type AuthResponse = AuthSuccessResponse | AuthFailureResponse;
