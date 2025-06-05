
# 📄 `fitb` CLI – Finalization & Completion Specification

## 📌 Overview

`fitb` is a **TypeScript-based CLI tool** built using **Oclif** and **Knex.js**, designed for internal developer and support workflows. It uses a **JSON schema** (`fitb.schema.json`) to dynamically configure resources and map CLI commands to full **CRUD operations** on a PostgreSQL database.

This spec outlines the tasks needed to take the current POC implementation to full production-quality completeness.

## ✅ Current State

The current base includes:
- ✔ Oclif CLI scaffolding
- ✔ `task` resource with `create`, `list`, `get`, `update`, `delete` commands
- ✔ Knex.js DB client
- ✔ `.env` support
- ✔ Static `fitb.schema.json` loader
- ✔ Working file tree and CLI usage examples

## 🔧 Objectives for Finalization

### 🧩 1. CLI Improvements
- [ ] Implement a **dynamic dispatcher** to allow CLI commands like:
  `fitb <resource> <action> --id <id> --data '{}'`
- [ ] Add a **universal resource handler**
- [ ] Support subcommands like:
  `fitb schema list`, `fitb <resource> describe`

### 📐 2. Schema Loader Improvements
- [ ] Add field type validation
- [ ] Support for required fields or default values

### ⚙️ 3. CLI Execution Entry (Bin Hook)
- [ ] Add proper CLI binary entry in `package.json`
- [ ] Add `bin/dev` Oclif entrypoint script
- [ ] Ensure `fitb <command>` works from terminal

### 📦 4. Packaging & Distribution
- [ ] Add `oclif.config.js`
- [ ] Optionally publish to NPM

### 🧪 5. Testing & Tooling
- [ ] Add unit tests and integration tests
- [ ] Add `scripts/test.sh`
- [ ] Use `Vitest` or `Jest`

### 🧰 6. Example Data + Fixtures
- [ ] Include fixture files (e.g., `task.sample.json`)
- [ ] Add a `fitb seed` command

### 🛡 7. Error Handling & Logging
- [ ] Improve all error messages
- [ ] Add verbose mode
- [ ] Wrap DB ops in try/catch

### 📄 8. Documentation
- [ ] Expand `README.md` with full usage, dev guide
- [ ] Add `ARCHITECTURE.md` explaining structure

### 📈 9. Optional Enhancements
- [ ] Add `fitb repl`
- [ ] Tab completion
- [ ] Export/import support

## 📦 Deliverables

1. Fully working CLI (`npm run dev`)
2. Dynamic CRUD via `fitb.schema.json`
3. Unit tests and fixtures
4. Final documentation
5. Packaged for internal use or NPM

## 💡 Notes for the Agent

- Use `.env` for DB connection
- Never hardcode table/fields
- Use schema lookup, async/await, and proper typing
- Organize and document all code

