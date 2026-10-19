ALTER TABLE orders
ADD COLUMN cashfree_order_id VARCHAR(45);

ALTER TABLE orders
ADD COLUMN cashfree_payment_session_id TEXT;

ALTER TABLE orders
ADD COLUMN cashfree_payment_id VARCHAR(255);

CREATE UNIQUE INDEX idx_orders_cashfree_order_id
ON orders(cashfree_order_id)
WHERE cashfree_order_id IS NOT NULL;
