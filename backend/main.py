from pathlib import Path
from fastapi import FastAPI, Query, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Any
import json, copy
from dotenv import load_dotenv
from tts import get_or_generate, CACHE_DIR

BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")  # backend/.env
load_dotenv(BASE_DIR.parent / ".env.local", override=False)  # project root .env.local (ElevenLabs key)
DIST_DIR = BASE_DIR.parent / "dist"

app = FastAPI(title="SchoolSims Player")

# Serve cached TTS audio files
app.mount("/tts", StaticFiles(directory=str(CACHE_DIR)), name="tts")

with open(BASE_DIR / "scenario.json") as f:
    SCENARIO: dict = json.load(f)

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

    return {
        "start_node_id": SCENARIO["start_node_id"],
        "nodes": SCENARIO[lang]["nodes"],
        "ui": SCENARIO[lang]["ui"],
        "media": {
            "photo": f"/assets/{ethnicity}_photo.{'png' if ethnicity == 'black' else 'jpg'}",
            "video_template": f"/assets/{ethnicity}_{lang}.mp4",
            "photo_alt": "Character portrait",
        },
    }


class ScenarioUpdate(BaseModel):
    start_node_id: str
    nodes: dict[str, Any]
    ui: dict[str, Any]


@app.post("/api/tts/preload")
def tts_preload(body: dict):
    """Generate (or return cached) ElevenLabs MP3s for all slide texts."""
    texts: dict = body.get("texts", {})
    result = {}
    for node_id, text in texts.items():
        if text:
            filename = get_or_generate(text)
            result[node_id] = f"/tts/{filename}"
    return result


@app.post("/api/scenario/{lang}")
def save_scenario(lang: str, body: ScenarioUpdate):
    if lang not in VALID_LANGS:
        raise HTTPException(400, detail=f"lang must be one of {sorted(VALID_LANGS)}")
    if body.start_node_id not in body.nodes:
        raise HTTPException(400, detail="start_node_id not found in nodes")
    global SCENARIO
    updated = copy.deepcopy(SCENARIO)
    updated[lang]["nodes"] = body.nodes
    updated[lang]["ui"] = body.ui
    updated["start_node_id"] = body.start_node_id
    with open(BASE_DIR / "scenario.json", "w") as f:
        json.dump(updated, f, indent=2, ensure_ascii=False)
    SCENARIO = updated
    return {"ok": True}


if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")

    @app.get("/")
    def serve_index():
        return FileResponse(str(DIST_DIR / "index.html"))

    @app.get("/{full_path:path}")
    def catch_all(full_path: str):
        return FileResponse(str(DIST_DIR / "index.html"))
