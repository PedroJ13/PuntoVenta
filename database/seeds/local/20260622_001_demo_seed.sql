-- PuntoVenta local demo seed.
-- Target dialect: SQL Server / Azure SQL compatible T-SQL.
-- Scope: local development only. Uses fictitious data and no secrets.
-- Preconditions:
--   1. database/migrations/20260620_001_initial_mvp_schema.sql has run.
--   2. database/migrations/20260622_002_daily_cash_flow.sql has run.
-- Idempotence:
--   Safe to run more than once. Existing demo rows are updated by stable natural keys.

SET XACT_ABORT ON;
BEGIN TRANSACTION;

DECLARE @company_id INT;
DECLARE @admin_role_id INT;
DECLARE @cashier_role_id INT;
DECLARE @manager_role_id INT;
DECLARE @admin_user_id INT;
DECLARE @cashier_user_id INT;
DECLARE @terminal_id INT;
DECLARE @cat_hot_id INT;
DECLARE @cat_cold_id INT;
DECLARE @cat_food_id INT;
DECLARE @cat_supply_id INT;
DECLARE @espresso_id INT;
DECLARE @latte_id INT;
DECLARE @water_id INT;
DECLARE @cake_id INT;
DECLARE @coffee_beans_id INT;
DECLARE @milk_id INT;
DECLARE @cup_id INT;
DECLARE @espresso_recipe_id INT;
DECLARE @latte_recipe_id INT;

IF EXISTS (SELECT 1 FROM dbo.companies WHERE tax_id = N'PV-DEMO-LOCAL')
BEGIN
    UPDATE dbo.companies
    SET
        name = N'PuntoVenta Demo Local',
        legal_name = N'PuntoVenta Demo Local S.A.',
        default_currency = 'CRC',
        is_active = 1,
        updated_at = SYSUTCDATETIME()
    WHERE tax_id = N'PV-DEMO-LOCAL';
END
ELSE
BEGIN
    INSERT INTO dbo.companies (name, legal_name, tax_id, default_currency)
    VALUES (N'PuntoVenta Demo Local', N'PuntoVenta Demo Local S.A.', N'PV-DEMO-LOCAL', 'CRC');
END;

SELECT @company_id = id FROM dbo.companies WHERE tax_id = N'PV-DEMO-LOCAL';

IF EXISTS (SELECT 1 FROM dbo.roles WHERE company_id = @company_id AND system_key = N'admin')
    UPDATE dbo.roles SET name = N'Administrador', is_active = 1 WHERE company_id = @company_id AND system_key = N'admin';
ELSE
    INSERT INTO dbo.roles (company_id, name, system_key) VALUES (@company_id, N'Administrador', N'admin');

IF EXISTS (SELECT 1 FROM dbo.roles WHERE company_id = @company_id AND system_key = N'cashier')
    UPDATE dbo.roles SET name = N'Cajero', is_active = 1 WHERE company_id = @company_id AND system_key = N'cashier';
ELSE
    INSERT INTO dbo.roles (company_id, name, system_key) VALUES (@company_id, N'Cajero', N'cashier');

IF EXISTS (SELECT 1 FROM dbo.roles WHERE company_id = @company_id AND system_key = N'manager')
    UPDATE dbo.roles SET name = N'Encargado', is_active = 1 WHERE company_id = @company_id AND system_key = N'manager';
ELSE
    INSERT INTO dbo.roles (company_id, name, system_key) VALUES (@company_id, N'Encargado', N'manager');

SELECT @admin_role_id = id FROM dbo.roles WHERE company_id = @company_id AND system_key = N'admin';
SELECT @cashier_role_id = id FROM dbo.roles WHERE company_id = @company_id AND system_key = N'cashier';
SELECT @manager_role_id = id FROM dbo.roles WHERE company_id = @company_id AND system_key = N'manager';

IF EXISTS (SELECT 1 FROM dbo.users WHERE company_id = @company_id AND email = N'admin.demo@puntoventa.local')
BEGIN
    UPDATE dbo.users
    SET display_name = N'Admin Demo Local',
        pin_hash = N'fake-local-pin-hash-admin-demo',
        is_active = 1,
        updated_at = SYSUTCDATETIME()
    WHERE company_id = @company_id AND email = N'admin.demo@puntoventa.local';
END
ELSE
BEGIN
    INSERT INTO dbo.users (company_id, display_name, email, pin_hash)
    VALUES (@company_id, N'Admin Demo Local', N'admin.demo@puntoventa.local', N'fake-local-pin-hash-admin-demo');
END;

IF EXISTS (SELECT 1 FROM dbo.users WHERE company_id = @company_id AND email = N'cajero.demo@puntoventa.local')
BEGIN
    UPDATE dbo.users
    SET display_name = N'Cajero Demo Local',
        pin_hash = N'fake-local-pin-hash-cashier-demo',
        is_active = 1,
        updated_at = SYSUTCDATETIME()
    WHERE company_id = @company_id AND email = N'cajero.demo@puntoventa.local';
END
ELSE
BEGIN
    INSERT INTO dbo.users (company_id, display_name, email, pin_hash)
    VALUES (@company_id, N'Cajero Demo Local', N'cajero.demo@puntoventa.local', N'fake-local-pin-hash-cashier-demo');
END;

SELECT @admin_user_id = id FROM dbo.users WHERE company_id = @company_id AND email = N'admin.demo@puntoventa.local';
SELECT @cashier_user_id = id FROM dbo.users WHERE company_id = @company_id AND email = N'cajero.demo@puntoventa.local';

IF NOT EXISTS (SELECT 1 FROM dbo.user_roles WHERE user_id = @admin_user_id AND role_id = @admin_role_id)
    INSERT INTO dbo.user_roles (user_id, role_id) VALUES (@admin_user_id, @admin_role_id);
IF NOT EXISTS (SELECT 1 FROM dbo.user_roles WHERE user_id = @admin_user_id AND role_id = @manager_role_id)
    INSERT INTO dbo.user_roles (user_id, role_id) VALUES (@admin_user_id, @manager_role_id);
IF NOT EXISTS (SELECT 1 FROM dbo.user_roles WHERE user_id = @cashier_user_id AND role_id = @cashier_role_id)
    INSERT INTO dbo.user_roles (user_id, role_id) VALUES (@cashier_user_id, @cashier_role_id);

IF EXISTS (SELECT 1 FROM dbo.terminals WHERE company_id = @company_id AND code = N'CAJA-01')
    UPDATE dbo.terminals SET name = N'Caja Principal', is_active = 1 WHERE company_id = @company_id AND code = N'CAJA-01';
ELSE
    INSERT INTO dbo.terminals (company_id, name, code) VALUES (@company_id, N'Caja Principal', N'CAJA-01');

SELECT @terminal_id = id FROM dbo.terminals WHERE company_id = @company_id AND code = N'CAJA-01';

IF EXISTS (SELECT 1 FROM dbo.customers WHERE company_id = @company_id AND is_default_consumer = 1)
BEGIN
    UPDATE dbo.customers
    SET name = N'Consumidor Final',
        document_id = NULL,
        phone = NULL,
        is_active = 1
    WHERE company_id = @company_id AND is_default_consumer = 1;
END
ELSE
BEGIN
    INSERT INTO dbo.customers (company_id, name, document_id, phone, is_default_consumer)
    VALUES (@company_id, N'Consumidor Final', NULL, NULL, 1);
END;

IF EXISTS (SELECT 1 FROM dbo.categories WHERE company_id = @company_id AND name = N'Bebidas calientes')
    UPDATE dbo.categories SET sort_order = 10, is_active = 1 WHERE company_id = @company_id AND name = N'Bebidas calientes';
ELSE
    INSERT INTO dbo.categories (company_id, name, sort_order) VALUES (@company_id, N'Bebidas calientes', 10);

IF EXISTS (SELECT 1 FROM dbo.categories WHERE company_id = @company_id AND name = N'Bebidas frias')
    UPDATE dbo.categories SET sort_order = 20, is_active = 1 WHERE company_id = @company_id AND name = N'Bebidas frias';
ELSE
    INSERT INTO dbo.categories (company_id, name, sort_order) VALUES (@company_id, N'Bebidas frias', 20);

IF EXISTS (SELECT 1 FROM dbo.categories WHERE company_id = @company_id AND name = N'Reposteria')
    UPDATE dbo.categories SET sort_order = 30, is_active = 1 WHERE company_id = @company_id AND name = N'Reposteria';
ELSE
    INSERT INTO dbo.categories (company_id, name, sort_order) VALUES (@company_id, N'Reposteria', 30);

IF EXISTS (SELECT 1 FROM dbo.categories WHERE company_id = @company_id AND name = N'Insumos')
    UPDATE dbo.categories SET sort_order = 90, is_active = 1 WHERE company_id = @company_id AND name = N'Insumos';
ELSE
    INSERT INTO dbo.categories (company_id, name, sort_order) VALUES (@company_id, N'Insumos', 90);

SELECT @cat_hot_id = id FROM dbo.categories WHERE company_id = @company_id AND name = N'Bebidas calientes';
SELECT @cat_cold_id = id FROM dbo.categories WHERE company_id = @company_id AND name = N'Bebidas frias';
SELECT @cat_food_id = id FROM dbo.categories WHERE company_id = @company_id AND name = N'Reposteria';
SELECT @cat_supply_id = id FROM dbo.categories WHERE company_id = @company_id AND name = N'Insumos';

IF EXISTS (SELECT 1 FROM dbo.items WHERE company_id = @company_id AND sku = N'ESPRESSO')
    UPDATE dbo.items SET category_id = @cat_hot_id, item_type = N'prepared_product', barcode = NULL, name = N'Espresso', description = N'Cafe espresso demo', base_unit = N'unit', sale_price = 1200, cost_amount = NULL, tax_rate = 0, tracks_inventory = 0, stock_minimum = 0, current_stock = 0, is_favorite = 1, is_active = 1, updated_at = SYSUTCDATETIME() WHERE company_id = @company_id AND sku = N'ESPRESSO';
ELSE
    INSERT INTO dbo.items (company_id, category_id, item_type, sku, barcode, name, description, base_unit, sale_price, cost_amount, tax_rate, tracks_inventory, stock_minimum, current_stock, is_favorite)
    VALUES (@company_id, @cat_hot_id, N'prepared_product', N'ESPRESSO', NULL, N'Espresso', N'Cafe espresso demo', N'unit', 1200, NULL, 0, 0, 0, 0, 1);

IF EXISTS (SELECT 1 FROM dbo.items WHERE company_id = @company_id AND sku = N'LATTE')
    UPDATE dbo.items SET category_id = @cat_hot_id, item_type = N'prepared_product', barcode = NULL, name = N'Cafe latte', description = N'Cafe latte demo', base_unit = N'unit', sale_price = 1800, cost_amount = NULL, tax_rate = 0, tracks_inventory = 0, stock_minimum = 0, current_stock = 0, is_favorite = 1, is_active = 1, updated_at = SYSUTCDATETIME() WHERE company_id = @company_id AND sku = N'LATTE';
ELSE
    INSERT INTO dbo.items (company_id, category_id, item_type, sku, barcode, name, description, base_unit, sale_price, cost_amount, tax_rate, tracks_inventory, stock_minimum, current_stock, is_favorite)
    VALUES (@company_id, @cat_hot_id, N'prepared_product', N'LATTE', NULL, N'Cafe latte', N'Cafe latte demo', N'unit', 1800, NULL, 0, 0, 0, 0, 1);

IF EXISTS (SELECT 1 FROM dbo.items WHERE company_id = @company_id AND sku = N'AGUA-600')
    UPDATE dbo.items SET category_id = @cat_cold_id, item_type = N'purchased_product', barcode = N'744000000001', name = N'Agua botella 600ml', description = N'Producto comprado demo', base_unit = N'unit', sale_price = 900, cost_amount = 420, tax_rate = 0, tracks_inventory = 1, stock_minimum = 6, current_stock = 24, is_favorite = 0, is_active = 1, updated_at = SYSUTCDATETIME() WHERE company_id = @company_id AND sku = N'AGUA-600';
ELSE
    INSERT INTO dbo.items (company_id, category_id, item_type, sku, barcode, name, description, base_unit, sale_price, cost_amount, tax_rate, tracks_inventory, stock_minimum, current_stock, is_favorite)
    VALUES (@company_id, @cat_cold_id, N'purchased_product', N'AGUA-600', N'744000000001', N'Agua botella 600ml', N'Producto comprado demo', N'unit', 900, 420, 0, 1, 6, 24, 0);

IF EXISTS (SELECT 1 FROM dbo.items WHERE company_id = @company_id AND sku = N'QUEQUE-CHOC')
    UPDATE dbo.items SET category_id = @cat_food_id, item_type = N'purchased_product', barcode = NULL, name = N'Queque chocolate', description = N'Reposteria demo', base_unit = N'unit', sale_price = 1500, cost_amount = 700, tax_rate = 0, tracks_inventory = 1, stock_minimum = 4, current_stock = 12, is_favorite = 1, is_active = 1, updated_at = SYSUTCDATETIME() WHERE company_id = @company_id AND sku = N'QUEQUE-CHOC';
ELSE
    INSERT INTO dbo.items (company_id, category_id, item_type, sku, barcode, name, description, base_unit, sale_price, cost_amount, tax_rate, tracks_inventory, stock_minimum, current_stock, is_favorite)
    VALUES (@company_id, @cat_food_id, N'purchased_product', N'QUEQUE-CHOC', NULL, N'Queque chocolate', N'Reposteria demo', N'unit', 1500, 700, 0, 1, 4, 12, 1);

IF EXISTS (SELECT 1 FROM dbo.items WHERE company_id = @company_id AND sku = N'CAFE-G')
    UPDATE dbo.items SET category_id = @cat_supply_id, item_type = N'raw_material', barcode = NULL, name = N'Cafe en grano', description = N'Materia prima demo', base_unit = N'g', sale_price = NULL, cost_amount = 0.0140, tax_rate = 0, tracks_inventory = 1, stock_minimum = 500, current_stock = 5000, is_favorite = 0, is_active = 1, updated_at = SYSUTCDATETIME() WHERE company_id = @company_id AND sku = N'CAFE-G';
ELSE
    INSERT INTO dbo.items (company_id, category_id, item_type, sku, barcode, name, description, base_unit, sale_price, cost_amount, tax_rate, tracks_inventory, stock_minimum, current_stock, is_favorite)
    VALUES (@company_id, @cat_supply_id, N'raw_material', N'CAFE-G', NULL, N'Cafe en grano', N'Materia prima demo', N'g', NULL, 0.0140, 0, 1, 500, 5000, 0);

IF EXISTS (SELECT 1 FROM dbo.items WHERE company_id = @company_id AND sku = N'LECHE-ML')
    UPDATE dbo.items SET category_id = @cat_supply_id, item_type = N'raw_material', barcode = NULL, name = N'Leche', description = N'Materia prima demo', base_unit = N'ml', sale_price = NULL, cost_amount = 0.0011, tax_rate = 0, tracks_inventory = 1, stock_minimum = 1000, current_stock = 8000, is_favorite = 0, is_active = 1, updated_at = SYSUTCDATETIME() WHERE company_id = @company_id AND sku = N'LECHE-ML';
ELSE
    INSERT INTO dbo.items (company_id, category_id, item_type, sku, barcode, name, description, base_unit, sale_price, cost_amount, tax_rate, tracks_inventory, stock_minimum, current_stock, is_favorite)
    VALUES (@company_id, @cat_supply_id, N'raw_material', N'LECHE-ML', NULL, N'Leche', N'Materia prima demo', N'ml', NULL, 0.0011, 0, 1, 1000, 8000, 0);

IF EXISTS (SELECT 1 FROM dbo.items WHERE company_id = @company_id AND sku = N'VASO-12OZ')
    UPDATE dbo.items SET category_id = @cat_supply_id, item_type = N'operational_supply', barcode = NULL, name = N'Vaso 12oz', description = N'Insumo operativo demo', base_unit = N'unit', sale_price = NULL, cost_amount = 55, tax_rate = 0, tracks_inventory = 1, stock_minimum = 25, current_stock = 100, is_favorite = 0, is_active = 1, updated_at = SYSUTCDATETIME() WHERE company_id = @company_id AND sku = N'VASO-12OZ';
ELSE
    INSERT INTO dbo.items (company_id, category_id, item_type, sku, barcode, name, description, base_unit, sale_price, cost_amount, tax_rate, tracks_inventory, stock_minimum, current_stock, is_favorite)
    VALUES (@company_id, @cat_supply_id, N'operational_supply', N'VASO-12OZ', NULL, N'Vaso 12oz', N'Insumo operativo demo', N'unit', NULL, 55, 0, 1, 25, 100, 0);

SELECT @espresso_id = id FROM dbo.items WHERE company_id = @company_id AND sku = N'ESPRESSO';
SELECT @latte_id = id FROM dbo.items WHERE company_id = @company_id AND sku = N'LATTE';
SELECT @water_id = id FROM dbo.items WHERE company_id = @company_id AND sku = N'AGUA-600';
SELECT @cake_id = id FROM dbo.items WHERE company_id = @company_id AND sku = N'QUEQUE-CHOC';
SELECT @coffee_beans_id = id FROM dbo.items WHERE company_id = @company_id AND sku = N'CAFE-G';
SELECT @milk_id = id FROM dbo.items WHERE company_id = @company_id AND sku = N'LECHE-ML';
SELECT @cup_id = id FROM dbo.items WHERE company_id = @company_id AND sku = N'VASO-12OZ';

IF EXISTS (SELECT 1 FROM dbo.recipes WHERE company_id = @company_id AND output_item_id = @espresso_id)
    UPDATE dbo.recipes SET name = N'Receta espresso demo', output_quantity = 1, is_active = 1, updated_at = SYSUTCDATETIME() WHERE company_id = @company_id AND output_item_id = @espresso_id;
ELSE
    INSERT INTO dbo.recipes (company_id, output_item_id, name, output_quantity) VALUES (@company_id, @espresso_id, N'Receta espresso demo', 1);

IF EXISTS (SELECT 1 FROM dbo.recipes WHERE company_id = @company_id AND output_item_id = @latte_id)
    UPDATE dbo.recipes SET name = N'Receta latte demo', output_quantity = 1, is_active = 1, updated_at = SYSUTCDATETIME() WHERE company_id = @company_id AND output_item_id = @latte_id;
ELSE
    INSERT INTO dbo.recipes (company_id, output_item_id, name, output_quantity) VALUES (@company_id, @latte_id, N'Receta latte demo', 1);

SELECT @espresso_recipe_id = id FROM dbo.recipes WHERE company_id = @company_id AND output_item_id = @espresso_id;
SELECT @latte_recipe_id = id FROM dbo.recipes WHERE company_id = @company_id AND output_item_id = @latte_id;

IF EXISTS (SELECT 1 FROM dbo.recipe_ingredients WHERE recipe_id = @espresso_recipe_id AND ingredient_item_id = @coffee_beans_id)
    UPDATE dbo.recipe_ingredients SET quantity = 18, unit = N'g', is_optional = 0 WHERE recipe_id = @espresso_recipe_id AND ingredient_item_id = @coffee_beans_id;
ELSE
    INSERT INTO dbo.recipe_ingredients (recipe_id, ingredient_item_id, quantity, unit) VALUES (@espresso_recipe_id, @coffee_beans_id, 18, N'g');

IF EXISTS (SELECT 1 FROM dbo.recipe_ingredients WHERE recipe_id = @espresso_recipe_id AND ingredient_item_id = @cup_id)
    UPDATE dbo.recipe_ingredients SET quantity = 1, unit = N'unit', is_optional = 0 WHERE recipe_id = @espresso_recipe_id AND ingredient_item_id = @cup_id;
ELSE
    INSERT INTO dbo.recipe_ingredients (recipe_id, ingredient_item_id, quantity, unit) VALUES (@espresso_recipe_id, @cup_id, 1, N'unit');

IF EXISTS (SELECT 1 FROM dbo.recipe_ingredients WHERE recipe_id = @latte_recipe_id AND ingredient_item_id = @coffee_beans_id)
    UPDATE dbo.recipe_ingredients SET quantity = 18, unit = N'g', is_optional = 0 WHERE recipe_id = @latte_recipe_id AND ingredient_item_id = @coffee_beans_id;
ELSE
    INSERT INTO dbo.recipe_ingredients (recipe_id, ingredient_item_id, quantity, unit) VALUES (@latte_recipe_id, @coffee_beans_id, 18, N'g');

IF EXISTS (SELECT 1 FROM dbo.recipe_ingredients WHERE recipe_id = @latte_recipe_id AND ingredient_item_id = @milk_id)
    UPDATE dbo.recipe_ingredients SET quantity = 180, unit = N'ml', is_optional = 0 WHERE recipe_id = @latte_recipe_id AND ingredient_item_id = @milk_id;
ELSE
    INSERT INTO dbo.recipe_ingredients (recipe_id, ingredient_item_id, quantity, unit) VALUES (@latte_recipe_id, @milk_id, 180, N'ml');

IF EXISTS (SELECT 1 FROM dbo.recipe_ingredients WHERE recipe_id = @latte_recipe_id AND ingredient_item_id = @cup_id)
    UPDATE dbo.recipe_ingredients SET quantity = 1, unit = N'unit', is_optional = 0 WHERE recipe_id = @latte_recipe_id AND ingredient_item_id = @cup_id;
ELSE
    INSERT INTO dbo.recipe_ingredients (recipe_id, ingredient_item_id, quantity, unit) VALUES (@latte_recipe_id, @cup_id, 1, N'unit');

IF EXISTS (SELECT 1 FROM dbo.suppliers WHERE company_id = @company_id AND name = N'Proveedor Demo Local')
    UPDATE dbo.suppliers SET document_id = N'PV-SUPPLIER-DEMO', phone = N'0000-0000', email = N'proveedor.demo@puntoventa.local', is_active = 1 WHERE company_id = @company_id AND name = N'Proveedor Demo Local';
ELSE
    INSERT INTO dbo.suppliers (company_id, name, document_id, phone, email)
    VALUES (@company_id, N'Proveedor Demo Local', N'PV-SUPPLIER-DEMO', N'0000-0000', N'proveedor.demo@puntoventa.local');

COMMIT TRANSACTION;

SELECT
    c.id AS company_id,
    c.name AS company_name,
    (SELECT COUNT(*) FROM dbo.terminals t WHERE t.company_id = c.id) AS terminals_count,
    (SELECT COUNT(*) FROM dbo.users u WHERE u.company_id = c.id) AS users_count,
    (SELECT COUNT(*) FROM dbo.categories ca WHERE ca.company_id = c.id) AS categories_count,
    (SELECT COUNT(*) FROM dbo.items i WHERE i.company_id = c.id) AS items_count,
    (SELECT COUNT(*) FROM dbo.recipes r WHERE r.company_id = c.id) AS recipes_count,
    (SELECT COUNT(*) FROM dbo.recipe_ingredients ri INNER JOIN dbo.recipes r ON r.id = ri.recipe_id WHERE r.company_id = c.id) AS recipe_ingredients_count
FROM dbo.companies c
WHERE c.tax_id = N'PV-DEMO-LOCAL';
