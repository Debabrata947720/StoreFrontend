import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useApi from "../hook/useApi";
import DeviseID from "../utils/deviseId";
import { SetAdmin, SetLoginStutas } from "../Store/slices/authSlice";
import { useDispatch } from "react-redux";
const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const { request, loading } = useApi();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Pre-fill OTP from URL parameter
    useEffect(() => {
        const otpFromURL = searchParams.get("code");
        console.log(otpFromURL);
        if (otpFromURL) {
            setOtp(otpFromURL);
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Allow only numbers (max 6)
        setOtp(value);

        if (value.length === 6) {
            handleSubmit(value);
        }
    };

    const handleSubmit = async (otpCode) => {
        if (otpCode.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }
        const DeviseId = await DeviseID();
        const response = await request("POST", "/auth/verify", {
            code: otpCode,
            DeviseId: DeviseId,
        });
        dispatch(SetAdmin(false));
        dispatch(SetLoginStutas(true));
        toast.success(response.message || "OTP Verified Successfully!");
        navigate("/");
    };

    return (
        <div className='flex items-center justify-center h-screen '>
            <div className=' p-6 rounded-lg shadow-lg w-96'>
                <h2 className='text-2xl font-semibold text-center mb-4'>
                    Verify Your Email
                </h2>
                <p className='text-gray-600 text-center mb-4'>
                    Enter the 6-digit OTP sent to your email.
                </p>

                <input
                    type='text'
                    value={otp}
                    onChange={handleChange}
                    maxLength={6}
                    className='w-full p-3 border rounded-md text-center text-xl tracking-widest placeholder:text-Text'
                    placeholder='Enter OTP'
                />

                <button
                    onClick={() => handleSubmit(otp)}
                    disabled={loading || otp.length !== 6}
                    className={`w-full mt-4 p-3  rounded-md ${
                        otp.length === 6
                            ? "bg-Green"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </div>
        </div>
    );
};

export default VerifyOTP;
