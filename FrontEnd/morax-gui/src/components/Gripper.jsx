import React, { useState, useEffect, useRef } from 'react'
import * as Slider from "@radix-ui/react-slider";
function Gripper({opening, handleChangeOpening}) {
    return (
        <div className='w-[max(330px,20vw)] rounded-lg text-white bg-[#1F1F1F] border-1 border-solid border-[#4A4A4A]'>
            <div className='w-full rounded-t-lg bg-[#2B2B2B] py-2 px-5 font-bold text-xl'>APERTURA DE LA PINZA</div>
            <div className="flex flex-col gap-4 py-2 px-5 text-[#828282] w-full">
                <div className='flex flex-row items-center gap-5'> {/* Slider */}
                    <h3 className='text-lg text-center'>Apertura</h3>
                    <Slider.Root
                        className="relative flex items-center justify-center select-none touch-none h-8 w-54"
                        defaultValue={[50]}
                        max={100}
                        step={1}
                        value={[opening]}
                        onValueChange={handleChangeOpening}
                    >
                        <Slider.Track className="bg-[#2B2B2B] relative rounded-full h-2 w-full mx-auto overflow-hidden hover:cursor-pointer">
                            <Slider.Range className="absolute bg-[#00FFFF] rounded-full h-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb className="block w-4 h-4 bg-[#00FFFF] rounded-full hover:cursor-pointer" />
                    </Slider.Root>
                    {/* 3CD6D6 */}
                    <div className="flex items-center gap-1">
                        <input type='text' className='text-lg w-[2rem] text-end' value={opening} onChange={(e) => handleChangeOpening(e.target.value)} />
                        <span>%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Gripper
