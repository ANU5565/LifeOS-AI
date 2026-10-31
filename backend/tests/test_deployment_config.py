import json
from pathlib import Path


def test_vercel_rewrite_sources_use_supported_wildcard_syntax() -> None:
    config = json.loads(Path(__file__).parents[2].joinpath("vercel.json").read_text())
    sources = [rewrite["source"] for rewrite in config["rewrites"]]

    assert sources == ["/api/backend/:path*", "/:path*"]
    assert all("(" not in source and ")" not in source for source in sources)
