import CartesianControl from "./components/CartesianControl"
import Gripper from "./components/Gripper"
import ManualControl from "./components/ManualControl"
import RobotModel from "./components/RobotModel"
import Positions from "./components/Positions"
import Console from "./components/Console"
import Trayectories from "./components/Trayectories"
import { useRef, useEffect, useState } from "react"


function App() {
  const ws = useRef(null);
  const [logs, setLogs] = useState([])
  const [isConnected, setIsConnected] = useState(false);
  const [positions, setPositions] = useState([])
  const [joints, setJoints] = useState({ J1: 0, J2: 0, J3: 0, J4: 0 });
  const [coords, setCoords] = useState({ X: 0, Y: 0, Z: 0 });
  const lastSent = useRef({ J1: 0, J2: 0, J3: 0, J4: 0 });
  const [opening, setOpening] = useState(0)
  const [showTrayectories, setShowTrayectories] = useState(false)
  const sendInterval = 10
  const connectWebSocket = () => {
    // Cerrar la conexión previa si existe y no está cerrada
    if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
      ws.current.close();
    }

    ws.current = new WebSocket("ws://localhost:8000/ws");

    // Funciones de manejo de eventos
    const handleOpen = () => {
      setIsConnected(true);
      // setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: "INFO", values: "Conexión establecida" }]);
    };

    const handleClose = () => {
      if (ws.current.readyState === WebSocket.CONNECTING) return;
      setIsConnected(false);
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: "WARNING", values: "Conexión cerrada" }]);
    };

    const handleError = (err) => {
      if (ws.current.readyState === WebSocket.CONNECTING) return;
      setIsConnected(false);
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: "ERROR", values: "No se pudo conectar al servidor" }]);
      console.error("WebSocket error:", err);
    };

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "JOINTS") setJoints(data.values);
        else if (data.type === "COORDS") setCoords(data.values);
        setLogs(prev => [...prev, data]);
      } catch {
        console.log("Mensaje no JSON:", event.data);
      }
    };

    // Añadir listeners
    ws.current.addEventListener("open", handleOpen);
    ws.current.addEventListener("close", handleClose);
    ws.current.addEventListener("error", handleError);
    ws.current.addEventListener("message", handleMessage);

    // Cleanup para eliminar listeners si se reconecta o desmonta
    return () => {
      ws.current?.removeEventListener("open", handleOpen);
      ws.current?.removeEventListener("close", handleClose);
      ws.current?.removeEventListener("error", handleError);
      ws.current?.removeEventListener("message", handleMessage);
    };
  };
  useEffect(() => {
    connectWebSocket();
    return () => ws.current?.close();
  }, []);
  // const loadPositions = () => {
  //   fetch("http://localhost:8000/positions")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (Array.isArray(data) && data.length > 0) {
  //         setPositions(data);
  //       } else {
  //         setLogs(prev => [
  //           ...prev,
  //           {
  //             time: new Date().toLocaleTimeString(),
  //             type: "WARNING",
  //             values: "No se encontraron posiciones predefinidas"
  //           }
  //         ]);
  //         setPositions([]);
  //       }
  //     })
      
  //     .catch((err) => setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: "ERROR", values: `Error cargando posiciones: ${err}` }]));
  // };
  const loadPositions = async (retries = 3, delay = 1000) => {
    try {
      const res = await fetch("http://localhost:8000/positions");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setPositions(data);
      } else {
        setLogs(prev => [...prev, {
          time: new Date().toLocaleTimeString(),
          type: "WARNING",
          values: "No se encontraron posiciones predefinidas"
        }]);
        setPositions([]);
      }

    } catch (err) {
      if (retries > 0) {
        console.warn(`Reintentando cargar posiciones... (${retries} intentos restantes)`);
        setTimeout(() => loadPositions(retries - 1, delay), delay);
      } else {
        setLogs(prev => [...prev, {
          time: new Date().toLocaleTimeString(),
          type: "ERROR",
          values: `Error cargando posiciones: ${err}`
        }]);
      }
    }
  };
  function useJointSender(ws, joints, opening, interval) {
    const lastSent = useRef({});
    const pending = useRef(false);

    useEffect(() => {
      const timer = setInterval(() => {
        if (pending.current && ws.current?.readyState === WebSocket.OPEN) {
          const mapped = Object.fromEntries(
            Object.entries(joints).map(([k, v]) => [k, v])
          );

          ws.current.send(
            JSON.stringify({
              type: "joints",
              data: {
                joints: mapped,
                gripper: opening,
              },
            })
          );

          lastSent.current = joints;
          pending.current = false;
        }
      }, interval);

      return () => clearInterval(timer);
    }, [ws, joints, opening, interval]);

    // devolvemos pending para poder marcar cambios desde fuera
    return pending;
  }

  const pending = useJointSender(ws, joints, opening, sendInterval);

  const handleChangeJoint = (name, input) => {
    let val;
    if (Array.isArray(input)) val = input[0];
    else {
      input = input.replace(/^0+/, "");
      if (input === "" || input === "-") input = "0";
      val = parseInt(input, 10);
      if (isNaN(val)) val = 0;
    }

    val = Math.max(-180, Math.min(180, val));

    setJoints((prev) => {
      const newJoints = { ...prev, [name]: val };
      pending.current = true; // 🔹 marca que hay cambios pendientes
      return newJoints;
    });
  };
  function useGripperSender(ws, joints, opening, interval = 100) {
    const pending = useRef(false);

    useEffect(() => {
      const timer = setInterval(() => {
        if (pending.current && ws.current?.readyState === WebSocket.OPEN) {
          const mapped = Object.fromEntries(
            Object.entries(joints).map(([k, v]) => [k, v])
          );

          ws.current.send(
            JSON.stringify({
              type: "gripper",
              data: {
                joints: mapped,
                gripper: opening,
              },
            })
          );

          pending.current = false;
        }
      }, interval);

      return () => clearInterval(timer);
    }, [ws, joints, opening, interval]);

    return pending;
  }
  const pendingGripper = useGripperSender(ws, joints, opening, sendInterval);

  const handleChangeOpening = (input) => {
    let val;
    if (Array.isArray(input)) val = input[0];
    else {
      input = input.replace(/^0+/, '');
      if (input === '' || input === '-') input = '0';
      val = parseInt(input, 10);
      if (isNaN(val)) val = 0;
    }

    val = Math.max(0, Math.min(100, val));
    setOpening(val);
    pendingGripper.current = true; // marca que hay un envío pendiente
  };
  return (
    <>
      <div className="p-10 h-[100vh] flex gap-10">
        <div className="h-full flex flex-col justify-between">
          <ManualControl joints={joints} handleChangeJoint={handleChangeJoint} />
          <CartesianControl ws={ws} coords={coords} setCoords={setCoords} />
          <Gripper opening={opening} handleChangeOpening={handleChangeOpening} />
        </div>
        <RobotModel angles={joints} opening={opening} />
        <div className="h-full flex flex-col gap-10">
          {(showTrayectories)
            ?
            <Trayectories
              joints={joints} setJoints={setJoints}
              loadPositions={loadPositions} positions={positions}
              opening={opening} setOpening={setOpening}
              setShowTrayectories={setShowTrayectories}
            />
            : <Positions
              joints={joints} setJoints={setJoints}
              setLogs={setLogs}
              loadPositions={loadPositions} positions={positions}
              isConnected={isConnected}
              opening={opening} setOpening={setOpening}
              coords={coords}
              setCoords={setCoords}
              setShowTrayectories={setShowTrayectories}
              ws={ws} />
          }
          <Console logs={logs} setLogs={setLogs} isConnected={isConnected} reconnect={connectWebSocket} loadPositions={loadPositions} />
        </div>
      </div>

    </>
  )
}

export default App
