import math

# def inverse_3R(x, y, z):
#     L1 = 0
#     L2 = 200/1000
#     L3 = 150/1000
#     print(x,y,z)
#     theta1 = math.atan2(y,x)
#     theta3 = math.acos((x**2+y**2+z**2-2*L1*z-L2**2-L2**2)/2*L2*L3)
#     theta2 = math.atan2(L1-z, math.sqrt(x**2+y**2)) - math.atan2(L3*math.sin(theta3), L2 + L3*math.cos(theta3))

#     theta1 = round(math.degrees(theta1))
#     theta2 = round(math.degrees(theta2))
#     theta3 = round(math.degrees(theta3))
#     solution = {
#         'theta_1': theta1,
#         'theta_2': theta2,
#         'theta_3': theta3,
#     }

#     return solution
import math

def Inverse_Kinematics(x, y, z):
    import math

    # Longitudes de eslabones (m)
    L1 = 0.0
    L2 = 0.185
    L3 = 0.270

    # --- Cálculo de θ₁ ---
    theta1 = math.atan2(y, x)

    # --- Coordenadas del plano del brazo (r,z) ---
    r = math.sqrt(x**2 + y**2)
    z_eff = z - L1

    # --- Verificar alcance ---
    D = (r**2 + z_eff**2 - L2**2 - L3**2) / (2 * L2 * L3)
    D = max(min(D, 1.0), -1.0)

    theta3 = math.acos(D)

    # --- Configuración codo arriba ---
    theta2 = math.atan2(z_eff, r) - math.atan2(L3 * math.sin(theta3), L2 + L3 * math.cos(theta3))
    

    # --- Convertir a grados ---
    theta1_deg = round(math.degrees(theta1))
    theta2_deg = round(math.degrees(theta2))
    theta3_deg = round(math.degrees(theta3))

    # --- Detección de singularidades ---
    if abs(r) < 1e-6:
        status = "warning: Brazo vertical (r≈0)"
    elif abs(math.sin(theta3)) < 1e-6:
        status = "warning: Brazo totalmente extendido o plegado"
    else:
        status = "ok"

    return {
        "theta_1": theta1_deg,
        "theta_2": theta2_deg,
        "theta_3": theta3_deg,
        "status": status
    }

#print(inverse_3R(0,135/1000,160/1000,0.16,0,0.135))