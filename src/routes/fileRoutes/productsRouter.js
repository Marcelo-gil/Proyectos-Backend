import { Router } from "express";
import {__dirname } from "../../utils.js";

import ProductManager from "../../dao/fileSystem/productManager.js";

const router = Router();

const productManager = new ProductManager(
    __dirname + "/../files/Productos.json"
);

router.get("/", async (req, res) => {
    const limit = Number(req.query.limit);
    try {
        const products = await productManager.getProducts();
        const productsLimit = limit ? products.slice(0, limit) : products;
        res.send(productsLimit);
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const pid = Number(req.params.pid);
        const product = await productManager.getProductById(pid);
        res.send(product);
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
});

router.post("/", async (req, res) => {
    const productNew = req.body;
    try {
        const product = await productManager.addProducts(productNew);
        if (product) {
            const io = req.app.get("socketio");
            io.emit("showProducts", await productManager.getProducts());

            res.send({
                status: "success",
                message: "Producto Creado Correctamente",
                payload: product,
            });
        }
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
});

router.put("/:pid", async (req, res) => {
    const pid = Number(req.params.pid);
    const productNew = req.body;
    try {
        const product = await productManager.updateProduct(pid, productNew);

        const io = req.app.get("socketio");
        io.emit("showProducts", await productManager.getProducts(999,1));

        res.send({
            status: "success",
            message: "Producto Actualizado Correctamente",
            payload: product,
        });
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
});

router.delete("/:pid", async (req, res) => {
    const pid = Number(req.params.pid);
    try {
        const product = await productManager.deleteProduct(pid);

        const io = req.app.get("socketio");
        io.emit("showProducts", await productManager.getProducts(999,1));

        res.send({
            status: "success",
            message: "Producto Eliminado Correctamente",
            payload: product,
        });
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
});

export default router;
