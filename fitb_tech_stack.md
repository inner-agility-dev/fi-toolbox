
# 🧱 fitb: Config-Driven CLI Tool for Internal CRUD Operations

## 🔧 Overview

`fitb` is a TypeScript-based CLI designed for support engineers, developers, and power users. It provides fully dynamic CRUD operations mapped to PostgreSQL tables using a shared JSON schema. It's built for extensibility, local dev friendliness, and internal tooling parity with your backend.

---

## 🛠 Tech Stack

| Layer              | Tool / Framework          | Purpose |
|--------------------|---------------------------|---------|
| CLI Framework      | Oclif (TypeScript)        | Command structure, flag parsing, plugins |
| Runtime Language   | Node.js (with TypeScript) | Execution platform |
| DB Client          | `pg` or `Knex.js`         | PostgreSQL interaction |
| Config Format      | JSON                      | Describes schema and CRUD fields |
| Database           | PostgreSQL                | Primary backing store |
| Frontend (optional)| Lit + Signals             | (Not part of `fitb`, but aligns with broader project) |

---

## 🎯 Key Features

- Full CRUD: create, list, get, update, delete.
- Schema-driven: easy to add new resource types via JSON.
- Works in local dev or production environments.
- Scalable structure using Oclif plugins and hooks.

---

## ✅ Supported Commands (via Oclif)

```
fitb task list
fitb task get --id 1
fitb task create --data '{ "title": "Foo" }'
fitb task update --id 1 --data '{ "status": "done" }'
fitb task delete --id 1
fitb task describe
fitb schema list
```

---

## 🧠 User Stories

1. Create new records from CLI.
2. Read or inspect resources (list/get).
3. Update records.
4. Delete records.
5. Add new resources via JSON config.
6. Run in local dev mode.
7. Introspect schema and commands.

---

## 📊 Mermaid Diagram: Stack Architecture

```mermaid
graph TD
    A[fitb CLI] -->|Reads| B[JSON Schema]
    A -->|Sends Queries| C[PostgreSQL]
    A -->|Executes| D[Oclif Commands]
    B -->|Defines| D
    C -->|Data Source| E[Express API (Optional)]
    E -->|Mirrors| C
    B -->|Shared Config| E
```

---

## 📁 File Tree (Preview)

```
fitb/
├── src/
│   ├── commands/
│   │   ├── task/
│   │   │   ├── create.ts
│   │   │   ├── list.ts
│   │   │   ├── get.ts
│   │   │   ├── update.ts
│   │   │   ├── delete.ts
│   ├── schema/
│   │   └── fitb.schema.json
│   └── db/
│       └── client.ts
├── .env
├── tsconfig.json
├── package.json
└── README.md
```

---

## 📦 Install & Run

```bash
# Install dependencies
npm install

# Run CLI
npm run dev -- task list
```

---

## 🧪 Test Plan (coming next)
- Schema-driven unit tests
- DB mocking or test container support
- Integration tests via CLI calls

---

