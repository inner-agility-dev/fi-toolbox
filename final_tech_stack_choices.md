
# 🧱 Final Tech Stack Choices for `fitb` CLI

## 🎯 Goal
Build a config-driven CLI with dynamic, schema-based CRUD operations over PostgreSQL. Easy to use, extensible, and dev-friendly.

---

## 🛠 Tech Stack

| Layer              | Tool / Framework          | Why It Was Chosen |
|--------------------|---------------------------|-------------------|
| CLI Framework      | **Oclif** (TypeScript)    | Scalable, plugin-friendly, file-based routing, good TypeScript support |
| Runtime Language   | **TypeScript**            | Safer dev, great LLM compatibility, strongly typed |
| DB Client          | **Knex.js**               | Chainable, readable queries, works well with JSON schema abstraction |
| Config Format      | **JSON**                  | Human + LLM-friendly, declarative, extensible |
| Database           | **PostgreSQL**            | Reliable, relational, introspectable |
| Environment Config | **dotenv**                | Simple DB connection and environment switching |
| Package Scripts    | **npm scripts**           | Easily portable, CLI tested locally |
| Testing Framework  | *(To be added: Vitest or Jest)* | For validation of loaders and DB behavior |

---

## 💡 AI + Dev Agent Friendliness

- ✅ Knex.js is better than raw SQL for LLMs (chainable syntax, less ambiguity)
- ✅ JSON schema abstraction maps naturally to prompt-based tooling
- ✅ Oclif structure is modular and discoverable
- ✅ All TypeScript, so strongly typed end-to-end

---

## 📦 Deployment Targets (Stretch Goals)

- Optional publish to private NPM registry
- Use as internal devtool in CI/CD
- Potential MCP integration later for AI schema wiring

---

