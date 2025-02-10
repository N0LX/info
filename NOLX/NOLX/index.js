const express = require("express");
const cors = require("cors");
const multer = require("multer"); // Import multer
const bodyParser = require("body-parser");
const { PORT } = require("./config");
const fileUpload = require("express-fileupload")

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // To handle form submissions
app.use(bodyParser.json()); // Parse JSON request body
app.use(fileUpload({
  useTempFiles:true,
  
}))
// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());

// Test API
app.get("/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Routes
const userRoutes = require("./routes/user");
const cartRoute = require("./routes/cart");
const transportRoute = require("./routes/Transport");
const AddressRoute = require("./routes/Address");
const orderRoute = require("./routes/orders");
const paymentRoute = require("./routes/payment");
const productRoute = require("./routes/product");
const sellerRoute = require("./routes/seller");
const wishRoute = require("./routes/wishlist");
const dispatcherRoute = require("./routes/DispatchedOrders");
const CategoryRoute = require("./routes/category");
const cloudinaryRoute = require("./routes/Cloudinary"); // Add Cloudinary routes

app.use("/user", userRoutes);
app.use("/Cart", cartRoute);
app.use("/transport", transportRoute);
app.use("/disp", dispatcherRoute);
app.use("/address", AddressRoute);
app.use("/order", orderRoute);
app.use("/payment", paymentRoute);
app.use("/product", productRoute);
app.use("/seller", sellerRoute);
app.use("/wish", wishRoute);
app.use("/category", CategoryRoute);
app.use("/upload", cloudinaryRoute); // Add Cloudinary upload route

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
