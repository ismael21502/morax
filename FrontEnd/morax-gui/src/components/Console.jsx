import React, { useState } from 'react'
import { useRef, useEffect } from 'react';
import Log from './Log';
function Console({ logs, setLogs, isConnected, reconnect, loadPositions }) {
    const [isReconnecting, setIsReconnecting] = useState(false);
    const logContainerRef = useRef(null)
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs])
    const handleReconnection = async () => {
        setIsReconnecting(true);
        await reconnect(); // suponiendo que sea async
        await loadPositions()
        setTimeout(() => setIsReconnecting(false), 500)
    }
    function clearConsole(e) {
        setLogs([])
    }
    return (
        <div className='overflow-hidden flex flex-col w-[max(330px,25vw)] flex-grow rounded-lg text-white bg-[#1F1F1F] border-1 border-solid border-[#4A4A4A]'>
            <div className='w-full rounded-t-lg bg-[#2B2B2B] py-2 px-5 font-bold text-xl flex justify-between items-center'>
                <p>Consola</p>
                {(isConnected) ? <div className='rounded-full bg-[#02BF3A] border-2 border-[#017424] w-5 h-5'></div> : <div className='rounded-full bg-[#E00025] border-2 border-[#B0001E] w-5 h-5'></div>}
            </div>
            <div className="flex flex-grow flex-col gap-4 p-2 w-full overflow-y-auto">
                <div ref={logContainerRef} className="bg-black flex-grow overflow-y-auto border-2 border-[#3A3A3A] rounded-lg py-1 px-2">
                    {logs.map((log, index) => {
                        if (log.type == "JOINTS" || log.type == "COORDS") {
                            return
                        }
                        return <Log key={`${log.time}-${index}`} type={log.type} time={log.time} content={log.values} />
                    })}
                </div>
                <div className="flex gap-3 justify-between">
                    <button className='flex py-2 px-4 gap-2 items-center bg-[#e0006f] rounded-md cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_10px_#e0006f] text-bold'
                        onClick={clearConsole}>
                        <i className="fa-solid fa-trash"></i>
                        <p>Limpiar consola</p>

                    </button>
                    <button className='flex py-2 px-4 gap-2 items-center bg-[#008787] rounded-md cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_5px_#00FFFF] text-bold'
                        onClick={handleReconnection}>
                        <i className={`fa-solid fa-refresh ${isReconnecting ? "rotate" : ""}`} ></i>
                        <p>Reconectar</p>
                    </button>
                </div>
            </div>

        </div>
    )
}

export default Console
