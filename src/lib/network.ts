import { SigninDetails, SignupDetails } from "../types/network";
import axios from "axios";
import { setUserDetails } from "../redux/slice/user";

const client = axios.create({
  baseURL: "http://localhost:4020",
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const signup = async (details: SignupDetails) => {
  try {
    const response = await client.post("/auth/signup", {
      ...details,
    });
    const { user, token } = response.data;
    localStorage.setItem("token", token);
    setUserDetails(user);
    return true;
  } catch (err) {
    if (err.response) {
      alert(err.response.data.message);
    } else {
      alert("Unable to communicate with the server");
    }
    return false;
  }
};

const signin = async (details: SigninDetails) => {
  try {
    const response = await client.post("/auth/login", {
      ...details,
    });
    const { user, token } = response.data;
    localStorage.setItem("token", token);
    setUserDetails(user);
    return true;
  } catch (err) {
    if (err.response) {
      alert(err.response.data.message);
    } else {
      alert("Unable to communicate with the server");
    }
    return false;
  }
};

const networkServices = {
  signup,
  signin,
};

export default networkServices;
