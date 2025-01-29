CREATE TABLE Users (
    user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    role ENUM('Admin', 'User') DEFAULT 'User',
    location VARCHAR(255),
    history TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Address (
    address_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    pin VARCHAR(10),
    country VARCHAR(100) NOT NULL,
    landmarks VARCHAR(255),
    extra_directions VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);


CREATE TABLE Seller (
    seller_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Category (
    Category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    product_id INT UNSIGNED  NOT NULL
);


CREATE TABLE Product (
    product_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    seller_id INT UNSIGNED NOT NULL,
    Category_id INT UNSIGNED NOT NULL,
    description VARCHAR(255),
    Stock INT UNSIGNED NOT NULL,
    FOREIGN KEY (Category_id) REFERENCES Category(Category_id)
);




CREATE TABLE Cart (
    cart_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

CREATE TABLE Wishlist (
    wishlist_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

CREATE TABLE Payment (
    transaction_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payment_method  ENUM('UPI', 'Card', 'Cash') DEFAULT 'Cash',
    payment_status  ENUM('Pending', 'Success','Failed') DEFAULT 'Pending',
    amount DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Orders (
    order_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    transaction_id INT UNSIGNED DEFAULT NULL,
    order_date DATE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    FOREIGN KEY (transaction_id) REFERENCES Payment(transaction_id)
);

CREATE TABLE DispatchedOrders (
    dispatched_order_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    seller_id INT UNSIGNED NOT NULL,
    transport_services_id INT UNSIGNED DEFAULT NULL,
    dispatch_date DATE,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (seller_id) REFERENCES Seller(seller_id),
    FOREIGN KEY (transport_services_id) REFERENCES TransportServices(transport_services_id)
);

CREATE TABLE TransportServices (
    transport_services_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    price_charge INT UNSIGNED,
    transport_medium VARCHAR(100),
    transaction_id INT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (transaction_id) REFERENCES Payment(transaction_id)
);


//querys

-- Users Table
INSERT INTO Users (name, password, email, phone, role, location) 
VALUES 
('John Doe', 'password123', 'john@example.com', '1234567890', 'Admin', 'New York, USA'),
('Jane Smith', 'securepass', 'jane@example.com', '9876543210', 'User', 'London, UK'),
('Alice Brown', 'alicepass', 'alice@example.com', '4561237890', 'User', 'Sydney, Australia'),
('Bob Johnson', 'bobsafe', 'bob@example.com', '7894561230', 'User', 'Toronto, Canada'),
('Eve Williams', 'evepass123', 'eve@example.com', '3216549870', 'Admin', 'Berlin, Germany');

-- Address Table
INSERT INTO Address (user_id, street_address, city, pin, country, landmarks, extra_directions) 
VALUES 
(1, '123 Elm Street', 'New York', '10001', 'USA', 'Near Central Park', 'Third building on the right'),
(2, '456 Maple Avenue', 'London', 'SW1A 1AA', 'UK', 'Opposite Big Ben', 'Next to the coffee shop'),
(3, '789 Pine Road', 'Sydney', '2000', 'Australia', 'Near Opera House', 'Last house on the left'),
(4, '101 Birch Lane', 'Toronto', 'M4B 1B3', 'Canada', 'Close to CN Tower', 'Follow the blue signs'),
(5, '202 Oak Street', 'Berlin', '10115', 'Germany', 'Near Brandenburg Gate', 'Adjacent to the museum');

-- Seller Table
INSERT INTO Seller (user_id) 
VALUES 
(1), 
(2), 
(3);

-- Category Table
INSERT INTO Category (category_name, product_id) 
VALUES 
('Electronics', 1),
('Fashion', 2),
('Home Appliances', 3),
('Books', 4),
('Toys', 5);

-- Product Table
INSERT INTO Product (product_name, seller_id, Category_id, description, Stock) 
VALUES 
('Smartphone', 1, 1, 'Latest model with 128GB storage', 50),
('Leather Jacket', 2, 2, 'Stylish black leather jacket', 20),
('Microwave Oven', 3, 3, 'Compact microwave with grill function', 15),
('Fiction Book', 1, 4, 'Best-selling novel of the year', 100),
('Lego Set', 2, 5, 'Building blocks for kids', 30);

-- Cart Table
INSERT INTO Cart (user_id, product_id, quantity) 
VALUES 
(1, 1, 2),
(2, 2, 1),
(3, 3, 1),
(4, 4, 3),
(5, 5, 2);

-- Wishlist Table
INSERT INTO Wishlist (user_id, product_id) 
VALUES 
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 1);

-- Payment Table
INSERT INTO Payment (payment_method, payment_status, amount) 
VALUES 
('UPI', 'Success', 599.99),
('Card', 'Pending', 1200.50),
('Cash', 'Failed', 300.00),
('Card', 'Success', 999.75),
('UPI', 'Pending', 450.00);

-- Orders Table
INSERT INTO Orders (user_id, product_id, transaction_id, order_date) 
VALUES 
(1, 1, 1, '2024-12-01'),
(2, 2, 2, '2024-12-02'),
(3, 3, NULL, '2024-12-03'),
(4, 4, 4, '2024-12-04'),
(5, 5, 5, '2024-12-05');

-- TransportServices Table
INSERT INTO TransportServices (price_charge, transport_medium, transaction_id) 
VALUES 
(100, 'Air', 1),
(50, 'Road', NULL),
(75, 'Sea', 4),
(120, 'Rail', 5),
(90, 'Air', 3);

-- DispatchedOrders Table
INSERT INTO DispatchedOrders (order_id, seller_id, transport_services_id, dispatch_date) 
VALUES 
(1, 1, 1, '2024-12-06'),
(2, 2, 2, '2024-12-07'),
(3, 3, NULL, '2024-12-08'),
(4, 1, 3, '2024-12-09'),
(5, 2, 4, '2024-12-10');
