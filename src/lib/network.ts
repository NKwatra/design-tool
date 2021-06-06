import {
  AuthResponse,
  SigninDetails,
  SignupDetails,
  UserDocumentsResponse,
} from "../types/network";
import axios from "axios";
import { UserDocument } from "../types/document";

const client = axios.create({
  baseURL: "http://localhost:4020",
  timeout: 5000,
});

/**
 *
 * @param details  sign up details of the user
 * @returns Whether the operation was successful and
 * user details if successfull
 */
const signup = async (details: SignupDetails): Promise<AuthResponse> => {
  try {
    const response = await client.post("/auth/signup", {
      ...details,
    });
    const { user, token } = response.data;
    localStorage.setItem("token", token);
    return {
      success: true,
      user,
    };
  } catch (err) {
    if (err.response) {
      alert(err.response.data.message);
    } else {
      alert("Unable to communicate with the server");
    }
    return {
      success: false,
    };
  }
};

/**
 *
 * @param details sign in credentials of the user
 * @returns Whether the operation was successful.
 */
const signin = async (details: SigninDetails): Promise<AuthResponse> => {
  try {
    const response = await client.post("/auth/login", {
      ...details,
    });
    const { user, token } = response.data;
    localStorage.setItem("token", token);
    return {
      success: true,
      user,
    };
  } catch (err) {
    if (err.response) {
      alert(err.response.data.message);
    } else {
      alert("Unable to communicate with the server");
    }
    return {
      success: false,
    };
  }
};

/**
 *
 * @returns Whether the session has expired and user needs to be redirected
 */
const getUserDocuments = async (): Promise<UserDocumentsResponse> => {
  try {
    const response = await client.get("/document", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const documents: UserDocument[] = response.data.documents;
    return {
      redirect: false,
      documents,
    };
  } catch (err) {
    if (err.response) {
      if (err.response.status === 401) {
        localStorage.removeItem("token");
        alert("Session expired, please login again");
        return {
          redirect: true,
        };
      } else {
        alert(err.response.data.message);
      }
    } else {
      alert("Unable to communicate with the server");
    }
    return {
      redirect: false,
    };
  }
};

const networkServices = {
  signup,
  signin,
  getUserDocuments,
};

export default networkServices;
