-- Seed Data for RMSys
-- Generated automatically

SET FOREIGN_KEY_CHECKS=0;

-- 1. Create User
INSERT INTO User (email, name, password, emailVerified, createdAt)
VALUES ('sohaib@chromadiv.com', 'Sohaib Latif', '$2b$10$VJpBzpExm.4EXX/DT55U.ueR4rBzwHP1OV5vERaERXUC3usWonGxu', '2026-01-28 16:18:10', '2026-01-28 16:18:10')
ON DUPLICATE KEY UPDATE name='Sohaib Latif', password='$2b$10$VJpBzpExm.4EXX/DT55U.ueR4rBzwHP1OV5vERaERXUC3usWonGxu', emailVerified='2026-01-28 16:18:10';

-- Get the ID (Assuming it is 1 for clean DB, or we can use subquery but MySQL doesn't like subquery in INSERT sometimes)
-- We will assume ID @userId.
SET @userId = (SELECT id FROM User WHERE email = 'sohaib@chromadiv.com');

-- 2. Clear old data for user
DELETE FROM menu WHERE user_id = @userId;
DELETE FROM orders WHERE user_id = @userId;
DELETE FROM inventory WHERE user_id = @userId;
DELETE FROM suppliers WHERE user_id = @userId;

-- Menu
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Offer of the Day (2 in 1 Deal)', 1350, 'Exciting Deals', 'Limited time offer: 2 delicious items for one great price.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Economy Deal', 1700, 'Exciting Deals', 'Perfect for sharing: 1 Medium Pizza + 2 Drinks.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Deal for 2 (2 Med Pizza + 2 Drinks)', 2100, 'Exciting Deals', 'Double the fun with 2 Medium Pizzas and drinks.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Deal for 2 (1 Lrg Pizza + 2 Zingers + 2 Drinks)', 2385, 'Exciting Deals', 'A feast for two: Large Pizza, crispy Zingers, and drinks.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Deal for 4 (1 Lrg + 1 Med Pizza + 4 Clubs + 4 Drinks)', 4350, 'Exciting Deals', 'Big appetite? Includes Large & Medium Pizzas plus Club Sandwiches.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Deal for 4 (2 Lrg Pizza + 4 Wraps + 4 Drinks)', 4660, 'Exciting Deals', 'Pizza & Wraps party pack for four.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Family Deal', 3720, 'Exciting Deals', '1 Lrg & 1 Med Pizza, 1 Zinger, 1 Patty Burger, Lrg Fries, 4 Drinks', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Friends Deal', 4800, 'Exciting Deals', '2 Lrg Pizza, 2 Zingers, 2 Clubs, 4 Drinks', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'BBQ Chicken Wrap', 380, 'Pizza, Sandwiches, & More', 'Grilled chicken tossed in smoky BBQ sauce, wrapped with fresh veggies.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Buffalo Chicken Wrap', 380, 'Pizza, Sandwiches, & More', 'Spicy buffalo chicken breast with cool ranch dressing in a soft tortilla.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Crispy Chicken Wrap', 380, 'Pizza, Sandwiches, & More', 'Golden fried chicken strips with lettuce and mayo.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Fajita Chicken Sandwich', 450, 'Pizza, Sandwiches, & More', 'Spiced fajita chicken, onions, and peppers in toasted bread.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Fries (Regular/Large/Loaded)', 175, 'Pizza, Sandwiches, & More', 'Crispy golden fries. Choose Plain, Masala, or Mayo.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Chicken Wings (Buffalo/BBQ)', 450, 'Pizza, Sandwiches, & More', 'Juicy wings coated in your choice of spicy Buffalo or sweet BBQ sauce.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Nuggets', 390, 'Pizza, Sandwiches, & More', 'Bite-sized crispy chicken chunks, perfect for snacking.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Chicken Tikka Pizza', 550, 'Pizza, Sandwiches, & More', 'Classic desi flavor with spicy tikka chunks and onions.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Chicken Fajita Pizza', 550, 'Pizza, Sandwiches, & More', 'Fajita seasoned chicken, capsicum, and onions.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Chicken Malai Boti Pizza', 550, 'Pizza, Sandwiches, & More', 'Creamy malai boti chicken bits with a mild, rich flavor.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Chicken Supreme Pizza', 550, 'Pizza, Sandwiches, & More', 'Loaded with chicken sausages, fajita, tikka, and veggies.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Kabab Crust Pizza', 700, 'Pizza, Sandwiches, & More', 'Stuffed crust with seekh kabab bites for extra meatiness.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Chicken Meat Balls Pizza', 700, 'Pizza, Sandwiches, & More', 'Savory meatballs topped with melted mozzarella.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Mediterranean Pizza', 550, 'Pizza, Sandwiches, & More', 'Fresh veggies, olives, and feta cheese (Video exclusive).', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Zinger Burger', 430, 'Pizza, Sandwiches, & More', 'Crunchy fried chicken fillet with fresh lettuce and mayo.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Cheesy Zinger Burger', 530, 'Pizza, Sandwiches, & More', 'Our signature Zinger topped with a slice of melted cheddar.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Chicken Patty Burger', 450, 'Pizza, Sandwiches, & More', 'Succulent chicken patty grilled to perfection.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Lotus Frappe', 720, 'Signature Cold Coffee', 'Rich creamy blend with Lotus Biscoff spread and biscuit crumbs.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Mocha Frappe', 720, 'Signature Cold Coffee', 'Iced coffee blended with rich chocolate syrup and milk.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Oreo Frappe', 720, 'Signature Cold Coffee', 'Cookies and cream delight with a coffee kick.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'V60 Iced', 550, 'Signature Cold Coffee', 'Pour-over method over ice for a clean, crisp coffee taste.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Blue Velvet Frappe', 720, 'Signature Cold Coffee', 'Unique velvet vanilla blend with a stunning blue hue.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Caramel Frappe', 720, 'Signature Cold Coffee', 'Sweet caramel blended with espresso and milk, topped with whipped cream.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Mochaccino', 650, 'Signature Hot Coffee', 'A warm hug of espresso, steamed milk, and chocolate.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Caramel Latte', 650, 'Signature Hot Coffee', 'Espresso with steamed milk and sweet caramel syrup.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'V60', 550, 'Signature Hot Coffee', 'Manual pour-over brewing for a pure, aromatic cup.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Coffee Toffee', 620, 'Signature Hot Coffee', 'Rich coffee with distinct toffee nut notes.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Spanish Latte', 620, 'Signature Hot Coffee', 'Espresso with textured milk and sweetened condensed milk.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Chocolate Ice Cream Shake', 470, 'Ice Cream Shakes & Mojito', 'Thick and creamy shake made with premium chocolate ice cream.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Oreo Ice Cream Shake', 720, 'Ice Cream Shakes & Mojito', 'Blended with real Oreos for a cookie crunch.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Vanilla Ice Cream Shake', 470, 'Ice Cream Shakes & Mojito', 'Classic vanilla bean flavor, smooth and rich.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Blue Velvet Ice Cream Shake', 720, 'Ice Cream Shakes & Mojito', 'Creamy blue velvet indulgence.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Lotus Ice Cream Shake', 720, 'Ice Cream Shakes & Mojito', 'Lotus Biscoff infused shake for cookie butter lovers.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Strawberry Mojito', 520, 'Ice Cream Shakes & Mojito', 'Refreshing sparkling drink with lime, mint, and strawberry.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Americano', 450, 'Hot Coffee', 'Espresso shots topped with hot water.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Cappuccino', 520, 'Hot Coffee', 'Equal parts espresso, steamed milk, and foam.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Mocha', 620, 'Hot Coffee', 'Espresso mixed with hot chocolate and steamed milk.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Hot Chocolate', 620, 'Hot Coffee', 'Rich cocoa beverage, no coffee included.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Iced Cappuccino', 590, 'Cold Coffee', 'Chilled cappuccino poured over ice.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Iced Americano', 450, 'Cold Coffee', 'Espresso and cold water over ice.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Iced Tea Peach', 520, 'Teas & Desserts', 'Chilled tea infused with sweet peach flavor.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'English Breakfast Tea', 270, 'Teas & Desserts', 'Strong, traditional black tea blend.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Green Tea (Moroccan Mint & Lemon)', 270, 'Teas & Desserts', 'Soothing green tea with refreshing mint or zesty lemon.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Tea with Milk', 350, 'Teas & Desserts', 'Classic brewed tea served with fresh milk.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Cream Puff', 75, 'Teas & Desserts', 'Light pastry shell filled with sweet whipped cream.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Pastry (Chocolate/Caramel)', 250, 'Teas & Desserts', 'Soft sponge cake layered with your choice of topping.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Chocolate Brownie', 250, 'Teas & Desserts', 'Rich, fudgy chocolate brownie square.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Chocolate Croissant', 380, 'Teas & Desserts', 'Buttery flaky croissant filled with chocolate.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Croissant', 110, 'Teas & Desserts', 'Plain buttery croissant, freshly baked.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Mineral Water Small', 70, 'Teas & Desserts', ' chilled bottle.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Soft Drink', 70, 'Teas & Desserts', 'Coke, Sprite, or Fanta.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Raaz Guatemala Beans (250g)', 2750, 'Raw Coffee (Beans)', 'Single origin beans with fruity notes.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Raaz Espresso Beans (1kg)', 11500, 'Raw Coffee (Beans)', 'Strong dark roast perfect for espresso shots.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Raaz Kenya Rarity (250g)', 4500, 'Raw Coffee (Beans)', 'Exotic beans with bright acidity and berry tones.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Raaz Signature Blend (250g)', 2500, 'Raw Coffee (Beans)', 'Our house blend, balanced and smooth.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Raaz Colombia Huila (250g)', 3750, 'Raw Coffee (Beans)', 'Medium body with caramel sweetness.', 1, '2026-01-28 16:18:10');
INSERT INTO menu (user_id, name, price, category, description, available, created_at) VALUES (@userId, 'Raaz Premium Blend (1kg)', 12000, 'Raw Coffee (Beans)', 'Top-tier selection for the coffee connoisseur.', 1, '2026-01-28 16:18:10');

-- Orders
INSERT INTO orders (user_id, customer, phone, items, total, status, created_at, updated_at) VALUES (@userId, 'Ahmed Khan', '923001234567', '["Zinger Burger","Fries","Soft Drink"]', 950, 'Preparing', '2026-01-28 16:18:10', '2026-01-28 16:18:10');
INSERT INTO orders (user_id, customer, phone, items, total, status, created_at, updated_at) VALUES (@userId, 'Ahmed Khan', '923001234567', '["Zinger Burger","Soft Drink"]', 800, 'Delivered', '2026-01-28 16:18:10', '2026-01-28 16:18:10');
INSERT INTO orders (user_id, customer, phone, items, total, status, created_at, updated_at) VALUES (@userId, 'Omar Farooq', '923009876543', '["Chicken Tikka Pizza","Soft Drink"]', 620, 'Delivered', '2026-01-28 16:18:10', '2026-01-28 16:18:10');

-- Inventory
INSERT INTO inventory (user_id, item, quantity, unit, supplier, status, created_at, updated_at) VALUES (@userId, 'Arabica Coffee Beans', 15, 'kg', 'Raaz Beans', 'Good', '2026-01-28 16:18:10', '2026-01-28 16:18:10');
INSERT INTO inventory (user_id, item, quantity, unit, supplier, status, created_at, updated_at) VALUES (@userId, 'Fresh Milk', 45, 'L', 'Punjab Dairy', 'Good', '2026-01-28 16:18:10', '2026-01-28 16:18:10');
INSERT INTO inventory (user_id, item, quantity, unit, supplier, status, created_at, updated_at) VALUES (@userId, 'Chocolate Syrup', 8, 'L', 'Sweet Supplies', 'Low Risk', '2026-01-28 16:18:10', '2026-01-28 16:18:10');
INSERT INTO inventory (user_id, item, quantity, unit, supplier, status, created_at, updated_at) VALUES (@userId, 'Burger Buns', 24, 'pcs', 'Dawn Bread', 'Critical', '2026-01-28 16:18:10', '2026-01-28 16:18:10');
INSERT INTO inventory (user_id, item, quantity, unit, supplier, status, created_at, updated_at) VALUES (@userId, 'Chicken Fillets', 12, 'kg', 'K&Ns', 'Good', '2026-01-28 16:18:10', '2026-01-28 16:18:10');
INSERT INTO inventory (user_id, item, quantity, unit, supplier, status, created_at, updated_at) VALUES (@userId, 'Sugar', 50, 'kg', 'Local Mart', 'Good', '2026-01-28 16:18:10', '2026-01-28 16:18:10');
INSERT INTO inventory (user_id, item, quantity, unit, supplier, status, created_at, updated_at) VALUES (@userId, 'Oreo Biscuits', 100, 'pcs', 'Dawn Distribution', 'Good', '2026-01-28 16:18:10', '2026-01-28 16:18:10');
INSERT INTO inventory (user_id, item, quantity, unit, supplier, status, created_at, updated_at) VALUES (@userId, 'Lotus Biscoff', 12, 'jars', 'Imported Goods', 'Low Risk', '2026-01-28 16:18:10', '2026-01-28 16:18:10');

-- Suppliers
INSERT INTO suppliers (user_id, name, type, rating, status, created_at) VALUES (@userId, 'Raaz Beans', 'Coffee', 4.9, 'Active', '2026-01-28 16:18:10');
INSERT INTO suppliers (user_id, name, type, rating, status, created_at) VALUES (@userId, 'Punjab Dairy', 'Dairy', 4.7, 'Active', '2026-01-28 16:18:10');
INSERT INTO suppliers (user_id, name, type, rating, status, created_at) VALUES (@userId, 'Dawn Bread', 'Bakery', 4.5, 'Delayed', '2026-01-28 16:18:10');
INSERT INTO suppliers (user_id, name, type, rating, status, created_at) VALUES (@userId, 'K&Ns', 'Meat', 4.8, 'Active', '2026-01-28 16:18:10');
INSERT INTO suppliers (user_id, name, type, rating, status, created_at) VALUES (@userId, 'Sweet Supplies', 'Syrups', 4.2, 'Active', '2026-01-28 16:18:10');

SET FOREIGN_KEY_CHECKS=1;
