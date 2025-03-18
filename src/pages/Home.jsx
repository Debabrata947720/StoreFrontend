import React, { useEffect, useState, useRef } from "react";
import useApi from "../hook/useApi";
import { useSelector, useDispatch } from "react-redux";
import { addProduct } from "../Store/slices/pdfSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Home = () => {
    const { request, loading } = useApi();
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState({});
    const [overflowing, setOverflowing] = useState({});
    const Navigate = useNavigate();
    const fetchData = async () => {
        const res = await request("POST", "/docoment", {});
        dispatch(addProduct(res.data));
    };

    const data = useSelector((state) => state.pdfs.ProductDetails);

    useEffect(() => {
        if (!data.length) {
            fetchData();
        }
    }, [data]);

    const textRefs = useRef({});

    useEffect(() => {
        setTimeout(() => {
            const newOverflowing = {};
            Object.keys(textRefs.current).forEach((id) => {
                const el = textRefs.current[id];
                if (el) {
                    newOverflowing[id] = el.scrollHeight > el.clientHeight;
                }
            });
            setOverflowing(newOverflowing);
        }, 0);

        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [data]);

    const checkOverflow = () => {
        const newOverflowing = {};
        Object.keys(textRefs.current).forEach((id) => {
            const el = textRefs.current[id];
            if (el) {
                newOverflowing[id] = el.scrollHeight > el.clientHeight;
            }
        });
        setOverflowing(newOverflowing);
    };

    const toggleExpand = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    const handelViwe = (id) => {
        Navigate(`/download/v?id=${id}`);
    };

    return (
        <div className='min-h-screen p-2'>
            {loading ? (
                <p className='text-center text-gray-500 animate-pulse'>
                    Loading...
                </p>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 auto-rows-min'>
                    {data?.map((pdf) => (
                        <div
                            key={pdf._id}
                            className={`relative rounded-lg shadow-lg border transition-all duration-500 ease-in-out flex flex-col hover:shadow-xl ${
                                overflowing[pdf._id] ? "p-3" : "p-5"
                            }`}
                            style={{
                                gridRowEnd: `span ${expanded[pdf._id] ? 3 : 2}`,
                            }}
                        >
                            <h2 className='text-lg font-semibold'>
                                {pdf.title}
                            </h2>

                            <div
                                ref={(el) => (textRefs.current[pdf._id] = el)}
                                className={`relative overflow-hidden transition-all duration-500 ease-in-out opacity-80 ${
                                    expanded[pdf._id]
                                        ? "max-h-[300px]"
                                        : "max-h-[53px]"
                                }`}
                            >
                                <p>{pdf.description}</p>
                            </div>

                            {overflowing[pdf._id] && (
                                <button
                                    onClick={() => toggleExpand(pdf._id)}
                                    className='text-blue-600 font-medium text-xs hover:underline self-start transition-all duration-300'
                                >
                                    {expanded[pdf._id]
                                        ? "Show Less"
                                        : "Show More"}
                                </button>
                            )}

                            <p
                                className={`text-lg font-bold transition-all duration-300 ${
                                    pdf.price > 0
                                        ? "text-blue-700"
                                        : "text-green-600"
                                }`}
                            >
                                {pdf.price > 0 ? `₹${pdf.price}` : "FREE"}
                            </p>

                            {pdf.price > 0 ? (
                                <button
                                    className='mt-3 w-full rounded-lg bg-green-500 text-white py-2 transition-all duration-300 hover:bg-green-600 hover:scale-105'
                                    onClick={() => toast.error("Currently Unable")}
                                >
                                    Buy Now
                                </button>
                            ) : (
                                <button
                                    className='mt-3 w-full rounded-lg bg-green-500 text-white py-2 transition-all duration-300 hover:bg-green-600 hover:scale-105'
                                    onClick={() => handelViwe(pdf._id)}
                                >
                                    Viwe
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
