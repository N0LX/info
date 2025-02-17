const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const { PORT } = require("./config");
const fileUpload = require("express-fileupload");
const db = require("./db"); // Import MySQL connection

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload({ useTempFiles: true }));

// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Test API
app.get("/test", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "❌ Database connection error", error: err });
    }
    res.json({ message: "✅ API is working, DB connected" });
  });
});

// Routes
const userRoutes = require("./routes/user");
const transportRoute = require("./routes/Transport");
const AddressRoute = require("./routes/address");
const orderRoute = require("./routes/orders");
const paymentRoute = require("./routes/payment");
const productRoute = require("./routes/product");
const wishRoute = require("./routes/wishlist");
const dispatcherRoute = require("./routes/DispatchedOrders");
const CategoryRoute = require("./routes/category");
const cloudinaryRoute = require("./routes/Cloudinary");

app.use("/user", userRoutes);
app.use("/transport", transportRoute);
app.use("/disp", dispatcherRoute);
app.use("/address", AddressRoute);
app.use("/order", orderRoute);
app.use("/payment", paymentRoute);
app.use("/product", productRoute);
app.use("/wish", wishRoute);
app.use("/category", CategoryRoute);
app.use("/upload", cloudinaryRoute);

app.listen(PORT, () => {
  console.log(` Server started on port: ${PORT}`);
});
