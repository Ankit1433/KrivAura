CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,

    user_id INT NOT NULL,

    full_name VARCHAR(100) NOT NULL,

    phone VARCHAR(15) NOT NULL,

    address_line1 TEXT NOT NULL,

    address_line2 TEXT,

    landmark VARCHAR(150),

    city VARCHAR(100) NOT NULL,

    state VARCHAR(100) NOT NULL,

    postal_code VARCHAR(10) NOT NULL,

    country VARCHAR(50) DEFAULT 'India',

    address_type VARCHAR(20) DEFAULT 'Home',

    is_default BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_address_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_address_user ON addresses(user_id);






ALTER TABLE orders
ADD COLUMN address_id INT;

ALTER TABLE orders
ADD CONSTRAINT fk_order_address
FOREIGN KEY(address_id)
REFERENCES addresses(id);