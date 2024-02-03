from pytket.circuit import Circuit
from pytket.circuit.display import render_circuit_jupyter
from pytket.extensions.nexus import Nexus
from datetime import datetime
from pytket.extensions.nexus import QuantinuumConfig
from pytket.extensions.nexus import NexusBackend

# Create Circuit
qc_seed = Circuit(16)
for i in range(16):
    qc_seed.H(i)
qc_seed.measure_all()
# render_circuit_jupyter(qc_seed)

# Create Project on Nexus
nexus = Nexus()
my_project = nexus.get_project_by_name(name=f"My Project")

# Create job configuration
configuration = QuantinuumConfig(device_name="H1-1LE", user_group="iQuHACK_2024")

# Then we'll create a NexusBackend using our config and the project we created
backend = NexusBackend(configuration, project=my_project)

# Compile the circuit in Nexus
compiled_circuit = backend.get_compiled_circuit(qc, optimisation_level=2)


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




