import React, { useEffect, useState } from "react";
import { getAllData } from "../utils/iDbStore";
import { useNavigate } from "react-router-dom";

function DownloadedList() {
    const [pdfData, setPdfData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllData().then((data) => {
            console.log(data);
            setPdfData(data || []);
        });
    }, []);

    useEffect(() => {
        pdfData.forEach((_, index) => {
            drawIndexOnCanvas(index);
        });
    }, [pdfData]);

    const drawIndexOnCanvas = (index) => {
        const canvas = document.getElementById(`pdf-thumbnail-${index}`);
        if (canvas) {
            const ctx = canvas.getContext("2d");

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = "bold 20px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(index + 1, canvas.width / 2, canvas.height / 2);
        }
    };

    return (
        <div className='p-4'>
            <h2 className='text-xl font-semibold mb-4'>Downloaded PDFse</h2>
            {pdfData.length === 0 ? (
                <p>No PDFs downloaded.</p>
            ) : (
                <div className='space-y-4'>
                    {pdfData.map((pdf, index) => (
                        <div
                            key={index}
                            className='flex items-center p-3  shadow-md rounded-lg  transition cursor-pointer'
                            onClick={() => navigate("/download/v")}
                        >
                            {console.log(pdf)}
                            <canvas
                                id={`pdf-thumbnail-${index}`}
                                width='80'
                                height='100'
                                className=' rounded-md'
                            ></canvas>

                            {/* Right Side - PDF Info */}
                            <div className='flex-1 ml-4'>
                                <h3 className='text-lg font-medium'>
                                    {pdf.tite || "Untitled PDF"}
                                </h3>
                                <p className='text-sm '>
                                    {pdf.description ||
                                        "No description available"}
                                </p>
                                <p className='text-xs '>
                                    {(pdf.pdfblob?.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DownloadedList;
