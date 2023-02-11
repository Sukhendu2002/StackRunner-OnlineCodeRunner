import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  let auth = localStorage.getItem("authToken");
  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
