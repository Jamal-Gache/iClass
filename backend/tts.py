import hashlib
import os
from pathlib import Path
from elevenlabs import ElevenLabs

CACHE_DIR = Path(__file__).parent / "tts_cache"
CACHE_DIR.mkdir(exist_ok=True)


def get_or_generate(text: str) -> str:
    """Return cached MP3 filename. Calls ElevenLabs on cache miss."""
    voice_id = os.getenv("ELEVEN_LABS_VOICE_ID", "JBFqnCBsd6RMkjVDRZzb")
    model_id = os.getenv("ELEVEN_LABS_MODEL", "eleven_v4")

    if not text.strip():
        raise ValueError("Empty text passed to TTS")

    key = hashlib.sha256(f"{text}{voice_id}{model_id}".encode()).hexdigest()
    path = CACHE_DIR / f"{key}.mp3"

    if not path.exists():
        client = ElevenLabs(api_key=os.getenv("ELEVEN_LABS_API_KEY") or os.getenv("ELEVENLABS_API_KEY"))
        audio = client.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id=model_id,
            voice_settings={"stability": 0.5, "similarity_boost": 0.75},
        )
        with open(path, "wb") as f:
            for chunk in audio:
                f.write(chunk)

    return f"{key}.mp3"
