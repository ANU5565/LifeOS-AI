from pathlib import Path


def test_render_blueprint_targets_backend_service() -> None:
    config = Path(__file__).parents[2].joinpath("render.yaml").read_text()

    assert "type: web" in config
    assert "rootDir: backend" in config
    assert "buildCommand: pip install -r requirements.txt" in config
    assert "startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT" in config
    assert "healthCheckPath: /health" in config
