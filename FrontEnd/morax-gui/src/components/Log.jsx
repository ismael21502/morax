import React from 'react'

function Log({ time, type, content }) {
    // Mapeo de type a clase de color
    const typeColors = {
        'INFO': "text-[#02BF3A]",
        'WARNING': "text-[#FAE700]",
        'ERROR': "text-[#E00025]",
        'DEBUG': "text-[#00FFFF]", // opcional
    };

    const colorClass = typeColors[type] || "text-gray-400"; // default
    return (
        <p>{time} <span className={colorClass}>[{type}]</span> {content} </p>
    )
}

export default Log
