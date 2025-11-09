import React, { useState } from 'react'
import * as Slider from "@radix-ui/react-slider";
function CartesianControl({ws, coords, setCoords}) {
    const [tempCoords, setTempCoords] = useState({ X: "0", Y: "0", Z: "0" });

    const handleChange = (axis, input) => {
        // Slider pasa un array
        if (Array.isArray(input)) {
            const newCoords = { ...coords, [axis]: input[0] };
            setCoords(newCoords);
            setTempCoords(prev => ({ ...prev, [axis]: input[0].toString() }));
            ws.current.send(
                JSON.stringify({ type: "cartesian", data: newCoords })
            );
            return;
        }

        // Input pasa string
        setTempCoords(prev => ({ ...prev, [axis]: input }));
    };

    const handleKeyDown = (axis, e) => {
        if (e.key === "Enter") {
            let val = parseFloat(tempCoords[axis]);
            if (isNaN(val)) val = 0;

            // limitar rango -0.5 a 0.5
            if (val > 0.5) val = 0.5;
            if (val < -0.5) val = -0.5;
            const newCoords = { ...coords, [axis]: val };

            setCoords(newCoords);
            setTempCoords(prev => ({ ...prev, [axis]: val.toString() }));
            ws.current.send(
                JSON.stringify({ type: "cartesian", data: newCoords })
            );
            console.log("ENVIAR")
        }
    };

    const axes = ["X", "Y", "Z"];
    return (
        <div className='w-[max(330px,20vw)] rounded-lg text-white bg-[#1F1F1F] border-1 border-solid border-[#4A4A4A]'>
            <div className='w-full rounded-t-lg bg-[#2B2B2B] py-2 px-5 font-bold text-xl'>CONTROL CARTESIANO</div>
            <div className="flex flex-col gap-4 py-2 px-5 text-[#828282] w-full">
                {axes.map(axis => (
                    <div className='flex flex-row items-center gap-5' key={axis}> {/* Slider */}
                        <h3 className='text-lg text-center'>{axis}</h3>
                        <Slider.Root
                            className="relative flex items-center justify-center select-none touch-none h-8 w-54"
                            defaultValue={[0]}
                            min={-0.5}
                            max={0.5}
                            step={0.01}
                            onValueChange={(val) => handleChange(axis, val)}
                            value={[coords[axis]]}
                        >
                            <Slider.Track className="bg-[#2B2B2B] relative rounded-full h-2 w-full mx-auto overflow-hidden hover:cursor-pointer">
                                <Slider.Range className="absolute bg-[#00FFFF] rounded-full h-full h-full" />
                            </Slider.Track>
                            <Slider.Thumb className="block w-4 h-4 bg-[#00FFFF] rounded-full hover:cursor-pointer" />
                        </Slider.Root>
                        <div className="flex items-center">
                            <input type='text' className='text-lg w-[3rem] text-center'
                                //[ ] Hacer editable nuevamente
                                value={coords[axis]}
                                onChange={(e) => handleChange(axis, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(axis, e)} />
                            <span>m</span>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default CartesianControl
