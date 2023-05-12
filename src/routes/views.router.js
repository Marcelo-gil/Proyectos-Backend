import { Router } from "express";
//import ProductManager from "../dao/fileSystem/productManager.js";
//import ProductManager from "../dao/dbManager/ProductManager.js"
import ProductManager from "../dao/dbManager/productManager.js";
import __dirname from "../utils.js";

const router = Router();

const productManager = new ProductManager(
    __dirname + "/../files/Productos.json"
);

router.get("/", async (req, res) => {
    res.render("home", { products: await productManager.getProducts() });
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", {
        products: await productManager.getProducts(),
    });
});

export default router;
