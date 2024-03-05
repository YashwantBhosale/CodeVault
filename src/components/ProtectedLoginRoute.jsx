import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedLoginRoutes() {
    const userLoginStatus = useSelector(state => state.loginStatus.isLoggedIn);

    return (
        userLoginStatus ?  <Navigate to="/home" /> : <Outlet /> 
    )


}

export default ProtectedLoginRoutes;