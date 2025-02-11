require("dotenv").config(); // ✅ Load environment variables from .env

module.exports = {
    // 🛠 Database Config
    HOST: "localhost",
    PORT: 1111,
    // USERNAME: "W3_87057_Jayesh",
    // PASSWORD: "root",
    // DATABASE: "project",

    // 🗂️ Table Names
    USER_TABLE: "users",
    PAYMENT_TABLE: "payment",
    ORDERS_TABLE: "orders",
    PRODUCT_TABLE: "product",
    WISHLIST_TABLE: "wishlist",
    CATEGORY_TABLE: "category",
    ADDRESS_TABLE: "address",
    OI_TABLE: "order_items",

};
