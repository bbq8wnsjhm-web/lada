# Workspace Map

## Top-Level Structure

```text
Juleri/
  README.md
  docs/
  scripts/
  prototype/
  assets/
  archive/
```

## Folder Meanings

### `docs/`

Human-readable and academic materials.

Subfolders:

- `docs/academic/` diploma source documents, assignments, methodology, and academic PDFs
- `docs/reports/` exported reports and report-related materials

Use this folder when:

- editing diploma content
- finding official assignment and methodical files
- checking report outputs
- recovering narrative context of the project

### `scripts/`

Python automation for document generation and assembly.

Current files:

- `scripts/build_vkr_docx.py`
- `scripts/assemble_vkr_telegram.py`

Use this folder when:

- generating Word-based deliverables
- inspecting text assembly logic
- debugging formatting or document-structure issues

### `prototype/`

Interactive experiments or future interface concepts.

Current subfolder:

- `prototype/kinetic-type/`

Use this folder when:

- testing motion language
- previewing browser-based ideas
- extending visual identity experiments into web form

### `assets/`

Visual and production materials.

Subfolders:

- `assets/media/` loose root-level media collected into one place
- `assets/working/` larger working sets and exploratory folders

Use this folder when:

- searching for source imagery
- reviewing motion references
- opening iterative visual explorations

### `archive/`

Non-active but retained materials.

Current contents include:

- unpacked report temp material
- large zip archive

Use this folder when:

- you need historical outputs
- you need to inspect previously unpacked report material
- you want to keep the active workspace uncluttered

## Practical Working Rules

- Keep the root clean. New files should usually go into one of the five main folders.
- Put automation in `scripts/`, not in the root.
- Put prototypes in `prototype/`, one concept per subfolder when possible.
- Put academic source documents in `docs/academic/`.
- Put exported reports in `docs/reports/`.
- Put raw media in `assets/media/` and active exploration folders in `assets/working/`.
- Put temporary unpacked or historical bulky content in `archive/`.

## Migration Notes

If you move this workspace to a new machine:

- preserve folder names exactly if possible
- verify any local shortcuts or run commands that reference old root paths
- open `README.md` first after migration
- confirm Python can still access the `.docx` templates in `docs/academic/`

## Known Technical Debt

- Python text encoding in diploma scripts likely needs repair
- media folders still contain duplicates and exploratory naming
- no dedicated runbook exists yet for document generation
- no explicit version-control metadata is present in this workspace

## Best Next Cleanup Layer

After this first-pass organization, the next cleanup should happen inside `assets/working/` and inside the Python automation layer, not at the root level.
