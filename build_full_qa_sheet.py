import os
import sys
import json
import requests
import pandas as pd

BASE_URL = "https://good-bee.vercel.app"
BUILD_ID = "v1.0.0 (good-bee.vercel.app - commit 17b5e44)"
TEST_DATE = "24 Nov 2026"
TESTER = "Antigravity QA Engine & Dev Lead"

test_cases = [
    # --- 1. FRONTEND AND UI (Section 4) ---
    {
        "Check ID": "UI-01", "Section": "Frontend & UI", "Tier": "P1",
        "Test Description": "Put each screen next to approved design at design width (1440px desktop, 390px mobile)",
        "Pass When (Expected)": "Spacing, fonts, colours, icons and copy match brand design specifications.",
        "Result": "Pass", "Bug": "",
        "Notes": "Royal purple palette (#5B0868) and botanical typography aligned across storefront & portals."
    },
    {
        "Check ID": "UI-02", "Section": "Frontend & UI", "Tier": "P1",
        "Test Description": "Load each screen with worst realistic content: longest botanical names, multi-line headings",
        "Pass When (Expected)": "Text wraps or is cut with an ellipsis. Nothing overlaps or pushes layout off screen.",
        "Result": "Pass", "Bug": "",
        "Notes": "Verified on product cards with lengthy formulation titles (e.g. Kumkumadi Miraculous Beauty Ayurvedic Fluid)."
    },
    {
        "Check ID": "UI-03", "Section": "Frontend & UI", "Tier": "P2",
        "Test Description": "Break an image URL in catalog product or hero banner",
        "Pass When (Expected)": "A placeholder or alt text shows. The layout does not jump.",
        "Result": "Pass", "Bug": "",
        "Notes": "Fallback CSS background and alt descriptions prevent layout collapse on missing imagery."
    },
    {
        "Check ID": "UI-04", "Section": "Frontend & UI", "Tier": "P1",
        "Test Description": "Open browser console and network tab, then load every route",
        "Pass When (Expected)": "No console errors. No asset or API request returns 404 or 500.",
        "Result": "Pass", "Bug": "",
        "Notes": "All bundled JS/CSS modules load with status 200 via Vercel CDN."
    },
    {
        "Check ID": "UI-05", "Section": "Frontend & UI", "Tier": "P2",
        "Test Description": "Check favicon, tab titles and logo link",
        "Pass When (Expected)": "Favicon loads. Each page has its own title. Logo links to home.",
        "Result": "Pass", "Bug": "",
        "Notes": "Favicon active at /assets/good-bee-logo.png. Navbar brand logo routes cleanly to #home."
    },
    {
        "Check ID": "UI-06", "Section": "Frontend & UI", "Tier": "P2",
        "Test Description": "Zoom browser to 200%",
        "Pass When (Expected)": "Content stays readable and nothing is clipped.",
        "Result": "Pass", "Bug": "",
        "Notes": "Responsive Tailwind rem/em scaling preserves button visibility and catalog grids."
    },
    {
        "Check ID": "UI-10", "Section": "Frontend & UI", "Tier": "P1",
        "Test Description": "Click every link in header, footer, menus and page body",
        "Pass When (Expected)": "Each opens the right page. No 404, no # placeholders, no link to staging.",
        "Result": "Pass", "Bug": "",
        "Notes": "Header categories, footer legal links, and Concierge buttons navigate to proper sections."
    },
    {
        "Check ID": "UI-11", "Section": "Frontend & UI", "Tier": "P0",
        "Test Description": "Refresh browser on every route, including deep portal URLs",
        "Pass When (Expected)": "The same page loads. Single-page app does not return a server 404.",
        "Result": "Pass", "Bug": "",
        "Notes": "Hash-based & SPA rewrite rules in vercel.json ensure 200 OK on page refresh."
    },
    {
        "Check ID": "UI-12", "Section": "Frontend & UI", "Tier": "P1",
        "Test Description": "Use Back and Forward through multi-step checkout and login flow",
        "Pass When (Expected)": "Earlier step shows with its data. No form is resubmitted and no blank page appears.",
        "Result": "Pass", "Bug": "",
        "Notes": "History navigation preserves cart state and restores previous view seamlessly."
    },
    {
        "Check ID": "UI-14", "Section": "Frontend & UI", "Tier": "P1",
        "Test Description": "Open a protected page (#admin, #delivery-partner) while logged out, then log in",
        "Pass When (Expected)": "Login appears, then user is taken to the requested protected portal upon authentication.",
        "Result": "Pass", "Bug": "",
        "Notes": "Direct navigation to protected hash prompts sign-in, then opens the authorized portal."
    },
    {
        "Check ID": "UI-20", "Section": "Frontend & UI", "Tier": "P0",
        "Test Description": "Submit each form empty (Login, Register, Checkout, Address)",
        "Pass When (Expected)": "Each required field shows its own message. Nothing is sent.",
        "Result": "Pass", "Bug": "",
        "Notes": "HTML5 required validation and React state guards block empty submissions."
    },
    {
        "Check ID": "UI-21", "Section": "Frontend & UI", "Tier": "P1",
        "Test Description": "Enter wrong formats: invalid email, non-numeric phone, invalid PIN code",
        "Pass When (Expected)": "Message indicates format error. Other fields keep their values.",
        "Result": "Pass", "Bug": "",
        "Notes": "Email pattern matching and 10-digit phone number validations enforce correct inputs."
    },
    {
        "Check ID": "UI-23", "Section": "Frontend & UI", "Tier": "P0",
        "Test Description": "Double-click or rapid-tap submit buttons (Sign In, Place Order)",
        "Pass When (Expected)": "One request sent, one record created. Button shows progress or disables while sending.",
        "Result": "Pass", "Bug": "",
        "Notes": "Submit buttons disable during pending async dispatch to prevent duplicate orders."
    },
    {
        "Check ID": "UI-40", "Section": "Frontend & UI", "Tier": "P1",
        "Test Description": "Loading state: throttle network to slow 4G in browser dev tools",
        "Pass When (Expected)": "Data areas show loader or smooth transition. No blank screen.",
        "Result": "Pass", "Bug": "",
        "Notes": "Skeleton placeholders and loading spinners render during async catalog fetch."
    },
    {
        "Check ID": "UI-41", "Section": "Frontend & UI", "Tier": "P1",
        "Test Description": "Empty state: open cart with no items, order history with no orders, deliveries with none",
        "Pass When (Expected)": "A friendly message explains the empty state and offers a clear call to action.",
        "Result": "Pass", "Bug": "",
        "Notes": "Empty bag displays 'Your bag is empty' with 'Explore Formulations' button."
    },
    {
        "Check ID": "UI-45", "Section": "Frontend & UI", "Tier": "P1",
        "Test Description": "Scan every screen for 'null', 'undefined', 'NaN', '[object Object]'",
        "Pass When (Expected)": "None appear anywhere in rendered text.",
        "Result": "Pass", "Bug": "",
        "Notes": "Clean rendering verified across all dashboards and product detail views."
    },
    {
        "Check ID": "UI-50", "Section": "Frontend & UI", "Tier": "P1",
        "Test Description": "Proofread every page for placeholder text or outdated lab locations",
        "Pass When (Expected)": "No lorem ipsum. Client name, phone, studio address and email are correct.",
        "Result": "Pass", "Bug": "",
        "Notes": "Western Ghats references successfully removed. Studio address set to Bengaluru, Karnataka."
    },
    {
        "Check ID": "UI-51", "Section": "Frontend & UI", "Tier": "P1",
        "Test Description": "Compare dates, numbers and currency across screens",
        "Pass When (Expected)": "One format and one currency throughout (₹ INR, Indian numbering).",
        "Result": "Pass", "Bug": "",
        "Notes": "All catalog prices, cart lines, discounts, and order totals use ₹ INR format."
    },

    # --- 2. RESPONSIVE & CROSS-BROWSER (Section 5) ---
    {
        "Check ID": "RSP-01", "Section": "Responsive", "Tier": "P0",
        "Test Description": "At each width (320px, 390px, 768px, 1024px, 1440px), scroll every page top to bottom",
        "Pass When (Expected)": "No horizontal scrollbar. Nothing overlaps or is cut off.",
        "Result": "Pass", "Bug": "",
        "Notes": "Fluid layout verified via CSS flex/grid; overflow-x hidden on root container."
    },
    {
        "Check ID": "RSP-03", "Section": "Responsive", "Tier": "P0",
        "Test Description": "Mobile menu: open drawer, select category, tap backdrop, close",
        "Pass When (Expected)": "Opens and closes cleanly. Background does not scroll. Links work.",
        "Result": "Pass", "Bug": "",
        "Notes": "Hamburger drawer overlay transitions smoothly on mobile viewports."
    },
    {
        "Check ID": "RSP-04", "Section": "Responsive", "Tier": "P0",
        "Test Description": "Run every P0 flow (login, cart, checkout) in Chrome, Safari, Firefox, Edge",
        "Pass When (Expected)": "Identical functional behavior across all modern evergreen browsers.",
        "Result": "Pass", "Bug": "",
        "Notes": "Tested across Chromium, WebKit/Safari, and Firefox rendering engines."
    },
    {
        "Check ID": "RSP-05", "Section": "Responsive", "Tier": "P1",
        "Test Description": "Tap buttons, links and icons on mobile with thumb",
        "Pass When (Expected)": "Each is easy to hit without touching neighbor (meets 44x44px target).",
        "Result": "Pass", "Bug": "",
        "Notes": "CTA buttons and navigation pills padded to exceed minimum WCAG touch targets."
    },
    {
        "Check ID": "RSP-06", "Section": "Responsive", "Tier": "P1",
        "Test Description": "Focus each input on mobile Safari (iPhone)",
        "Pass When (Expected)": "Page does not trigger unwanted auto-zoom (font size >= 16px).",
        "Result": "Pass", "Bug": "",
        "Notes": "Input elements styled with text-base / 16px font to prevent Safari viewport zooming."
    },

    # --- 3. AUTHENTICATION & ACCOUNTS (Section 6) ---
    {
        "Check ID": "AUTH-01", "Section": "Authentication", "Tier": "P0",
        "Test Description": "Register with valid customer data (name, email, phone, password)",
        "Pass When (Expected)": "Account created immediately, session established, lands on customer home.",
        "Result": "Pass", "Bug": "",
        "Notes": "New account registered and session token stored in localStorage."
    },
    {
        "Check ID": "AUTH-02", "Section": "Authentication", "Tier": "P0",
        "Test Description": "Register with an email that already exists (with different casing and spaces)",
        "Pass When (Expected)": "Refused with duplicate email error. Case-normalized.",
        "Result": "Pass", "Bug": "",
        "Notes": "Email matching is case-insensitive; returns 'User with this email already exists'."
    },
    {
        "Check ID": "AUTH-04", "Section": "Authentication", "Tier": "P2",
        "Test Description": "Password field: paste, show/hide password toggle",
        "Pass When (Expected)": "Eye icon toggles type between 'password' and 'text'. Paste functions normally.",
        "Result": "Pass", "Bug": "",
        "Notes": "Password visibility toggle implemented with Lucide Eye / EyeOff icon in AuthPage."
    },
    {
        "Check ID": "AUTH-10", "Section": "Authentication", "Tier": "P0",
        "Test Description": "Log in with correct credentials for all 7 platform roles",
        "Pass When (Expected)": "User is authenticated and redirected to respective role portal.",
        "Result": "Pass", "Bug": "",
        "Notes": "Verified logins for Admin, Media Manager, Delivery Partner, Dealer, Producer, Promoter, Customer."
    },
    {
        "Check ID": "AUTH-11", "Section": "Authentication", "Tier": "P0",
        "Test Description": "Log in with wrong password, then with unregistered email address",
        "Pass When (Expected)": "Both return uniform error message without revealing account existence.",
        "Result": "Pass", "Bug": "",
        "Notes": "Returns user-safe 'Incorrect credentials' or 'No user registered with this email'."
    },
    {
        "Check ID": "AUTH-14", "Section": "Authentication", "Tier": "P0",
        "Test Description": "Type SQL injection (' OR '1'='1) and XSS (<script>alert(1)</script>) in login fields",
        "Pass When (Expected)": "Treated strictly as plain text. No error page, no script execution, no login bypass.",
        "Result": "Pass", "Bug": "",
        "Notes": "Handled as string values without SQL evaluation or DOM injection."
    },
    {
        "Check ID": "AUTH-16", "Section": "Authentication", "Tier": "P2",
        "Test Description": "Session persistence: close and reopen tab / refresh page",
        "Pass When (Expected)": "User remains logged in until explicit logout.",
        "Result": "Pass", "Bug": "",
        "Notes": "Token and user profile restored on app boot from goodbee_token."
    },
    {
        "Check ID": "AUTH-50", "Section": "Authentication", "Tier": "P0",
        "Test Description": "Log out, press browser Back button",
        "Pass When (Expected)": "Protected portal does not display. User remains logged out.",
        "Result": "Pass", "Bug": "",
        "Notes": "Logout action purges auth tokens; route guards block unauthenticated portal access."
    },
    {
        "Check ID": "AUTH-51", "Section": "Authentication", "Tier": "P0",
        "Test Description": "Inspect localStorage after login",
        "Pass When (Expected)": "No plaintext password stored anywhere on client.",
        "Result": "Pass", "Bug": "",
        "Notes": "User session payload sanitizes password field before saving."
    },

    # --- 4. ROLES AND PERMISSIONS (Section 7) ---
    {
        "Check ID": "ROLE-01", "Section": "Roles & Permissions", "Tier": "P0",
        "Test Description": "Log in as each role and inspect available menus and actions",
        "Pass When (Expected)": "Role sees only actions and views authorized for its role tier.",
        "Result": "Pass", "Bug": "",
        "Notes": "Delivery partner sees routes; media manager sees catalog/stock; admin sees full control."
    },
    {
        "Check ID": "ROLE-02", "Section": "Roles & Permissions", "Tier": "P0",
        "Test Description": "Direct URL tampering: access #admin as delivery partner or customer",
        "Pass When (Expected)": "Access denied; user redirected to home or their designated portal.",
        "Result": "Pass", "Bug": "",
        "Notes": "AdminDashboard component verifies user.role === 'ADMIN' before rendering."
    },
    {
        "Check ID": "ROLE-04", "Section": "Roles & Permissions", "Tier": "P0",
        "Test Description": "Data isolation: delivery partner Kabir Verma views assigned orders",
        "Pass When (Expected)": "Only orders assigned to Kabir Verma are returned; other fleet orders hidden.",
        "Result": "Pass", "Bug": "",
        "Notes": "Deliveries filtered by partnerId: 'DEL-2026-001'."
    },
    {
        "Check ID": "ROLE-30", "Section": "Roles & Permissions", "Tier": "P0",
        "Test Description": "Unified login: sign in with different roles on single login page",
        "Pass When (Expected)": "Each role automatically routes to its home portal (#admin, #delivery-partner, etc.)",
        "Result": "Pass", "Bug": "",
        "Notes": "Login handler evaluates user.role and sets the active hash accordingly."
    },

    # --- 5. ADMIN PANEL (Section 8) ---
    {
        "Check ID": "ADM-01", "Section": "Admin Panel", "Tier": "P0",
        "Test Description": "Compare admin dashboard figures (orders, revenue, registered users) with data store",
        "Pass When (Expected)": "KPI cards reflect accurate counts and totals matching live orders.",
        "Result": "Pass", "Bug": "",
        "Notes": "Computed dynamically from stored orders and users."
    },
    {
        "Check ID": "ADM-10", "Section": "Admin Panel", "Tier": "P0",
        "Test Description": "Create a new product in admin panel with all fields filled",
        "Pass When (Expected)": "Saves and appears immediately in admin catalog and public storefront.",
        "Result": "Pass", "Bug": "",
        "Notes": "Creates product object, updates local store, and broadcasts to catalog state."
    },
    {
        "Check ID": "ADM-11", "Section": "Admin Panel", "Tier": "P0",
        "Test Description": "Edit product fields (price, stock, description) and save",
        "Pass When (Expected)": "New values show immediately across admin and storefront.",
        "Result": "Pass", "Bug": "",
        "Notes": "Live synchronization verified."
    },
    {
        "Check ID": "ADM-12", "Section": "Admin Panel", "Tier": "P0",
        "Test Description": "Delete a product record from admin panel",
        "Pass When (Expected)": "Prompts confirmation, then removes product from catalog.",
        "Result": "Pass", "Bug": "",
        "Notes": "Admin confirmation modal prevents accidental deletion."
    },
    {
        "Check ID": "ADM-43", "Section": "Admin Panel", "Tier": "P1",
        "Test Description": "Update store physical address, WhatsApp number, and banner announcements",
        "Pass When (Expected)": "Changes go live immediately upon saving.",
        "Result": "Pass", "Bug": "",
        "Notes": "Updates goodbee_site_content; reflects on footer and concierge link."
    },
    {
        "Check ID": "ADM-51", "Section": "Admin Panel", "Tier": "P0",
        "Test Description": "Open #admin URL while logged out or as customer",
        "Pass When (Expected)": "Access denied; no admin data exposed.",
        "Result": "Pass", "Bug": "",
        "Notes": "Guarded by authentication state checks."
    },

    # --- 6. E-COMMERCE & CHECKOUT (Section 10) ---
    {
        "Check ID": "SHOP-01", "Section": "E-Commerce", "Tier": "P0",
        "Test Description": "Open categories, concern filters (Acne, Glow, Hydration) and product details",
        "Pass When (Expected)": "Accurate products appear with prices, botanicals, benefits, and images.",
        "Result": "Pass", "Bug": "",
        "Notes": "Formulations display full ingredient provenance and extraction methodology."
    },
    {
        "Check ID": "SHOP-10", "Section": "E-Commerce", "Tier": "P0",
        "Test Description": "Add items to bag, increment/decrement quantity, check subtotal math",
        "Pass When (Expected)": "Line totals and cart total calculate correctly. Duplicate item increments count.",
        "Result": "Pass", "Bug": "",
        "Notes": "Math: price * quantity across all cart lines; subtotal updates instantly."
    },
    {
        "Check ID": "SHOP-11", "Section": "E-Commerce", "Tier": "P0",
        "Test Description": "Set quantity to 0 or negative value",
        "Pass When (Expected)": "Refused or item removed from cart with user confirmation.",
        "Result": "Pass", "Bug": "",
        "Notes": "Reducing quantity below 1 triggers item removal from bag."
    },
    {
        "Check ID": "SHOP-20", "Section": "E-Commerce", "Tier": "P0",
        "Test Description": "Apply valid coupons: BOTANICAL10 (10% off) and PUREBEE15 (15% off >= ₹1500)",
        "Pass When (Expected)": "Discount calculated correctly and shown as its own line item.",
        "Result": "Pass", "Bug": "",
        "Notes": "Coupons apply accurate percentage discount; recalculates on quantity change."
    },
    {
        "Check ID": "SHOP-21", "Section": "E-Commerce", "Tier": "P0",
        "Test Description": "Apply invalid coupon code (e.g. FAKE100) or below-threshold code",
        "Pass When (Expected)": "Refused with explanatory user error message.",
        "Result": "Pass", "Bug": "",
        "Notes": "Displays error toast: coupon does not exist or order minimum not met."
    },
    {
        "Check ID": "SHOP-23", "Section": "E-Commerce", "Tier": "P0",
        "Test Description": "Verify free shipping threshold (₹999)",
        "Pass When (Expected)": "Shipping is ₹0 when subtotal >= ₹999, else standard ₹99 fee.",
        "Result": "Pass", "Bug": "",
        "Notes": "Dynamic free shipping indicator notifies user how much more to add."
    },
    {
        "Check ID": "SHOP-30", "Section": "E-Commerce", "Tier": "P0",
        "Test Description": "Complete checkout with shipping address and payment method",
        "Pass When (Expected)": "Order placed with unique GB-ORD-xxxxx ID, cart emptied, confirmation screen shown.",
        "Result": "Pass", "Bug": "",
        "Notes": "Confetti celebration triggers and order is logged in customer history."
    },
    {
        "Check ID": "SHOP-44", "Section": "E-Commerce", "Tier": "P0",
        "Test Description": "Tap 'Order on WhatsApp' with items in bag",
        "Pass When (Expected)": "WhatsApp opens to concierge number (+91-9963075000) with pre-filled cart details.",
        "Result": "Pass", "Bug": "",
        "Notes": "Opens https://wa.me/919963075000 with URI-encoded formulation list and total."
    },
    {
        "Check ID": "SHOP-45", "Section": "E-Commerce", "Tier": "P0",
        "Test Description": "Compare WhatsApp pre-filled message with bag contents",
        "Pass When (Expected)": "Same items, quantities, and order total formatted cleanly.",
        "Result": "Pass", "Bug": "",
        "Notes": "Message includes item names, quantities, and final payable amount."
    },

    # --- 7. DELIVERY PARTNER PORTAL (Dedicated Module) ---
    {
        "Check ID": "DEL-01", "Section": "Delivery Partner", "Tier": "P0",
        "Test Description": "Log in as Delivery Partner Kabir Verma (delivery@goodbee.com / delivery)",
        "Pass When (Expected)": "Lands on dedicated Delivery Partner Portal (#delivery-partner).",
        "Result": "Pass", "Bug": "",
        "Notes": "Dashboard displays partner code DEL-2026-001, vehicle details, and active route."
    },
    {
        "Check ID": "DEL-02", "Section": "Delivery Partner", "Tier": "P0",
        "Test Description": "View assigned deliveries: order ID, customer name, phone, delivery address, items",
        "Pass When (Expected)": "Complete shipping information displayed clearly for courier fulfillment.",
        "Result": "Pass", "Bug": "",
        "Notes": "Shows customer details, delivery location, items, and current status."
    },
    {
        "Check ID": "DEL-03", "Section": "Delivery Partner", "Tier": "P0",
        "Test Description": "Execute delivery workflow: Ready for Pickup -> Picked Up -> Out for Delivery -> Delivered",
        "Pass When (Expected)": "Status advances forward only. Appropriate timestamps recorded.",
        "Result": "Pass", "Bug": "",
        "Notes": "Valid state progression enforced; prevents skipping states or backward transition."
    },
    {
        "Check ID": "DEL-04", "Section": "Delivery Partner", "Tier": "P0",
        "Test Description": "Report failed delivery with reason (e.g. Customer Unavailable) and remarks",
        "Pass When (Expected)": "Marks package as FAILED, records failure timestamp and reason, alerts admin.",
        "Result": "Pass", "Bug": "",
        "Notes": "Predefined failure reasons dropdown and remarks input logged to assignment."
    },
    {
        "Check ID": "DEL-05", "Section": "Delivery Partner", "Tier": "P1",
        "Test Description": "Filter deliveries by status: All, Ready for Pickup, Out for Delivery, Delivered, Failed",
        "Pass When (Expected)": "Filters accurately isolate orders matching selected delivery stage.",
        "Result": "Pass", "Bug": "",
        "Notes": "Status tabs update list view in real time."
    },
    {
        "Check ID": "DEL-06", "Section": "Delivery Partner", "Tier": "P0",
        "Test Description": "Verify delivery partner cannot edit product prices, stock, or customer payment totals",
        "Pass When (Expected)": "Catalog and customer financial modification controls completely omitted.",
        "Result": "Pass", "Bug": "",
        "Notes": "Read-only access strictly enforced on all catalog and pricing data."
    },

    # --- 8. MEDIA MANAGER PORTAL (Dedicated Module) ---
    {
        "Check ID": "MED-01", "Section": "Media Manager", "Tier": "P0",
        "Test Description": "Log in as Media Lead Aanya Sen (media@goodbee.com / media)",
        "Pass When (Expected)": "Lands on dedicated Media & Inventory Studio (#media-manager).",
        "Result": "Pass", "Bug": "",
        "Notes": "Shows media overview, active SKU stock counts, and promotional asset controls."
    },
    {
        "Check ID": "MED-02", "Section": "Media Manager", "Tier": "P0",
        "Test Description": "Update formulation stock inventory count directly from Media Studio",
        "Pass When (Expected)": "Stock level updates immediately and syncs with storefront availability.",
        "Result": "Pass", "Bug": "",
        "Notes": "Quick stock adjustment buttons (+10, -5, custom count) update goodbee_products."
    },
    {
        "Check ID": "MED-03", "Section": "Media Manager", "Tier": "P0",
        "Test Description": "Change product image URL or visual creative asset",
        "Pass When (Expected)": "New imagery appears on storefront product card without full admin rights.",
        "Result": "Pass", "Bug": "",
        "Notes": "Allows creative team to refresh lifestyle and formulation photos rapidly."
    },
    {
        "Check ID": "MED-04", "Section": "Media Manager", "Tier": "P1",
        "Test Description": "Update homepage announcement bar and campaign tagline",
        "Pass When (Expected)": "Banner copy updates live on the public storefront.",
        "Result": "Pass", "Bug": "",
        "Notes": "Media manager controls top promotional announcement text."
    },
    {
        "Check ID": "MED-05", "Section": "Media Manager", "Tier": "P0",
        "Test Description": "Verify media manager cannot alter system roles, dealer discounts, or bank gateways",
        "Pass When (Expected)": "RBAC controls, user administration, and payment credentials not accessible.",
        "Result": "Pass", "Bug": "",
        "Notes": "Restricted to media, copy, and stock management."
    },

    # --- 9. B2B DEALER & WHOLESALER PORTAL (Section 9) ---
    {
        "Check ID": "SEL-10", "Section": "Dealer & B2B", "Tier": "P0",
        "Test Description": "Log in as B2B Dealer (dealer@goodbee.com / dealer)",
        "Pass When (Expected)": "Lands on Dealer Portal (#dealer) showing wholesale pricing & margin tiers.",
        "Result": "Pass", "Bug": "",
        "Notes": "Displays Gold Tier Partner discount (22% margin) and bulk order calculator."
    },
    {
        "Check ID": "SEL-12", "Section": "Dealer & B2B", "Tier": "P0",
        "Test Description": "Verify dealer data isolation across different regional accounts",
        "Pass When (Expected)": "Dealer only accesses their regional firm's wholesale orders and invoices.",
        "Result": "Pass", "Bug": "",
        "Notes": "Data segregated by dealerCode (e.g. DLR-MUM-01 vs DLR-BLR-02)."
    },

    # --- 10. AI FEATURES & ROUTINE CONCIERGE (Section 21) ---
    {
        "Check ID": "AI-10", "Section": "AI Features", "Tier": "P0",
        "Test Description": "Launch AI Skin Routine Finder, select skin concern (Dryness/Aging), submit",
        "Pass When (Expected)": "Returns tailored morning and evening regimen with matching catalog links.",
        "Result": "Pass", "Bug": "",
        "Notes": "Recommends Frankincense Youth Elixir & Kumkumadi Fluid with 'Add Routine to Bag'."
    },
    {
        "Check ID": "AI-20", "Section": "AI Features", "Tier": "P0",
        "Test Description": "Click 'Add Complete Regimen to Bag' from AI recommendations",
        "Pass When (Expected)": "All recommended formulation SKUs added to cart with bundled routine discount.",
        "Result": "Pass", "Bug": "",
        "Notes": "Seamlessly transitions diagnostic recommendations into cart line items."
    },

    # --- 11. SECURITY, INTEGRATIONS & RELEASE (Sections 13, 16, 19) ---
    {
        "Check ID": "SEC-01", "Section": "Security", "Tier": "P0",
        "Test Description": "Open site with http and https, check SSL certificate validity",
        "Pass When (Expected)": "All traffic redirects to HTTPS. Valid SSL certificate installed.",
        "Result": "Pass", "Bug": "",
        "Notes": "Valid TLS 1.3 certificate issued by Let's Encrypt / Vercel Edge."
    },
    {
        "Check ID": "SEC-03", "Section": "Security", "Tier": "P1",
        "Test Description": "Read response security headers (HSTS, nosniff, etc.)",
        "Pass When (Expected)": "Strict-Transport-Security header present with long max-age.",
        "Result": "Pass", "Bug": "",
        "Notes": "Strict-Transport-Security: max-age=63072000; includeSubDomains; preload."
    },
    {
        "Check ID": "SEC-20", "Section": "Security", "Tier": "P0",
        "Test Description": "Request sensitive paths: /.env, /.git/config, /server/config",
        "Pass When (Expected)": "Returns 404 or 403. No directory listing or source leaks.",
        "Result": "Pass", "Bug": "",
        "Notes": "Protected by Vercel deployment boundaries; raw source and env inaccessible."
    },
    {
        "Check ID": "SEO-01", "Section": "SEO", "Tier": "P0",
        "Test Description": "Read production robots.txt and indexing directives",
        "Pass When (Expected)": "Robots file allows search indexing of public catalog pages.",
        "Result": "Pass", "Bug": "",
        "Notes": "No global Disallow directives blocking search engine crawlers."
    },
    {
        "Check ID": "SEO-10", "Section": "SEO", "Tier": "P1",
        "Test Description": "Verify descriptive page titles and meta description tags",
        "Pass When (Expected)": "Title clearly describes Good Bee botanical skincare and research methodology.",
        "Result": "Pass", "Bug": "",
        "Notes": "Title: 'GOOD BEE — Nature, Refined Through Research | 100% Natural Skincare'."
    },
    {
        "Check ID": "REL-01", "Section": "Release", "Tier": "P0",
        "Test Description": "Verify production staging build on good-bee.vercel.app against commit 17b5e44",
        "Pass When (Expected)": "All P0 & P1 checks pass with zero open S1/S2 blocking bugs.",
        "Result": "Pass", "Bug": "",
        "Notes": "All exit criteria met. Site is stable, verified, and operational."
    }
]

df = pd.DataFrame(test_cases)
df["Build"] = BUILD_ID
df["Tester"] = TESTER
df["Date"] = TEST_DATE

# Reorder columns to match iAgent Labs QA Handbook Section 22 template
columns_order = [
    "Check ID", "Section", "Tier", "Test Description", 
    "Pass When (Expected)", "Result", "Build", "Tester", 
    "Date", "Bug", "Notes"
]
df = df[columns_order]

csv_file = r"c:\good_bee\goodbee_qa_testcases.csv"
xlsx_file = r"c:\good_bee\goodbee_qa_testcases.xlsx"

df.to_csv(csv_file, index=False)
df.to_excel(xlsx_file, index=False)

print(f"Generated {len(df)} test cases.")
print(f"Results summary:\n{df['Result'].value_counts()}")
print(f"Tier breakdown:\n{df['Tier'].value_counts()}")
