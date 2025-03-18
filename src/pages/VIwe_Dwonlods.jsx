import React, { useEffect, useState, useRef } from "react";
import useApi from "../hook/useApi.js";
import { setData, getData } from "../utils/iDbStore.js";
import { useLocation } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function SecurePDFViewer() {
    const [pdfBlob, setPdfBlob] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [error, setError] = useState(null);
    const { loading, request } = useApi();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pdfID = searchParams.get("id");
    const containerRef = useRef(null);

    const fetchPdf = async () => {
        try {
            const response = await request("POST", "/pdf", { ID: pdfID });

            if (!response.data.pdf) {
                throw new Error("No PDF data received");
            }

            // Convert Base64 to Blob
            const byteCharacters = atob(response.data.pdf);
            const byteArray = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteArray[i] = byteCharacters.charCodeAt(i);
            }
            const pdfBlob = new Blob([byteArray], { type: "application/pdf" });

            // Store in IndexedDB
            await setData(response.data.ID, pdfBlob);

            // Set PDF Blob
            setPdfBlob(pdfBlob);
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
                // Set PDF Blob from stored data
                setPdfBlob(storedData);
            } else {
                await fetchPdf();
            }
        } catch (error) {
            console.error("❌ Error fetching from IndexedDB:", error);
            fetchPdf();
        }
    };

    const renderPDF = async () => {
        if (!pdfBlob || !containerRef.current) return;

        try {
            const url = URL.createObjectURL(pdfBlob);
            const loadingTask = pdfjsLib.getDocument(url);
            const pdf = await loadingTask.promise;

            setNumPages(pdf.numPages);

            containerRef.current.innerHTML = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                containerRef.current.appendChild(canvas);

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                await page.render(renderContext).promise;
            }

            // Clean up the Blob URL
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("❌ Error rendering PDF:", error);
            setError("Failed to render PDF. Please try again.");
        }
    };

    useEffect(() => {
        viewPDF();
    }, [pdfID]);

    useEffect(() => {
        if (pdfBlob) renderPDF();
    }, [pdfBlob]);

    return (
        <div className='w-full h-full overflow-y-auto'>
            {loading ? (
                <p>Loading PDF...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <div ref={containerRef} className='w-full h-full flex flex-col gap-0.5'>
                </div>
            )}
        </div>
    );
}

export default SecurePDFViewer;
