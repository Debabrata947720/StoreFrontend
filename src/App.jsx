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
