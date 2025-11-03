# 🧭 carv_learn_to_earn — Your AI Guide to On-Chain Adventures

A decentralized Learn-to-Earn dApp built on the **CARV SVM testnet**, combining Web3 onboarding, quests, and DeFi features into one seamless experience. 
It helps users **discover, complete, and record Web3 tasks** — all linked to their **CARV ID** via **CARV AgentKit**.  
This project is built for the [CARV Community Hackathon](https://docs.carv.io/hackathon).

---

## 💡 Overview

Web3 has countless quests — from testnet missions to community campaigns — but discovery and tracking are fragmented.  
CARV Quest solves this by creating a **unified, intelligent quest hub** where an **AI CARV Agent** helps users:

- 🔍 Discover relevant quests  
- 🧩 Track progress & completions  
- 🪪 Link activity to their CARV ID  
- 🌐 Log proof-of-participation on **CARV SVM**

> *A Sovereign AI layer guiding your on-chain growth.*

---

## 🎯 Problem Statement

Web3 lacks a cohesive experience for users to **explore quests, verify participation**, and **build on-chain reputation**.  
Most campaigns are scattered across Discords, Twitter threads, and external platforms.

---

## 🚀 Solution

carv_l2e provides a **simple, AI-assisted portal** that connects users with quests and verifies completions directly on-chain.

| Function | Description |
|-----------|--------------|
| **AI Quest Finder** | Suggests trending quests using AgentKit prompts |
| **Quest Tracker** | Logs user progress (Started → Completed) |
| **On-Chain Proof** | Writes verified completions to CARV SVM |
| **CARV ID Integration** | Links actions to reputation & XP |
| **Leaderboard** | Displays top contributors |

---

## 🧠 Architecture

```mermaid
graph TD
A[User] -->|Login with CARV ID| B[Frontend (Next.js)]
B -->|Requests Quest List| C[Backend (Node.js)]
C -->|Fetches from DB| D[Supabase / JSON Store]
B -->|AI Suggestions| E[Agent Endpoint (OpenAI or Local LLM)]
B -->|Submit Quest Completion| F[CARV SVM Smart Contract]
F -->|Record Proof| G[On-chain QuestLog]

