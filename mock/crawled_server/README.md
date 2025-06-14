# 🕷️ MockSprawl - Mock Web Servers for Adversarial Crawler Testing 

This document describes, in exhaustive and precise detail, the structure, purpose, components, and implementation requirements of the **MockSprawl** project. This environment is designed to simulate realistic and adversarial web environments that will allow developers to rigorously test and benchmark their web crawlers.

All instructions should be interpreted **literally and without assumption**. If any ambiguity is detected, halt processing and request clarification.

---

## 🔰 Project Overview

**MockSprawl** is a testbed composed of multiple independent mock websites, all hosted under a single Next.js project (using the App Router structure). Each mock website is implemented as a self-contained route, simulating specific challenges that crawlers may face in real-world hostile web environments.

This includes, but is not limited to:

- Dynamic HTML content
- JavaScript-only rendering
- Sitemap inconsistencies
- Meta tag misinformation
- Robots.txt traps
- Anti-bot middleware

These are **not optional** features. Each one must be implemented faithfully and independently.

---

## 🎯 Purpose

1. Allow developers to locally test scrapers and crawlers without hitting real production sites.
2. Provide realistic obstacles that represent common and advanced anti-crawling strategies.
3. Function as a baseline for crawler robustness testing, ML-based scraping evaluation, and automated bot design.

This project should be able to replicate or exceed the complexity of most real-world sites. If a crawler performs well here, it is expected to succeed in production.

---

## 🏗️ Directory Structure

The Next.js app must reside in the following folder:

```
mock/crawled_server/
```

All development must occur inside this directory.

Subdirectories and key files:

```
mock/crawled_server/
├── app/
│   ├── static/
│   ├── dynamic/
│   ├── client-only/
│   ├── map/
│   ├── anti-bot/
│   ├── trap/[slug]/
│   ├── trap-broken/
│   ├── meta-fake/
│   ├── no-sitemap/
│   ├── partial-map/
│   └── layout.tsx
├── middleware.ts         # Required for anti-bot User-Agent detection
├── public/
│   ├── robots.txt         # Multiple versions may be conditionally served
│   └── sitemap.xml        # Must include both complete and corrupted examples
├── next.config.js         # May include rewrites and middleware conditions
├── tsconfig.json
└── README.md              # This file
```

---

## 🧩 Mock Site Definitions

Each subdirectory under `app/` represents a **mock site**. These are not pages, but full adversarial test environments. Each must include a `page.tsx` file and conform to the following specifications:

| Site Name      | Route Path     | Required Behavior                                                               |
| -------------- | -------------- | ------------------------------------------------------------------------------- |
| `StaticLand`   | `/static`      | Plain HTML site with hardcoded internal links. Fully crawlable without JS.      |
| `DynamicMaze`  | `/dynamic`     | Uses `getServerSideProps()` to randomize content on each request.               |
| `ClientShadow` | `/client-only` | Initial HTML is empty. Content appears **only after JavaScript execution**.     |
| `MapTown`      | `/map`         | Displays a map via Google Maps or OpenStreetMap JS API. Hidden without JS.      |
| `BotWarden`    | `/anti-bot`    | Middleware blocks or alters response for specific User-Agents.                  |
| `LinkSpiral`   | `/trap/[slug]` | Generates recursive links dynamically. Infinite depth possible.                 |
| `BrokenWeb`    | `/trap-broken` | Pages referenced in sitemap do not exist or return 404.                         |
| `MetaLie`      | `/meta-fake`   | Meta title and description differ from visible content.                         |
| `NoMapZone`    | `/no-sitemap`  | Neither sitemap.xml nor robots.txt is served. Site must be discovered manually. |
| `HalfMapSite`  | `/partial-map` | Sitemap.xml exists but omits many live pages. Misleads crawling heuristics.     |

Each of the above sites **must be implemented completely** and serve distinguishable HTML structures for testing parser adaptability.

---

## ⚔️ Anti-Crawler Mechanisms (Per Site)

| Feature                  | Applies To    | Implementation Requirement                                              |
| ------------------------ | ------------- | ----------------------------------------------------------------------- |
| JS-only content          | `client-only` | Use `useEffect()` to render content post-load. Empty SSR output.        |
| SSR + DOM randomization  | `dynamic`     | Random number generation + DOM reshuffling on each load.                |
| Bot middleware           | `anti-bot`    | Use `middleware.ts` to inspect headers and block known bot UAs.         |
| sitemap poisoning        | `trap-broken` | Include non-existent pages in sitemap.xml intentionally.                |
| recursive link trap      | `trap/[slug]` | Slugs should link to more slugs, forming an infinite navigational loop. |
| metadata mismatch        | `meta-fake`   | HTML content must differ drastically from head metadata.                |
| robots.txt inconsistency | varies        | Some paths explicitly disallowed; others not mentioned at all.          |

Any deviation from these behaviors must be considered a **critical error**.

---

## 🗺️ Sitemap & Robots.txt Rules

You must implement the following sitemap/robots logic:

| Site Name      | sitemap.xml | robots.txt  | Expected Outcome                                                         |
| -------------- | ----------- | ----------- | ------------------------------------------------------------------------ |
| `StaticLand`   | ✅ Complete | ✅ Allow    | Fully visible and crawlable                                              |
| `DynamicMaze`  | ❌ None     | ✅ Disallow | Excluded from indexing by rule                                           |
| `ClientShadow` | ✅ Present  | ❌ None     | Sitemap listed but content is invisible without JS                       |
| `BotWarden`    | ❌ None     | ❌ Disallow | Crawler banned; no site map; dynamic rejection via middleware            |
| `BrokenWeb`    | ✅ Present  | ✅ Allow    | Sitemap links lead to 404s                                               |
| `HalfMapSite`  | ✅ Partial  | ✅ Allow    | Only partial site listed, requires link traversal to find full structure |
| `NoMapZone`    | ❌ None     | ❌ None     | Crawler must discover all pages organically                              |

---

## ⚙️ Deployment Instructions

You must be able to start this app locally for testing using the following:

```bash
cd mock/crawled_server
npm install
npm run dev
```

Once started, test each route manually in browser and via headless browser to verify behavior.

---

## 🔮 Future Expansion (Optional)

These features are not required, but recommended for advanced crawler testing:

- Cookie-based gatekeeping: only show content on second visit
- Time-based visibility (e.g., appear after N seconds)
- CAPTCHA-like elements (non-functional visual traps)
- TLS/JA3 fingerprint-based middleware blocking
- Dynamic HTML mutation based on viewport or language

---

## 📜 Licensing / Contribution

You may fork or reuse this specification under a permissive license. Contributions should follow the explicit model: one trap, one mock site, isolated logic.

All additions should maintain the same architectural clarity and testing utility.
