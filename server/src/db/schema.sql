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
    status VARCHAR(32) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
    rating NUMERIC(3,2) DEFAULT 4.9,
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
    status VARCHAR(32) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- 4. Customer Product Reviews & Ratings Table
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(255) NOT NULL,
    author_city VARCHAR(128) DEFAULT 'Verified Patron',
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    headline VARCHAR(255),
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT TRUE,
    status VARCHAR(32) DEFAULT 'APPROVED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- 5. Orders Table
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
    payment_status VARCHAR(32) DEFAULT 'PAID',
    upi_ref VARCHAR(128),
    order_status VARCHAR(32) DEFAULT 'PROCESSING',
    shipping_address JSONB NOT NULL,
    promoter_code VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);

-- 6. Supplier Batch Submissions Table
CREATE TABLE IF NOT EXISTS supplier_submissions (
    id VARCHAR(64) PRIMARY KEY,
    producer_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    producer_name VARCHAR(255) NOT NULL,
    batch_lot VARCHAR(64) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    volume_liters NUMERIC(10,2) NOT NULL,
    extraction_date DATE,
    lab_purity_pct NUMERIC(5,2),
    gc_ms_report_url TEXT,
    cert_of_analysis_url TEXT,
    botanical_origin VARCHAR(255),
    status VARCHAR(32) DEFAULT 'PENDING_REVIEW',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Platform Site Content & Configuration Table
CREATE TABLE IF NOT EXISTS site_content (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'primary_storefront',
    config_data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
