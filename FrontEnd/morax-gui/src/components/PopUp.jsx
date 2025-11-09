import React from 'react'

function PopUp({ isOpen, title, message, onConfirm, onCancel }) {
    if (isOpen != true) return null
    return (
        <div className='fixed h-full w-full bg-black/80 right-0 top-0 flex justify-center items-center'>
            <div className='w-[400px] h-[250px] rounded-lg p-4 text-white bg-[#0D0D0D] border-1 border-solid border-[#4A4A4A] flex flex-col gap-5'>
                <div className='flex gap-2 text-2xl text-[#CF00C4]'>
                    <div className='border-3 border-[#CF00C4] rounded-full flex items-center justify-center w-8 h-8'>
                        <i className="fa-solid fa-info text-base"></i>
                    </div>
                    <p>{title}</p>
                </div>
                <div className='flex flex-col justify-between h-full'>
                    <p className='text-lg text-justify'>{message}</p>
                    <div className="flex justify-between text-lg">
                        <button className='flex py-2 px-4 gap-2 items-center bg-[#E00025] rounded-md cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_10px_#E60000] text-bold'
                            onClick={onCancel}>
                            <i className="fa-solid fa-xmark"></i>
                            Cancelar
                        </button>
                        <button className='flex py-2 px-4 gap-2 items-center bg-[#02BF3A] rounded-md cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_10px_#00CF3E] text-bold'
                            onClick={onConfirm}>
                            <i className="fa-solid fa-check"></i>
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopUp
