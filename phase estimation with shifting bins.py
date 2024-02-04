from qiskit import QuantumCircuit, Aer, execute, transpile
from qiskit.visualization import plot_histogram
from qiskit.circuit.library import QFT
import matplotlib.pyplot as plt
from qiskit import QuantumRegister, ClassicalRegister
from qiskit import QuantumCircuit, execute,IBMQ
from qiskit.tools.monitor import job_monitor
from qiskit.circuit.library import QFT
import matplotlib.animation as animation
import numpy as np
pi = np.pi

def estimate_phase(angle):
	q = QuantumRegister(4,'q')
	c = ClassicalRegister(3,'c')
	circuit = QuantumCircuit(q,c)

	#### Controlled unitary operations ####
	circuit.h(q[0])
	circuit.h(q[1])
	circuit.h(q[2])
	circuit.x(q[3])

	circuit.cu(0, 0, angle, 0, q[0], q[3]);

	circuit.cu(0, 0, angle, 0, q[1], q[3]);
	circuit.cu(0, 0, angle, 0, q[1], q[3]);

	circuit.cu(0, 0, angle, 0, q[2], q[3]);
	circuit.cu(0, 0, angle, 0, q[2], q[3]);
	circuit.cu(0, 0, angle, 0, q[2], q[3]);
	circuit.cu(0, 0, angle, 0, q[2], q[3]);

	circuit.barrier()

	#### Inverse QFT ####
	circuit.swap(q[0],q[2])
	circuit.h(q[0])
	circuit.cu(0, 0, -pi/2, 0,q[0], q[1]);
	circuit.h(q[1])
	circuit.cu(0, 0, -pi/4, 0, q[0], q[2]);
	circuit.cu(0, 0, -pi/2, 0, q[1], q[2]);
	circuit.h(q[2])

	circuit.barrier()

	#### Measuring counting qubits ####
	circuit.measure(q[0],0)
	circuit.measure(q[1],1)
	circuit.measure(q[2],2)

	#print(circuit)

	simulator = Aer.get_backend('aer_simulator')
	circ = transpile(circuit, simulator)

	# Run and get counts
	result = simulator.run(circ).result()
	counts = result.get_counts(circ)
	for i in range(2**3):
		key = str(bin(i))[2:].zfill(3)
		if key not in counts:
			counts[key] = 0

	a = counts.most_frequent()
	#print('Most frequent measurement: ',a)

	bin_a = int(a,2) # Converts the binary value to an integer
	phase = bin_a/(2**3)# The calculation used to estimate the phase

	actual_phase = angle/(2*pi)
	print('Actual phase is: ',actual_phase)
	print('Estimated phase is: ',phase)
	
	return counts



fig=plt.figure()
plt.ylim(0,1000)

n=10000 #Number of frames
counts = estimate_phase(2*pi/3 + 0*0)
a_s, b_s = map(list, zip(*sorted(zip(counts.keys(),counts.values()), reverse=True)))
barcollection = plt.bar(a_s, b_s)

def animate(i):
    counts = estimate_phase(2*pi/3 + i*0.05)
    a_s, b_s = map(list, zip(*sorted(zip(counts.keys(),counts.values()), reverse=True)))
    for i, b in enumerate(barcollection):
        b.set_height(b_s[i])

anim=animation.FuncAnimation(fig,animate,repeat=False,
			     blit=False,frames=n,
                             interval=50)

#anim.save('mymovie.mp4',writer=animation.FFMpegWriter(fps=10))
plt.show()


quit()
for i in range(1000):
	estimate_phase(2*pi/3 + i*0.03)
#estimate_phase(2*pi/3 + 2*pi/(2**3)/2)









