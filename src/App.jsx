import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Store/store";
import AppRouter from "./router/AppRouter";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import DeviseID from "./utils/deviseId";

function App() {
    const [securityActive, setSecurityActive] = useState(false);

    useEffect(() => {
        DeviseID().then((id) => {
            console.log("Device ID:", id);
        });

        // Register Service Worker
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker
                    .register("/service-worker.js")
                    .then(() => console.log("Service Worker registered."))
                    .catch((error) =>
                        console.error(
                            "Service Worker registration failed:",
                            error
                        )
                    );
            });
        }

        // Disable Right-Click
        document.addEventListener("contextmenu", (event) =>
            event.preventDefault()
        );

        // Disable Text Selection, Copying, and Dragging
        document.addEventListener("selectstart", (event) =>
            event.preventDefault()
        );
        document.addEventListener("copy", (event) => event.preventDefault());
        document.addEventListener("dragstart", (event) =>
            event.preventDefault()
        );

        // Disable Printing (Ctrl + P, Print Button, Preview)
        window.onbeforeprint = function () {
            document.body.innerHTML = "<h1>Printing is not allowed.</h1>";
            setTimeout(() => window.location.reload(), 100);
        };

        const mediaQueryList = window.matchMedia("print");
        mediaQueryList.addEventListener("change", (mql) => {
            if (mql.matches) {
                alert("Printing is disabled!");
                document.body.innerHTML = "<h1>Printing is blocked.</h1>";
                setTimeout(() => window.location.reload(), 100);
            }
        });

        // Disable Common Key Combinations (DevTools, Copy, Print, Save, Inspect)
        document.addEventListener("keydown", (event) => {
            if (
                event.ctrlKey ||
                event.metaKey ||
                event.key === "PrintScreen" ||
                // event.key === "F12" ||
                event.key === "Escape" ||
                (event.ctrlKey &&
                    event.shiftKey &&
                    (event.key === "I" ||
                        event.key === "J" ||
                        event.key === "C" ||
                        event.key === "U"))
            ) {
                event.preventDefault();
                setSecurityActive(true);
            }
        });

        // Clear Clipboard on PrintScreen
        document.addEventListener("keyup", (event) => {
            if (event.key === "PrintScreen") {
                navigator.clipboard.writeText("Restricted");
            }
        });

        // Blur Content When Switching Tabs (Prevents Screen Recording)
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                document.body.style.filter = "blur(15px)";
            } else {
                document.body.style.filter = "none";
            }
        });

        // Disable Dragging Images and Links
        document.querySelectorAll("img, a").forEach((el) => {
            el.addEventListener("dragstart", (event) => event.preventDefault());
        });
    }, []);

    return (
        <Provider store={store}>
            <Toaster />
            {securityActive ? (
                <div className='absolute top-0 left-0 h-screen w-screen bg-red-800 flex items-center justify-center text-white text-2xl'>
                    Security Warning: Unauthorized Activity Detected!
                </div>
            ) : (
                <Router>
                    <div className='w-screen h-screen overflow-hidden'>
                        <Navbar />
                        <AppRouter />
                    </div>
                </Router>
            )}
        </Provider>
    );
}

export default App;
