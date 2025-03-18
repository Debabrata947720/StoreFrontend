import React from "react";
import { useNavigate } from "react-router-dom";
function PdfCard({ pdf, index }) {
    // Log the Base64 thumbnail string for debugging
    console.log(pdf.Thubnell);
    const navigate = useNavigate();
    return (
        <div
            key={index}
            className='flex flex-col p-4 shadow-md rounded-lg transition cursor-pointer hover:shadow-lg  transform duration-300 '
            onClick={() => navigate(`/download/v?id=${pdf.id}`)}
        >
            {/* Thumbnail Image */}
            {pdf.Thubnell && (
                <img
                    src={`data:image/jpeg;base64,${pdf.Thubnell}`} // Use Base64 string as image source
                    alt={`Thumbnail for ${pdf.Title || "Untitled PDF"}`}
                    className='w-full h-40 object-cover rounded-t-lg'
                />
            )}

            {/* PDF Info */}
            <div className='p-2 flex flex-col flex-grow'>
                <h3 className='text-lg font-semibold  truncate'>
                    {pdf.Title || "Untitled PDF"}
                </h3>
                <p className='text-sm  mt-2 line-clamp-3'>
                    {pdf.description || "No description available"}
                </p>
            </div>
        </div>
    );
}

export default PdfCard;
