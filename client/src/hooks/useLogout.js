import axios from "axios";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const logout =  async () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return { logout };
}