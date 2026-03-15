---
description: Architecture overview of the .agent folder structure for be-reader
---

# Agent Configuration Architecture (BE)

> Modular AI agent capability system for be-reader project

---

## 📋 Overview

This `.agent` folder contains:

- **0 Skills** - (planned: NestJS patterns, Prisma conventions)
- **10 Workflows** - Slash command procedures

---

## 🏗️ Directory Structure

```plaintext
.agent/
├── rules/
│   └── 00-project-conventions.md   # Critical rules (loaded first)
│
└── workflows/           # Slash command workflows
    ├── ARCHITECTURE.md  # This file
    ├── brainstorm.md    # Structured idea exploration
    ├── create.md        # Create new NestJS modules
    ├── debug.md         # Systematic problem investigation
    ├── deploy.md        # Production deployment
    ├── enhance.md       # Improve existing code
    ├── orchestrate.md   # Multi-agent coordination
    ├── plan.md          # Task breakdown & planning
    ├── preview.md       # Dev server management
    ├── status.md        # Project status check
    └── test.md          # Test generation & execution
```

---

## 🔄 Workflows (10)

Slash command procedures. Invoke with `/command` in chat.

| Command        | Description                      |
| -------------- | -------------------------------- |
| `/brainstorm`  | Structured idea exploration      |
| `/create`      | Create new NestJS module         |
| `/debug`       | Systematic problem investigation |
| `/deploy`      | Deploy application               |
| `/enhance`     | Improve existing code            |
| `/orchestrate` | Multi-agent coordination         |
| `/plan`        | Task breakdown & planning        |
| `/preview`     | Dev server management            |
| `/status`      | Check project status             |
| `/test`        | Run tests                        |

---

## 🔗 Quick Reference

| Need                | Workflow     |
| ------------------- | ------------ |
| New NestJS module   | `/create`    |
| Add features        | `/enhance`   |
| Fix bugs            | `/debug`     |
| Plan complex task   | `/plan`      |
| Explore options     | `/brainstorm`|
| Deploy to prod      | `/deploy`    |
| Check project state | `/status`    |
