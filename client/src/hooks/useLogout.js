import axios from "axios";
import { useAuthContext } from "./useAuthContext";
export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout =  async () => {
    await axios.post("http://localhost:4000/api/user/logout");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return { logout };
}