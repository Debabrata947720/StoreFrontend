import React, { useEffect, useState } from "react";
import useApi from "../hook/useApi.js";
import { setData, getData } from "../utils/iDbStore.js";
import { useLocation } from "react-router-dom";
function SecurePDFViewer() {
    const [pdfUrl, setPdfUrl] = useState("");
    const [error, setError] = useState(null);
    const { loading, request } = useApi();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const fetchPdf = async () => {
        try {
            const response = await request("POST", "/pdf", {
                ID: searchParams.get("id"),
            });

            if (!response.data.pdf) {
                throw new Error("No PDF data received");
            }
            // console.log(response.data);

            const byteCharacters = atob(response.data.pdf);
            const byteNumbers = new Array(byteCharacters.length)
                .fill(0)
                .map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const pdfBlob = new Blob([byteArray], {
                type: "application/pdf",
            });

            await setData(response.data.ID, { pdfBlob });

            // Create Blob URL
            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);
            setError(null);
        } catch (err) {
            console.error("Error loading PDF:", err);
            setError("Failed to load PDF. Please try again.");
        }
    };

    const ViwePDF = async () => {
        const data = await getData(searchParams.get("id"));
        console.log(data);
        if (data) {
            const url = URL.createObjectURL(data);
            console.log(url);
            setPdfUrl(url);
        } else {
            fetchPdf();
        }
    };
    useEffect(() => {
        ViwePDF();

        // fetchPdf();

        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl); // Free up memory
                setPdfUrl(""); // Clear state
            }
        };
    }, []);

    // Load from IndexedDB if available
    // useEffect(() => {

    // }, []);

    return (
        <div className='w-full h-full'>
            {loading ? (
                <p>Loading PDF...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : pdfUrl ? (
                <div className='relative w-full h-full'>
                    <iframe
                        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                        width='100%'
                        height='100%'
                        style={{
                            border: "1px solid black",
                            pointerEvents: "auto",
                            position: "relative",
                            zIndex: 2,
                        }}
                        title='Secure PDF Viewer'
                    ></iframe>
                </div>
            ) : (
                <p>No PDF to display.</p>
            )}
        </div>
    );
}

export default SecurePDFViewer;
