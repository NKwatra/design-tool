import {
  AuthResponse,
  CreateDocumentResponse,
  GetDocumentResponse,
  SigninDetails,
  SignupDetails,
  UpdateDocumentResponse,
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

/**
 *
 * @param title title of the new document.
 * @returns Whether the session has expired and user needs to be redirected
 */
const createNewDocument = async (
  title: string
): Promise<CreateDocumentResponse> => {
  try {
    const response = await client.post(
      "/document/new",
      { title },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const newDocument = response.data.document;
    return {
      redirect: false,
      newDocument,
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

const verifyAuth = async () => {
  try {
    const response = await client.post("/auth/verify", null, {
      headers: {
        Authorization: localStorage.getItem("token")
          ? `Bearer ${localStorage.getItem("token")}`
          : "Bearer",
      },
    });
    localStorage.setItem("name", response.data.firstName);
    return true;
  } catch (err) {
    if (err.response) {
      if (err.response.status !== 401) {
        alert(err.response.data.message);
      }
    } else {
      alert("Unable to communicate with the server");
    }
    return false;
  }
};

const getDocument = async (id: string): Promise<GetDocumentResponse> => {
  try {
    const response = await client.get(`/document/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const { data, title } = response.data.document;

    return {
      redirect: false,
      data,
      title,
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

const updateDocument = async (
  title: string,
  id: string
): Promise<UpdateDocumentResponse> => {
  try {
    await client.put(
      `/document/${id}`,
      {
        title,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return {
      redirect: false,
      success: true,
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

const patchDocument = async (
  id: string,
  patch: any[]
): Promise<UpdateDocumentResponse> => {
  try {
    await client.patch(
      `/document/${id}`,
      {
        patch,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return {
      redirect: false,
      success: true,
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
  createNewDocument,
  verifyAuth,
  getDocument,
  updateDocument,
  patchDocument,
};

export default networkServices;