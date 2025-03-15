import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { SetLoginStutas } from "../Store/slices/authSlice";

const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api`;

const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const request = async (method, endpoint, data = "", options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const headers = {
                "Content-Type":  "application/json", 
                ...options
            };

            // Add auth token if required
            if (options.requiresAuth) {
                const token = localStorage.getItem("token");
                if (token) headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await axios({
                method,
                url: `${API_BASE_URL}${endpoint}`,
                data,
                headers,
                responseType: options.responseType || "json", // Default to JSON
                withCredentials: true,
            });

            return response;
        } catch (err) {
            if (err.response) {
                const { status, data } = err.response;
                if (status === 401) {
                    toast.error("Session expired, please log in again.");
                    localStorage.removeItem("token");
                    dispatch(SetLoginStutas(null));
                    navigate("/login"); // Redirect to login
                } else if (status === 403) {
                    toast.error("You do not have permission for this action.");
                } else {
                    toast.error(data.message || "Something went wrong.");
                }

                setError(data?.error );
            } else if (err.request) {
                toast.error("Network error. Check your connection.");
                setError("Network error. Check your connection.");
            } else {
                toast.error("An unexpected error occurred.");
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return { request, loading, error };
};

export default useApi;
