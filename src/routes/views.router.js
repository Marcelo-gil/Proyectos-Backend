import { Router } from "express";
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

router.get("/chat", async (req, res) => {
    res.render("chat");
});

export default router;
