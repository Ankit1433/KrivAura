-- ===========================
-- DROP OLD OBJECTS (Optional)
-- ===========================

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;

-- ===========================
-- ENUMS
-- ===========================

CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- ===========================
-- USERS
-- ===========================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role user_role DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- CATEGORIES
-- ===========================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- PRODUCTS
-- ===========================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    discount_price NUMERIC(10,2),
    stock INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT
);

-- ===========================
-- PRODUCT IMAGES
-- ===========================

CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    image_url TEXT NOT NULL,
    is_thumbnail BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_images_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

-- ===========================
-- CART
-- ===========================

CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_cart UNIQUE(user_id, product_id)
);

-- ===========================
-- WISHLIST
-- ===========================

CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_wishlist_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_wishlist_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_wishlist UNIQUE(user_id, product_id)
);

-- ===========================
-- ORDERS
-- ===========================

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,

    total_amount NUMERIC(10,2) NOT NULL,

    shipping_address TEXT NOT NULL,

    payment_method VARCHAR(20) NOT NULL,

    payment_status VARCHAR(20) DEFAULT 'Pending',

    order_status VARCHAR(20) DEFAULT 'Pending',

    payment_id VARCHAR(255),

    razorpay_order_id VARCHAR(255),

    razorpay_payment_id VARCHAR(255),

    razorpay_signature TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ===========================
-- ORDER ITEMS
-- ===========================

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,

    order_id INT NOT NULL,

    product_id INT NOT NULL,

    quantity INT NOT NULL,

    price NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY(order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_items_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
);

-- ===========================
-- INDEXES
-- ===========================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_cart_user ON carts(user_id);
CREATE INDEX idx_wishlist_user ON wishlists(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ===========================
-- VERIFY
-- ===========================

SELECT table_name
FROM information_schema.tables
WHERE table_schema='public'
ORDER BY table_name;