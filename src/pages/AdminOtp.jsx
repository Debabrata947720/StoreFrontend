import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useApi from "../hook/useApi";
import { useDispatch } from "react-redux";
import { SetAdmin, SetLoginStutas } from "../Store/slices/authSlice";
import { useNavigate } from "react-router-dom";
const OTPForm = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();
    const Dispatch = useDispatch();
    const Navigate = useNavigate();
    const otpValue = watch("otp", "");
    const { request, loading } = useApi();

    // Auto-submit when OTP length is 10
    useEffect(() => {
        if (otpValue.length === 10) {
            handleSubmit(onSubmit)();
        }
    }, [otpValue, handleSubmit]);

    const onSubmit = async (data) => {
        // console.log("OTP Submitted:", data.otp);
        const res = await request("POST", "/a/verify", data);
        if (res.status == 200) {
            Dispatch(SetAdmin(true));
            Dispatch(SetLoginStutas(true));
            Navigate("/admin");
        }
    };

    // Allow only uppercase letters and numbers
    const handleInputChange = (e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        setValue("otp", value); // Update the form value
    };

    return (
        <div className='flex items-center justify-center min-h-screen '>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className=' p-8 rounded-lg shadow-md w-full max-w-sm'
            >
                <h2 className='text-2xl font-bold mb-6 text-center'>
                    Enter OTP
                </h2>

                {/* OTP Input Field */}
                <div className='mb-6'>
                    <input
                        type='text'
                        id='otp'
                        {...register("otp", {
                            required: "OTP is required",
                            pattern: {
                                value: /^[A-Z0-9]{10}$/, // Ensure OTP is exactly 10 uppercase letters or numbers
                                message:
                                    "OTP must be 10 characters (uppercase letters and numbers only)",
                            },
                        })}
                        onChange={handleInputChange} // Restrict input to uppercase and numbers
                        maxLength={10} // Limit input to 10 characters
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none  ${
                            errors.otp
                                ? "border-red-200 focus:ring-red-200"
                                : " focus:border-Green"
                        }`}
                        placeholder='Enter 10-character OTP'
                    />
                    {errors.otp && (
                        <p className='text-red-500 text-sm mt-2'>
                            {errors.otp.message}
                        </p>
                    )}
                </div>

                <button
                    type='submit'
                    className={`w-full bg-Green py-2 px-4 rounded-lg ${
                        loading ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    disabled={loading}
                >
                    Verify OTP
                </button>
            </form>
        </div>
    );
};

export default OTPForm;
