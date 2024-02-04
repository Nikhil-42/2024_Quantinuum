from fastapi import FastAPI
#from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from fastapi.staticfiles import StaticFiles
from scipy.stats import unitary_group
import generate_seed
from BachSphere import composition

app = FastAPI()

from pydantic import BaseModel

class matrix_json(BaseModel):
	real_part: list[list]
	imag_part: list[list]

from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse, Response
from typing import Callable
from starlette.types import Scope, Receive, Send
@app.get("/")
async def read_index():
	return FileResponse('index.html')

class CustomStaticFiles(StaticFiles):
	async def get_response(self, path: str, scope: Scope) -> Response:  # Adjust the return type
		full_path, stat_result = super().lookup_path(path)
		if full_path.endswith(".js"):
			# Serve with 'application/javascript' MIME type if it's a JS file
			return FileResponse(full_path, media_type='application/javascript')
		else:
			# Fall back to the default handling for other file types
			return await super().get_response(path, scope)


app.mount("/site", CustomStaticFiles(directory="site", html=True), name="site")

@app.get("/plotly-2.16.1.min.js")
async def read_index():
	return FileResponse('plotly-2.16.1.min.js')

@app.get("/materialize.min.css")
async def read_index():
	return FileResponse('materialize.min.css')

@app.get("/generate_matrix")
async def generate_matrix():
	the_matrix = unitary_group.rvs(2)
	eigenvalues, eigenvectors = np.linalg.eig(the_matrix)
	i = np.random.choice([0,1])  # pick one of the eigenvalue eigenvector pairs
	eigenvalue, eigenvector = eigenvalues[i],eigenvectors.T[i]
	# sending components seperately because
	# json doesn't support complex numbers
	print(eigenvalue.real)
	the_matrix_parts = {"real_part": the_matrix.real.tolist(),
	'imag_part':the_matrix.imag.tolist(),
	'eigenvalue_real':eigenvalue.real,
	'eigenvalue_imag':eigenvalue.imag,
	'eigenvector_real':eigenvector.real.tolist(),
	'eigenvector_imag':eigenvector.imag.tolist()}
	print(f'Sending the random matrix: {the_matrix_parts}')
	return the_matrix_parts

@app.post("/calculate_eigenvalues")
async def calculate_eigenvalues(matrix: matrix_json):
	print(matrix)
	breakpoint()
	return {"TODO": "TODO"}

@app.post("/random_numbers/")
async def random_numbers():
	return {"numbers": generate_seed.generate_numbers()}


@app.post("/get_music/")
async def get_music():

	quantum_seeds = [1123,213,45,73,134]
	print(quantum_seeds)

	comp = composition(seeds = quantum_seeds)
	comp.show()
	# comp.show('midi')
	comp.write('midi', fp='/tmp/output_file.mid')
	return FileResponse('/tmp/output_file.mid')