"""Build documentation against the public source dependencies, without a registry release."""
from pathlib import Path
import subprocess
import os

ROOT = Path(__file__).resolve().parents[1]
DEPENDENCIES = ROOT / "build/docs-dependencies"
SOURCE_REF = os.environ.get("GRAMLOT_SOURCE_REF") or ("develop" if os.environ.get("READTHEDOCS_VERSION_TYPE") == "external" else "main")


def run(*args, cwd):
    subprocess.run(args, cwd=cwd, check=True)


def checkout(name):
    destination = DEPENDENCIES / name
    if destination.exists():
        run("git", "fetch", "--depth=1", "origin", SOURCE_REF, cwd=destination)
        run("git", "switch", "--detach", "FETCH_HEAD", cwd=destination)
    else:
        run("git", "clone", "--depth=1", f"--branch={SOURCE_REF}",
            f"https://github.com/gramlot-org/{name}.git", str(destination), cwd=ROOT)
    run("git", "log", "-1", "--format=%H %s", cwd=destination)
    return destination


def main():
    DEPENDENCIES.mkdir(parents=True, exist_ok=True)
    core = checkout("gramlot")
    hosts = checkout("gramlot-js-server")
    install = ("npm", "install", "--install-links", "--ignore-scripts", "--package-lock=false", "--no-audit", "--no-fund")
    run(*install, cwd=core / "js")
    run(*install, cwd=core / "tools/gramlot-builder")
    run("npm", "run", "build", cwd=core / "js")
    core_package = f"@gramlot/gramlot@file:{core / 'js'}"
    run(*install, "--no-save", core_package, cwd=hosts)
    run(*install, "--no-save", core_package,
        f"@gramlot/builder@file:{core / 'tools/gramlot-builder'}",
        f"@gramlot/gramlot-serverless@file:{hosts / 'serverless'}", "playwright", cwd=ROOT)
    run("npm", "run", "build", cwd=ROOT)


if __name__ == "__main__":
    main()
