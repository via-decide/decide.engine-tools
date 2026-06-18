# Architecture Report

Generated at: 2026-06-09T00:21:04.303Z

## Repository Overview

- **Total Files Checked:** 1134
- **Layer Breakdown:**
  - Shared Utilities: 42 files
  - Games: 41 files
  - Orchard Engine Layer: 116 files
  - Modular Tools: 739 files
  - Root-Level Hub/Router: 61 files

## File Types Distribution

| Extension | Count |
|---|---|
| `(no ext)` | 12 |
| `.md` | 50 |
| `.json` | 112 |
| `.ts` | 14 |
| `.html` | 268 |
| `.js` | 190 |
| `.css` | 12 |
| `.webmanifest` | 1 |
| `.sh` | 3 |
| `.mjs` | 1 |
| `.bak_1778747819030` | 1 |
| `.bak_1778747950366` | 1 |
| `.txt` | 14 |
| `.cjs` | 3 |
| `.jpg` | 445 |
| `.tsx` | 2 |
| `.png` | 2 |
| `.svg` | 2 |
| `.patch` | 1 |

## Modular Naming Conventions & Boundaries

⚠️ **Boundary & naming alerts detected:**

- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/aaradhana-hospitality.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/accurate-search-consultants-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/acme-computing-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/adarsh-nivasi-sala-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/anchor-rahul-budhani.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/apna-adda-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/arkay-hr-consultancy-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/bdh-party-lawns-shinay.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/bhagwati-travels-gandhidham.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/bharat-hr-solutions.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/bhavin-patadiya-photography-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/bhimratna-samras-hostel-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/bholenath-enterprise-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/bhujodi-kala-cotton-bhujodi.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/bird-eye-production-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/chat-ka-chaska.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/cheesy-events-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/chheda-decorators-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/codelyhut-infotech-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/codteg-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/de-mayra-collections.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/deep-koradia-associates-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/deepak-plumber-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/diamond-pg-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/dishaa-consultancy.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/ditya-events-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/dpt-exhibition-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/drashya-glamour-studio.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/dreamland-placement-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/ekankotri-shinay.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/etrnity-solutions-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/executive-ship-management-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/gems-hairs-studio-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/gokul-dairy-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/great-peripherals-gandhidham.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/hari-om-electric-ac-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/honest-restaurant-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/hotel-shiv-international-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/jalaram-digital-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/jb-photo-studio-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/jitendra-thacker-associates-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/jp-kheradia-construction-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/keshav-hair-art-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/khavda-events-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/kishan-hair-art-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/kmg-co-llp-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/kpt-co-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/kutch-handicrafts-arts-bhujodi.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/lady-point-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/laxmi-medical-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/madhav-hardware-shinay.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/mahalaxmi-hardware-nakhatrana.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/maheshwari-sweets-mandvi.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/maniifest-hr-consultancy.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/matka-house-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/matrix-salon-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/mehran-plumbing-services-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/metro-hair-beauty-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/mitesh-house-maintenance-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/mk-soft-service-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/navkar-events-shinay.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/neelkanth-hardware-nakhatrana.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/nilesh-buch-associates.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/nr-infotech-gandhidham.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/odhani-studio-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/odhni-ranis-boutique-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/om-print-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/pandit-vora-associates-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/paresh-hadiya-associates-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/patel-plumber-works.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/patidar-guest-house-nakhatrana.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/pink-daisy-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/poonam-beauty-care-mandvi.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/pragati-girls-pg.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/prajapati-chhatralaya-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/pravin-maheshwari-plumber-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/prince-hardware-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/radha-krishna-jewellers-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/rajhansh-enterprise-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/ramada-wyndham-shinay.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/rb-enterprise-pg-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/rd-creation-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/rightfithr-solutions-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/rj-mehta-co.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/sahara-photo-video-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/salon-2-gandhidham.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/samakhalyi-mahajan-wadi-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/sanju-software-developer-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/seven-sky-clarks-exotica-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/shadofax-technologies.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/shiv-fabrication-shinay.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/shiv-regency-gandhidham.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/shiv-sanket-shinay.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/shiv-shakti-construction-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/shree-ganesh-photos.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/shree-ram-hardware-sinay.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/shree-umiya-timber-gandhidham.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/shree-vishwakarma-hardware-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/shreeji-tech-hub-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/shreeji-vada-pav-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/siddharth-mehta-ca-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/skyline-softech-bhujpur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/skywings-gandhidham.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/snap-and-shoot-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/star-sound-dj-lights-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/sumit-collection-shinay.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/suresh-h-thacker-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/suvidha-pg.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/sweet-home-hostel-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/the-fab-tales-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/time-square-resort-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/tongue-twister-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/trylo-inner-luxury.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/uma-enterprise-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/uma-enterprise-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/urdhvaga-consultancy-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/veeha-boutique-mandvi.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/vidhus-treat-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/vikas-auto-garage-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/vinay-manpower-consultant-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/vinod-electrical-solutions.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/visanjhi-enterprise-shinay.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/vishnu-paints-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/welcome-tea-house-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/wellisa-salon-adipur.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/white-hair-care-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/wrteam-bhuj.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/yasu-family-salon-anjar.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/yogita-s-and-company-bhachau.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/sites/yuva-sharthi-pg.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/templates/accommodation.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/templates/business-site.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/templates/business.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/templates/creative.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/templates/education.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/templates/finance.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/templates/food.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/templates/health.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/templates/it.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/templates/retail.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/templates/salon.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/templates/services.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/business/kutch-map/templates/tech.html`)

## Dependency Graph Map

```mermaid
graph TD
    "index.html" --> "config_env.js"
    "index.html" --> "vd-auth.js"
    "index.html" --> "vd-wallet.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "viadecide-agent.js"
    "agent-builder.html" --> "agent-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "scaffold-tool.js" --> "manifest-sync"
    "pre-commit-check.js" --> "verification-engine"
    "mission-runner.js" --> "scanner"
    "mission-runner.js" --> "planner"
    "mission-runner.js" --> "verifier"
    "mission-runner.js" --> "tracer"
    "index.html" --> "vd-nav-fix.js"
    "execution-console.html" --> "agent-storage.js"
    "execution-console.html" --> "tool-registry.js"
    "execution-console.html" --> "workflow-engine.js"
    "execution-console.html" --> "agent-runtime.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "config_env.js"
    "index.html" --> "tool-registry.js"
    "index.html" --> "vd-auth.js"
    "index.html" --> "router.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-registry.js"
    "index.html" --> "tool-bridge.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "csv.js"
    "index.html" --> "vd-nav-fix.js"
    "run.js" --> "tools.smoke.js"
    "smoke-tools.test.js" --> "tools.smoke.js"
    "tool-graph.html" --> "tool-registry.js"
    "tool-graph.html" --> "agent-storage.js"
    "tool-graph.html" --> "tool-graph.js"
    "tool-registry.html" --> "tool-registry.js"
    "tool-router.html" --> "_shared-utils.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-registry.js"
    "index.html" --> "config_env.js"
    "index.html" --> "vd-auth.js"
    "index.html" --> "search.js"
    "index.html" --> "claim.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "reward-wallet.js"
    "index.html" --> "growth-stage-engine.js"
    "index.html" --> "season-engine.js"
    "index.html" --> "tool-bridge.js"
    "index.html" --> "vd-wallet.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "simulation-utils.js"
    "index.html" --> "engine-balance.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "growth-stage-engine.js"
    "index.html" --> "reward-wallet.js"
    "index.html" --> "season-engine.js"
    "index.html" --> "vd-wallet.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "simulation-utils.js"
    "index.html" --> "engine-balance.js"
    "index.html" --> "tool-bridge.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "swipe-engine.js"
    "index.html" --> "growth-stage-engine.js"
    "index.html" --> "reward-wallet.js"
    "index.html" --> "vd-wallet.js"
    "index.html" --> "tool-bridge.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "terminal-logger.js"
    "index.html" --> "glass-modal.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "simulation-utils.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "simulation-utils.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-wallet.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-balance.js"
    "index.html" --> "tool-bridge.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-wallet.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
    "index.html" --> "tool-bridge.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "config_env.js"
    "app.js" --> "state.js"
    "app.js" --> "ui.js"
    "app.js" --> "missionEngine.js"
    "app.js" --> "leaderboard.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-wallet.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-auth.js"
    "index.html" --> "vd-wallet.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-wallet.js"
    "index.html" --> "tool-bridge.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "index.js"
    "index.html" --> "csv.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "csv.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-registry.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-registry.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "main-ui.js" --> "tool-registry.js"
    "main-ui.js" --> "router.js"
    "main-ui.js" --> "shell-parts.js"
    "main-ui.js" --> "hero.js"
    "main-ui.js" --> "creators.js"
    "main-ui.js" --> "builders.js"
    "main-ui.js" --> "research.js"
    "main-ui.js" --> "business.js"
    "main-ui.js" --> "orchard.js"
    "main-ui.js" --> "games.js"
    "main-ui.js" --> "mars.js"
    "main-ui.js" --> "mission.js"
    "main-ui.js" --> "all-tools.js"
    "builders.js" --> "grid-layout.js"
    "builders.js" --> "section-header.js"
    "builders.js" --> "tool-card.js"
    "business.js" --> "grid-layout.js"
    "business.js" --> "section-header.js"
    "business.js" --> "tool-card.js"
    "creators.js" --> "featured-card.js"
    "creators.js" --> "grid-layout.js"
    "creators.js" --> "section-header.js"
    "creators.js" --> "tool-card.js"
    "render-sections.js" --> "builders.js"
    "render-sections.js" --> "business.js"
    "render-sections.js" --> "creators.js"
    "render-sections.js" --> "games.js"
    "render-sections.js" --> "research.js"
    "research.js" --> "grid-layout.js"
    "research.js" --> "section-header.js"
    "research.js" --> "tool-card.js"
    "index.html" --> "vd-nav-fix.js"
    "workflow-builder.html" --> "tool-registry.js"
    "workflow-builder.html" --> "workflow-engine.js"
    "workflow-builder.html" --> "workflow-storage.js"
    "workflow-builder.html" --> "agent-storage.js"
    "workflow-builder.html" --> "agent-runtime.js"
    "workflow-builder.html" --> "agent-layer.js"
    "workflow-builder.html" --> "workflow-ui.js"
```
