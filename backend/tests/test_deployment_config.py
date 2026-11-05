import json
from pathlib import Path


def test_vercel_config_lives_with_the_frontend_project() -> None:
    repository_root = Path(__file__).parents[2]
    config = json.loads(repository_root.joinpath("frontend/vercel.json").read_text())

    assert config["framework"] == "nextjs"
    assert not repository_root.joinpath("vercel.json").exists()
