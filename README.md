<div align="center">

# Pinturillo App

Multiplayer and realtime drawing and guessing game built with/Express JS, WebSockets & NextJS. It is Personal project made for showcasing design and systems architectura skills along with proficiency at backend and frontend development.

</div>

## 📖 Essential Documentation

The documentation can be found in `/docs`

## 🚀 Project structure

```text
/
├── apps/
│    ├── client/
│    └── server/
│
├── packages/
│    └── shared/
│
├── docs/
├── package.json
└── pnpm-workspace.yaml
```

## ⚙️ Stack

| Tech       | Purpose                                  | Version |
| ---------- | ---------------------------------------- | ------- |
| ExpressJS  | Backend Framework for routes handling    |         |
| NodeJS     | Backend enviroment with built in sockets | ^26.1.0 |
| NextJS     | Frontend Framework                       |         |
| TypeScript | Main programming lenguaje                |         |

## 🧞 Available commands

| Command                                 | Action                                      |
| :-------------------------------------- | :------------------------------------------ |
| `pnpm install`                          | Installs dependencies                       |
| `pnpm dev:server`                       | Starts local dev server at `localhost:3000` |
| `pnpm dev:client`                       | Starts local dev page at `localhost:4000`   |
| `pnpm --filter server add "dependency"` | Installs a devependency in server app       |
| `pnpm --filter client add "dependency"` | Installs a devependency in client app       |
| `pnpm add "dependency"`                 | Installs a devependency in globally         |
