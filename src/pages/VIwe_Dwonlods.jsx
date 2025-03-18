import React, { useEffect, useState, useRef } from "react";
import useApi from "../hook/useApi.js";
import { setData, getData } from "../utils/iDbStore.js";
import { useLocation } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function SecurePDFViewer() {
    const [pdfBlob, setPdfBlob] = useState(null);
    const [error, setError] = useState(null);
    const [scale, setScale] = useState(1.5);
    const { loading, request } = useApi();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pdfID = searchParams.get("id");
    const containerRef = useRef(null);

    const fetchPdf = async () => {
        try {
            const response = await request("POST", "/pdf", { ID: pdfID });
            if (!response.data.pdf) throw new Error("No PDF data received");

            const byteArray = new Uint8Array(
                atob(response.data.pdf)
                    .split("")
                    .map((char) => char.charCodeAt(0))
            );
            const pdfBlob = new Blob([byteArray], { type: "application/pdf" });

            await setData(response.data.ID, response.data);
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
                const byteArray = new Uint8Array(
                    atob(storedData.pdf)
                        .split("")
                        .map((char) => char.charCodeAt(0))
                );
                const pdfBlob = new Blob([byteArray], {
                    type: "application/pdf",
                });
                setPdfBlob(pdfBlob);
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
            const pdf = await pdfjsLib.getDocument(url).promise;
            containerRef.current.innerHTML = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d", {
                    willReadFrequently: true,
                }); // Fix blurring
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                canvas.style.width = "100%"; // Make canvas responsive
                canvas.style.height = "auto"; // Maintain aspect ratio
                containerRef.current.appendChild(canvas);

                const renderContext = { canvasContext: context, viewport };
                await page.render(renderContext).promise;
            }

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("❌ Error rendering PDF:", error);
            setError("Failed to render PDF. Please try again.");
        }
    };

    const handleZoom = (newScale) => {
        setScale(Math.max(0.5, Math.min(3, newScale))); // Clamp scale between 0.5 and 3
    };

    useEffect(() => {
        const preventActions = (e) => e.preventDefault();
        const container = containerRef.current;

        if (container) {
            container.addEventListener("contextmenu", preventActions);
            container.addEventListener("dragstart", preventActions);
        }

        return () => {
            if (container) {
                container.removeEventListener("contextmenu", preventActions);
                container.removeEventListener("dragstart", preventActions);
            }
        };
    }, []);

    useEffect(() => {
        viewPDF();
    }, [pdfID]);

    useEffect(() => {
        if (pdfBlob) renderPDF();
    }, [pdfBlob, scale]);

    return (
        <div className='w-full h-full overflow-y-auto'>
            {loading ? (
                <p>Loading PDF...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <div>
                    <div
                        ref={containerRef}
                        className='w-full h-full flex flex-col gap-0.5'
                    ></div>
                </div>
            )}
        </div>
    );
}

export default SecurePDFViewer;
