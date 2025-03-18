import React, { useEffect, useState } from "react";
import { getAllData } from "../utils/iDbStore";
import { useNavigate } from "react-router-dom";
import DwonlodeCard from "../components/PdfCard";
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
                        <div>
                            <DwonlodeCard pdf={pdf} index={index} />
                            <DwonlodeCard pdf={pdf} index={index} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DownloadedList;
