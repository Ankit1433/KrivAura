-- User Role Enum
CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- Users Table
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
