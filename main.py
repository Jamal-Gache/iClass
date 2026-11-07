from fastapi import FastAPI, Query, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import json

app = FastAPI(title="SchoolSims Player")

with open("scenario.json") as f:
    SCENARIO = json.load(f)

VALID_LANGS = {"en", "es"}
VALID_ETHNICITIES = {"black", "east_asian"}


@app.get("/api/options")
def get_options():
    return {"languages": list(VALID_LANGS), "ethnicities": list(VALID_ETHNICITIES)}


@app.get("/api/simulation")
def get_simulation(
    lang: str = Query(..., description="en or es"),
    ethnicity: str = Query(..., description="black or east_asian"),
):
    if lang not in VALID_LANGS:
        raise HTTPException(400, detail=f"lang must be one of {sorted(VALID_LANGS)}")
    if ethnicity not in VALID_ETHNICITIES:
        raise HTTPException(400, detail=f"ethnicity must be one of {sorted(VALID_ETHNICITIES)}")

    content = SCENARIO[lang]
    return {
        **content,
        "media": {
            "photo": f"/static/{ethnicity}_photo.jpg",
            "video": f"/static/{ethnicity}_{lang}.mp4",
            "captions": f"/static/captions_{lang}.vtt",
        },
    }


app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def serve_index():
    return FileResponse("static/index.html")
