import os
import subprocess
import shutil

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Good Bee Architecture Blueprint & Project Replication Manual</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: A4;
    margin: 10mm 12mm 10mm 12mm;
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #0f172a;
    background: #ffffff;
    margin: 0;
    padding: 0;
    line-height: 1.35;
    font-size: 8.5pt;
  }

  .sheet {
    page-break-after: always;
    break-after: page;
    height: 275mm;
    max-height: 275mm;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 4mm;
  }

  .sheet:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }

  .sheet-content {
    flex-grow: 1;
  }

  .sheet-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #cbd5e1;
    padding-top: 5px;
    margin-top: 8px;
    font-size: 7pt;
    color: #64748b;
    font-family: 'JetBrains Mono', monospace;
  }

  h1 {
    font-size: 15pt;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #0f172a;
    margin: 0 0 2px 0;
  }

  h2 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #0f172a;
    margin: 9px 0 4px 0;
    border-bottom: 1.5px solid #0f172a;
    padding-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  h3 {
    font-size: 9pt;
    font-weight: 700;
    color: #1e293b;
    margin: 5px 0 3px 0;
  }

  p {
    margin: 0 0 4px 0;
    color: #334155;
  }

  .doc-header {
    border-bottom: 2px solid #0f172a;
    padding-bottom: 6px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .doc-meta {
    text-align: right;
    font-size: 7.5pt;
    color: #475569;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1.3;
  }

  .badge {
    display: inline-block;
    padding: 1px 5px;
    font-size: 6.8pt;
    font-weight: 600;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-family: 'JetBrains Mono', monospace;
  }

  .badge-slate { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; }
  .badge-blue { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
  .badge-green { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
  .badge-purple { background: #faf5ff; color: #581c87; border: 1px solid #e9d5ff; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 4px 0 6px 0;
    font-size: 7.2pt;
  }

  th {
    background: #f8fafc;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 4px 5px;
    border: 1px solid #cbd5e1;
    font-size: 6.8pt;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  td {
    padding: 3.5px 5px;
    border: 1px solid #cbd5e1;
    color: #334155;
    vertical-align: top;
  }

  tr:nth-child(even) td {
    background: #fbfcfe;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 5px;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px;
    margin-bottom: 5px;
  }

  .grid-4 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 5px;
    margin-bottom: 5px;
  }

  .box {
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 5px 7px;
    background: #ffffff;
    margin-bottom: 5px;
  }

  .box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    font-size: 7.8pt;
    color: #0f172a;
    margin-bottom: 2px;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 2px;
  }

  .box-desc {
    font-size: 7.2pt;
    color: #475569;
    margin: 0;
    line-height: 1.35;
  }

  .step-flow {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 4px 0 6px 0;
  }

  .step-item {
    display: flex;
    gap: 6px;
    align-items: flex-start;
    padding: 3px 6px;
    border: 1px solid #e2e8f0;
    border-radius: 3px;
    background: #ffffff;
    font-size: 7.2pt;
  }

  .step-num {
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    color: #0f172a;
    background: #f1f5f9;
    padding: 1px 4px;
    border-radius: 2px;
    font-size: 6.8pt;
    flex-shrink: 0;
  }

  .step-content {
    flex-grow: 1;
    color: #334155;
    line-height: 1.3;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 6.8pt;
    background: #f1f5f9;
    padding: 1px 3px;
    border-radius: 2px;
    color: #0f172a;
    border: 1px solid #e2e8f0;
  }

  .checklist {
    list-style: none;
    padding-left: 0;
    margin: 3px 0;
  }

  .checklist li {
    position: relative;
    padding-left: 13px;
    margin-bottom: 2.5px;
    font-size: 7.2pt;
    color: #334155;
    line-height: 1.3;
  }

  .checklist li::before {
    content: "■";
    position: absolute;
    left: 0;
    top: 0;
    font-size: 5.5pt;
    color: #0f172a;
  }

</style>
</head>
<body>

  <!-- ================= SHEET 1 ================= -->
  <div class="sheet">
    <div class="sheet-content">
      
      <div class="doc-header">
        <div>
          <h1>GOOD BEE ARCHITECTURE BLUEPRINT</h1>
          <p style="margin: 0; font-size: 8.5pt; font-weight: 600; color: #475569;">
            System Technical Blueprint, Core Engine Specifications & Replication Guide
          </p>
        </div>
        <div class="doc-meta">
          <div>DOC REF: GB-ARCH-BLUEPRINT-2026</div>
          <div>FORMAT: TECHNICAL BLUEPRINT</div>
          <div>TARGET: ARCHITECTS & DEVELOPERS</div>
        </div>
      </div>

      <h2>1. Architectural Blueprint & System Topology</h2>
      <p>
        This document details the complete technical architecture and subsystem mechanics of the <strong>Good Bee</strong> platform. It is formatted as an architectural blueprint so that any engineering team can clone, adapt, and reuse this entire software architecture for other direct-to-consumer and business-to-business commerce platforms simply by swapping catalog data, assets, and branding themes.
      </p>

      <div class="grid-3" style="margin-top: 5px;">
        <div class="box">
          <div class="box-header"><span>Frontend Layer</span><span class="badge badge-slate">Client</span></div>
          <p class="box-desc">Single Page Application (SPA) powered by React 18 and Vite. Employs atomic component breakdown, Lucide icons, and Tailwind utility classes for responsive design.</p>
        </div>
        <div class="box">
          <div class="box-header"><span>API / Microservice</span><span class="badge badge-blue">Backend</span></div>
          <p class="box-desc">Lightweight Node.js Express REST API. Processes authentication, transactional order generation, inventory locks, and B2B quotation contracts.</p>
        </div>
        <div class="box">
          <div class="box-header"><span>Dual-Sync Fallback</span><span class="badge badge-green">Reliability</span></div>
          <p class="box-desc">Integrated client-side mock backend operating on localStorage. Provides seamless offline immunity and ensures zero downtime during server cold starts.</p>
        </div>
      </div>

      <h2>2. Master Subsystems & Functional Mapping</h2>
      <table>
        <thead>
          <tr>
            <th style="width: 20%;">Subsystem Module</th>
            <th style="width: 25%;">Component / File Key</th>
            <th style="width: 28%;">Core Functional Responsibility</th>
            <th style="width: 27%;">State Management & Data Output</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Catalog & Grid Engine</strong></td>
            <td><code>InteractiveSpaCatalog.jsx</code><br><code>ProductCard.jsx</code></td>
            <td>1:1 aspect-square product viewport, 4-column responsive grid, skin concern filtering, quick-view modal.</td>
            <td>React state (<code>activeConcern</code>), renders products array with strikethrough MRP & savings pills.</td>
          </tr>
          <tr>
            <td><strong>Product Detail (PDP)</strong></td>
            <td><code>ProductDetailPage.jsx</code><br><code>ProductQuickViewModal.jsx</code></td>
            <td>Above-the-fold 5/7 column split layout. 100% visible packshot viewport, tabbed INCI disclosures, verified ratings.</td>
            <td>URL hash routing (<code>#product=ID</code>), quantity selector, instant buy trigger dispatching to checkout.</td>
          </tr>
          <tr>
            <td><strong>Cart & Order Engine</strong></td>
            <td><code>CartContext.jsx</code><br><code>Checkout.jsx</code></td>
            <td>Reactive shopping bag, coupon code validation (<code>HONEY15</code>), free shipping threshold logic (&ge; ₹999).</td>
            <td>LocalStorage synchronized cart array, dynamic NPCI UPI string synthesis, QR timer, COD order generation.</td>
          </tr>
          <tr>
            <td><strong>Wholesale B2B Desk</strong></td>
            <td><code>WholesalerDesk.jsx</code><br><code>PortalModal.jsx</code></td>
            <td>Commercial distributor portal. Minimum Order Quantity (MOQ = 20), automated volume tier discounting (30%-50%).</td>
            <td>Computes wholesale margin matrix, 18% GST calculation, and registers wholesale purchase orders (<code>GB-WHL-XXXX</code>).</td>
          </tr>
          <tr>
            <td><strong>Supplier & Lab Desk</strong></td>
            <td><code>VendorPortal.jsx</code></td>
            <td>R&D formulation intake. ISO/GMP facility accreditation, analytical parameters (pH, viscosity), Certificate of Analysis.</td>
            <td>Submits technical proposals (<code>GB-PROP-XXXX</code>) into Admin evaluation and verification pipeline.</td>
          </tr>
          <tr>
            <td><strong>Admin Operations Suite</strong></td>
            <td><code>AdminSuite.jsx</code></td>
            <td>Mission control center: live gross sales telemetry, order fulfillment lifecycle, live catalog CMS.</td>
            <td>Direct mutations to orders state, order status toggles (<code>PROCESSING &rarr; DISPATCHED &rarr; DELIVERED</code>), catalog price/stock editing.</td>
          </tr>
        </tbody>
      </table>

      <h2>3. The 4 Stakeholder Roles & Access Gates</h2>
      <div class="grid-2">
        <div class="box">
          <div class="box-header"><span>1. Retail Customer / Patron</span><span class="badge badge-slate">Public Access</span></div>
          <p class="box-desc">
            <strong>Entry:</strong> Direct storefront URL.<br>
            <strong>Capabilities:</strong> Filter by concern, inspect INCI ingredients, one-click cart addition, dynamic UPI payment, and track dispatch status via order ID (<code>GB-ORD-XXXX</code>).
          </p>
        </div>
        <div class="box">
          <div class="box-header"><span>2. Wholesale Partner / Dealer</span><span class="badge badge-blue">Partner Modal Gate</span></div>
          <p class="box-desc">
            <strong>Entry:</strong> Top Navigation &rarr; Partner Console &rarr; Wholesale Desk.<br>
            <strong>Capabilities:</strong> Authenticates via GSTIN & Dealer Code (e.g. <code>DLR-MUM-01</code>). Selects high-volume units, views live retailer margins, and generates formal purchase orders.
          </p>
        </div>
      </div>
      <div class="grid-2">
        <div class="box">
          <div class="box-header"><span>3. Formulation Lab / Supplier</span><span class="badge badge-green">Producer Gate</span></div>
          <p class="box-desc">
            <strong>Entry:</strong> Top Navigation &rarr; Partner Console &rarr; Vendor & Labs.<br>
            <strong>Capabilities:</strong> Enters lab accreditation, declares chemical purity metrics, offers batch supply volumes, and submits pricing proposals directly to procurement.
          </p>
        </div>
        <div class="box">
          <div class="box-header"><span>4. Master Store Administrator</span><span class="badge badge-purple">Operations Suite</span></div>
          <p class="box-desc">
            <strong>Entry:</strong> Top Navigation &rarr; Partner Console &rarr; Admin Suite.<br>
            <strong>Capabilities:</strong> Superuser privileges. Reviews revenue telemetry, transitions order fulfillment states, reviews vendor proposals, and edits catalog items in real time.
          </p>
        </div>
      </div>

    </div>
    <div class="sheet-footer">
      <span>Good Bee Architecture Blueprint & System Replication Guide &bull; Confidential Engineering Blueprint</span>
      <span>Page 1 of 5</span>
    </div>
  </div>

  <!-- ================= SHEET 2 ================= -->
  <div class="sheet">
    <div class="sheet-content">

      <h2>4. Storefront Display & Catalog Presentation Mechanics</h2>
      <p>
        The presentation layer of Good Bee is engineered around strict aspect-ratio enforcement and above-the-fold layout constraints. This prevents media pixelation and ensures conversion actions require zero downward scrolling.
      </p>

      <div class="grid-2">
        <div class="box">
          <div class="box-header"><span>1:1 Square Catalog Grid Engine</span><span class="badge badge-slate">Layout Standard</span></div>
          <ul class="checklist">
            <li><strong>4-Column Grid Standard:</strong> Uses <code>grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6</code> to keep individual card widths between 260px and 280px on desktop screens.</li>
            <li><strong>Strict 1:1 Aspect Ratio:</strong> Image containers enforce <code>aspect-square bg-[#FAF7F2]</code> with <code>object-cover</code>, perfectly matching native 300x300 and 600x600 assets without distortion or horizontal/vertical stretching.</li>
            <li><strong>Editorial Badges:</strong> Dark pill tags (<code>BEST SELLER</code>, <code>FREQUENTLY BOUGHT</code>, <code>MOST LOVED</code>) pinned top-left.</li>
            <li><strong>Instant Feedback Button:</strong> Add-to-bag action toggles a green confirmation checkmark state for 1.6 seconds without UI layout shifts.</li>
          </ul>
        </div>

        <div class="box">
          <div class="box-header"><span>Above-The-Fold PDP Layout</span><span class="badge badge-green">Conversion Architecture</span></div>
          <ul class="checklist">
            <li><strong>Reclaimed Top Margin:</strong> Container padding compacted to <code>pt-[74px] sm:pt-[78px]</code>, aligning directly beneath the fixed 76px header and removing 100px of dead space.</li>
            <li><strong>5/7 Asymmetric Column Split:</strong> Gallery occupies 5 columns (<code>lg:col-span-5</code>), and purchase controls occupy 7 columns (<code>lg:col-span-7</code>).</li>
            <li><strong>Constrained Viewport Height:</strong> Product stage enforces <code>max-h-[min(440px,calc(100vh-170px))]</code> with <code>object-contain</code>, guaranteeing 100% bottle visibility from cap to base.</li>
            <li><strong>Above-The-Fold CTAs:</strong> Price savings block, Quantity selector, and Instant Buy UPI button sit alongside the image without scrolling.</li>
          </ul>
        </div>
      </div>

      <h2>5. Cart Logic, Dynamic UPI & Checkout Engine</h2>
      <div class="grid-2">
        <div class="box">
          <div class="box-header"><span>Cart State & Financial Rules</span><span class="badge badge-blue">Cart Context</span></div>
          <p class="box-desc">
            <strong>State Store:</strong> <code>CartContext.jsx</code> manages item objects: <code>{ id, title, price, mrp, image, quantity }</code>.<br>
            <strong>Subtotal & Shipping:</strong> Real-time sum. If <code>subtotal &ge; 999</code>, shipping fee is ₹0; otherwise ₹70 express courier charge is appended.<br>
            <strong>Coupon Code Evaluation:</strong> Evaluates coupon inputs. Applying <code>HONEY15</code> calculates a flat 15% discount on eligible subtotal.<br>
            <strong>Persistence:</strong> Synchronizes cart state to browser <code>localStorage</code> on every mutation.
          </p>
        </div>

        <div class="box">
          <div class="box-header"><span>Client-Side Dynamic UPI QR Generator</span><span class="badge badge-purple">Zero Fee Gateway</span></div>
          <p class="box-desc">
            <strong>NPCI String Construction:</strong> Synthesizes real-time standard UPI payment string:<br>
            <code>upi://pay?pa=brand@upi&pn=BrandName&am=${total}&cu=INR&tr=${orderId}</code><br>
            <strong>Client Rendering:</strong> Converted to high-density QR matrix directly in browser using <code>qrcode</code> package.<br>
            <strong>Security & Expiry:</strong> 10-minute active session countdown timer with deep links for mobile devices (GPay, PhonePe, Paytm).
          </p>
        </div>
      </div>

      <h2>6. Self-Service Order Tracking Subsystem</h2>
      <table>
        <thead>
          <tr>
            <th style="width: 15%;">Stage</th>
            <th style="width: 18%;">State Enum</th>
            <th style="width: 37%;">Customer View & Progress Text</th>
            <th style="width: 30%;">Operational Trigger</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Stage 1</strong></td>
            <td><code>PROCESSING</code></td>
            <td>Payment verified. Order registered at fulfillment center.</td>
            <td>Checkout completion; assigns <code>GB-ORD-XXXX</code>.</td>
          </tr>
          <tr>
            <td><strong>Stage 2</strong></td>
            <td><code>PROCESSING</code></td>
            <td>Formulation batch picked, sealed under nitrogen, and packed.</td>
            <td>Admin Suite verification; batch lot assigned.</td>
          </tr>
          <tr>
            <td><strong>Stage 3</strong></td>
            <td><code>DISPATCHED</code></td>
            <td>Consignment handed to courier (BlueDart / Delhivery Express).</td>
            <td>Admin Suite "Mark Dispatched" toggle; generates AWB.</td>
          </tr>
          <tr>
            <td><strong>Stage 4</strong></td>
            <td><code>DELIVERED</code></td>
            <td>Package delivered to customer address.</td>
            <td>Courier delivery webhook or manual admin confirmation.</td>
          </tr>
        </tbody>
      </table>

      <h2>7. Dual-Sync Architecture (Cold-Start & Offline Resilience)</h2>
      <div class="box">
        <div class="box-header"><span>Zero Downtime Resilience Pattern</span><span class="badge badge-slate">Architectural Pattern</span></div>
        <p class="box-desc">
          Good Bee implements a robust dual-sync architecture via <code>api.js</code> and <code>mockBackend.js</code>. In production environments, the storefront attempts to fetch live records from the Node/Express REST API (<code>/api/v1/...</code>). If the backend is cold-starting or unreachable, the system automatically falls back to client-side localStorage without displaying blank screens or interrupting customer checkout. Changes made in the Admin CMS are persisted across storage layers.
        </p>
      </div>

    </div>
    <div class="sheet-footer">
      <span>Good Bee Architecture Blueprint & System Replication Guide &bull; Confidential Engineering Blueprint</span>
      <span>Page 2 of 5</span>
    </div>
  </div>

  <!-- ================= SHEET 3 ================= -->
  <div class="sheet">
    <div class="sheet-content">

      <h2>8. B2B Wholesaler Desk & Automated Margin Engine</h2>
      <p>
        The Wholesale Desk allows commercial distributors to execute bulk procurement orders with automated pricing tiers. This replaces manual quotes with programmatic pricing rules.
      </p>

      <div class="grid-2">
        <div class="box">
          <div class="box-header"><span>Wholesale Qualification & Session</span><span class="badge badge-blue">Authentication</span></div>
          <ul class="checklist">
            <li><strong>Dealer Credential Audit:</strong> Authenticated using GSTIN, verified Dealer Code (e.g. <code>DLR-MUM-01</code>), Company Name, and Registered City.</li>
            <li><strong>Partner Tier Profiles:</strong> Supports Silver, Gold, and Platinum partner levels with predefined credit terms (Net-30 / Advance).</li>
            <li><strong>Order Ledger:</strong> Displays distributor lifetime spend and past purchase order records.</li>
          </ul>
        </div>

        <div class="box">
          <div class="box-header"><span>Tiered Volume Pricing Rules</span><span class="badge badge-green">Pricing Engine</span></div>
          <ul class="checklist">
            <li><strong>Strict MOQ Threshold:</strong> Enforces minimum order quantity of 20 units across combined SKUs.</li>
            <li><strong>Tier 1 (20 – 49 Units):</strong> 30% Wholesale Discount off retail MRP.</li>
            <li><strong>Tier 2 (50 – 99 Units):</strong> 40% Wholesale Discount off retail MRP.</li>
            <li><strong>Tier 3 (100+ Units):</strong> 50% Master Distributor Rebate.</li>
            <li><strong>Statutory Tax:</strong> Applies 18% GST with full B2B tax invoice credit.</li>
          </ul>
        </div>
      </div>

      <div class="box">
        <div class="box-header"><span>Wholesale Order Generation Workflow</span><span class="badge badge-slate">Process Flow</span></div>
        <div class="step-flow">
          <div class="step-item">
            <span class="step-num">01</span>
            <div class="step-content"><strong>Catalog Selection:</strong> Dealer inputs SKU quantities. System checks if total units &ge; 20 MOQ.</div>
          </div>
          <div class="step-item">
            <span class="step-num">02</span>
            <div class="step-content"><strong>Live Calculation:</strong> Calculates Retail MRP Value, Volume Discount, 18% GST, Net Payable, and Reseller Gross Margin.</div>
          </div>
          <div class="step-item">
            <span class="step-num">03</span>
            <div class="step-content"><strong>PO Submission:</strong> Generates unique PO reference (<code>GB-WHL-XXXX</code>) and routes to Admin Suite matrix.</div>
          </div>
          <div class="step-item">
            <span class="step-num">04</span>
            <div class="step-content"><strong>Consignment Release:</strong> Admin verifies payment and freight, marking consignment approved for warehouse release.</div>
          </div>
        </div>
      </div>

      <h2>9. Vendor & Formulation Lab Partner Portal</h2>
      <p>
        The Supplier Portal integrates extraction labs, raw ingredient suppliers, and research institutions into the platform's supply chain.
      </p>

      <div class="grid-2">
        <div class="box">
          <div class="box-header"><span>Supplier Onboarding & Lab Compliance</span><span class="badge badge-green">Accreditation</span></div>
          <p class="box-desc">
            <strong>Facility Identity:</strong> Entity name, manufacturing address, and ISO/GMP lab license ID (<code>LAB-ISO-9001-GB</code>).<br>
            <strong>Technical Lead:</strong> Certified bio-chemist / cosmetologist contact details.<br>
            <strong>Supply Track Record:</strong> Historical log of accepted raw materials and active supply contracts.
          </p>
        </div>

        <div class="box">
          <div class="box-header"><span>Formulation Intake Specifications</span><span class="badge badge-slate">Data Capture</span></div>
          <p class="box-desc">
            <strong>Active Nomenclature:</strong> Standard INCI botanical scientific naming.<br>
            <strong>Extraction Methodology:</strong> Steam distillation, cold-press, or supercritical CO2 extraction.<br>
            <strong>Batch Capacity:</strong> Volume offered (Liters/Kg), lead time in days, supply price per unit.<br>
            <strong>Analytical Parameters:</strong> pH rating, viscosity index, and active compound concentration %.
          </p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 20%;">Proposal State</th>
            <th style="width: 25%;">Workflow Condition</th>
            <th style="width: 35%;">Platform Action</th>
            <th style="width: 20%;">Next Phase</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>SUBMITTED</code></td>
            <td>Lab completes form & provides CoA metrics.</td>
            <td>Generates <code>GB-PROP-XXXX</code>; queues in Admin Supplier Proposals tab.</td>
            <td>Admin Technical Audit</td>
          </tr>
          <tr>
            <td><code>IN_LAB_AUDIT</code></td>
            <td>Admin reviews gas chromatography data.</td>
            <td>Flags sample testing requirements and physical batch verification.</td>
            <td>Lab Audit Pass / Fail</td>
          </tr>
          <tr>
            <td><code>APPROVED</code></td>
            <td>Purity and commercial terms meet standards.</td>
            <td>Proposal accepted; formulation queued for Catalog CMS onboarding.</td>
            <td>Catalog Integration</td>
          </tr>
          <tr>
            <td><code>REJECTED</code></td>
            <td>Purity below threshold or price non-viable.</td>
            <td>Returns structured feedback to supplier with explanation.</td>
            <td>Archived / Resubmit</td>
          </tr>
        </tbody>
      </table>

    </div>
    <div class="sheet-footer">
      <span>Good Bee Architecture Blueprint & System Replication Guide &bull; Confidential Engineering Blueprint</span>
      <span>Page 3 of 5</span>
    </div>
  </div>

  <!-- ================= SHEET 4 ================= -->
  <div class="sheet">
    <div class="sheet-content">

      <h2>10. Master Admin Suite & Operations Management</h2>
      <p>
        The Admin Suite functions as the central operations tower. It provides real-time revenue telemetry, retail fulfillment controls, B2B quote approvals, and live catalog content management.
      </p>

      <div class="grid-4">
        <div class="box">
          <div class="box-header"><span>Gross Sales</span><span class="badge badge-green">Telemetry</span></div>
          <p style="font-size: 11pt; font-weight: 800; color: #0f172a; margin: 2px 0;">₹1,27,860</p>
          <span style="font-size: 6.5pt; color: #16a34a; font-weight: 600;">+18.4% month-on-month</span>
        </div>
        <div class="box">
          <div class="box-header"><span>Patron Orders</span><span class="badge badge-blue">Fulfillment</span></div>
          <p style="font-size: 11pt; font-weight: 800; color: #0f172a; margin: 2px 0;">3 Active</p>
          <span style="font-size: 6.5pt; color: #ea580c; font-weight: 600;">1 pending dispatch</span>
        </div>
        <div class="box">
          <div class="box-header"><span>Active Catalog</span><span class="badge badge-slate">SKUs</span></div>
          <p style="font-size: 11pt; font-weight: 800; color: #0f172a; margin: 2px 0;">19 Items</p>
          <span style="font-size: 6.5pt; color: #64748b; font-weight: 600;">Cold-stabilized formulations</span>
        </div>
        <div class="box">
          <div class="box-header"><span>Stock Alert</span><span class="badge badge-slate">Inventory</span></div>
          <p style="font-size: 11pt; font-weight: 800; color: #dc2626; margin: 2px 0;">1 Warning</p>
          <span style="font-size: 6.5pt; color: #dc2626; font-weight: 600;">&le; 10 units remaining</span>
        </div>
      </div>

      <div class="grid-2">
        <div class="box">
          <div class="box-header"><span>Order Fulfillment Control</span><span class="badge badge-slate">Order Management</span></div>
          <ul class="checklist">
            <li><strong>Live Pipeline Table:</strong> Displays Order ID, Patron Name, Line Items, Net Total, Payment Mode (UPI/COD), and Fulfillment Status.</li>
            <li><strong>One-Click Dispatch:</strong> Operators advance orders from <code>PROCESSING &rarr; DISPATCHED</code>, automatically updating customer-facing tracking views.</li>
            <li><strong>Customer Audit:</strong> Inspects full shipping address, mobile contact, and delivery notes.</li>
          </ul>
        </div>

        <div class="box">
          <div class="box-header"><span>Partner Operations Control</span><span class="badge badge-blue">Wholesale & Labs</span></div>
          <ul class="checklist">
            <li><strong>Wholesale Matrix:</strong> Displays submitted B2B purchase orders, dealer tiers, unit counts, and margin discounts. Operators approve or reject bulk invoices.</li>
            <li><strong>Supplier Proposals:</strong> Evaluates incoming formulation submissions from bio-labs. Operators review test reports and click "Accept Proposal" to onboard formulations.</li>
          </ul>
        </div>
      </div>

      <h2>11. Real-Time Catalog Content Management System (CMS)</h2>
      <p>
        The Catalog CMS provides real-time control over product data, pricing, inventory thresholds, and badges without requiring code changes or application rebuilds.
      </p>

      <table>
        <thead>
          <tr>
            <th style="width: 20%;">CMS Field</th>
            <th style="width: 25%;">Validation Rule</th>
            <th style="width: 30%;">Storefront Effect</th>
            <th style="width: 25%;">UI Control</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Selling Price (₹)</strong></td>
            <td>Positive integer</td>
            <td>Updates instant buy price, cart subtotal, and wholesale pricing base.</td>
            <td>Direct numeric input field.</td>
          </tr>
          <tr>
            <td><strong>MRP (₹)</strong></td>
            <td>Must be &ge; Selling Price</td>
            <td>Computes strikethrough price and "% OFF" savings pill badge.</td>
            <td>Enforces discount calculation.</td>
          </tr>
          <tr>
            <td><strong>Stock Units</strong></td>
            <td>Non-negative integer</td>
            <td>If &le; 10, displays low stock alert. If 0, disables Add to Cart button.</td>
            <td>Numeric inventory input.</td>
          </tr>
          <tr>
            <td><strong>Image Asset Path</strong></td>
            <td>Relative or absolute URL</td>
            <td>Renders in 1:1 aspect-square catalog cards and PDP image gallery.</td>
            <td>URL input with live preview.</td>
          </tr>
          <tr>
            <td><strong>Product Badge</strong></td>
            <td>String (e.g. "Best Seller")</td>
            <td>Renders motivation pill badge on product card and PDP stage.</td>
            <td>Custom text badge input.</td>
          </tr>
        </tbody>
      </table>

      <h2>12. Production Hosting & VPS Sizing Blueprint</h2>
      <table>
        <thead>
          <tr>
            <th style="width: 20%;">Deployment Tier</th>
            <th style="width: 25%;">Traffic Capacity</th>
            <th style="width: 30%;">Recommended Hardware (VPS)</th>
            <th style="width: 25%;">Est. Monthly Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Stage 1: Launch / MVP</strong></td>
            <td>1,000 – 3,000 visitors/day (~50 concurrent)</td>
            <td>1 vCPU, 2 GB RAM, 25-40 GB NVMe SSD (Ubuntu 24.04, Nginx, PM2, Postgres)</td>
            <td>$4 – $6 / month (₹350 – ₹500)</td>
          </tr>
          <tr>
            <td><strong>Stage 2: Growth Phase</strong></td>
            <td>10,000 – 25,000 visitors/day (~200 concurrent)</td>
            <td>2 vCPU, 4 GB RAM, 50-80 GB NVMe SSD (Nginx reverse proxy, Node PM2 cluster)</td>
            <td>$10 – $14 / month (₹850 – ₹1,200)</td>
          </tr>
          <tr>
            <td><strong>Stage 3: Scale / Flash Surge</strong></td>
            <td>50,000+ visitors/day (surges & B2B volume)</td>
            <td>4 vCPU, 8 GB RAM, 100+ GB NVMe SSD + Redis session/catalog cache</td>
            <td>$24 – $35 / month (₹2,000 – ₹3,000)</td>
          </tr>
        </tbody>
      </table>

    </div>
    <div class="sheet-footer">
      <span>Good Bee Architecture Blueprint & System Replication Guide &bull; Confidential Engineering Blueprint</span>
      <span>Page 4 of 5</span>
    </div>
  </div>

  <!-- ================= SHEET 5 ================= -->
  <div class="sheet">
    <div class="sheet-content">

      <h2>13. Core Data Schemas (JSON Entity Contracts)</h2>
      <p>
        These standardized JSON schemas represent the core data contracts of the Good Bee platform and can be ported directly into PostgreSQL, MongoDB, or SQLite.
      </p>

      <div class="grid-2">
        <div class="box">
          <div class="box-header"><span>Product Entity Contract</span><span class="badge badge-slate">Data Model</span></div>
          <p class="box-desc" style="font-family: 'JetBrains Mono', monospace; font-size: 6.5pt; line-height: 1.3;">
            {<br>
            &nbsp;&nbsp;"id": "gb_prod_rosemary_oil",<br>
            &nbsp;&nbsp;"title": "Good Bee Rosemary Pure Essential Oil",<br>
            &nbsp;&nbsp;"slug": "good-bee-rosemary-pure-essential-oil",<br>
            &nbsp;&nbsp;"sku": "GB-OIL-RSM-15",<br>
            &nbsp;&nbsp;"category": "Pure Essential Oils",<br>
            &nbsp;&nbsp;"concerns": ["Hair Fall & Scalp", "Acne & Blemishes"],<br>
            &nbsp;&nbsp;"price": 950, "mrp": 1150,<br>
            &nbsp;&nbsp;"volume": "15 ml / 0.5 fl. oz.",<br>
            &nbsp;&nbsp;"stock": 45, "lowStockThreshold": 10,<br>
            &nbsp;&nbsp;"badge": "Best Seller",<br>
            &nbsp;&nbsp;"image": "/images_ref/rosemary.webp",<br>
            &nbsp;&nbsp;"ingredients": ["100% Pure Rosmarinus Officinalis"],<br>
            &nbsp;&nbsp;"ritual": "Dilute 3-4 drops into carrier oil..."<br>
            }
          </p>
        </div>

        <div class="box">
          <div class="box-header"><span>Customer Order Contract</span><span class="badge badge-blue">Order Model</span></div>
          <p class="box-desc" style="font-family: 'JetBrains Mono', monospace; font-size: 6.5pt; line-height: 1.3;">
            {<br>
            &nbsp;&nbsp;"id": "GB-ORD-90214",<br>
            &nbsp;&nbsp;"customer": {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;"name": "Pooja Reddy", "phone": "+919876543210",<br>
            &nbsp;&nbsp;&nbsp;&nbsp;"address": "Flat 402, Lotus Heights", "city": "Hyderabad",<br>
            &nbsp;&nbsp;&nbsp;&nbsp;"state": "Telangana", "pincode": "500081"<br>
            &nbsp;&nbsp;},<br>
            &nbsp;&nbsp;"items": [<br>
            &nbsp;&nbsp;&nbsp;&nbsp;{ "productId": "gb_prod_rosemary_oil", "qty": 1, "price": 950 }<br>
            &nbsp;&nbsp;],<br>
            &nbsp;&nbsp;"subtotal": 950, "shipping": 0, "discount": 0, "total": 950,<br>
            &nbsp;&nbsp;"payment": { "method": "UPI", "status": "VERIFIED" },<br>
            &nbsp;&nbsp;"status": "PROCESSING",<br>
            &nbsp;&nbsp;"createdAt": "2026-11-02T12:00:00Z"<br>
            }
          </p>
        </div>
      </div>

      <div class="grid-2">
        <div class="box">
          <div class="box-header"><span>Wholesale Quote Contract</span><span class="badge badge-green">B2B Model</span></div>
          <p class="box-desc" style="font-family: 'JetBrains Mono', monospace; font-size: 6.5pt; line-height: 1.3;">
            {<br>
            &nbsp;&nbsp;"quoteId": "GB-WHL-8821",<br>
            &nbsp;&nbsp;"dealerCode": "DLR-MUM-01", "gstNumber": "27AABCU9603R1ZM",<br>
            &nbsp;&nbsp;"companyName": "Apex Luxury Skincare Distributors",<br>
            &nbsp;&nbsp;"totalUnits": 55, "discountTier": "Tier 2 (40% OFF)",<br>
            &nbsp;&nbsp;"retailMrpValue": 57750, "wholesaleSubtotal": 34650,<br>
            &nbsp;&nbsp;"gst18": 6237, "netPayable": 40887,<br>
            &nbsp;&nbsp;"status": "PENDING_ADMIN_APPROVAL"<br>
            }
          </p>
        </div>

        <div class="box">
          <div class="box-header"><span>Supplier Proposal Contract</span><span class="badge badge-purple">Lab Model</span></div>
          <p class="box-desc" style="font-family: 'JetBrains Mono', monospace; font-size: 6.5pt; line-height: 1.3;">
            {<br>
            &nbsp;&nbsp;"proposalId": "GB-PROP-4412",<br>
            &nbsp;&nbsp;"producerId": "Aura Botanica Bio-Labs",<br>
            &nbsp;&nbsp;"labCertId": "LAB-ISO-9001-GB",<br>
            &nbsp;&nbsp;"formulationName": "Organic Pink Lotus Hydrosol",<br>
            &nbsp;&nbsp;"botanicalSource": "Nelumbo nucifera petals",<br>
            &nbsp;&nbsp;"batchVolumeLiters": 500, "unitSupplyCost": 320,<br>
            &nbsp;&nbsp;"analytical": { "pH": 5.4, "purityPct": 99.8 },<br>
            &nbsp;&nbsp;"status": "SUBMITTED"<br>
            }
          </p>
        </div>
      </div>

      <h2>14. 10-Step Replication Guide for Similar Projects</h2>
      <div class="box">
        <div class="box-header"><span>Replication Roadmap</span><span class="badge badge-slate">Implementation Checklist</span></div>
        <div class="grid-2">
          <ul class="checklist">
            <li><strong>Step 1 (Catalog Data Definition):</strong> Define JSON array of initial products with <code>id, title, price, mrp, stock, image, category, concerns</code>.</li>
            <li><strong>Step 2 (Cart Context Store):</strong> Implement React <code>CartContext</code> storing line items, coupon logic, and synchronizing with <code>localStorage</code>.</li>
            <li><strong>Step 3 (1:1 Media & Grid Layout):</strong> Enforce <code>aspect-square</code> containers inside a 4-column responsive grid (<code>grid-cols-2 md:grid-cols-4</code>).</li>
            <li><strong>Step 4 (Above-the-Fold PDP):</strong> Build PDP using a 5/7 column split with <code>max-h-[min(440px,calc(100vh-170px))]</code> so images and CTAs fit on screen.</li>
            <li><strong>Step 5 (Dynamic UPI & COD Checkout):</strong> Implement client-side NPCI UPI URI generator with <code>qrcode</code> rendering and cash-on-delivery routing.</li>
          </ul>
          <ul class="checklist">
            <li><strong>Step 6 (Order Tracking Timeline):</strong> Build self-service tracking modal mapping order status to a 4-step progress bar with AWB details.</li>
            <li><strong>Step 7 (B2B Wholesale Module):</strong> Add dealer qualification, MOQ enforcement (&ge; 20 units), and dynamic tiered bulk discount calculations.</li>
            <li><strong>Step 8 (Vendor Formulation Intake):</strong> Create supplier form capturing batch volume, chemistry parameters, and CoA compliance.</li>
            <li><strong>Step 9 (Master Admin Operations):</strong> Implement admin telemetry dashboard, order dispatch controls, and live Catalog CMS.</li>
            <li><strong>Step 10 (Dual-Sync Fallback Engine):</strong> Configure API service layer that falls back seamlessly to localStorage when the backend is offline.</li>
          </ul>
        </div>
      </div>

    </div>
    <div class="sheet-footer">
      <span>Good Bee Architecture Blueprint & System Replication Guide &bull; Confidential Engineering Blueprint</span>
      <span>Page 5 of 5</span>
    </div>
  </div>

</body>
</html>
"""

html_path = r"c:\good_bee\Good_Bee_Architecture_Blueprint.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)
print(f"HTML written to {html_path}")

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
pdf_out_path = r"c:\good_bee\Good_Bee_Architecture_Blueprint.pdf"

cmd = [
    chrome_path,
    "--headless",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-software-rasterizer",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_out_path}",
    f"file:///{html_path.replace(os.sep, '/')}"
]

print("Compiling PDF with Chrome...")
res = subprocess.run(cmd, capture_output=True, text=True)
print("Returncode:", res.returncode)

if os.path.exists(pdf_out_path):
    size = os.path.getsize(pdf_out_path)
    print(f"PDF successfully generated: {pdf_out_path} ({size:,} bytes)")
    
    artifact_dir = r"C:\Users\aadi\.gemini\antigravity\brain\ada7f367-8571-4599-ade3-4137b19c0e2c"
    if os.path.exists(artifact_dir):
        artifact_pdf = os.path.join(artifact_dir, "Good_Bee_Architecture_Blueprint.pdf")
        shutil.copy2(pdf_out_path, artifact_pdf)
        print(f"Copied to artifact directory: {artifact_pdf}")
else:
    print("PDF generation failed! Stderr:", res.stderr)
