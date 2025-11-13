import React, { useState, useEffect } from 'react'
import * as Select from "@radix-ui/react-select";
import PopUp from './PopUp';
export default function Trayectories({ joints, positions, opening, setShowTrayectories }) {
    const [value, setValue] = useState("Home");
    const [newPosName, setNewPosName] = useState("")
    const [showPopUp, setShowPopUp] = useState(false)

    // const deletePosition = (positionName) => {
    //     if (positionName === "Home") return;

    //     fetch("http://localhost:8000/delete", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ name: positionName }),
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.status === "ok") {
    //                 loadPositions();
    //                 setValue("Home");
    //                 setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: "INFO", values: `La posición fue eliminada con éxito.` }]);
    //             } else {
    //                 setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: "ERROR", values: `Error del servidor: ${data.status}` }]);
    //             }
    //         })
    //         .catch(err => setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: "ERROR", values: `Error al intentar borrar la posición: ${err}` }]));
    // }

    // useEffect(() => { loadPositions() }, [isConnected])

    // function moveRobot(targetJoints, targetGripperOpening, targetCoords) {
    //     const duration = 700; // duración de la animación en ms
    //     const start = performance.now();
    //     const initialJoints = { ...joints };
    //     const initialOpening = opening;
    //     const initialCoords = { ...coords };

    //     function animate(time) {
    //         const elapsed = time - start;
    //         const t = Math.min(elapsed / duration, 1);

    //         const newJoints = {};
    //         const newCoords = {};

    //         for (let key in initialJoints) {
    //             newJoints[key] = Math.round(initialJoints[key] + t * (targetJoints[key] - initialJoints[key]));
    //         }

    //         const newOpening = Math.round(initialOpening + t * (targetGripperOpening - initialOpening));

    //         for (let key in initialCoords) {
    //             newCoords[key] = parseFloat((initialCoords[key] + t * (targetCoords[key] - initialCoords[key])).toFixed(2));
    //         }

    //         // Actualiza estados
    //         setJoints(newJoints);
    //         setOpening(newOpening);
    //         setCoords(newCoords);

    //         // Envía datos al backend si WebSocket está abierto
    //         if (ws?.current?.readyState === WebSocket.OPEN) {
    //             console.log("HOLA")
    //             ws.current.send(JSON.stringify({
    //                 type: "joints",
    //                 data: { joints: Object.fromEntries(Object.entries(newJoints).map(([k, v]) => [k, v + 90])), gripper: newOpening }
    //             }));
    //         }

    //         if (t < 1) requestAnimationFrame(animate);
    //     }

    //     requestAnimationFrame(animate);
    // }

    // function sendPos() {
    //     const target = positions.find(pos => pos.name === value);
    //     if (target) moveRobot(target.joints, target.gripperOpening, target.coords);
    // }

    // function savePos() {
    //     if (!newPosName) return;
    //     fetch("http://localhost:8000/save", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ name: newPosName, joints, gripperOpening: opening, coords }),
    //     })
    //         .then(data => {
    //             if (data.ok) {
    //                 loadPositions();
    //                 setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: "INFO", values: "Posición guardada correctamente" }]);
    //             } else {
    //                 setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: "ERROR", values: "La posición no fue guardada" }]);
    //             }
    //         })
    //         .catch(err => setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: "ERROR", values: `No fue posible guardar la posición: ${err}` }]));

    //     setNewPosName("");
    // }
    return (
        <div className='w-[max(330px,25vw)] rounded-lg text-white bg-[#1F1F1F] border-1 border-solid border-[#4A4A4A]'>
            <div className='w-full rounded-t-lg bg-[#2B2B2B] py-2 px-5 font-bold text-xl items-center flex flex-row'>
                <button onClick={() => setShowTrayectories(false)} className='px-2 cursor-pointer'>
                    <i className="fa-solid fa-arrow-left mr-5"></i>
                </button>
                <p className='w-full'>Trayectorias</p>
            </div>
            <div className='p-2 flex flex-col gap-5'>
                <div className='flex justify-between items-center w-full'>
                    <Select.Root value={value} onValueChange={setValue}>
                        <Select.Trigger className="border border-gray-400 px-3 py-2 rounded cursor-pointer">
                            <Select.Value placeholder="Selecciona un color" />
                            <Select.Icon className="SelectIcon ml-3" />
                        </Select.Trigger>
                        <Select.Content className="bg-[#2B2B2B] border border-gray-400 rounded mt-1">
                            {positions.length > 0 ? positions.map(pos => (
                                <Select.Item key={pos.name} value={pos.name} className="px-3 py-1 hover:bg-[#3B3939] cursor-pointer">
                                    <Select.ItemText>{pos.name}</Select.ItemText>
                                </Select.Item>
                            )) :
                                <Select.Item key="Home" value="Home" className="px-3 py-1 hover:bg-[#3B3939] cursor-pointer">
                                    <Select.ItemText>Home</Select.ItemText>
                                </Select.Item>}
                        </Select.Content>
                    </Select.Root>
                    <div className="flex flex-row gap-2">
                        <button className='flex gap-2 items-center bg-[#e0006f] rounded-md cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_10px_#e0006f] text-bold h-10 w-10 justify-center'
                            onClick={() => { }}>
                            <i className="fa-solid fa-stop"></i>
                        </button>
                        <button className='flex gap-2 items-center bg-[#e0006f] rounded-md cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_10px_#e0006f] text-bold  h-10 w-10 justify-center'
                            onClick={() => { }}>
                            <i className="fa-solid fa-play"></i>
                        </button>
                    </div>
                </div>

                <div>
                    <div className='flex justify-between'>
                        <input type="text" className='border-1 border-[#3B3939] rounded-sm px-2 w-[8rem]' placeholder='Nombre' onChange={(e) => setNewPosName(e.target.value)} value={newPosName} />
                        <div className='flex gap-2'>
                            <button className='flex gap-2 items-center bg-[#e0006f] rounded-md cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_10px_#e0006f] text-bold h-10 w-10 justify-center'
                                onClick={()=>{}}>
                                <i className="fa-solid fa-floppy-disk"></i>
                            </button>
                            <button className='flex gap-2 items-center bg-[#008787] rounded-md cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_10px_#008787] text-bold h-10 w-10 justify-center'
                                onClick={() => { }}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className='flex w-full justify-between items-center'>
                    <div className="flex gap-2">
                        <p>Posición actual: </p>
                        <p>{joints['J1']}°, {joints['J2']}°, {joints['J3']}°, {opening}%</p>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <button className='flex gap-2 items-center bg-[#008787] rounded-md cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_10px_#008787] text-bold h-10 w-10 justify-center'
                            onClick={() => { }}>
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <button className='flex gap-2 items-center bg-[#e0006f] rounded-md cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_10px_#e0006f] text-bold h-10 w-10 justify-center'
                            onClick={() => { }}>
                            <i className="fa-solid fa-list-ul"></i>
                        </button>
                    </div>
                </div>
            </div>

            {(value === "Home") ?
                <PopUp isOpen={showPopUp} title="Aviso" message={`No es posible eliminar la posición "Home", ya que está protegida por el sistema.`} onCancel={() => setShowPopUp(false)} onConfirm={() => { deletePosition(value); setShowPopUp(false); }} /> :
                <PopUp isOpen={showPopUp} title="CONFIRMAR ELIMINACIÓN" message={`¿Estás seguro que quieres eliminar "${value}"? Esta acción no se puede deshacer.`} onCancel={() => setShowPopUp(false)} onConfirm={() => { deletePosition(value); setShowPopUp(false); }} />
            }
        </div>
    )
}
