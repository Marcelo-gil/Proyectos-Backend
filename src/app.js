import express from "express";
import productsRouter from "./routes/dbRoutes/products.router.js";
//import cartsRouter from "./routes/dbRoutes/carts.router.js";

import { Server } from "socket.io";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import mongoose from 'mongoose';
import ProductManager from "./dao/dbManager/productManager.js"

/* const productManager = new ProductManager(
    __dirname + "/../files/Productos.json"
);
 */

const productManager = new ProductManager()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
//app.use("/api/carts", cartsRouter);

app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);

/* app.use((err, req, res, next) => {
    res.status(500).send("Error no contralado");
}); */


app.use('/api/productos', productsRouter);
//app.use('/api/carrito', cartsRouter);

try {
    await mongoose.connect('mongodb+srv://marceloalgil:RRrQo5zW2vhLoHOU@cluster39760ap.e5cmjnv.mongodb.net/ecommerce?retryWrites=true&w=majority');
    console.log('DB CONNECTED')
} catch (error) {
    console.log(error);
}


const server = app.listen(8080, () => console.log("Server running"));

const io = new Server(server);

app.set("socketio", io);

io.on("connection", async () => {
    console.log("Cliente Conectado");
    io.emit("showProducts", await productManager.getProducts());
});
