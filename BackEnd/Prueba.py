import math
from InverseKinematics import Inverse_Kinematics
from ForwardKinematics import MatrixFromDH
import sympy as sp
from sympy import lambdify

theta1, alpha1,  L1 = sp.symbols('theta_1 alpha_1 L_1')
theta2, alpha2, L2 = sp.symbols('theta_2 alpha_2 L_2')
theta3, alpha3,  L3 = sp.symbols('theta_3 alpha_3 L_3')

theta1, L1 = sp.symbols('theta_1 L_1')
theta2, L2 = sp.symbols('theta_2 L_2')
theta3, L3 = sp.symbols('theta_3 L_3')
T01 = MatrixFromDH(theta1, +sp.pi/2, 0, L1)
T12 = MatrixFromDH(theta2, 0, L2, 0)
T23 = MatrixFromDH(theta3, 0, L3, 0)

T02 = T01*T12
T03 = T02*T23

fk_func = lambdify(
    (L1, L2, L3, theta1, theta2, theta3),
    [T03[0, 3], T03[1, 3], T03[2, 3]],
    "numpy"
)
# --- Tu FK callable (fk_func) ya lo tienes cargado ---
# fk_func(L1,L2,L3,theta1,theta2,theta3) -> (x,y,z)

theta_1 = 90
theta_2 = 10
theta_3 = 90

L1 = 0.0
L2 = 0.185
L3 = 0.270
x, y, z = fk_func(
                    0,
                    185/1000,
                    270/1000,
                    math.radians(theta_1),
                    math.radians(theta_2),
                    math.radians(theta_3)
                )
print("XYZ: ",x,y,z)
ik =  Inverse_Kinematics(x,y,z)
theta2_1 = ik['theta_1']
theta2_2 = ik['theta_2']
theta2_3 = ik['theta_3']
print(theta2_1, theta2_2, theta2_3)
x2, y2, z2 = fk_func(
                    0,
                    185/1000,
                    270/1000,
                    math.radians(theta2_1),
                    math.radians(theta2_2),
                    math.radians(theta2_3)
                )
print("XYZ2: ", x2,y2,z2)
