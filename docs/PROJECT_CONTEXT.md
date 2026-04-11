# Project Context

## What This Project Is

This workspace contains the materials for a diploma design project related to the jewelry brand `Lada Jewelry`.

The project is broader than a website or a single codebase. It combines:

- academic writing for the diploma
- packaging and brand system development
- visual and media experiments
- report and presentation materials
- small automation scripts to generate or assemble Word documents
- a browser prototype exploring kinetic typography and motion language

## Core Subject

The central theme is the development of packaging and visual communication for `Lada Jewelry`, with emphasis on:

- jewelry brand identity
- tactile and material qualities
- packaging as part of brand storytelling
- integration of offline and online brand presentation

The project appears to position packaging not as a secondary container, but as an active communication layer of the brand.

## What The Code Does

### `scripts/build_vkr_docx.py`

This script programmatically assembles a diploma `.docx` by editing WordprocessingML XML inside a `.docx` archive.

Observed responsibilities:

- open a template `.docx`
- replace placeholder text for the diploma topic
- inject generated structure such as title pages, contents, introduction, and chapter text
- write a new `.docx` output archive

Technical characteristics:

- uses `zipfile` to read and rewrite the `.docx`
- uses `xml.etree.ElementTree` to modify `word/document.xml`
- does not depend on external packages

### `scripts/assemble_vkr_telegram.py`

This script appears to be a larger or more complete variation of the same automation approach.

Observed responsibilities:

- define formatted Word runs and paragraphs
- build headings, subheadings, lists, and page breaks
- inject larger structured text blocks into a `.docx`

Technical characteristics:

- same XML-level document assembly strategy
- also relies on direct editing of Word XML
- likely intended for a more complete diploma assembly pipeline

## What The Prototype Does

### `prototype/kinetic-type/`

This is a lightweight standalone web prototype.

Contents:

- `index.html`
- `styles.css`
- `script.js`

Behavior:

- renders a single `canvas`
- animates the text `RE081813`
- uses layered distortion, blur, and strip-based warping
- creates a liquid or kinetic typography effect

Interpretation:

- this looks like a motion-language or visual-identity experiment
- it does not currently look like a full product site
- it is useful as a style study and possibly as a future building block

## Main Asset Groups

### Academic materials

Located primarily in `docs/academic/`.

These include:

- diploma drafts
- chapter drafts
- assignment documents
- methodology and schedule PDFs
- formatted source documents

### Reports

Located in `docs/reports/`.

These appear to contain generated or exported report packages and supporting images.

### Media

Located in `assets/media/`.

These are loose visual and motion files that were previously cluttering the project root, including:

- `.png`
- `.jpg`
- `.tiff`
- `.mov`
- `.mp4`
- `.toe`

### Working source folders

Located in `assets/working/`.

These folders contain active or exploratory material collections such as:

- `Пилим`
- `свалка`
- `Новая папка`

These look like raw, iterative, or staging areas rather than final deliverables.

### Archive

Located in `archive/`.

This now holds bulky or temporary material that is useful to keep but should not distract from active work.

## Risks And Caveats

### Encoding risk in Python text blocks

The Python scripts contain Cyrillic strings that currently display as mojibake in the source. That suggests an encoding mismatch occurred at some point.

Impact:

- generated text inside output `.docx` files may be corrupted
- editing those constants without a careful encoding strategy could make things worse

### Workspace is a studio folder, not a hardened repo

This is a practical working directory. It does not currently present as:

- a test-driven codebase
- a packaged application
- a dependency-managed software repository

That is fine for the project type, but it matters when migrating or expanding it.

### Path assumptions changed after cleanup

Files were reorganized to make the workspace easier to navigate. If there are any external shortcuts, scripts, or habits that assumed root-level file paths, they may need to be updated manually.

## Recommended Next Steps

If this project will keep growing, the next highest-value improvements are:

1. Validate both Python document scripts against real template files and confirm output integrity.
2. Repair source encoding in Russian text constants.
3. Add a small `scripts/README.md` with exact run commands and input/output examples.
4. Decide whether the web prototype should remain an isolated experiment or evolve into a real site prototype.
5. Normalize duplicate and exploratory media inside `assets/working/`.

## If You Reopen This Elsewhere

To restore the working context quickly:

1. Start from `README.md`.
2. Read `docs/PROJECT_CONTEXT.md`.
3. Read `docs/WORKSPACE_MAP.md`.
4. Open `scripts/` to understand automation.
5. Open `prototype/kinetic-type/` to understand the browser experiment.
6. Inspect `docs/academic/` for the current diploma source materials.

This sequence should be enough both for a human collaborator and for an AI agent to regain working context with minimal confusion.
