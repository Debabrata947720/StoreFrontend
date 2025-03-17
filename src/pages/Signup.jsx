import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import useApi from "../hook/useApi";
import { useNavigate } from "react-router-dom";
const Signup = () => {
    const { register, handleSubmit } = useForm();
    const { request, loading } = useApi();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const response = await request("POST", "/auth/signup", data);
        if (response) {
            localStorage.setItem("token", response.token);
            toast.success("Account created successfully!");
            navigate("/verify");
        }
    };

    return (
        <div className='flex min-h-screen items-center justify-center '>
            <div className='w-full max-w-md rounded-lg p-6 shadow-lg'>
                <h2 className='mb-4 text-center text-2xl font-bold'>Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <input
                        {...register("username", { required: true })}
                        placeholder='Name'
                        className='w-full rounded-lg border p-2 focus:outline-none'
                    />
                    <input
                        {...register("email", { required: true })}
                        type='email'
                        placeholder='Email'
                        className='w-full rounded-lg border p-2 focus:outline-none'
                    />
                    <input
                        {...register("password", { required: true })}
                        type='password'
                        placeholder='Password'
                        className='w-full rounded-lg border p-2 focus:outline-none'
                    />
                    <button
                        type='submit'
                        className='w-full rounded-lg bg-green-500 p-2 font-semibold  disabled:opacity-50'
                        disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
