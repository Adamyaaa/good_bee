-- Good Bee Skincare Platform - Production PostgreSQL Schema
-- Compatible with Neon, Supabase, Render Postgres, AWS RDS, Docker, and standard PostgreSQL 14+

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'CUSTOMER',
    phone VARCHAR(32),
    company_name VARCHAR(255),
    lab_cert_id VARCHAR(64),
    dealer_code VARCHAR(64),
    gst_number VARCHAR(64),
    tier VARCHAR(64),
    commission_margin_pct NUMERIC(5,2) DEFAULT 0.00,
    loyalty_points INTEGER DEFAULT 0,
    referral_code VARCHAR(64),
    city VARCHAR(128),
    state VARCHAR(128),
    partner_code VARCHAR(64),
    vehicle_type VARCHAR(128),
    vehicle_number VARCHAR(64),
    delivery_zone VARCHAR(128),
    duty_status VARCHAR(32) DEFAULT 'ON_DUTY',
    total_orders INTEGER DEFAULT 0,
    total_spend NUMERIC(12,2) DEFAULT 0.00,
    earnings NUMERIC(12,2) DEFAULT 0.00,
    title VARCHAR(255),
    addresses JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS partner_code VARCHAR(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS vehicle_type VARCHAR(128);
ALTER TABLE users ADD COLUMN IF NOT EXISTS vehicle_number VARCHAR(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS delivery_zone VARCHAR(128);
ALTER TABLE users ADD COLUMN IF NOT EXISTS duty_status VARCHAR(32) DEFAULT 'ON_DUTY';
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_spend NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS earnings NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS addresses JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    sku VARCHAR(64) UNIQUE NOT NULL,
    category VARCHAR(128) NOT NULL,
    concerns JSONB DEFAULT '[]'::jsonb,
    price NUMERIC(10,2) NOT NULL,
    mrp NUMERIC(10,2) NOT NULL,
    volume VARCHAR(64),
    rating NUMERIC(3,2),
    reviews_count INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 50,
    low_stock_threshold INTEGER DEFAULT 10,
    badge VARCHAR(64),
    short_description TEXT,
    description TEXT,
    ingredients JSONB DEFAULT '[]'::jsonb,
    ritual TEXT,
    research_notes TEXT,
    image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    field_photos JSONB DEFAULT '[]'::jsonb,
    field_videos JSONB DEFAULT '[]'::jsonb,
    processing_unit_photos JSONB DEFAULT '[]'::jsonb,
    accreditations JSONB DEFAULT '[]'::jsonb,
    farmer_story JSONB,
    manufacturing_process TEXT,
    producer_id VARCHAR(64),
    producer_name VARCHAR(255),
    status VARCHAR(32) DEFAULT 'PUBLISHED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE products ADD COLUMN IF NOT EXISTS field_photos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS field_videos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS processing_unit_photos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS accreditations JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS farmer_story JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS manufacturing_process TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS producer_id VARCHAR(64);
ALTER TABLE products ADD COLUMN IF NOT EXISTS producer_name VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- 4. Customer Product Reviews & Ratings Table
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(255) NOT NULL,
    author_city VARCHAR(128) DEFAULT 'Verified Buyer',
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    headline VARCHAR(255),
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT TRUE,
    status VARCHAR(32) DEFAULT 'APPROVED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- 5. Orders Table (Consumer & Direct Orders)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(32),
    items JSONB NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    discount NUMERIC(10,2) DEFAULT 0.00,
    shipping NUMERIC(10,2) DEFAULT 0.00,
    total NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(64) DEFAULT 'DYNAMIC_UPI_QR',
    payment_status VARCHAR(32) DEFAULT 'PENDING_PAYMENT',
    upi_ref VARCHAR(128),
    order_status VARCHAR(32) DEFAULT 'PROCESSING',
    shipping_address JSONB NOT NULL,
    promoter_code VARCHAR(64),
    promoter_id VARCHAR(64),
    dealer_id VARCHAR(64),
    paid_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS promoter_id VARCHAR(64);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dealer_id VARCHAR(64);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);

-- 5.1 B2B Dealer Wholesale Purchase Orders Table
CREATE TABLE IF NOT EXISTS dealer_orders (
    id VARCHAR(64) PRIMARY KEY,
    dealer_id VARCHAR(64),
    dealer_code VARCHAR(64) NOT NULL,
    dealer_name VARCHAR(255),
    items JSONB NOT NULL,
    total_units INTEGER DEFAULT 0,
    subtotal NUMERIC(10,2) NOT NULL,
    gst NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(32) DEFAULT 'PROCESSING',
    courier VARCHAR(128) DEFAULT 'Pending Regional Dispatch',
    tracking_no VARCHAR(128) DEFAULT 'Pending Assignment',
    payment_terms VARCHAR(128) DEFAULT 'Net-30 Invoice Dispatched',
    date_label VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dealer_orders_code ON dealer_orders(dealer_code);

-- 6. Supplier Batch Submissions Table
CREATE TABLE IF NOT EXISTS supplier_submissions (
    id VARCHAR(64) PRIMARY KEY,
    producer_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    producer_name VARCHAR(255) NOT NULL,
    lab_cert_id VARCHAR(64),
    batch_lot VARCHAR(64),
    product_name VARCHAR(255),
    title VARCHAR(255),
    category VARCHAR(128) NOT NULL,
    concerns JSONB DEFAULT '[]'::jsonb,
    price NUMERIC(10,2) DEFAULT 0.00,
    mrp NUMERIC(10,2) DEFAULT 0.00,
    volume VARCHAR(64),
    stock INTEGER DEFAULT 50,
    volume_liters NUMERIC(10,2),
    extraction_date DATE,
    lab_purity_pct NUMERIC(5,2),
    gc_ms_report_url TEXT,
    cert_of_analysis_url TEXT,
    botanical_origin VARCHAR(255),
    ingredients TEXT,
    description TEXT,
    image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    field_photos JSONB DEFAULT '[]'::jsonb,
    field_videos JSONB DEFAULT '[]'::jsonb,
    processing_unit_photos JSONB DEFAULT '[]'::jsonb,
    processing_unit_videos JSONB DEFAULT '[]'::jsonb,
    accreditations JSONB DEFAULT '[]'::jsonb,
    farmer_story JSONB,
    lot_number VARCHAR(128),
    origin VARCHAR(255),
    harvest_season VARCHAR(128),
    active_purity VARCHAR(128),
    coa_status VARCHAR(64),
    batch_doc VARCHAR(255),
    manufacturing_process TEXT,
    status VARCHAR(32) DEFAULT 'PENDING_REVIEW',
    admin_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS lab_cert_id VARCHAR(64);
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS concerns JSONB DEFAULT '[]'::jsonb;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0.00;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS mrp NUMERIC(10,2) DEFAULT 0.00;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS volume VARCHAR(64);
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 50;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS ingredients TEXT;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS field_photos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS field_videos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS processing_unit_photos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS processing_unit_videos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS accreditations JSONB DEFAULT '[]'::jsonb;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS farmer_story JSONB;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS lot_number VARCHAR(128);
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS origin VARCHAR(255);
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS harvest_season VARCHAR(128);
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS active_purity VARCHAR(128);
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS coa_status VARCHAR(64);
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS batch_doc VARCHAR(255);
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS manufacturing_process TEXT;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE supplier_submissions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE supplier_submissions ALTER COLUMN batch_lot DROP NOT NULL;
ALTER TABLE supplier_submissions ALTER COLUMN product_name DROP NOT NULL;
ALTER TABLE supplier_submissions ALTER COLUMN volume_liters DROP NOT NULL;

-- 7. Platform Site Content & Configuration Table
CREATE TABLE IF NOT EXISTS site_content (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'primary_storefront',
    config_data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Delivery Partner Assignments Table
CREATE TABLE IF NOT EXISTS delivery_assignments (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    delivery_partner_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    delivery_partner_name VARCHAR(255),
    provider_type VARCHAR(32) DEFAULT 'IN_HOUSE',
    order_preparation_status VARCHAR(32) DEFAULT 'PREPARING',
    delivery_status VARCHAR(32) DEFAULT 'ASSIGNED',
    customer_name VARCHAR(255),
    customer_phone VARCHAR(32),
    shipping_address JSONB,
    pickup_location JSONB NOT NULL,
    items JSONB DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10,2) DEFAULT 0.00,
    delivery_notes TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ready_for_pickup_at TIMESTAMP WITH TIME ZONE,
    picked_up_at TIMESTAMP WITH TIME ZONE,
    out_for_delivery_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    failure_reason VARCHAR(128),
    failure_remarks TEXT,
    flagged_for_admin_review BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE delivery_assignments DROP CONSTRAINT IF EXISTS delivery_assignments_order_id_fkey;
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS delivery_partner_name VARCHAR(255);
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(32);
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10,2) DEFAULT 0.00;
ALTER TABLE delivery_assignments ADD COLUMN IF NOT EXISTS delivery_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_delivery_partner ON delivery_assignments(delivery_partner_id);
CREATE INDEX IF NOT EXISTS idx_delivery_order ON delivery_assignments(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_status ON delivery_assignments(delivery_status);

-- 9. Delivery Status History Audit Log Table
CREATE TABLE IF NOT EXISTS delivery_status_history (
    id VARCHAR(64) PRIMARY KEY,
    assignment_id VARCHAR(64) NOT NULL REFERENCES delivery_assignments(id) ON DELETE CASCADE,
    previous_status VARCHAR(32),
    new_status VARCHAR(32) NOT NULL,
    changed_by_user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    changed_by_name VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT
);

-- 10. In-App Delivery Notifications Table
CREATE TABLE IF NOT EXISTS delivery_notifications (
    id VARCHAR(64) PRIMARY KEY,
    delivery_partner_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assignment_id VARCHAR(64) REFERENCES delivery_assignments(id) ON DELETE SET NULL,
    order_id VARCHAR(64),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
