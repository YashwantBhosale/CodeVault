import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes() {
    const userLoginStatus = useSelector(state => state.loginStatus.isLoggedIn);

    return (
        userLoginStatus ? <Outlet /> : <Navigate to="/login" />
    )


}

export default ProtectedRoutes;