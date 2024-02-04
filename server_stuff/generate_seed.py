from pytket.circuit import Circuit
from pytket.circuit.display import render_circuit_jupyter
from datetime import datetime

# Create Circuit
qc_seed = Circuit(16)
for i in range(16):
    qc_seed.H(i)
qc_seed.measure_all()
# render_circuit_jupyter(qc_seed)

from pytket.extensions.quantinuum import QuantinuumBackend, QuantinuumAPIOffline
api_offline = QuantinuumAPIOffline()
backend = QuantinuumBackend(device_name="H1-1LE", api_handler = api_offline)

# Compile the circuit in Nexus
compiled_circuit = backend.get_compiled_circuit(qc_seed, optimisation_level=2)


def generate_numbers() -> list[int]:
    numbers = []
    
    # Run the compiled circuit
    handle = backend.process_circuit(compiled_circuit, n_shots=5)
    
    # This will give you a ResultHandle
    # As with other pytket-backends, a ResultHandle identifies a particular run of the circuit, which you can then use to keep track of the job status.
    print(handle)
    
    # Get an update on the status
    backend.circuit_status(handle)
    
    # If the job is COMPLETED we can then retrieve the result with the handle
    result = backend.get_result(handle)
    list(result.get_distribution().keys())
    numbers = []
    for j in range(5):
        bits = [list(result.get_distribution().keys())[j][i] for i in range(16)]
        bit_string = ''
        for bit in bits:
            bit_string += str(bit)
        numbers.append(int(bit_string,2))

    return numbers




