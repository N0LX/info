require("dotenv").config(); // ✅ Load environment variables from .env

module.exports = {
    // 🛠 Database Config
    HOST: "localhost",
    PORT: 1111,
    USERNAME: "W3_87057_Jayesh",
    PASSWORD: "root",
    DATABASE: "project",

    // 🗂️ Table Names
    USER_TABLE: "Users",
    PAYMENT_TABLE: "payment",
    CART_TABLE: "Cart",
    ORDERS_TABLE: "Orders",
    PRODUCT_TABLE: "product",
    PRODUCT_DETAILS_TABLE: "ProductDetails",
    TRANSPORT_SERVICE_TABLE: "TransportService",
    WISHLIST_TABLE: "Wishlist",
    CATEGORY_TABLE: "Category",
    SELLER_TABLE: "Seller",
    ADDRESS_TABLE: "Address",
   
    CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
    
};
