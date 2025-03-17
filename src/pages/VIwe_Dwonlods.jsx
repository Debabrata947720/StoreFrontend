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
    const pdfID = searchParams.get("id");

    const fetchPdf = async () => {
        try {
            const response = await request("POST", "/pdf", { ID: pdfID });

            if (!response.data.pdf) {
                throw new Error("No PDF data received");
            }

            // Convert Base64 to Blob
            const byteCharacters = atob(response.data.pdf);
            const byteArray = new Uint8Array(byteCharacters.length).map(
                (_, i) => byteCharacters.charCodeAt(i)
            );
            const pdfBlob = new Blob([byteArray], { type: "application/pdf" });

            // Store in IndexedDB
            await setData(response.data.ID, { pdfBlob });

            // Create Blob URL & Set PDF
            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);
            setError(null);
        } catch (err) {
            console.error("❌ Error loading PDF:", err);
            setError("Failed to load PDF. Please try again.");
        }
    };

    const viewPDF = async () => {
        try {
            const storedData = await getData(pdfID);
            if (storedData) {
                // Create a Blob URL from stored data
                const url = URL.createObjectURL(storedData);
                setPdfUrl(url);
            } else {
                await fetchPdf();
            }
        } catch (error) {
            console.error("❌ Error fetching from IndexedDB:", error);
            fetchPdf();
        }
    };

    useEffect(() => {
        viewPDF();

        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl); // Free memory
                setPdfUrl("");
            }
        };
    }, [pdfID]); // Runs when `pdfID` changes

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
