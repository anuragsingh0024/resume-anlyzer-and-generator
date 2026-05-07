import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const user = localStorage.getItem("role"); // Get user data

    return user && user === "admin" ? (
        children
    ) : (
        <div>
            {toast.error("This is proctect route only for admin")}
            <Navigate to={"/auth/login"} />
        </div>
    );
};

export default AdminRoute;
