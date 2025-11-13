from fastapi import FastAPI, WebSocket # type: ignore
import serial
import json
from datetime import datetime
import asyncio
from InverseKinematics import Inverse_Kinematics
# from BackEnd.IK import inverse_3R
from ForwardKinematics import MatrixFromDH
import sympy as sp
from sympy import lambdify
import math
from fastapi.middleware.cors import CORSMiddleware
import time
import os
print(os.getcwd())
# Permitir solicitudes desde tu frontend
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # allow_origins=[
    #     "http://localhost",
    #     "http://localhost:5173",
    #     "tauri://localhost",
    #     "app://.",
    #     "null",
    # ],  # o ["*"] para permitir todos
    allow_origins=["*", "http://localhost:5173", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_connections = []
esp32_socket: WebSocket | None = None  # <-- ¡NUEVO! Almacén para el ESP32

# -----------------------------
# 🕒 Función auxiliar para logs
# -----------------------------
async def send_log(ws: WebSocket, type_: str, message: str):
    """Envía un log con timestamp al cliente."""
    try:
        await ws.send_json({
            "type": type_,
            "values": message,
            "time": datetime.now().strftime("%H:%M:%S")
        })
    except Exception as e:
        print(f"⚠️ No se pudo enviar log: {e}")

async def send_joints(ws: WebSocket, angles: list):
    try:
        await ws.send_json({
            "values": angles,
        })
    except Exception as e:
        print(f"⚠️ No se pudo enviar log: {e}")
# -----------------------------
# 🔌 Conexión al Arduino 
# -----------------------------
# def connect_arduino():
#     """Intenta conectar al Arduino y devuelve el objeto o None."""
#     try:
#         arduino = serial.Serial("COM4", 115200, timeout=1)
#         print("✅ Conectado a Arduino en COM4")
#         return arduino
#     except serial.SerialException as e:
#         print(f"❌ Error al abrir el puerto serie: {e}")
#         return None

# arduino = connect_arduino()

# -----------------------------
# 🔁 Enviar datos al Arduino
# -----------------------------
# def send_to_arduino(data):
#     global arduino
#     if arduino and arduino.is_open:
#         try:
#             json_str = json.dumps(data)   # ✅ convierte a JSON válido
#             arduino.write((json_str + "\n").encode("utf-8"))
#             return True
#         except Exception as e:
#             # print("Valió maiz: ", e)
#             arduino.close()
#             arduino = None
#             return False
@app.post("/save")
async def save_data(newData: dict):
    try:
        with open("positions.json", "r") as f:
            data = json.load(f)  # data será una lista
    except (FileNotFoundError, json.JSONDecodeError):
        data = []

    # Buscar si ya existe un elemento con el mismo nombre
    existing_index = next((i for i, item in enumerate(data) if item["name"] == newData["name"]), None)
    if existing_index is not None:
        data[existing_index] = newData  # Reemplazar
    else:
        data.append(newData)  # Agregar nuevo

    with open("positions.json", "w") as f:
        json.dump(data, f, indent=2)

    return {"status": "ok"}

@app.post("/delete")
async def delete_position(item: dict):
    try:
        with open("positions.json", "r") as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        data = []

    # Verificar que haya un campo 'name'
    if "name" not in item:
        return {"status": "error", "message": "Falta el campo 'name'."}

    # Filtrar los elementos que no coincidan con el nombre
    original_length = len(data)
    data = [pos for pos in data if pos["name"] != item["name"]]

    # Guardar solo si algo cambió
    if len(data) < original_length:
        with open("positions.json", "w") as f:
            json.dump(data, f, indent=2)
        return {"status": "ok", "message": f"Posición '{item['name']}' eliminada."}
    else:
        return {"status": "not_found", "message": f"No se encontró '{item['name']}'."}

@app.get("/positions")
async def get_positions():
    import os, json
    try:
        file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "positions.json")
        print("Intentando abrir:", file_path)
        with open(file_path, "r") as f:
            data = json.load(f)
        print("Contenido leído:", data)
        return data
    except Exception as e:
        print("Error leyendo positions.json:", e)
        return []



theta1, L1 = sp.symbols('theta_1 L_1')
theta2, L2 = sp.symbols('theta_2 L_2')
theta3, L3 = sp.symbols('theta_3 L_3')
T01 = MatrixFromDH(theta1, -sp.pi/2, 0, L1)
T12 = MatrixFromDH(theta2, 0, L2, 0)
T23 = MatrixFromDH(theta3, 0, L3, 0)

T02 = T01*T12
T03 = T02*T23

fk_func = lambdify(
    (L1, L2, L3, theta1, theta2, theta3),
    [T03[0, 3], T03[1, 3], T03[2, 3]],
    "numpy"
)
# -----------------------------
# 🌐 WebSocket principal
# -----------------------------
last_reconnect_attempt = 0  # variable global o fuera del bucle principal
# Esta función es tu antiguo "while True"
async def process_gui_command(ws: WebSocket, data: dict):
    global theta1, theta2, theta3
    global esp32_socket

    # Función para enviar datos al ESP32 (reemplaza send_to_arduino)
    async def send_to_esp32(data_to_send):
        if esp32_socket:
            try:
                await esp32_socket.send_json(data_to_send)
            except Exception as e:
                print(f"⚠️ Error al enviar a ESP32: {e}")
                # Podríamos cerrar el socket si falla
                await send_log(ws, "ERROR", "Fallo al enviar comando a ESP32.")
        else:
            print("❌ GUI envió comando, pero ESP32 no está conectado.")
            await send_log(ws, "ERROR", "ESP32 no está conectado.")

    # --- INICIO DE TU LÓGICA EXISTENTE ---
    
    if data.get("type") == "joints":
        # print("Recibido desde GUI:", data)
        values = data['data']['joints']
        dataToSend = {
            'type': 'joints',
            'data': [values['J1'], 
                     values['J2'], 
                     values['J3']]
        }
        # ... (cálculo de FK) ...
        x, y, z = fk_func(
                    0,
                    185/1000,
                    270/1000,
                    math.radians(values['J1']),
                    math.radians(values['J2']) - math.pi/2, #Offset porque zero debe ser extendido hacia arriba
                    math.radians(values['J3'])
                )
        await send_log(ws, "COORDS", {'X':round(x,2), 'Y':round(y,2), 'Z':round(z,2)}) # Envía log a la GUI
        print(dataToSend)
        await send_to_esp32(dataToSend) # <-- ¡REEMPLAZO CLAVE!

    elif data.get("type") == "cartesian":
        values = data["data"]
        
        # --- ¡AÑADE ESTO DE VUELTA! ---
        # (Esta lógica la tenías en tu código anterior)
        IK = Inverse_Kinematics(float(values["X"]), float(values["Y"]), float(values["Z"]*-1))
        theta_1 = IK['theta_1']
        theta_2 = IK['theta_2']
        theta_3 = IK['theta_3']
        theta_2 = theta_2 + 90 # Offset para que zero sea extendido hacia arriba
        
        # Opcional: Envía un log de vuelta a la GUI si lo necesitas
        await send_log(ws, "JOINTS", {'J1': theta_1, 'J2': theta_2, 'J3': theta_3, 'J4': 0})
        # --- FIN DEL CÓDIGO A AÑADIR ---
        # if('warning' in IK['status']):
        #     warning = IK['status'].replace('warning: ', '')
        #     await send_log(ws, "WARNING", warning)
        # Ahora estas variables SÍ existen
        dataToSend = {
            'type': 'joints',
            'data': [theta_1, theta_2, theta_3] 
        }
        print(dataToSend)
        await send_to_esp32(dataToSend)

    elif data.get("type") == "gripper":
        dataToSend = {
            'type': 'gripper',
            'data': data['data']['gripper']
        }
        await send_to_esp32(dataToSend) # <-- ¡REEMPLAZO CLAVE!

    await asyncio.sleep(0.01)
@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    global esp32_socket, arduino # Añade esp32_socket
    
    await ws.accept()
    print(f"🟢 Cliente conectado desde {ws.client.host}")
    await send_log(ws, "INFO", "Conexión establecida con el servidor.")
    # Añade la conexión a la lista general
    active_connections.append(ws)

    try:
        # Espera el primer mensaje para identificar al cliente
        msg = await ws.receive_text()
        data = json.loads(msg)

        # --- LÓGICA DE IDENTIFICACIÓN ---
        if data.get("type") == "hello" and data.get("from") == "ESP32":
            # 1. ES EL ESP32
            esp32_socket = ws  # ¡Lo guardamos!
            print("✅ Cliente identificado como ESP32")
            await send_log(ws, "INFO", "Conexión ESP32 registrada.")
            
            # Mantenemos al ESP32 en un bucle de espera, solo escuchando
            while True:
                await asyncio.sleep(1) # Simplemente lo mantenemos vivo
                
        else:
            # 2. ES LA GUI (O OTRO CLIENTE)
            print("✅ Cliente identificado como GUI/Navegador")
            
            # Procesamos su primer mensaje (que ya recibimos)
            await process_gui_command(ws, data) 
            
            # Ahora entramos al bucle normal para escuchar más comandos de la GUI
            while True:
                msg = await ws.receive_text()
                data = json.loads(msg)
                await process_gui_command(ws, data)

    except Exception as e:
        print(f"🔴 Cliente desconectado: {e}")
    finally:
        # Limpieza al desconectar
        if ws in active_connections:
            active_connections.remove(ws)
        if ws == esp32_socket:
            print("🔌 ESP32 desconectado.")
            esp32_socket = None # Limpiamos la variable
