from fastapi import FastAPI, Query, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Any
import json, copy

app = FastAPI(title="SchoolSims Player")

with open("scenario.json") as f:
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
            "photo": f"/static/{ethnicity}_photo.jpg",
            "video_template": f"/static/{ethnicity}_{{lang}}.mp4",
            "photo_alt": f"Character portrait",
        },
    }


class ScenarioUpdate(BaseModel):
    start_node_id: str
    nodes: dict[str, Any]
    ui: dict[str, Any]


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
    with open("scenario.json", "w") as f:
        json.dump(updated, f, indent=2, ensure_ascii=False)
    SCENARIO = updated
    return {"ok": True}


app.mount("/assets", StaticFiles(directory="static/dist/assets"), name="dist-assets")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def serve_index():
    return FileResponse("static/dist/index.html")


@app.get("/{full_path:path}")
def catch_all(full_path: str):
    return FileResponse("static/dist/index.html")
