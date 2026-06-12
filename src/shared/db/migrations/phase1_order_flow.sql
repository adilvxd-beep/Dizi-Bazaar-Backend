-- Phase 1: Order Flow V2 (Broadcast & Hybrid Fulfillment)

-- 1. Wholesaler Inventory Preference
ALTER TABLE users ADD COLUMN IF NOT EXISTS manages_inventory BOOLEAN DEFAULT true;

-- 2. Revamp Orders Table (for multi-item support)
-- Note: Assuming the old 'orders' table was a simplified placeholder, we'll alter it or recreate it.
-- Let's drop if it's just a mock, but in production we'd migrate. We'll use IF NOT EXISTS for safety.
-- We will rename the old table to 'orders_legacy' if it has the old structure, but for simplicity:

-- Create a robust Orders table
CREATE TABLE IF NOT EXISTS orders_v2 (
    id SERIAL PRIMARY KEY,
    retailer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'pending', -- pending, broadcasted, partial, accepted, shipping, completed, cancelled
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders_v2(id) ON DELETE CASCADE,
    product_variant_id INTEGER REFERENCES product_variants(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    fulfilled_by_wholesaler_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- set when a wholesaler accepts this item
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Broadcasts Table (linking orders to wholesalers)
CREATE TABLE IF NOT EXISTS order_broadcasts (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders_v2(id) ON DELETE CASCADE,
    wholesaler_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, viewed, accepted (partially or fully), rejected, expired
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(order_id, wholesaler_id)
);

-- 5. Add Stock to Product Variants if not exists
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
