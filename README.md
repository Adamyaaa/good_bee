# GOOD BEE — 100% Natural Skincare Platform & Multi-Role Ecosystem

> **Brand Positioning:** Good Bee is a 100% Natural Skincare products manufacturing company that develops pure botanical formulations after high-end active-stabilization research.

---

## 🌟 Architecture & Implementation Summary

Good Bee is designed as a luxury prestige storefront seamlessly unified with a multi-tier commerce ecosystem supporting **Customers, Producers/Labs, Dealers, Promoters, and Administrators**.

### 1. Dual-Engine UX Paradigm
- **Public Storefront (`http://localhost:3000`)**: Refined warm ivory (`#FAF7F2`) and champagne gold palette (`#C5A880`), editorial typography (*Cormorant Garamond* & *Plus Jakarta Sans*), subtle SVG bee flight trails, scrollytelling *"The Pure Cycle"*, diagnostic concern filtering, and frictionless bag checkout.
- **Enterprise Control Tower (`/admin`)**: Efficient, data-dense slate darkroom interface for reviewing quarantined producer formulation submissions, inventory matrix adjustments, configurable rules engine, and gateway configurations.

---

## 🚀 Live Services & Portals

| Service / Portal | URL | Description |
| :--- | :--- | :--- |
| **Public Storefront** | `http://localhost:3000/` | Immersive scrollytelling, catalog, concerns, bag, checkout |
| **Backend REST API** | `http://localhost:5000/` | Express API, JWT auth, dynamic QR engine, WhatsApp layer |
| **Universal Portal Sign-In** | `http://localhost:3000/portal/login` | Instant 1-click role switcher for live demoing |
| **Admin Control Tower** | Access via Sign In (`admin@goodbee.com`) | Approvals, inventory, rules engine, QR/WhatsApp config |
| **Producer & Lab Studio** | Access via Sign In (`producer@goodbee.com`) | Draft, submit formulations, batch docs, approval status |
| **Dealer Wholesale Desk** | Access via Sign In (`dealer@goodbee.com`) | B2B catalog, configurable margins, wholesale POs |
| **Promoter Studio** | Access via Sign In (`promoter@goodbee.com`) | Unique affiliate tracking links, promo codes, commissions |
| **Customer Dashboard** | Access via Sign In (`customer@goodbee.com`) | Order tracking, address book, Bee-Coin loyalty rewards |

---

## 🔑 Pre-Configured Test Credentials

| Role | Email | Password | Primary Capability |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@goodbee.com` | `admin` | Full platform control, approve/reject submissions, rules engine |
| **Producer / Lab** | `producer@goodbee.com` | `producer` | Submit new formulations (quarantined until admin approval) |
| **Dealer / Wholesale** | `dealer@goodbee.com` | `dealer` | Wholesale ordering with 18% margin |
| **Promoter / Affiliate** | `promoter@goodbee.com` | `promoter` | 12% commission tracking with referral code `ELENA10` |
| **Patron / Customer** | `customer@goodbee.com` | `customer` | Order history, 340 Bee-Coin loyalty balance |

---

## ⚡ Core Technical Features Implemented

### 1. Quarantined Producer Approval Workflow
- Producer drafts and submits formulation with botanical actives, batch specs, volume, and pricing.
- Submission is immediately locked into `PENDING_REVIEW` and **completely hidden** from public storefront.
- Admin reviews in the Control Tower with one-click **[Approve & Publish]** or **[Reject with Note]**.
- Upon approval, the formulation is converted into an active, published SKU in the Good Bee catalog.

### 2. Dynamic Payment QR (Bill-to-QR)
- Compliant with NPCI UPI standard (`upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...&tr=...`).
- Generates a custom high-definition vector QR dynamically matched to the exact final cart invoice amount.
- Direct UPI deep-link intent for smartphone app opening (GPay, PhonePe, Paytm, BHIM).
- Integrated transaction UTR/reference verification fallback and direct WhatsApp payment confirmation.

### 3. Contextual WhatsApp Concierge
- Floating concierge widget with live consultation prompt.
- Context-aware deep-link generators for:
  - Specific product active ingredient queries.
  - Live order tracking and dispatch inquiries.
  - Configurable phone number and greeting in Admin.

### 4. Configurable Rules Engine (No Hardcoded Assumptions)
- **Dealer Wholesale Margin %**: Adjustable through Admin (default 18%).
- **Promoter Affiliate Commission %**: Adjustable through Admin (default 12%).
- **Customer Loyalty Points per Rupee**: Configurable reward ratio (default 0.05 = 1 pt / ₹20).
- **Low-Stock Safety Alarm**: Configurable minimum unit threshold.

---

## 🛠 Local Development Commands

### Start Backend API:
```bash
cd server
npm install
npm start # Runs on http://localhost:5000
```

### Start Frontend Storefront:
```bash
cd client
npm install
npm run dev # Runs on http://localhost:3000
```
