import { Router } from "express";
import ProductManager from "../dao/dbManager/productManager.js";
import __dirname from "../utils.js";

const router = Router();

const productManager = new ProductManager(
    __dirname + "/../files/Productos.json"
);

router.get("/", async (req, res) => {
    const result = await productManager.getProducts();
    const arrayProducts=[...result.docs].map(product => (product.toJSON()));
    console.log(arrayProducts);
    res.render("home", {products: arrayProducts});
    });

router.get("/realtimeproducts", async (req, res) => {
    const result = await productManager.getProducts();
    const arrayProducts=[...result.docs];
    res.render("realTimeProducts", {products: arrayProducts});
});

router.get("/chat", async (req, res) => {
    res.render("chat");
});

export default router;
