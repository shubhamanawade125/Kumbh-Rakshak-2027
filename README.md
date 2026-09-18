# 🛡️ Kumbh-Rakshak 2027 — AI Crowd Safety & Emergency Command

**Live Demo:** [kumbh-rakshak-2027.onrender.com](https://kumbh-rakshak-2027.onrender.com/)

Kumbh-Rakshak is a unified AI-powered crowd management and mass-safety command platform built for the **Simhastha Kumbh Mela 2027**, developed for **TechFusion** (Problem Statement 2 — AI-Based Crowd Management & Safety).

The platform gives command-center operators a single real-time view of crowd density, medical emergencies, missing persons, and ambulance routing across the Nashik ghat sectors.

## 🚨 Core Modules

- **Crowd Flow Intelligence** — Real-time spatial density monitoring (persons/m²), stampede shockwave prediction, and CSRNet-based optical crowd counting with 15–20 min surge forecasting.
- **Rapid AED Response** — Sub-3-minute "golden hour" resuscitation workflow with live countdown timer, automated CPR audio guidance, and nearest AED cabinet dispatch.
- **Amber Alert — Missing Persons** — Case registration with public broadcast across Ghat LED screens, multilingual alerts (Marathi, Hindi, English), and photo/attire matching.
- **108 Ambulance & Green Corridor** — Live ambulance GPS tracking, ETA monitoring, and automated traffic signal preemption to Nashik District Civil Hospital.
- **Sentinel OS Command Dashboard** — Unified tactical map, CCTV AI analytics (bounding boxes, flow vectors, heatmaps), incident timeline, and role-based access (Police Commander, Doctor, Volunteer Lead, Super Admin).
- **Gemini Disaster Mitigation Advisor** — AI consultation engine synthesizing ground telemetry against NDMA response protocols.

## 🧰 Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js (Express)
- **Database:** Firebase Firestore
- **Maps:** Google Maps API + Leaflet fallback
- **AI:** Gemini API, Computer Vision (crowd density / CCTV analysis)

## 👥 Team Codepulse

MVPS Institute of Nursing Education, Nashik
- Shubham Anawade
- Tanmay Dusane
- Sarthak Deore
- Pranav Pawar

## ⚙️ Getting Started

```bash
git clone https://github.com/shubhamanawade125/kumbh-rakshak-2027.git
cd kumbh-rakshak-2027
npm install --legacy-peer-deps
npm run build
npm run start
```

### Environment Variables

Copy `.env.example` to `.env` and set:
