# Architecture Report

Generated at: 2026-06-28T17:02:18.395Z

## Repository Overview

- **Total Files Checked:** 2609
- **Layer Breakdown:**
  - Shared Utilities: 55 files
  - Games: 43 files
  - Orchard Engine Layer: 130 files
  - Modular Tools: 796 files
  - Root-Level Hub/Router: 114 files

## File Types Distribution

| Extension | Count |
|---|---|
| `(no ext)` | 22 |
| `.json` | 251 |
| `.md` | 274 |
| `.ts` | 138 |
| `.html` | 392 |
| `.py` | 278 |
| `.yaml` | 2 |
| `.txt` | 18 |
| `.sh` | 9 |
| `.tsx` | 29 |
| `.js` | 709 |
| `.css` | 20 |
| `.png` | 8 |
| `.webmanifest` | 1 |
| `.mjs` | 1 |
| `.bak_1778747819030` | 2 |
| `.bak_1778747950366` | 2 |
| `.cjs` | 3 |
| `.jpg` | 445 |
| `.svg` | 2 |
| `.patch` | 1 |
| `.toml` | 2 |

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
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/commerce/printbydd/gift-psychology.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/commerce/printbydd/gifts-that-mean-more.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/commerce/printbydd/keychain.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/commerce/printbydd/numberplate.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/commerce/printbydd/products.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/commerce (1)/printbydd/gift-psychology.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/commerce (1)/printbydd/gifts-that-mean-more.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/commerce (1)/printbydd/keychain.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/commerce (1)/printbydd/numberplate.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/commerce (1)/printbydd/products.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/index (1).html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/mars-game/mars-visual-v1.html`)
- Non-standard file structure: HTML entry points in tools should be named `index.html` (Found: `tools/mars-game (1)/mars-visual-v1.html`)

## Dependency Graph Map

```mermaid
graph TD
    "Highway-V2I dashboard simulation (1).html" --> "vd-nav-fix.js"
    "Highway-V2I dashboard simulation (1).html" --> "tool-registry.js"
    "Highway-V2I dashboard simulation (1).html" --> "engine-utils.js"
    "Highway-V2I dashboard simulation (1).html" --> "protocol-core.js"
    "Highway-V2I dashboard simulation (1).html" --> "protocol-evolution.js"
    "Highway-V2I dashboard simulation (1).html" --> "event-engine.js"
    "Highway-V2I dashboard simulation (1).html" --> "vehicle-engine.js"
    "Highway-V2I dashboard simulation (1).html" --> "data-calibration.js"
    "Highway-V2I dashboard simulation (1).html" --> "network-engine.js"
    "Highway-V2I dashboard simulation (1).html" --> "sensor-engine.js"
    "Highway-V2I dashboard simulation (1).html" --> "decision-graph.js"
    "Highway-V2I dashboard simulation (1).html" --> "protocol-genome.js"
    "Highway-V2I dashboard simulation (1).html" --> "protocol-evolution.js"
    "Highway-V2I dashboard simulation (1).html" --> "infrastructure-genome.js"
    "Highway-V2I dashboard simulation (1).html" --> "research-output.js"
    "Highway-V2I dashboard simulation (1).html" --> "lab-engine.js"
    "Highway-V2I dashboard simulation (1).html" --> "scenario-engine.js"
    "Highway-V2I dashboard simulation (1).html" --> "experiment-runner.js"
    "Highway-V2I dashboard simulation (1).html" --> "protocol-lab.js"
    "Highway-V2I dashboard simulation (1).html" --> "simulation.js"
    "Highway-V2I dashboard simulation.html" --> "vd-nav-fix.js"
    "Highway-V2I dashboard simulation.html" --> "tool-registry.js"
    "Highway-V2I dashboard simulation.html" --> "engine-utils.js"
    "Highway-V2I dashboard simulation.html" --> "protocol-core.js"
    "Highway-V2I dashboard simulation.html" --> "protocol-evolution.js"
    "Highway-V2I dashboard simulation.html" --> "event-engine.js"
    "Highway-V2I dashboard simulation.html" --> "vehicle-engine.js"
    "Highway-V2I dashboard simulation.html" --> "data-calibration.js"
    "Highway-V2I dashboard simulation.html" --> "network-engine.js"
    "Highway-V2I dashboard simulation.html" --> "sensor-engine.js"
    "Highway-V2I dashboard simulation.html" --> "decision-graph.js"
    "Highway-V2I dashboard simulation.html" --> "protocol-genome.js"
    "Highway-V2I dashboard simulation.html" --> "protocol-evolution.js"
    "Highway-V2I dashboard simulation.html" --> "infrastructure-genome.js"
    "Highway-V2I dashboard simulation.html" --> "research-output.js"
    "Highway-V2I dashboard simulation.html" --> "lab-engine.js"
    "Highway-V2I dashboard simulation.html" --> "scenario-engine.js"
    "Highway-V2I dashboard simulation.html" --> "experiment-runner.js"
    "Highway-V2I dashboard simulation.html" --> "protocol-lab.js"
    "Highway-V2I dashboard simulation.html" --> "simulation.js"
    "index.html" --> "config_env.js"
    "index.html" --> "vd-auth.js"
    "index.html" --> "vd-wallet.js"
    "index.html" --> "vd-auth.js"
    "index.html" --> "vd-wallet.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "viadecide-agent.js"
    "agent-builder.html" --> "agent-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "mission-runner (1).js" --> "scanner"
    "mission-runner (1).js" --> "planner"
    "mission-runner (1).js" --> "verifier"
    "mission-runner (1).js" --> "tracer"
    "mission-runner.js" --> "scanner"
    "mission-runner.js" --> "planner"
    "mission-runner.js" --> "verifier"
    "mission-runner.js" --> "tracer"
    "pr-consolidation-mission.js" --> "mission-runner"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-registry.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-registry.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-registry.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-registry.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "csv.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "csv.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-registry.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-registry.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "index.html" --> "config_env.js"
    "index.html" --> "vd-auth.js"
    "index.html" --> "vd-wallet.js"
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
    "tool.js" --> "tool-bus.js"
    "index.html" --> "config_env.js"
    "index.html" --> "vd-auth.js"
    "index.html" --> "vd-wallet.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "tool.js" --> "tool-bus.js"
    "engine-audit.js" --> "plugin.lifecycle.test"
    "engine-audit.js" --> "runtime.determinism.test"
    "engine-audit.js" --> "isolation.test"
    "engine-audit.js" --> "reporter"
    "isolation.test.js" --> "plugin-system"
    "plugin.lifecycle.test.js" --> "plugin-system"
    "runtime.determinism.test.js" --> "runtime"
    "engine-audit.js" --> "plugin.lifecycle.test"
    "engine-audit.js" --> "runtime.determinism.test"
    "engine-audit.js" --> "isolation.test"
    "engine-audit.js" --> "reporter"
    "isolation.test.js" --> "plugin-system"
    "plugin.lifecycle.test.js" --> "plugin-system"
    "runtime.determinism.test.js" --> "runtime"
    "scaffold-tool.js" --> "manifest-sync"
    "scaffold-tool.js" --> "manifest-sync"
    "pre-commit-check.js" --> "verification-engine"
    "pre-commit-check.js" --> "verification-engine"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "simulation-utils.js"
    "index.html" --> "engine-balance.js"
    "index.html" --> "tool-bridge.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "engine-utils.js"
    "index.html" --> "engine-models.js"
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
    "agent-manager.js" --> "plugin-system"
    "agent-manager.js" --> "runtime"
    "agent-manager.js" --> "agent-context"
    "plugin-system.js" --> "plugin-registry"
    "plugin-system.js" --> "trace-engine"
    "runtime.js" --> "scheduler"
    "runtime.js" --> "state-manager"
    "runtime.js" --> "trace-engine"
    "runtime.js" --> "state-machine"
    "state-machine.js" --> "state-registry"
    "trace-engine.js" --> "id"
    "trace-engine.js" --> "trace-store"
    "agent-manager.js" --> "plugin-system"
    "agent-manager.js" --> "runtime"
    "agent-manager.js" --> "agent-context"
    "plugin-system.js" --> "plugin-registry"
    "plugin-system.js" --> "trace-engine"
    "runtime.js" --> "scheduler"
    "runtime.js" --> "state-manager"
    "runtime.js" --> "trace-engine"
    "runtime.js" --> "state-machine"
    "state-machine.js" --> "state-registry"
    "trace-engine.js" --> "id"
    "trace-engine.js" --> "trace-store"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "navbar.js"
    "index.html" --> "header.js"
    "index.html" --> "sidebar.js"
    "index.html" --> "workspace.js"
    "index.html" --> "status.js"
    "index.html" --> "module-loader.js"
    "index.html" --> "command_palette.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "navbar.js"
    "index.html" --> "header.js"
    "index.html" --> "sidebar.js"
    "index.html" --> "workspace.js"
    "index.html" --> "status.js"
    "index.html" --> "module-loader.js"
    "index.html" --> "command_palette.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "environment-browser.js"
    "index.html" --> "simulation-console.js"
    "index.html" --> "editor-launcher.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "environment-browser.js"
    "index.html" --> "simulation-console.js"
    "index.html" --> "editor-launcher.js"
    "execution-console.html" --> "agent-storage.js"
    "execution-console.html" --> "tool-registry.js"
    "execution-console.html" --> "workflow-engine.js"
    "execution-console.html" --> "agent-runtime.js"
    "dsa-test-runner.js" --> "dsa-decision-engine"
    "dsa-test-runner.js" --> "dsa-decision-engine"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "map.js"
    "index.html" --> "player.js"
    "index.html" --> "world.js"
    "index.html" --> "game.js"
    "index.html" --> "map.js"
    "index.html" --> "player.js"
    "index.html" --> "world.js"
    "index.html" --> "game.js"
    "ai-simulation-studio.html" --> "vd-nav-fix.js"
    "ai-simulation-studio.html" --> "entity-manager.js"
    "ai-simulation-studio.html" --> "component-registry.js"
    "ai-simulation-studio.html" --> "system-runner.js"
    "ai-simulation-studio.html" --> "entity-system.js"
    "ai-simulation-studio.html" --> "simulation-loop.js"
    "ai-simulation-studio.html" --> "asset-loader.js"
    "ai-simulation-studio.html" --> "game-loader.js"
    "ai-simulation-studio.html" --> "ui-orchestrator.js"
    "ai-simulation-studio.html" --> "engine-core.js"
    "ai-simulation-studio.html" --> "environment-builder.js"
    "ai-simulation-studio.html" --> "game-scaffold-generator.js"
    "ai-simulation-studio.html" --> "simulation-generator.js"
    "ai-simulation-studio.html" --> "pipeline.js"
    "ai-simulation-studio.html" --> "simulation-api.js"
    "ai-simulation-studio.html" --> "terrain-generator.js"
    "ai-simulation-studio.html" --> "entity-system.js"
    "ai-simulation-studio.html" --> "ui-template.js"
    "ai-simulation-studio.html" --> "world-parser.js"
    "ai-simulation-studio.html" --> "world-template-selector.js"
    "ai-simulation-studio.html" --> "world-builder.js"
    "ai-simulation-studio.html" --> "world-registry.js"
    "ai-simulation-studio.html" --> "world-pipeline.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "game-loader.js"
    "index.html" --> "simulation-generator.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "entity-manager.js"
    "index.html" --> "component-registry.js"
    "index.html" --> "system-runner.js"
    "index.html" --> "entity-system.js"
    "index.html" --> "simulation-loop.js"
    "index.html" --> "asset-loader.js"
    "index.html" --> "game-loader.js"
    "index.html" --> "ui-orchestrator.js"
    "index.html" --> "engine-core.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "entity-manager.js"
    "index.html" --> "component-registry.js"
    "index.html" --> "system-runner.js"
    "index.html" --> "entity-system.js"
    "index.html" --> "simulation-loop.js"
    "index.html" --> "asset-loader.js"
    "index.html" --> "game-loader.js"
    "index.html" --> "ui-orchestrator.js"
    "index.html" --> "engine-core.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "entity-manager.js"
    "index.html" --> "component-registry.js"
    "index.html" --> "system-runner.js"
    "index.html" --> "entity-system.js"
    "index.html" --> "simulation-loop.js"
    "index.html" --> "asset-loader.js"
    "index.html" --> "game-loader.js"
    "index.html" --> "ui-orchestrator.js"
    "index.html" --> "engine-core.js"
    "ai-simulation-studio.html" --> "vd-nav-fix.js"
    "ai-simulation-studio.html" --> "entity-manager.js"
    "ai-simulation-studio.html" --> "component-registry.js"
    "ai-simulation-studio.html" --> "system-runner.js"
    "ai-simulation-studio.html" --> "entity-system.js"
    "ai-simulation-studio.html" --> "simulation-loop.js"
    "ai-simulation-studio.html" --> "asset-loader.js"
    "ai-simulation-studio.html" --> "game-loader.js"
    "ai-simulation-studio.html" --> "ui-orchestrator.js"
    "ai-simulation-studio.html" --> "engine-core.js"
    "ai-simulation-studio.html" --> "environment-builder.js"
    "ai-simulation-studio.html" --> "game-scaffold-generator.js"
    "ai-simulation-studio.html" --> "simulation-generator.js"
    "ai-simulation-studio.html" --> "pipeline.js"
    "ai-simulation-studio.html" --> "simulation-api.js"
    "ai-simulation-studio.html" --> "terrain-generator.js"
    "ai-simulation-studio.html" --> "entity-system.js"
    "ai-simulation-studio.html" --> "ui-template.js"
    "ai-simulation-studio.html" --> "world-parser.js"
    "ai-simulation-studio.html" --> "world-template-selector.js"
    "ai-simulation-studio.html" --> "world-builder.js"
    "ai-simulation-studio.html" --> "world-registry.js"
    "ai-simulation-studio.html" --> "world-pipeline.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "game-loader.js"
    "index.html" --> "simulation-generator.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "entity-manager.js"
    "index.html" --> "component-registry.js"
    "index.html" --> "system-runner.js"
    "index.html" --> "entity-system.js"
    "index.html" --> "simulation-loop.js"
    "index.html" --> "asset-loader.js"
    "index.html" --> "game-loader.js"
    "index.html" --> "ui-orchestrator.js"
    "index.html" --> "engine-core.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "entity-manager.js"
    "index.html" --> "component-registry.js"
    "index.html" --> "system-runner.js"
    "index.html" --> "entity-system.js"
    "index.html" --> "simulation-loop.js"
    "index.html" --> "asset-loader.js"
    "index.html" --> "game-loader.js"
    "index.html" --> "ui-orchestrator.js"
    "index.html" --> "engine-core.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "entity-manager.js"
    "index.html" --> "component-registry.js"
    "index.html" --> "system-runner.js"
    "index.html" --> "entity-system.js"
    "index.html" --> "simulation-loop.js"
    "index.html" --> "asset-loader.js"
    "index.html" --> "game-loader.js"
    "index.html" --> "ui-orchestrator.js"
    "index.html" --> "engine-core.js"
    "index.html" --> "config_env.js"
    "index.html" --> "tool-registry.js"
    "index.html" --> "vd-auth.js"
    "index.html" --> "router.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "agent-loop.js" --> "repo-scanner"
    "agent-loop.js" --> "improvement-planner"
    "agent-loop.js" --> "verification-engine"
    "agent-loop.js" --> "trace-writer"
    "agent-loop.js" --> "repo-scanner"
    "agent-loop.js" --> "improvement-planner"
    "agent-loop.js" --> "verification-engine"
    "agent-loop.js" --> "trace-writer"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-registry.js"
    "index.html" --> "tool-bridge.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "csv.js"
    "index.html" --> "vd-nav-fix.js"
    "run.js" --> "tools.smoke.js"
    "agent-manager (1).test.js" --> "agent-manager"
    "agent-manager (1).test.js" --> "example.agent"
    "agent-manager.test.js" --> "agent-manager"
    "agent-manager.test.js" --> "example.agent"
    "debug-executor (1).test.js" --> "debug-executor.js"
    "debug-executor.test.js" --> "debug-executor.js"
    "documentation-executor (1).test.js" --> "documentation-executor.js"
    "documentation-executor.test.js" --> "documentation-executor.js"
    "file-change-tracker (1).test.js" --> "file-change-tracker.js"
    "file-change-tracker.test.js" --> "file-change-tracker.js"
    "generator-executor (1).test.js" --> "generator-executor.js"
    "generator-executor.test.js" --> "generator-executor.js"
    "local-commit-executor (1).test.js" --> "local-commit-executor.js"
    "local-commit-executor.test.js" --> "local-commit-executor.js"
    "mars-hex-grid (1).test.js" --> "HexGrid.js"
    "mars-hex-grid (1).test.js" --> "TerrainGenerator.js"
    "mars-hex-grid.test.js" --> "HexGrid.js"
    "mars-hex-grid.test.js" --> "TerrainGenerator.js"
    "package-executor (1).test.js" --> "package-executor.js"
    "package-executor.test.js" --> "package-executor.js"
    "pea-runner (1).test.js" --> "pea-runner.js"
    "pea-runner.test.js" --> "pea-runner.js"
    "plugin-system (1).test.js" --> "plugin-system"
    "plugin-system (1).test.js" --> "example.plugin"
    "plugin-system.test.js" --> "plugin-system"
    "plugin-system.test.js" --> "example.plugin"
    "refactor-executor (1).test.js" --> "refactor-executor.js"
    "refactor-executor.test.js" --> "refactor-executor.js"
    "runtime (1).test.js" --> "runtime"
    "runtime.test.js" --> "runtime"
    "security-scan-executor (1).test.js" --> "security-scan-executor.js"
    "security-scan-executor.test.js" --> "security-scan-executor.js"
    "smoke-tools (1).test.js" --> "tools.smoke.js"
    "smoke-tools.test.js" --> "tools.smoke.js"
    "state-registry (1).test.js" --> "state-registry"
    "state-registry.test.js" --> "state-registry"
    "tool-task-router (1).test.js" --> "tool-task-router.js"
    "tool-task-router.test.js" --> "tool-task-router.js"
    "trace-engine (1).test.js" --> "trace-engine"
    "trace-engine.test.js" --> "trace-engine"
    "validate-task-manifest (1).test.js" --> "validate-task-manifest.js"
    "validate-task-manifest.test.js" --> "validate-task-manifest.js"
    "validation-executor (1).test.js" --> "validation-executor.js"
    "validation-executor.test.js" --> "validation-executor.js"
    "zayvora-constraint-runtime (1).test.js" --> "experiment-registry"
    "zayvora-constraint-runtime (1).test.js" --> "replay-recorder"
    "zayvora-constraint-runtime (1).test.js" --> "artifact-capture"
    "zayvora-constraint-runtime.test.js" --> "experiment-registry"
    "zayvora-constraint-runtime.test.js" --> "replay-recorder"
    "zayvora-constraint-runtime.test.js" --> "artifact-capture"
    "zayvora-constraints-phase2-4 (1).test.js" --> "visual-constraints"
    "zayvora-constraints-phase2-4 (1).test.js" --> "interaction-constraints"
    "zayvora-constraints-phase2-4 (1).test.js" --> "replay-validator"
    "zayvora-constraints-phase2-4 (1).test.js" --> "reflection-bridge"
    "zayvora-constraints-phase2-4.test.js" --> "visual-constraints"
    "zayvora-constraints-phase2-4.test.js" --> "interaction-constraints"
    "zayvora-constraints-phase2-4.test.js" --> "replay-validator"
    "zayvora-constraints-phase2-4.test.js" --> "reflection-bridge"
    "zayvora-pipeline-scaffold (1).test.js" --> "zayvora-pipeline.js"
    "zayvora-pipeline-scaffold.test.js" --> "zayvora-pipeline.js"
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
    "index (1).html" --> "vd-nav-fix.js"
    "index (1).html" --> "navbar.js"
    "index (1).html" --> "header.js"
    "index (1).html" --> "sidebar.js"
    "index (1).html" --> "workspace.js"
    "index (1).html" --> "status.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "navbar.js"
    "index.html" --> "header.js"
    "index.html" --> "sidebar.js"
    "index.html" --> "workspace.js"
    "index.html" --> "status.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "index.js"
    "index.html" --> "csv.js"
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
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "tool-storage.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "vd-nav-fix.js"
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
    "index.html" --> "vd-nav-fix.js"
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
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "navbar.js"
    "index.html" --> "header.js"
    "index.html" --> "sidebar.js"
    "index.html" --> "workspace.js"
    "index.html" --> "status.js"
    "index.html" --> "session.js"
    "index.html" --> "vd-nav-fix.js"
    "index.html" --> "navbar.js"
    "index.html" --> "header.js"
    "index.html" --> "sidebar.js"
    "index.html" --> "workspace.js"
    "index.html" --> "status.js"
    "index.html" --> "session.js"
```
