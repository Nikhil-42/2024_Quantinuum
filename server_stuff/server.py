from fastapi import FastAPI
#from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from scipy.stats import unitary_group
import generate_seed

app = FastAPI()

from pydantic import BaseModel

'''
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)'''

class matrix_json(BaseModel):
	real_part: list[list]
	imag_part: list[list]

from starlette.responses import FileResponse 
@app.get("/")
async def read_index():
	return FileResponse('index.html')

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
	eigenvalue, eigenvector = eigenvalues[i],eigenvectors[i]
	# sending components seperately because
	# json doesn't support complex numbers
	print(eigenvalue.real)
	the_matrix_parts = {"real_part": the_matrix.real.tolist(),
	'imag_part':the_matrix.imag.tolist(),
	'eigenvalue_real':eigenvalue.real,
	'eigenvalue_real':eigenvalue.imag,
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

