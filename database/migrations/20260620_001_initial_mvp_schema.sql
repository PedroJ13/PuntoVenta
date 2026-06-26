-- PuntoVenta MVP initial schema proposal.
-- Target dialect: Azure SQL / SQL Server.
-- Local-review only for TASK-002; do not run against Azure SQL without an explicit migration task.

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;

CREATE TABLE dbo.companies (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(160) NOT NULL,
    legal_name NVARCHAR(200) NULL,
    tax_id NVARCHAR(64) NULL,
    default_currency CHAR(3) NOT NULL CONSTRAINT DF_companies_default_currency DEFAULT ('CRC'),
    is_active BIT NOT NULL CONSTRAINT DF_companies_is_active DEFAULT (1),
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_companies_created_at DEFAULT (SYSUTCDATETIME()),
    updated_at DATETIME2(0) NULL
);

CREATE TABLE dbo.roles (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    name NVARCHAR(80) NOT NULL,
    system_key NVARCHAR(40) NOT NULL,
    is_active BIT NOT NULL CONSTRAINT DF_roles_is_active DEFAULT (1),
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_roles_created_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_roles_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id),
    CONSTRAINT UQ_roles_company_system_key UNIQUE (company_id, system_key)
);

CREATE TABLE dbo.users (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    display_name NVARCHAR(140) NOT NULL,
    email NVARCHAR(180) NULL,
    pin_hash NVARCHAR(256) NULL,
    is_active BIT NOT NULL CONSTRAINT DF_users_is_active DEFAULT (1),
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_users_created_at DEFAULT (SYSUTCDATETIME()),
    updated_at DATETIME2(0) NULL,
    CONSTRAINT FK_users_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id)
);

CREATE UNIQUE INDEX UX_users_company_email ON dbo.users(company_id, email) WHERE email IS NOT NULL;

CREATE TABLE dbo.user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at DATETIME2(0) NOT NULL CONSTRAINT DF_user_roles_assigned_at DEFAULT (SYSUTCDATETIME()),
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT FK_user_roles_user FOREIGN KEY (user_id) REFERENCES dbo.users(id),
    CONSTRAINT FK_user_roles_role FOREIGN KEY (role_id) REFERENCES dbo.roles(id)
);

CREATE TABLE dbo.terminals (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    name NVARCHAR(100) NOT NULL,
    code NVARCHAR(40) NOT NULL,
    is_active BIT NOT NULL CONSTRAINT DF_terminals_is_active DEFAULT (1),
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_terminals_created_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_terminals_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id),
    CONSTRAINT UQ_terminals_company_code UNIQUE (company_id, code)
);

CREATE TABLE dbo.cash_shifts (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    terminal_id INT NOT NULL,
    opened_by_user_id INT NOT NULL,
    closed_by_user_id INT NULL,
    status NVARCHAR(20) NOT NULL CONSTRAINT DF_cash_shifts_status DEFAULT ('open'),
    opening_cash_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_cash_shifts_opening_cash DEFAULT (0),
    expected_cash_amount DECIMAL(18,2) NULL,
    counted_cash_amount DECIMAL(18,2) NULL,
    difference_amount DECIMAL(18,2) NULL,
    opened_at DATETIME2(0) NOT NULL CONSTRAINT DF_cash_shifts_opened_at DEFAULT (SYSUTCDATETIME()),
    closed_at DATETIME2(0) NULL,
    notes NVARCHAR(500) NULL,
    CONSTRAINT FK_cash_shifts_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id),
    CONSTRAINT FK_cash_shifts_terminal FOREIGN KEY (terminal_id) REFERENCES dbo.terminals(id),
    CONSTRAINT FK_cash_shifts_opened_by FOREIGN KEY (opened_by_user_id) REFERENCES dbo.users(id),
    CONSTRAINT FK_cash_shifts_closed_by FOREIGN KEY (closed_by_user_id) REFERENCES dbo.users(id),
    CONSTRAINT CK_cash_shifts_status CHECK (status IN ('open', 'closed', 'void')),
    CONSTRAINT CK_cash_shifts_amounts_nonnegative CHECK (
        opening_cash_amount >= 0
        AND (expected_cash_amount IS NULL OR expected_cash_amount >= 0)
        AND (counted_cash_amount IS NULL OR counted_cash_amount >= 0)
    )
);

CREATE TABLE dbo.categories (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    name NVARCHAR(120) NOT NULL,
    sort_order INT NOT NULL CONSTRAINT DF_categories_sort_order DEFAULT (0),
    is_active BIT NOT NULL CONSTRAINT DF_categories_is_active DEFAULT (1),
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_categories_created_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_categories_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id),
    CONSTRAINT UQ_categories_company_name UNIQUE (company_id, name)
);

CREATE TABLE dbo.items (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    category_id INT NULL,
    item_type NVARCHAR(30) NOT NULL,
    sku NVARCHAR(60) NOT NULL,
    barcode NVARCHAR(80) NULL,
    name NVARCHAR(180) NOT NULL,
    description NVARCHAR(500) NULL,
    base_unit NVARCHAR(20) NOT NULL,
    sale_price DECIMAL(18,2) NULL,
    cost_amount DECIMAL(18,4) NULL,
    tax_rate DECIMAL(7,4) NOT NULL CONSTRAINT DF_items_tax_rate DEFAULT (0),
    tracks_inventory BIT NOT NULL CONSTRAINT DF_items_tracks_inventory DEFAULT (1),
    stock_minimum DECIMAL(18,4) NOT NULL CONSTRAINT DF_items_stock_minimum DEFAULT (0),
    current_stock DECIMAL(18,4) NOT NULL CONSTRAINT DF_items_current_stock DEFAULT (0),
    is_favorite BIT NOT NULL CONSTRAINT DF_items_is_favorite DEFAULT (0),
    is_active BIT NOT NULL CONSTRAINT DF_items_is_active DEFAULT (1),
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_items_created_at DEFAULT (SYSUTCDATETIME()),
    updated_at DATETIME2(0) NULL,
    CONSTRAINT FK_items_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id),
    CONSTRAINT FK_items_category FOREIGN KEY (category_id) REFERENCES dbo.categories(id),
    CONSTRAINT UQ_items_company_sku UNIQUE (company_id, sku),
    CONSTRAINT CK_items_type CHECK (item_type IN ('purchased_product', 'prepared_product', 'raw_material', 'operational_supply', 'deposit_container')),
    CONSTRAINT CK_items_unit CHECK (base_unit IN ('unit', 'g', 'kg', 'ml', 'l')),
    CONSTRAINT CK_items_amounts_nonnegative CHECK (
        (sale_price IS NULL OR sale_price >= 0)
        AND (cost_amount IS NULL OR cost_amount >= 0)
        AND tax_rate >= 0
        AND stock_minimum >= 0
        AND current_stock >= 0
    )
);

CREATE UNIQUE INDEX UX_items_company_barcode ON dbo.items(company_id, barcode) WHERE barcode IS NOT NULL;

CREATE TABLE dbo.recipes (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    output_item_id INT NOT NULL,
    name NVARCHAR(160) NOT NULL,
    output_quantity DECIMAL(18,4) NOT NULL CONSTRAINT DF_recipes_output_quantity DEFAULT (1),
    is_active BIT NOT NULL CONSTRAINT DF_recipes_is_active DEFAULT (1),
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_recipes_created_at DEFAULT (SYSUTCDATETIME()),
    updated_at DATETIME2(0) NULL,
    CONSTRAINT FK_recipes_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id),
    CONSTRAINT FK_recipes_output_item FOREIGN KEY (output_item_id) REFERENCES dbo.items(id),
    CONSTRAINT UQ_recipes_company_output_item UNIQUE (company_id, output_item_id),
    CONSTRAINT CK_recipes_output_quantity CHECK (output_quantity > 0)
);

CREATE TABLE dbo.recipe_ingredients (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    recipe_id INT NOT NULL,
    ingredient_item_id INT NOT NULL,
    quantity DECIMAL(18,4) NOT NULL,
    unit NVARCHAR(20) NOT NULL,
    is_optional BIT NOT NULL CONSTRAINT DF_recipe_ingredients_is_optional DEFAULT (0),
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_recipe_ingredients_created_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_recipe_ingredients_recipe FOREIGN KEY (recipe_id) REFERENCES dbo.recipes(id),
    CONSTRAINT FK_recipe_ingredients_item FOREIGN KEY (ingredient_item_id) REFERENCES dbo.items(id),
    CONSTRAINT UQ_recipe_ingredients_recipe_item UNIQUE (recipe_id, ingredient_item_id),
    CONSTRAINT CK_recipe_ingredients_quantity CHECK (quantity > 0),
    CONSTRAINT CK_recipe_ingredients_unit CHECK (unit IN ('unit', 'g', 'kg', 'ml', 'l'))
);

CREATE TABLE dbo.customers (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    name NVARCHAR(160) NOT NULL,
    document_id NVARCHAR(80) NULL,
    phone NVARCHAR(40) NULL,
    is_default_consumer BIT NOT NULL CONSTRAINT DF_customers_is_default DEFAULT (0),
    is_active BIT NOT NULL CONSTRAINT DF_customers_is_active DEFAULT (1),
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_customers_created_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_customers_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id)
);

CREATE UNIQUE INDEX UX_customers_company_default ON dbo.customers(company_id, is_default_consumer) WHERE is_default_consumer = 1;

CREATE TABLE dbo.open_accounts (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    terminal_id INT NOT NULL,
    cash_shift_id INT NULL,
    customer_id INT NULL,
    opened_by_user_id INT NOT NULL,
    closed_by_user_id INT NULL,
    name NVARCHAR(120) NOT NULL,
    status NVARCHAR(20) NOT NULL CONSTRAINT DF_open_accounts_status DEFAULT ('open'),
    subtotal_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_open_accounts_subtotal DEFAULT (0),
    tax_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_open_accounts_tax DEFAULT (0),
    total_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_open_accounts_total DEFAULT (0),
    opened_at DATETIME2(0) NOT NULL CONSTRAINT DF_open_accounts_opened_at DEFAULT (SYSUTCDATETIME()),
    closed_at DATETIME2(0) NULL,
    cancel_reason NVARCHAR(300) NULL,
    CONSTRAINT FK_open_accounts_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id),
    CONSTRAINT FK_open_accounts_terminal FOREIGN KEY (terminal_id) REFERENCES dbo.terminals(id),
    CONSTRAINT FK_open_accounts_cash_shift FOREIGN KEY (cash_shift_id) REFERENCES dbo.cash_shifts(id),
    CONSTRAINT FK_open_accounts_customer FOREIGN KEY (customer_id) REFERENCES dbo.customers(id),
    CONSTRAINT FK_open_accounts_opened_by FOREIGN KEY (opened_by_user_id) REFERENCES dbo.users(id),
    CONSTRAINT FK_open_accounts_closed_by FOREIGN KEY (closed_by_user_id) REFERENCES dbo.users(id),
    CONSTRAINT CK_open_accounts_status CHECK (status IN ('open', 'paid', 'cancelled')),
    CONSTRAINT CK_open_accounts_amounts_nonnegative CHECK (subtotal_amount >= 0 AND tax_amount >= 0 AND total_amount >= 0)
);

CREATE TABLE dbo.open_account_lines (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    open_account_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity DECIMAL(18,4) NOT NULL,
    unit_price DECIMAL(18,2) NOT NULL,
    discount_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_open_account_lines_discount DEFAULT (0),
    tax_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_open_account_lines_tax DEFAULT (0),
    line_total DECIMAL(18,2) NOT NULL,
    notes NVARCHAR(300) NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_open_account_lines_created_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_open_account_lines_account FOREIGN KEY (open_account_id) REFERENCES dbo.open_accounts(id),
    CONSTRAINT FK_open_account_lines_item FOREIGN KEY (item_id) REFERENCES dbo.items(id),
    CONSTRAINT CK_open_account_lines_amounts CHECK (quantity > 0 AND unit_price >= 0 AND discount_amount >= 0 AND tax_amount >= 0 AND line_total >= 0)
);

CREATE TABLE dbo.sales (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    terminal_id INT NOT NULL,
    cash_shift_id INT NOT NULL,
    open_account_id INT NULL,
    customer_id INT NULL,
    sold_by_user_id INT NOT NULL,
    ticket_number NVARCHAR(40) NOT NULL,
    status NVARCHAR(20) NOT NULL CONSTRAINT DF_sales_status DEFAULT ('paid'),
    subtotal_amount DECIMAL(18,2) NOT NULL,
    discount_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_sales_discount DEFAULT (0),
    tax_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_sales_tax DEFAULT (0),
    total_amount DECIMAL(18,2) NOT NULL,
    paid_at DATETIME2(0) NOT NULL CONSTRAINT DF_sales_paid_at DEFAULT (SYSUTCDATETIME()),
    voided_at DATETIME2(0) NULL,
    void_reason NVARCHAR(300) NULL,
    CONSTRAINT FK_sales_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id),
    CONSTRAINT FK_sales_terminal FOREIGN KEY (terminal_id) REFERENCES dbo.terminals(id),
    CONSTRAINT FK_sales_cash_shift FOREIGN KEY (cash_shift_id) REFERENCES dbo.cash_shifts(id),
    CONSTRAINT FK_sales_open_account FOREIGN KEY (open_account_id) REFERENCES dbo.open_accounts(id),
    CONSTRAINT FK_sales_customer FOREIGN KEY (customer_id) REFERENCES dbo.customers(id),
    CONSTRAINT FK_sales_sold_by FOREIGN KEY (sold_by_user_id) REFERENCES dbo.users(id),
    CONSTRAINT UQ_sales_company_ticket UNIQUE (company_id, ticket_number),
    CONSTRAINT CK_sales_status CHECK (status IN ('paid', 'voided')),
    CONSTRAINT CK_sales_amounts_nonnegative CHECK (subtotal_amount >= 0 AND discount_amount >= 0 AND tax_amount >= 0 AND total_amount >= 0)
);

CREATE TABLE dbo.sale_lines (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    sale_id INT NOT NULL,
    item_id INT NOT NULL,
    item_name_snapshot NVARCHAR(180) NOT NULL,
    quantity DECIMAL(18,4) NOT NULL,
    unit_price DECIMAL(18,2) NOT NULL,
    discount_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_sale_lines_discount DEFAULT (0),
    tax_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_sale_lines_tax DEFAULT (0),
    line_total DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_sale_lines_sale FOREIGN KEY (sale_id) REFERENCES dbo.sales(id),
    CONSTRAINT FK_sale_lines_item FOREIGN KEY (item_id) REFERENCES dbo.items(id),
    CONSTRAINT CK_sale_lines_amounts CHECK (quantity > 0 AND unit_price >= 0 AND discount_amount >= 0 AND tax_amount >= 0 AND line_total >= 0)
);

CREATE TABLE dbo.payments (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    sale_id INT NOT NULL,
    payment_method NVARCHAR(30) NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    reference NVARCHAR(120) NULL,
    paid_at DATETIME2(0) NOT NULL CONSTRAINT DF_payments_paid_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_payments_sale FOREIGN KEY (sale_id) REFERENCES dbo.sales(id),
    CONSTRAINT CK_payments_method CHECK (payment_method IN ('cash', 'card', 'transfer', 'other')),
    CONSTRAINT CK_payments_amount CHECK (amount > 0)
);

CREATE TABLE dbo.suppliers (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    name NVARCHAR(180) NOT NULL,
    document_id NVARCHAR(80) NULL,
    phone NVARCHAR(40) NULL,
    email NVARCHAR(180) NULL,
    is_active BIT NOT NULL CONSTRAINT DF_suppliers_is_active DEFAULT (1),
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_suppliers_created_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_suppliers_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id),
    CONSTRAINT UQ_suppliers_company_name UNIQUE (company_id, name)
);

CREATE TABLE dbo.purchases (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    supplier_id INT NULL,
    purchased_by_user_id INT NOT NULL,
    supplier_invoice_reference NVARCHAR(120) NULL,
    status NVARCHAR(20) NOT NULL CONSTRAINT DF_purchases_status DEFAULT ('posted'),
    subtotal_amount DECIMAL(18,2) NOT NULL,
    tax_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_purchases_tax DEFAULT (0),
    total_amount DECIMAL(18,2) NOT NULL,
    purchased_at DATETIME2(0) NOT NULL CONSTRAINT DF_purchases_purchased_at DEFAULT (SYSUTCDATETIME()),
    notes NVARCHAR(500) NULL,
    CONSTRAINT FK_purchases_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id),
    CONSTRAINT FK_purchases_supplier FOREIGN KEY (supplier_id) REFERENCES dbo.suppliers(id),
    CONSTRAINT FK_purchases_user FOREIGN KEY (purchased_by_user_id) REFERENCES dbo.users(id),
    CONSTRAINT CK_purchases_status CHECK (status IN ('draft', 'posted', 'voided')),
    CONSTRAINT CK_purchases_amounts_nonnegative CHECK (subtotal_amount >= 0 AND tax_amount >= 0 AND total_amount >= 0)
);

CREATE TABLE dbo.purchase_lines (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    purchase_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity DECIMAL(18,4) NOT NULL,
    unit_cost DECIMAL(18,4) NOT NULL,
    tax_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_purchase_lines_tax DEFAULT (0),
    line_total DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_purchase_lines_purchase FOREIGN KEY (purchase_id) REFERENCES dbo.purchases(id),
    CONSTRAINT FK_purchase_lines_item FOREIGN KEY (item_id) REFERENCES dbo.items(id),
    CONSTRAINT CK_purchase_lines_amounts CHECK (quantity > 0 AND unit_cost >= 0 AND tax_amount >= 0 AND line_total >= 0)
);

CREATE TABLE dbo.inventory_movements (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    item_id INT NOT NULL,
    movement_type NVARCHAR(30) NOT NULL,
    quantity_delta DECIMAL(18,4) NOT NULL,
    unit NVARCHAR(20) NOT NULL,
    unit_cost DECIMAL(18,4) NULL,
    source_type NVARCHAR(30) NOT NULL,
    source_id INT NULL,
    reason NVARCHAR(300) NULL,
    created_by_user_id INT NOT NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_inventory_movements_created_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_inventory_movements_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id),
    CONSTRAINT FK_inventory_movements_item FOREIGN KEY (item_id) REFERENCES dbo.items(id),
    CONSTRAINT FK_inventory_movements_user FOREIGN KEY (created_by_user_id) REFERENCES dbo.users(id),
    CONSTRAINT CK_inventory_movements_type CHECK (movement_type IN ('purchase', 'sale', 'recipe_consumption', 'manual_adjustment', 'waste', 'return', 'transfer')),
    CONSTRAINT CK_inventory_movements_source CHECK (source_type IN ('purchase', 'sale', 'sale_line', 'manual_adjustment', 'system')),
    CONSTRAINT CK_inventory_movements_unit CHECK (unit IN ('unit', 'g', 'kg', 'ml', 'l')),
    CONSTRAINT CK_inventory_movements_quantity_nonzero CHECK (quantity_delta <> 0)
);

CREATE TABLE dbo.cash_movements (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    company_id INT NOT NULL,
    cash_shift_id INT NOT NULL,
    movement_type NVARCHAR(30) NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    payment_id INT NULL,
    reason NVARCHAR(300) NULL,
    created_by_user_id INT NOT NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_cash_movements_created_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_cash_movements_company FOREIGN KEY (company_id) REFERENCES dbo.companies(id),
    CONSTRAINT FK_cash_movements_shift FOREIGN KEY (cash_shift_id) REFERENCES dbo.cash_shifts(id),
    CONSTRAINT FK_cash_movements_payment FOREIGN KEY (payment_id) REFERENCES dbo.payments(id),
    CONSTRAINT FK_cash_movements_user FOREIGN KEY (created_by_user_id) REFERENCES dbo.users(id),
    CONSTRAINT CK_cash_movements_type CHECK (movement_type IN ('opening', 'sale_cash_payment', 'cash_in', 'cash_out', 'closing_adjustment')),
    CONSTRAINT CK_cash_movements_amount CHECK (amount > 0)
);

CREATE INDEX IX_cash_shifts_company_status ON dbo.cash_shifts(company_id, status, opened_at);
CREATE INDEX IX_items_company_type_active ON dbo.items(company_id, item_type, is_active);
CREATE INDEX IX_items_company_category ON dbo.items(company_id, category_id, is_active);
CREATE INDEX IX_open_accounts_company_status ON dbo.open_accounts(company_id, status, opened_at);
CREATE INDEX IX_sales_company_paid_at ON dbo.sales(company_id, paid_at);
CREATE INDEX IX_sale_lines_item ON dbo.sale_lines(item_id);
CREATE INDEX IX_payments_method_paid_at ON dbo.payments(payment_method, paid_at);
CREATE INDEX IX_purchases_company_purchased_at ON dbo.purchases(company_id, purchased_at);
CREATE INDEX IX_inventory_movements_item_created_at ON dbo.inventory_movements(item_id, created_at);
CREATE INDEX IX_cash_movements_shift_created_at ON dbo.cash_movements(cash_shift_id, created_at);
