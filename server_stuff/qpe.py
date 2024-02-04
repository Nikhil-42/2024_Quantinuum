from pytket.circuit import Circuit, QControlBox, CircBox, Unitary1qBox
from pytket.extensions.qiskit import AerBackend
import numpy as np
from numpy import pi, cos, sin
from pytket.circuit.display import render_circuit_jupyter#Return Inverse Quantum Fourier Transform Circuit

def getiqft():
    iqft2 = Circuit(2)
    iqft2.name = 'IQFT'
    iqft2.H(0)
    iqft2.CU1(-0.5, 1, 0)
    iqft2.H(1)
    iqft2_box: CircBox = CircBox(iqft2)
    return iqft2_box

def getQPE(U_circuit, D_circuit):
    QPE = Circuit()
    m = QPE.add_q_register("m", 2)
    s = QPE.add_q_register("p", 1)
    QPE.H(m[0])
    QPE.H(m[1])
    D_box = CircBox(D_circuit)
    QPE.add_circbox(D_box,s)
    controlled_u_gate = QControlBox(CircBox(U_circuit), 1)
    QPE.add_qcontrolbox(controlled_u_gate, [m[1], s[0]])
    QPE.add_qcontrolbox(controlled_u_gate, [m[0], s[0]])
    QPE.add_qcontrolbox(controlled_u_gate, [m[0], s[0]])
    QPE.add_circbox(getiqft(), m)
    QPE.measure_register(m, "c")
    return QPE

def return_direction(U_circuit, D_circuit):
    QPE = getQPE(U_circuit, D_circuit)
    backend = AerBackend()
    compiled_circ = backend.get_compiled_circuit(QPE)
    n_shots = 100
    result = backend.run_circuit(compiled_circ, n_shots)
    dir_dict = {(0,0):'right', (1,0):'up', (0,1):'left', (1,1):'down'}
    print(dir_dict[result.get_counts().most_common(1)[0][0]])
    #render_circuit_jupyter(QPE)

def get_stuff():
    D_circuit = Circuit(1)
    D_circuit.name = 'D'
    alpha = np.random.uniform(0, 2*pi)
    D_circuit.Ry(alpha, 0)
    U_circuit = Circuit(1)
    U_circuit.name = 'U'
    U_circuit.Ry(-alpha, 0)
    t = np.random.uniform(-pi/6, pi/6)+pi/2*np.random.randint(4)
    print(t/pi)
    beta = -2*t/pi
    U_circuit.Rz(beta, 0)
    U_circuit.Ry(alpha, 0)

    eigenvector = np.array([cos(alpha/2), sin(alpha/2)])
    L_matrix = np.matrix([[cos(t)+sin(t)*1j, 0],[0, cos(t)-sin(t)*1j]])
    D_matrix = np.matrix([[cos(alpha/2), -sin(alpha/2)],[sin(alpha/2), cos(alpha/2)]])
    U_matrix = np.matmul(D_matrix, np.matmul(L_matrix, D_matrix.transpose()))
    return U_circuit, D_circuit, U_matrix, eigenvector

# uc, dc, um, e = get_stuff()
# return_direction(uc, dc)

# import pdb; pdb.set_trace()