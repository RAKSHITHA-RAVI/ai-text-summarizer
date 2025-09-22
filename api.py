from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # Allow all origins (you can replace with ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],       # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],       # Allow all headers
)

# Load summarizer
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

class InputText(BaseModel):
    text: str
    max_length: int = 100
    min_length: int = 30

@app.post("/summarize")
def summarize(data: InputText):
    summary = summarizer(
        data.text,
        max_length=data.max_length,
        min_length=data.min_length,
        do_sample=False
    )
    return {"summary": summary[0]["summary_text"]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
