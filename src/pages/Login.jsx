import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import useApi from "../hook/useApi";
import { useNavigate } from "react-router-dom";
import { SetLoginStutas, SetAdmin } from "../Store/slices/authSlice";
const Login = () => {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, request } = useApi();
    const onSubmit = async (data) => {
        const response = await request("POST", "/auth/login", data);
        if (response) {
            toast.success("Login successfully!");
            navigate("/");
            dispatch(SetLoginStutas(true));
            dispatch(SetAdmin(false));
        }
    };

    return (
        <div className='flex min-h-screen items-center justify-center bg-primary-bg text-primary-text'>
            <div className='w-full max-w-md rounded-lg  p-6 shadow-lg'>
                <h2 className='mb-4 text-center text-2xl font-bold'>Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <input
                        {...register("username", { required: true })}
                        type='text'
                        placeholder='username'
                        className='w-full rounded-lg border  p-2 placeholder:text-Text focus:border-Green focus:outline-none'
                    />
                    <input
                        {...register("password", { required: true })}
                        type='password'
                        placeholder='Password'
                        className='w-full rounded-lg border placeholder:text-Text  p-2  focus:border-Green focus:outline-none'
                    />
                    <button
                        type='submit'
                        className='w-full rounded-lg bg-Green p-2 font-semibold    disabled:opacity-50'
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
