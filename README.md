# Respectech-HR Academy Platform 🚀

[![Brand Color](https://img.shields.io/badge/Brand-Respectech%20Red%20%26%20White-D92D20)](file:///d:/All%20Together/IT/Projects/Project%20with%20Respectech/RHR-Academy/assets/css/styles.css)
[![Cohort Status](https://img.shields.io/badge/Cohort%20Session-Cohort%206-brightgreen)](file:///d:/All%20Together/IT/Projects/Project%20with%20Respectech/RHR-Academy/index.html)
[![Admissions Status](https://img.shields.io/badge/Admissions-Cohort%207%20Open-D92D20)](file:///d:/All%20Together/IT/Projects/Project%20with%20Respectech/RHR-Academy/screening.html)

**Respectech-HR Academy (R-HR)** is a premier technology training institution based in Abuja, Nigeria, dedicated to bridging the digital skills gap and connecting African tech talents directly with global remote and local career opportunities.

---

## 🌟 Key Platform Features

### 🎨 Brand Red & White Design System
* **Official Palette**: Built with Respectech Red (`#D92D20`), pure white surfaces (`#FFFFFF`), slate dark headings (`#0F172A`), and rose accent tints (`#FEF2F2`).
* **Typography**: Powered by Google Fonts (**Plus Jakarta Sans** for headlines & **Inter** for body text) and **FontAwesome 6** vector icons.
* **Glassmorphic Sticky Navbar**: Responsive navigation with animated link underlines, dropdown menus, and mobile drawer hamburger menu.

### ⚡ Core Functional Modules
1. **Cohort 6 & 7 Admissions Portal**:
   - Live top announcement bar for Cohort 6 session & Cohort 7 applications.
   - Interactive Cohort 7 application modal generating formatted **Applicant IDs** (e.g. `RHR-APP-9482`).
2. **Candidate Baseline Screening Quiz (`screening.html`)**:
   - 10-minute online assessment evaluating logical reasoning, problem-solving, tech fundamentals, and weekly schedule commitment.
   - Auto-computes candidate score percentage (e.g. `80% - RECOMMENDED FOR ACCEPTANCE`) and records results for admissions team review.
3. **Phase 1 Transactional Email Dispatch**:
   - Automated candidate confirmation emails and admissions alert emails dispatched to `dexterdavid835@gmail.com` via **EmailJS API**.
4. **Graduate Certificate Verification Engine**:
   - Instant credential verification lookup with sample test IDs (`RHR-C6-001`, `RHR-C5-102`, `RHR-C4-089`).
5. **Filterable Talent Directory (`Respectechies/techies.html`)**:
   - Interactive fellow directory showcasing Cohorts 1 through 6 with live search (by name, skill, role) and cohort filter tabs.
6. **Regional Unemployment & Impact Dashboard (`Unemployment Statistics/unemployment.html`)**:
   - Data metrics for Nigeria, Ghana, Togo, and Cameroon with animated progress bars illustrating Respectech's 94% graduate placement solution.
7. **Interactive Onboarding Portal (`onboarding/onboard.html`)**:
   - 3-step registration wizard with role persona selection (Student, Employer/Recruiter, Tech Mentor).

---

## 📁 Repository Structure

```
RHR-Academy/
├── assets/
│   ├── css/
│   │   └── styles.css         # Unified Red & White Global Design System
│   ├── js/
│   │   └── main.js            # Core interactive logic, modals, toast alerts & EmailJS dispatch
│   └── images/                # Campus photos, graduate avatars & logos
├── About Us/
│   ├── about_us.html          # Mission, vision, core values, leadership team & corporate partners
│   └── images/                # Leadership team photos & partner logos
├── Contact/
│   └── contact.html           # Contact info cards, interactive form & embedded Google Map
├── Respectechies/
│   └── techies.html           # Fellow directory with live search & Cohort 1-6 filter tabs
├── Unemployment Statistics/
│   └── unemployment.html      # African youth unemployment metrics & R-HR solution stats
├── onboarding/
│   └── onboard.html           # 3-step onboarding wizard with persona selector
├── index.html                 # Homepage with hero, news ticker, track explorer & modals
├── screening.html             # Candidate Baseline Assessment & auto-scoring quiz portal
└── README.md                  # Comprehensive project documentation
```

---

## 🛠️ Technology Stack

* **Core**: HTML5, Vanilla JavaScript (ES6+), CSS3 (Custom Properties, Flexbox, CSS Grid)
* **Design & Icons**: Google Fonts (*Plus Jakarta Sans* & *Inter*), FontAwesome 6
* **Email & Integrations**: EmailJS SDK API
* **State & Storage**: LocalStorage Persistence & System Toast Alerts

---

## 🗺️ Multi-Phase Platform Architecture Roadmap

We are executing this project phase-by-phase:

- [x] **Phase 1: Transactional Email Integration & Candidate Screening Quiz** *(Completed)*
- [ ] **Phase 2: Database (Supabase/Firebase) & User Authentication Setup** *(Next Phase)*
- [ ] **Phase 3: Student & Fellow Portal (LMS, Progress Tracker & Capstone Uploads)**
- [ ] **Phase 4: Admin & Tutor Management Dashboard (Admissions Approval Center)**
- [ ] **Phase 5: Automated Certificate Generation Engine & Employer Showcase (`/showcase`)**
- [ ] **Phase 6: Final Security Audit, QA Testing & Production Deployment**

---

## 🚀 Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Teetwothefirst/RHR-Academy.git
   cd RHR-Academy
   ```

2. **Run Locally**:
   Open `index.html` in any modern web browser or use VS Code Live Server.

3. **Push Updates**:
   ```bash
   git add .
   git commit -m "Update project documentation"
   git push origin main
   ```

---

## 📧 Admissions & Contact

* **Campus Address**: Respectech Centre, 24 Bambari Cres. Fairtrade Business Complex, Wuse Zone 7, Abuja, Nigeria
* **Admissions Email**: `dexterdavid835@gmail.com`
* **Official Website**: `www.respectech-hr.com`

*© 2026 Respectech-HR Academy. All Rights Reserved.*
