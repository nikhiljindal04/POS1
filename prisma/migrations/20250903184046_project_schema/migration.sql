-- CreateTable
CREATE TABLE "public"."restaurants" (
    "restaurant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "address" TEXT,
    "timezone" VARCHAR(50),
    "subscription_plan" VARCHAR(50),
    "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("restaurant_id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "user_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "password_hash" VARCHAR(255),
    "role" VARCHAR(20) NOT NULL,
    "full_name" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."customers" (
    "customer_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "name" VARCHAR(255),
    "date_of_birth" TIMESTAMP(3),
    "anniversary" TIMESTAMP(3),
    "address" TEXT,
    "loyalty_points" INTEGER NOT NULL DEFAULT 0,
    "customer_tier" VARCHAR(20) NOT NULL DEFAULT 'regular',
    "preferences" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "public"."tables" (
    "table_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "table_number" VARCHAR(20) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "section" VARCHAR(50),
    "status" VARCHAR(20) NOT NULL DEFAULT 'available',
    "qr_code_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("table_id")
);

-- CreateTable
CREATE TABLE "public"."table_reservations" (
    "reservation_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "table_id" UUID NOT NULL,
    "customer_id" UUID,
    "customer_name" VARCHAR(255) NOT NULL,
    "customer_phone" VARCHAR(20),
    "party_size" INTEGER NOT NULL,
    "reservation_time" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 120,
    "status" VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    "special_requests" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "table_reservations_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateTable
CREATE TABLE "public"."menu_categories" (
    "category_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "display_order" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "public"."menu_items" (
    "item_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "category_id" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "cost" DECIMAL(65,30),
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "preparation_time" INTEGER,
    "ingredients" TEXT[],
    "allergens" TEXT[],
    "image_url" VARCHAR(500),
    "is_vegetarian" BOOLEAN NOT NULL DEFAULT false,
    "is_vegan" BOOLEAN NOT NULL DEFAULT false,
    "is_gluten_free" BOOLEAN NOT NULL DEFAULT false,
    "spice_level" INTEGER,
    "calories" INTEGER,
    "nutritional_info" JSONB,
    "tags" TEXT[],
    "sku" TEXT,
    "display_order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "public"."modifier_groups" (
    "group_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "selection_type" VARCHAR(20) NOT NULL DEFAULT 'single',
    "min_selections" INTEGER NOT NULL DEFAULT 0,
    "max_selections" INTEGER,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "modifier_groups_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "public"."menu_modifiers" (
    "modifier_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "price_adjustment" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_modifiers_pkey" PRIMARY KEY ("modifier_id")
);

-- CreateTable
CREATE TABLE "public"."modifier_group_items" (
    "group_id" UUID NOT NULL,
    "modifier_id" UUID NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "modifier_group_items_pkey" PRIMARY KEY ("group_id","modifier_id")
);

-- CreateTable
CREATE TABLE "public"."item_modifier_groups" (
    "item_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "item_modifier_groups_pkey" PRIMARY KEY ("item_id","group_id")
);

-- CreateTable
CREATE TABLE "public"."tax_rates" (
    "tax_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "tax_name" VARCHAR(100) NOT NULL,
    "tax_percentage" DECIMAL(65,30) NOT NULL,
    "tax_type" VARCHAR(20) NOT NULL DEFAULT 'exclusive',
    "applies_to" VARCHAR(20) NOT NULL DEFAULT 'all',
    "is_compound" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tax_rates_pkey" PRIMARY KEY ("tax_id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "order_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "customer_id" UUID,
    "user_id" UUID,
    "table_id" UUID,
    "order_number" VARCHAR(50),
    "order_type" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "subtotal" DECIMAL(65,30),
    "tax_amount" DECIMAL(65,30),
    "discount_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(65,30),
    "notes" TEXT,
    "estimated_completion_time" TIMESTAMP(3),
    "actual_completion_time" TIMESTAMP(3),
    "delivery_address" TEXT,
    "delivery_instructions" TEXT,
    "customer_instructions" TEXT,
    "loyalty_points_earned" INTEGER NOT NULL DEFAULT 0,
    "loyalty_points_redeemed" INTEGER NOT NULL DEFAULT 0,
    "source" VARCHAR(20) NOT NULL DEFAULT 'pos',
    "payment_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "public"."order_items" (
    "order_item_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "item_id" UUID,
    "line_number" INTEGER,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(65,30),
    "cost_per_unit" DECIMAL(65,30),
    "discount_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "modifiers_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_price" DECIMAL(65,30),
    "special_instructions" TEXT,
    "item_notes" TEXT,
    "status" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("order_item_id")
);

-- CreateTable
CREATE TABLE "public"."order_item_modifiers" (
    "order_item_modifier_id" UUID NOT NULL,
    "order_item_id" UUID NOT NULL,
    "modifier_id" UUID NOT NULL,
    "modifier_name" TEXT NOT NULL,
    "price_adjustment" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_item_modifiers_pkey" PRIMARY KEY ("order_item_modifier_id")
);

-- CreateTable
CREATE TABLE "public"."order_taxes" (
    "order_tax_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "tax_id" UUID NOT NULL,
    "tax_name" TEXT NOT NULL,
    "tax_percentage" DECIMAL(65,30) NOT NULL,
    "taxable_amount" DECIMAL(65,30) NOT NULL,
    "tax_amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_taxes_pkey" PRIMARY KEY ("order_tax_id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "payment_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_method" VARCHAR(20) NOT NULL,
    "transaction_id" VARCHAR(255),
    "status" VARCHAR(20) NOT NULL,
    "refund_reference" VARCHAR(255),
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "public"."inventory_items" (
    "inventory_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "current_stock" DOUBLE PRECISION,
    "min_stock_level" DOUBLE PRECISION,
    "unit" VARCHAR(50),
    "cost_per_unit" DECIMAL(65,30),
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "public"."shifts" (
    "shift_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "break_duration" INTEGER NOT NULL DEFAULT 0,
    "sales_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("shift_id")
);

-- CreateTable
CREATE TABLE "public"."daily_sales" (
    "sales_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "sales_date" TIMESTAMP(3) NOT NULL,
    "total_orders" INTEGER,
    "total_revenue" DECIMAL(65,30),
    "avg_order_value" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_sales_pkey" PRIMARY KEY ("sales_id")
);

-- CreateTable
CREATE TABLE "public"."promotions" (
    "promotion_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "discount_type" VARCHAR(20) NOT NULL,
    "discount_value" DECIMAL(65,30),
    "min_order_amount" DECIMAL(65,30),
    "valid_from" TIMESTAMP(3),
    "valid_to" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("promotion_id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "log_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "user_id" UUID,
    "table_name" VARCHAR(100),
    "operation" VARCHAR(20) NOT NULL,
    "record_id" TEXT,
    "old_values" JSONB,
    "new_values" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("log_id")
);

-- CreateIndex
CREATE INDEX "idx_users_restaurant" ON "public"."users"("restaurant_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_restaurant_id_username_key" ON "public"."users"("restaurant_id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "users_restaurant_id_email_key" ON "public"."users"("restaurant_id", "email");

-- CreateIndex
CREATE INDEX "idx_customers_phone" ON "public"."customers"("phone");

-- CreateIndex
CREATE INDEX "idx_customers_restaurant" ON "public"."customers"("restaurant_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_restaurant_id_phone_key" ON "public"."customers"("restaurant_id", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "customers_restaurant_id_email_key" ON "public"."customers"("restaurant_id", "email");

-- CreateIndex
CREATE INDEX "idx_tables_restaurant" ON "public"."tables"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_tables_status" ON "public"."tables"("status");

-- CreateIndex
CREATE UNIQUE INDEX "tables_restaurant_id_table_number_key" ON "public"."tables"("restaurant_id", "table_number");

-- CreateIndex
CREATE INDEX "idx_reservations_table" ON "public"."table_reservations"("table_id");

-- CreateIndex
CREATE INDEX "idx_reservations_time" ON "public"."table_reservations"("reservation_time");

-- CreateIndex
CREATE INDEX "idx_reservations_restaurant_time_status" ON "public"."table_reservations"("restaurant_id", "reservation_time", "status");

-- CreateIndex
CREATE INDEX "idx_categories_restaurant" ON "public"."menu_categories"("restaurant_id");

-- CreateIndex
CREATE UNIQUE INDEX "menu_items_sku_key" ON "public"."menu_items"("sku");

-- CreateIndex
CREATE INDEX "idx_items_restaurant" ON "public"."menu_items"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_items_category" ON "public"."menu_items"("category_id");

-- CreateIndex
CREATE INDEX "idx_menu_items_tags" ON "public"."menu_items" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "idx_menu_items_dietary" ON "public"."menu_items"("is_vegetarian", "is_vegan", "is_gluten_free");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "public"."orders"("order_number");

-- CreateIndex
CREATE INDEX "idx_orders_restaurant" ON "public"."orders"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_orders_customer" ON "public"."orders"("customer_id");

-- CreateIndex
CREATE INDEX "idx_orders_status" ON "public"."orders"("status");

-- CreateIndex
CREATE INDEX "idx_orders_created_at" ON "public"."orders"("created_at");

-- CreateIndex
CREATE INDEX "idx_orders_order_number" ON "public"."orders"("order_number");

-- CreateIndex
CREATE INDEX "idx_orders_table" ON "public"."orders"("table_id");

-- CreateIndex
CREATE INDEX "idx_orders_source" ON "public"."orders"("source");

-- CreateIndex
CREATE INDEX "idx_orders_payment_status" ON "public"."orders"("payment_status");

-- CreateIndex
CREATE INDEX "idx_orders_restaurant_status_date" ON "public"."orders"("restaurant_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "idx_orders_restaurant_user_date" ON "public"."orders"("restaurant_id", "user_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_order_items_order" ON "public"."order_items"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_order_id_line_number_key" ON "public"."order_items"("order_id", "line_number");

-- CreateIndex
CREATE INDEX "idx_order_item_modifiers_order_item" ON "public"."order_item_modifiers"("order_item_id");

-- CreateIndex
CREATE INDEX "idx_order_taxes_order" ON "public"."order_taxes"("order_id");

-- CreateIndex
CREATE INDEX "idx_payments_order" ON "public"."payments"("order_id");

-- CreateIndex
CREATE INDEX "idx_inventory_restaurant" ON "public"."inventory_items"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_shifts_user" ON "public"."shifts"("user_id");

-- CreateIndex
CREATE INDEX "idx_sales_restaurant" ON "public"."daily_sales"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_sales_date" ON "public"."daily_sales"("sales_date");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customers" ADD CONSTRAINT "customers_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tables" ADD CONSTRAINT "tables_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."table_reservations" ADD CONSTRAINT "table_reservations_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."table_reservations" ADD CONSTRAINT "table_reservations_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("table_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."table_reservations" ADD CONSTRAINT "table_reservations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_categories" ADD CONSTRAINT "menu_categories_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_items" ADD CONSTRAINT "menu_items_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_items" ADD CONSTRAINT "menu_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."menu_categories"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."modifier_groups" ADD CONSTRAINT "modifier_groups_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_modifiers" ADD CONSTRAINT "menu_modifiers_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."modifier_group_items" ADD CONSTRAINT "modifier_group_items_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."modifier_groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."modifier_group_items" ADD CONSTRAINT "modifier_group_items_modifier_id_fkey" FOREIGN KEY ("modifier_id") REFERENCES "public"."menu_modifiers"("modifier_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_modifier_groups" ADD CONSTRAINT "item_modifier_groups_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."menu_items"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_modifier_groups" ADD CONSTRAINT "item_modifier_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."modifier_groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tax_rates" ADD CONSTRAINT "tax_rates_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("table_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."menu_items"("item_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_item_modifiers" ADD CONSTRAINT "order_item_modifiers_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("order_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_item_modifiers" ADD CONSTRAINT "order_item_modifiers_modifier_id_fkey" FOREIGN KEY ("modifier_id") REFERENCES "public"."menu_modifiers"("modifier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_taxes" ADD CONSTRAINT "order_taxes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_taxes" ADD CONSTRAINT "order_taxes_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "public"."tax_rates"("tax_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_items" ADD CONSTRAINT "inventory_items_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shifts" ADD CONSTRAINT "shifts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_sales" ADD CONSTRAINT "daily_sales_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."promotions" ADD CONSTRAINT "promotions_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
