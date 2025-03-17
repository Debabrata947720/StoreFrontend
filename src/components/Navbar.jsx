import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const Navbar = () => {
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.auth.isLogin);
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        if (theme === "light") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.style.setProperty(
                "--primary-bg",
                "#ffffff"
            );
            document.documentElement.style.setProperty(
                "--primary-text",
                "#1a202c"
            );
        } else {
            document.documentElement.style.setProperty(
                "--primary-bg",
                "#1a202c"
            );
            document.documentElement.style.setProperty(
                "--primary-text",
                "#ffffff"
            );
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

  

    return (
        <nav className='  p-4 shadow-md bg-Green'>
            <div className='container mx-auto flex items-center justify-between '>
                <Link to='/' className='text-2xl font-bold text-accent '>
                    PDF Store
                </Link>

                <div className='flex items-center gap-4'>
                    {isLogin ? (
                        <>
                            <Link to='/' className='hover:text-accent'>
                                Home
                            </Link>
                            <Link to='/download' className='hover:text-accent'>
                                Download
                            </Link>

                            {isAdmin && (
                                <Link to='/admin' className='hover:text-accent'>
                                    Dashboard
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Link to='/login' className='hover:text-accent'>
                                Login
                            </Link>
                            <Link to='/signup' className='hover:text-accent'>
                                Signup
                            </Link>
                        </>
                    )}

                    <button
                        onClick={toggleTheme}
                        className='relative flex h-6 w-12 items-center rounded-full bg-zinc-500  transition-all duration-200'
                    >
                        <div
                            className={`absolute h-5 w-5 rounded-full  transition-all ${
                                theme === "light"
                                    ? "left-1 bg-zinc-50"
                                    : "right-1 bg-zinc-950"
                            }`}
                        />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
