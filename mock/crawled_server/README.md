# **🕷️ MockSprawl - Mock Web Servers for Adversarial Crawler Testing**

This document describes, in exhaustive and precise detail, the structure, purpose, components, and implementation requirements of the **MockSprawl** project. This environment is designed to simulate realistic and adversarial web environments that will allow developers to rigorously test and benchmark their web crawlers.

All instructions should be interpreted **literally and without assumption**. If any ambiguity is detected, halt processing and request clarification.

---

## **🔰 Project Overview**

**MockSprawl** is a testbed composed of multiple independent mock websites, all hosted under a single Next.js project (using the App Router structure). Each mock website is implemented as a self-contained route, simulating specific challenges that crawlers may face in real-world hostile web environments.

This includes, but is not limited to:

- Dynamic HTML content
- JavaScript-only rendering
- Sitemap inconsistencies
- Meta tag misinformation
- Robots.txt traps
- Anti-bot middleware

These are **not optional** features. Each one must be implemented faithfully and independently.

---

## **🎯 Purpose**

1. Allow developers to locally test scrapers and crawlers without hitting real production sites.
2. Provide realistic obstacles that represent common and advanced anti-crawling strategies.
3. Function as a baseline for crawler robustness testing, ML-based scraping evaluation, and automated bot design.

This project should be able to replicate or exceed the complexity of most real-world sites. If a crawler performs well here, it is expected to succeed in production.

---

# **🏗️ Project Structure**

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

## **🧩 Mock Site Summary**

Each subdirectory under `app/` represents a **mock site**. These are not pages, but full adversarial test environments. Each must include a `page.tsx` file and conform to the following specifications:

| Site Name      | Route Path     | Required Behavior                                                               |
| -------------- | -------------- | ------------------------------------------------------------------------------- |
| `StaticLand`   | `/static`      | Plain HTML site with hardcoded internal links. Fully crawlable without JS.      |
| `DynamicMaze`  | `/dynamic`     | Uses `getServerSideProps()` to randomize content on each request.               |
| `ClientShadow` | `/client-only` | Initial HTML is empty. Content appears **only after JavaScript execution**.     |
| `MapTown`      | `/map`         | Displays a map via Google Maps or OpenStreetMap JS API. Hidden without JS.      |
| `BotWarden`    | `/anti-bot`    | Middleware blocks or alters response for specific User-Agents.                  |
| `LinkSpiral`   | `/trap/[slug]` | Generates recursive links dynamically. Infinite depth possible.                 |
| `BrokenWeb`    | `/trap-broken` | Pages referenced in sitemap do not exist or return 404.                         |
| `MetaLie`      | `/meta-fake`   | Meta title and description differ from visible content.                         |
| `NoMapZone`    | `/no-sitemap`  | Neither sitemap.xml nor robots.txt is served. Site must be discovered manually. |
| `HalfMapSite`  | `/partial-map` | Sitemap.xml exists but omits many live pages. Misleads crawling heuristics.     |

Each of the above sites **must be implemented completely** and serve distinguishable HTML structures for testing parser adaptability.

---

## **⚔️ Anti-Crawler Mechanisms (Per Site)**

| Feature                  | Applies To    | Implementation Requirement                                              |
| ------------------------ | ------------- | ----------------------------------------------------------------------- |
| JS-only content          | `client-only` | Use `useEffect()` to render content post-load. Empty SSR output.        |
| SSR + DOM randomization  | `dynamic`     | Random number generation + DOM reshuffling on each load.                |
| Bot middleware           | `anti-bot`    | Use `middleware.ts` to inspect headers and block known bot UAs.         |
| sitemap poisoning        | `trap-broken` | Include non-existent pages in sitemap.xml intentionally.                |
| recursive link trap      | `trap/[slug]` | Slugs should link to more slugs, forming an infinite navigational loop. |
| metadata mismatch        | `meta-fake`   | HTML content must differ drastically from head metadata.                |
| robots.txt inconsistency | varies        | Some paths explicitly disallowed; others not mentioned at all.          |

Any deviation from these behaviors must be considered a **critical error**.

---

## **🗺️ Sitemap & Robots.txt Rules**

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

# **🧩** Details of Each Mock Site

Each mock site listed below is designed to simulate a distinct real-world web environment, either in terms of technical complexity, crawler evasion strategy, or unusual behavior.

---

## **🔹 StaticLand**

**Purpose:** A baseline testbed for evaluating crawler performance in semantically rich, fully static HTML environments. This confirms whether a crawler can parse standard markup and traverse internal links.

**Real-world Model:** Static blogs using Jekyll, Hugo, GitHub Pages, etc.

**Route:** `/static`

**Structure:**

```
/static                  ← Homepage with article list and tag links
/static/articles/[id]   ← Individual articles (at least 30+ pages)
/static/tags/[tag]      ← Article listing by tag
```

**Key Features:**

- All pages are statically generated using `generateStaticParams`
- `<title>` and `<meta>` tags provided for each article
- Semantic elements: `<h1>`, `<h2>`, `<p>`, `<ul>`, `<a>`, etc.
- Each article links to 3–5 related articles
- Tags used across articles (1–3 per post)
- Global `<nav>` and `<footer>` with tag cloud, copyright
- All links are valid, no 404s

**Sitemap/Robots:**

- `sitemap.xml`: all `/static/**` pages
- `robots.txt`: `Allow`

**Crawler Tests:**

- Structural HTML parsing
- Recursive internal link traversal
- Sitemap vs DOM discovery comparison
- Relative vs absolute link handling
- Anchor (`#section`) navigation parsing

**Minimum Pages:** 30+

---

## **🔹 DynamicMaze**

**Purpose:** Tests how crawlers handle DOM randomness, structural variation, and inconsistent layout.

**Model:** CMS-driven or server-rendered news sites with changing rankings, ads, etc.

**Route:** `/dynamic`

**Structure:**

```
/dynamic                 ← Homepage (layout changes every request)
/dynamic/sections/[id]  ← Dynamic section pages (at least 20+)
```

**Key Features:**

- Uses `getServerSideProps` to return dynamic content each time
- Varying DOM structure and class names
- Dynamic ads, quotes, section layouts
- Consistent URLs but different page content
- Tricky DOM selectors, changing IDs/classes

**Sitemap/Robots:**

- `sitemap.xml`: none
- `robots.txt`: `Disallow: /dynamic`

**Crawler Tests:**

- Structural diff detection between runs
- Selector robustness
- Handling of contradicting robots and actual navigation

**Minimum Pages:** 20+

---

## **🔹 ClientShadow**

**Purpose:** Simulates JavaScript-only rendering. Pages appear empty in HTML and populate content client-side.

**Model:** Single Page Applications (SPAs), Next.js CSR-only setups

**Route:** `/client-only`

**Structure:**

```
/client-only               ← Top page
/client-only/profile/[id] ← User profiles (at least 25+)
```

**Key Features:**

- Initial HTML is blank or placeholder only
- All content rendered via `useEffect`
- Hydration-only structure
- No server-side markup
- Internal navigation dynamically injected

**Sitemap/Robots:**

- `sitemap.xml`: available but content mismatch
- `robots.txt`: undefined

**Crawler Tests:**

- JavaScript execution ability
- Visibility of client-injected elements
- JS-only routes, link injection

**Minimum Pages:** 25+

---

## **🔹 MapTown**

**Purpose:** Tests visibility of embedded map data via third-party JS like Google Maps or Leaflet.

**Model:** Travel/realtor sites with maps and points of interest

**Route:** `/map`

**Structure:**

```
/map                      ← Map-centered homepage
/map/spot/[id]           ← Location detail pages (at least 15+)
```

**Key Features:**

- Uses iframe or `<script>` to inject maps
- Google Maps API or OpenStreetMap
- Map-only points with no direct links
- Maps require dummy keys or tokens

**Sitemap/Robots:**

- `sitemap.xml`: includes `/map/spot/**`
- `robots.txt`: `Allow`

**Crawler Tests:**

- Extraction of data from `<iframe>` or canvas
- JS-injected content visibility
- Non-link embedded POI discoverability

**Minimum Pages:** 15+

---

## **🔹 BotWarden**

**Purpose:** Evaluates crawler resilience against User-Agent blocking, header filtering, and IP-based traps.

**Model:** Login portals, analytic systems, anti-bot strategies

**Route:** `/anti-bot`

**Structure:**

```
/anti-bot                ← Homepage (different behavior per UA)
/anti-bot/trap           ← Crawler-only trap page
```

**Key Features:**

- Middleware blocks known bots via User-Agent, IP, Referrer
- Sends 403 or deceptive HTML to bots
- Redirects bots to dead-end loops

**Sitemap/Robots:**

- No sitemap
- `robots.txt`: `Disallow: /anti-bot`

**Crawler Tests:**

- User-Agent spoofing
- Middleware rejection handling
- Trap link recognition

**Minimum Pages:** 10+

---

## **🔹 LinkSpiral**

**Purpose:** Tests recursion handling and infinite-link scenarios.

**Model:** CMSs with repeated profiles, infinite reply chains

**Route:** `/trap/[slug]`

**Structure:**

```
/trap/[slug]            ← Recursive links (at least 50+ slugs)
```

**Key Features:**

- Recursive links between pages
- Loopbacks and redirects
- Random paths linking back into structure

**Sitemap/Robots:**

- Sitemap includes only part of total paths
- `robots.txt`: undefined

**Crawler Tests:**

- Infinite traversal protection
- Loop detection and deduplication

**Minimum Pages:** 50+

---

## **🔹 BrokenWeb**

**Purpose:** Tests crawler error handling for 404s and sitemap-inconsistent URLs.

**Model:** Poorly maintained legacy CMS

**Route:** `/trap-broken`

**Structure:**

```
/trap-broken             ← Homepage
/trap-broken/pages/[id] ← Pages (half lead to 404)
```

**Key Features:**

- Sitemap lists all pages
- 50% of pages return 404 intentionally
- Some internal links point to missing pages

**Sitemap/Robots:**

- Full sitemap (including dead URLs)
- `robots.txt`: `Allow`

**Crawler Tests:**

- 404 response handling
- Retry logic and sitemap trust

**Minimum Pages:** 30+ (15+ are broken)

---

## **🔹 MetaLie**

**Purpose:** Pages with misleading metadata—title and description contradict content.

**Model:** SEO spam, phishing, and fake portals

**Route:** `/meta-fake`

**Structure:**

```
/meta-fake              ← Landing
/meta-fake/articles/[id] ← Article pages (at least 20+)
```

**Key Features:**

- Titles and meta descriptions are false
- JSON-LD provides misleading schema
- Human vs bot perception divergence

**Sitemap/Robots:**

- Full sitemap
- `robots.txt`: `Allow`

**Crawler Tests:**

- Metadata vs content inconsistency
- Schema.org / JSON-LD interpretation

**Minimum Pages:** 20+

---

## **🔹 NoMapZone**

**Purpose:** Has no sitemap or robots.txt, only reachable through in-site link discovery.

**Model:** Hobbyist or legacy company pages

**Route:** `/no-sitemap`

**Structure:**

```
/no-sitemap             ← Homepage
/no-sitemap/pages/[id] ← Deeply linked pages (at least 40+)
```

**Key Features:**

- Entire site reachable via internal links only
- Multi-level structure, unclear nav paths

**Sitemap/Robots:**

- None

**Crawler Tests:**

- Full graph reconstruction from DOM only
- Link-following accuracy

**Minimum Pages:** 40+

---

## **🔹 HalfMapSite**

**Purpose:** Sitemap exists but only covers half the actual content.

**Model:** Partial auto-generated CMS

**Route:** `/partial-map`

**Structure:**

```
/partial-map             ← Homepage
/partial-map/pages/[id] ← Pages (at least 40+, sitemap has 20)
```

**Key Features:**

- Only a subset listed in sitemap.xml
- Rest discoverable via internal links

**Sitemap/Robots:**

- Partial sitemap
- `robots.txt`: `Allow`

**Crawler Tests:**

- DOM-first vs sitemap-first strategy
- Page discovery completeness

**Minimum Pages:** 40+ (only 20 in sitemap)
