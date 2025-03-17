import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useApi from "../hook/useApi";
import { useDispatch, useSelector } from "react-redux";
import { AddData } from "../Store/slices/AdminStates.js";

const AdminDashboard = () => {
    const { register, handleSubmit, reset } = useForm();
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [stats, setStats] = useState({ users: 0, uploads: 0, earnings: 0 });
    const { request, loading, error } = useApi();
    // Reference for hidden file input
    const fileInputRef = useRef(null);
    const Dispatch = useDispatch();
    const Details = useSelector((state) => state.Admin.AdminDashboard);

    const fetchStats = async () => {
        const res = await request("POST", "/admin/details", {});
        Dispatch(AddData(res.data));
    };
    useEffect(() => {
        if (!Details) {
            fetchStats();
        }
    }, [Details]);

    // Handle file selection
    const handleFileSelect = (event) => {
        if (event.target.files.length > 0) {
            validateAndSetFile(event.target.files[0]);
        }
    };

    // Handle drag & drop events
    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);

        if (event.dataTransfer.files.length > 0) {
            validateAndSetFile(event.dataTransfer.files[0]);
        }
    };

    // Validate and set file
    const validateAndSetFile = (selectedFile) => {
        if (selectedFile?.type === "application/pdf") {
            setFile(selectedFile);
            toast.success("File uploaded successfully!");
        } else {
            toast.error("Only PDF files are allowed!");
        }
    };

    // Handle form submission
    const onSubmit = async (data) => {
        if (!file) {
            toast.error("Please upload a PDF file!");
            return;
        }

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("file", file);
        const response = await request("POST", "/admin/upload", formData, {
            "Content-Type": "multipart/form-data",
        });

        if (error) {
            console.error(error);
        }
        if (response.data.success) {
            toast.success("PDF uploaded successfully!");
            reset();
            setFile(null);
        }
    };

    return (
        <div className='flex min-h-screen '>
            {/* Main Content */}
            <main className='flex-1 p-6'>
                {/* Stats Section */}
                <div className='grid grid-cols-3 gap-6'>
                    <div className='rounded-lg p-4 shadow-lg'>
                        <h3 className='text-lg font-semibold'>
                            👥 Total Users
                        </h3>
                        <p className='text-2xl font-bold'>
                            {Details?.totalUsers}
                        </p>
                    </div>
                    <div className='rounded-lg p-4 shadow-lg'>
                        <h3 className='text-lg font-semibold'>
                            📂 Total Uploads
                        </h3>
                        <p className='text-2xl font-bold'>
                            {Details?.totalPDFs}
                        </p>
                    </div>
                    <div className='rounded-lg p-4 shadow-lg'>
                        <h3 className='text-lg font-semibold'>💰 Earnings</h3>
                        <p className='text-2xl font-bold'>
                            ₹{Details?.totalAmountCollected}
                        </p>
                    </div>
                </div>

                {/* Upload Form */}
                <div className='mt-8 rounded-lg p-6 shadow-lg'>
                    <h2 className='text-2xl font-bold text-Green'>
                        Upload PDF
                    </h2>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='mt-4 space-y-4'
                    >
                        <input
                            {...register("title", { required: true })}
                            placeholder='Title'
                            className='w-full rounded-lg border border-Green bg-transparent p-3 placeholder:text-gray-400 focus:border-Green focus:ring-2 focus:ring-Green'
                        />
                        <textarea
                            {...register("description", { required: true })}
                            placeholder='Description'
                            className='w-full rounded-lg border border-Green bg-transparent p-3 placeholder:text-gray-400 focus:border-Green focus:ring-2 focus:ring-Green'
                        />
                        <input
                            {...register("price", { required: true })}
                            type='number'
                            placeholder='Price '
                            className='w-full rounded-lg border border-Green bg-transparent p-3 placeholder:text-gray-400 focus:border-Green focus:ring-2 focus:ring-Green'
                        />

                        {/* Drag & Drop / Click to Upload */}
                        <div
                            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-Green p-6 text-center transition-all duration-300 ${
                                dragging ? "bg-Green/20" : "bg-transparent"
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()} // Open file picker on click
                        >
                            <input
                                ref={fileInputRef}
                                type='file'
                                accept='application/pdf'
                                className='hidden'
                                onChange={handleFileSelect}
                            />
                            {file ? (
                                <p className='text-Green'>📄 {file.name}</p>
                            ) : (
                                <p className='text-gray-400'>
                                    Drag & Drop or Click to Upload a PDF
                                </p>
                            )}
                        </div>

                        <button
                            type='submit'
                            className='w-full rounded-lg bg-Green p-3 text-lg font-semibold text-black transition-all duration-300 hover:bg-opacity-80'
                        >
                            Upload
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
