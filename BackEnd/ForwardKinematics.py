import sympy as sp
import numpy as np
import math
def MatrixFromDH(theta, alfa, a, d):
    matrix = sp.Matrix([
        [sp.cos(theta), -sp.sin(theta) * sp.cos(alfa), sp.sin(theta) * sp.sin(alfa), a * sp.cos(theta)],
        [sp.sin(theta), sp.cos(theta) * sp.cos(alfa), -sp.cos(theta) * sp.sin(alfa), a * sp.sin(theta)],
        [0, sp.sin(alfa), sp.cos(alfa), d],
        [0, 0, 0, 1]
    ])
    return matrix

# theta1, alpha1,  L1 = sp.symbols('theta_1 alpha_1 L_1')
# theta2, alpha2, L2 = sp.symbols('theta_2 alpha_2 L_2')
# theta3, alpha3,  L3 = sp.symbols('theta_3 alpha_3 L_3')

# T01 = MatrixFromDH(theta1, -sp.pi/2, 0, L1)
# T12 = MatrixFromDH(theta2, 0, L2, 0)
# T23 = MatrixFromDH(theta3, 0, L3, 0)

# T02 = T01*T12
# T03 = T02*T23
# sp.pprint(T03)
# sp.pprint(T03)
# # Definir variables simbólicas
# theta1, alpha1, L1 = sp.symbols('theta_1 alpha_1 L_1')
# theta2, alpha2, L2 = sp.symbols('theta_2 alpha_2 L_2')
# theta3, alpha3, L3 = sp.symbols('theta_3 alpha_3 L_3')
# theta4, alpha4, L4 = sp.symbols('theta_4 alpha_4 L_4')

# # Obtener la matriz de transformación simbólica
# T01 = MatrixFromDH(theta1, -sp.pi/2, 0, L1)
# T12 = MatrixFromDH(theta2, 0, L2, 0)
# T23 = MatrixFromDH(theta3, 0, L3, 0)
# T34 = MatrixFromDH(theta4, -sp.pi/2, L4, 0)

# T02 = sp.simplify(T01*T12)
# T03 = sp.simplify(T02*T23)
# T04 = sp.simplify(T03*T34)
# sp.pprint(T04)
# sp.pprint(T03) #L1: 103/1000


# T03 = T03.subs({L1: 0, L2: 135/1000, L3:160/1000, theta1:0, theta2:-math.pi/2, theta3: math.pi/2})
# x=0.16
# y=0
# z=0.135
# l1=0
# l2=135/1000
# l3=160/1000
# print("Theta_1: ", math.atan2(y,x))
# print("Theta_3: ", math.acos((x**2+y**2+z**2-2*0-l2**2-l2**2)/2*l2*l3))
# print("Theta_2: ", math.atan2(l1-z, math.sqrt(x**2+y**2)) - math.atan2(l3*math.sin(math.pi/2), l2 + l3*math.cos(math.pi/2)))
# sp.pprint(T03)

