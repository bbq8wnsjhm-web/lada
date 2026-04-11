# Juleri Workspace

This workspace is a mixed design, research, and automation project centered on the diploma work for the jewelry brand `Lada Jewelry`.

The root is intentionally kept minimal so the project is easier to scan and migrate:

- `docs/` academic materials, reports, and project documentation
- `scripts/` Python automation for assembling `.docx` materials
- `prototype/` browser-based visual experiments and interface prototypes
- `assets/` media files and working visual source folders
- `archive/` temporary or bulky archived materials that are not part of the active working surface

## Quick Start

If you are opening this project in a new place, read these files first:

1. `docs/PROJECT_CONTEXT.md`
2. `docs/WORKSPACE_MAP.md`
3. `scripts/build_vkr_docx.py`
4. `scripts/assemble_vkr_telegram.py`

## Current Project Identity

- Domain: diploma / brand design / jewelry packaging / visual communication
- Brand: `Lada Jewelry`
- Main outputs: written diploma materials, reports, packaging concept, brand presentation assets, media references, and a small kinetic web prototype
- Technical layer: Python scripts for `.docx` assembly and a plain HTML/CSS/JS canvas prototype

## Important Notes

- This is not a conventional application repository. It is a working studio folder with code, media, research, and academic deliverables together.
- The Python scripts manipulate Word XML directly inside `.docx` archives.
- Some Russian text inside the Python sources appears to have encoding damage. Treat script content carefully before relying on generated text output.
- The web prototype lives in `prototype/kinetic-type/` and is self-contained.

## Suggested Opening Order

- For project meaning: `docs/PROJECT_CONTEXT.md`
- For folder orientation: `docs/WORKSPACE_MAP.md`
- For automation: `scripts/`
- For design experiments: `prototype/`
- For raw and working materials: `assets/`
