import React from "react";
import "./loder.css";
const BouncingBallsLoader = () => {
    return (
        <div className=' absolute flex items-center h-full w-full justify-center'>
            <div className='banter-loader '>
                <div className='banter-loader__box'></div>
                <div className='banter-loader__box'></div>
                <div className='banter-loader__box'></div>
                <div className='banter-loader__box'></div>
                <div className='banter-loader__box'></div>
                <div className='banter-loader__box'></div>
                <div className='banter-loader__box'></div>
                <div className='banter-loader__box'></div>
            </div>
        </div>
    );
};

export default BouncingBallsLoader;
