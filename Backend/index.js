const express = require("express");
const cors = require("cors");
const {PORT} = require("./config");


const app = express();

//Middleware
app.use(cors());
app.use(express.json());

// test api
app.get("/test", (req, res) => {
    res.json({ message: "API is working" });
  });

//Routes
const userRoutes = require("./routes/user");
const cartRoute=require("./routes/cart");
const transportRoute = require("./routes/Transport");
const AddressRoute = require("./routes/Address");
const orderRoute = require("./routes/orders");
const paymentRoute = require("./routes/payment");
const productRoute = require("./routes/product");
const sellerRoute = require("./routes/seller");
const wishRoute = require("./routes/wishlist");
const dispatcherRoute = require("./routes/DispatchedOrders");
const CategoryRoute = require("./routes/category");


app.use("/user",userRoutes);
app.use("/Cart",cartRoute);
app.use("/transport",transportRoute);
app.use("/disp",dispatcherRoute);
app.use("/address",AddressRoute);
app.use("/order",orderRoute);
app.use("/payment",paymentRoute);
app.use("/product",productRoute);
app.use("/seller",sellerRoute);
app.use("/wish",wishRoute);
app.use("/category",CategoryRoute);

app.listen(PORT, () =>{
    console.log(`Server started on port: ${PORT}`);
})
