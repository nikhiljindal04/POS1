-- Drop existing view if it exists
DROP VIEW IF EXISTS order_details_view;

-- Enhanced order details view with additional fields
CREATE VIEW order_details_view AS
SELECT 
    o.order_id,
    o.order_number,
    o.restaurant_id,
    r.name as restaurant_name,
    r.currency,
    c.customer_id,
    c.name as customer_name,
    c.phone as customer_phone,
    c.email as customer_email,
    c.loyalty_points,
    c.customer_tier,
    t.table_id,
    t.table_number,
    t.section as table_section,
    t.capacity as table_capacity,
    o.order_type,
    o.status as order_status,
    o.subtotal,
    o.tax_amount,
    o.discount_amount,
    o.total_amount,
    o.loyalty_points_earned,
    o.loyalty_points_redeemed,
    o.source as order_source,
    o.payment_status,
    o.notes,
    o.estimated_completion_time,
    o.actual_completion_time,
    o.delivery_address,
    o.delivery_instructions,
    o.customer_instructions,
    o.created_at as order_created_at,
    o.updated_at as order_updated_at,
    o.completed_at,
    u.user_id,
    u.full_name as cashier_name,
    u.username as cashier_username,
    u.role as cashier_role,
    -- Order item count
    COALESCE(oi.item_count, 0) as total_items,
    -- Payment status indicator
    CASE 
        WHEN o.payment_status = 'paid' THEN 'Paid'
        WHEN o.payment_status = 'pending' THEN 'Pending Payment'
        WHEN o.payment_status = 'failed' THEN 'Payment Failed'
        WHEN o.payment_status = 'refunded' THEN 'Refunded'
        ELSE 'Unknown'
    END as payment_status_display,
    -- Order age in minutes
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - o.created_at))/60 as order_age_minutes
FROM orders o
LEFT JOIN restaurants r ON o.restaurant_id = r.restaurant_id
LEFT JOIN customers c ON o.customer_id = c.customer_id
LEFT JOIN tables t ON o.table_id = t.table_id
LEFT JOIN users u ON o.user_id = u.user_id
LEFT JOIN (
    SELECT 
        order_id, 
        COUNT(*) as item_count,
        SUM(quantity) as total_quantity
    FROM order_items 
    GROUP BY order_id
) oi ON o.order_id = oi.order_id;

-- Drop existing view if it exists
DROP VIEW IF EXISTS available_tables_view;

-- Enhanced available tables view with reservation details
CREATE VIEW available_tables_view AS
SELECT 
    t.table_id,
    t.restaurant_id,
    r.name as restaurant_name,
    t.table_number,
    t.capacity,
    t.section,
    t.status as base_status,
    t.qr_code_url,
    t.created_at,
    t.updated_at,
    -- Current reservation details
    tr.reservation_id,
    tr.customer_name as reserved_customer_name,
    tr.customer_phone as reserved_customer_phone,
    tr.party_size as reserved_party_size,
    tr.reservation_time,
    tr.duration_minutes as reservation_duration,
    tr.special_requests,
    -- Current active order
    ao.order_id as active_order_id,
    ao.order_number as active_order_number,
    ao.status as active_order_status,
    -- Computed current status
    CASE 
        -- Table has active order
        WHEN ao.order_id IS NOT NULL AND ao.status IN ('pending', 'confirmed', 'preparing') THEN 'occupied'
        -- Table has confirmed reservation within time window
        WHEN tr.reservation_id IS NOT NULL 
             AND tr.status = 'confirmed' 
             AND tr.reservation_time BETWEEN CURRENT_TIMESTAMP - INTERVAL '30 minutes' 
                                          AND CURRENT_TIMESTAMP + INTERVAL '2 hours' THEN 'reserved'
        -- Table is in maintenance
        WHEN t.status = 'maintenance' THEN 'maintenance'
        -- Default to available
        ELSE 'available' 
    END as current_status,
    -- Availability indicator
    CASE 
        WHEN t.status = 'maintenance' THEN false
        WHEN ao.order_id IS NOT NULL AND ao.status IN ('pending', 'confirmed', 'preparing') THEN false
        WHEN tr.reservation_id IS NOT NULL 
             AND tr.status = 'confirmed' 
             AND tr.reservation_time BETWEEN CURRENT_TIMESTAMP - INTERVAL '15 minutes' 
                                          AND CURRENT_TIMESTAMP + INTERVAL '1 hour' THEN false
        ELSE true
    END as is_available,
    -- Next reservation time
    nr.next_reservation_time,
    nr.next_customer_name
FROM tables t
LEFT JOIN restaurants r ON t.restaurant_id = r.restaurant_id
-- Current active reservations
LEFT JOIN table_reservations tr ON t.table_id = tr.table_id 
    AND tr.status = 'confirmed' 
    AND tr.reservation_time BETWEEN CURRENT_TIMESTAMP - INTERVAL '30 minutes' 
                                 AND CURRENT_TIMESTAMP + INTERVAL '2 hours'
-- Active orders on table
LEFT JOIN orders ao ON t.table_id = ao.table_id 
    AND ao.status IN ('pending', 'confirmed', 'preparing', 'ready')
-- Next upcoming reservation
LEFT JOIN (
    SELECT DISTINCT ON (table_id)
        table_id,
        reservation_time as next_reservation_time,
        customer_name as next_customer_name
    FROM table_reservations 
    WHERE status = 'confirmed' 
      AND reservation_time > CURRENT_TIMESTAMP
    ORDER BY table_id, reservation_time ASC
) nr ON t.table_id = nr.table_id;

-- Menu items with category and restaurant details
CREATE VIEW menu_items_view AS
SELECT 
    mi.item_id,
    mi.restaurant_id,
    r.name as restaurant_name,
    r.currency,
    mi.category_id,
    mc.name as category_name,
    mi.name as item_name,
    mi.description,
    mi.price,
    mi.cost,
    mi.is_available,
    mi.preparation_time,
    mi.ingredients,
    mi.allergens,
    mi.image_url,
    mi.is_vegetarian,
    mi.is_vegan,
    mi.is_gluten_free,
    mi.spice_level,
    mi.calories,
    mi.tags,
    mi.sku,
    mi.display_order,
    -- Profit margin calculation
    CASE 
        WHEN mi.cost IS NOT NULL AND mi.cost > 0 
        THEN ROUND(((mi.price - mi.cost) / mi.price * 100)::numeric, 2)
        ELSE NULL
    END as profit_margin_percent
FROM menu_items mi
LEFT JOIN restaurants r ON mi.restaurant_id = r.restaurant_id
LEFT JOIN menu_categories mc ON mi.category_id = mc.category_id
WHERE mi.is_available = true
ORDER BY mc.display_order, mi.display_order, mi.name;

-- Daily sales summary view
CREATE VIEW daily_sales_summary AS
SELECT 
    o.restaurant_id,
    r.name as restaurant_name,
    DATE(o.created_at) as sales_date,
    COUNT(*) as total_orders,
    COUNT(DISTINCT o.customer_id) as unique_customers,
    SUM(o.total_amount) as total_revenue,
    AVG(o.total_amount) as avg_order_value,
    SUM(o.discount_amount) as total_discounts,
    SUM(o.loyalty_points_earned) as total_loyalty_points_earned,
    COUNT(CASE WHEN o.order_type = 'dine-in' THEN 1 END) as dine_in_orders,
    COUNT(CASE WHEN o.order_type = 'takeaway' THEN 1 END) as takeaway_orders,
    COUNT(CASE WHEN o.order_type = 'delivery' THEN 1 END) as delivery_orders
FROM orders o
LEFT JOIN restaurants r ON o.restaurant_id = r.restaurant_id
WHERE o.status = 'served' 
  AND o.payment_status = 'paid'
  AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY o.restaurant_id, r.name, DATE(o.created_at)
ORDER BY sales_date DESC, restaurant_name;

-- Customer loyalty summary
CREATE VIEW customer_loyalty_view AS
SELECT 
    c.customer_id,
    c.restaurant_id,
    r.name as restaurant_name,
    c.name as customer_name,
    c.phone,
    c.email,
    c.loyalty_points,
    c.customer_tier,
    COUNT(o.order_id) as total_orders,
    SUM(o.total_amount) as total_spent,
    AVG(o.total_amount) as avg_order_value,
    MAX(o.created_at) as last_order_date,
    EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - MAX(o.created_at))) as days_since_last_order
FROM customers c
LEFT JOIN restaurants r ON c.restaurant_id = r.restaurant_id
LEFT JOIN orders o ON c.customer_id = o.customer_id 
    AND o.status = 'served' 
    AND o.payment_status = 'paid'
GROUP BY c.customer_id, c.restaurant_id, r.name, c.name, c.phone, c.email, c.loyalty_points, c.customer_tier
ORDER BY total_spent DESC;
