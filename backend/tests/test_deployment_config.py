import json
from pathlib import Path


def test_vercel_builds_the_frontend_from_the_repository_root() -> None:
    config = json.loads(Path(__file__).parents[2].joinpath("vercel.json").read_text())

    assert config["framework"] == "nextjs"
    assert config["installCommand"] == "cd frontend && npm ci"
    assert config["buildCommand"] == "cd frontend && npm run build"
    assert "outputDirectory" not in config
    assert "services" not in config
    assert "rewrites" not in config
