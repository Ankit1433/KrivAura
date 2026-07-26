CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,

    order_id INT NOT NULL UNIQUE,

    provider VARCHAR(30),

    shipment_id VARCHAR(100),

    tracking_number VARCHAR(100),

    awb_code VARCHAR(100),

    courier_name VARCHAR(100),

    shipment_status VARCHAR(30) DEFAULT 'Pending',

    estimated_delivery DATE,

    shipped_at TIMESTAMP,

    delivered_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_shipments_order
        FOREIGN KEY(order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_shipment_order
ON shipments(order_id);


CREATE TYPE payment_status_enum AS ENUM (
    'Pending',
    'Paid',
    'Failed',
    'Refunded'
);

CREATE TYPE order_status_enum AS ENUM (
    'Pending',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Delivered',
    'Cancelled'
);

CREATE TYPE shipment_status_enum AS ENUM (
    'Pending',
    'Packed',
    'Shipped',
    'Out For Delivery',
    'Delivered',
    'Cancelled'
);



ALTER TABLE orders
ALTER COLUMN payment_status
TYPE payment_status_enum
USING payment_status::payment_status_enum;

ALTER TABLE orders
ALTER COLUMN order_status
TYPE order_status_enum
USING order_status::order_status_enum;

ALTER TABLE shipments
ALTER COLUMN shipment_status
TYPE shipment_status_enum
USING shipment_status::shipment_status_enum;



ALTER TABLE orders
ALTER COLUMN payment_status
SET DEFAULT 'Pending';

ALTER TABLE orders
ALTER COLUMN order_status
SET DEFAULT 'Pending';

ALTER TABLE shipments
ALTER COLUMN shipment_status
SET DEFAULT 'Pending';



UPDATE products
SET stock = 0
WHERE stock IS NULL;


ALTER TABLE products
ALTER COLUMN stock SET NOT NULL;

ALTER TABLE products
ALTER COLUMN stock SET DEFAULT 0;



ALTER TABLE carts
ADD CONSTRAINT chk_cart_quantity
CHECK(quantity > 0);

ALTER TABLE order_items
ADD CONSTRAINT chk_order_quantity
CHECK(quantity > 0);




ALTER TABLE products
ADD CONSTRAINT chk_price
CHECK(price > 0);

ALTER TABLE products
ADD CONSTRAINT chk_discount
CHECK(
    discount_price IS NULL
    OR
    discount_price <= price
);



ALTER TABLE products
ADD CONSTRAINT chk_stock
CHECK(stock >= 0);



ALTER TABLE shipments
ADD COLUMN label_url TEXT;



ALTER TABLE products
ADD COLUMN weight_grams INT DEFAULT 500;