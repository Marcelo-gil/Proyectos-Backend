import { Router } from "express";
import ProductManager from "../../dao/dbManager/productManager.js";

const router = Router();
const productsManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const products = await productsManager.getProducts();
        res.send({ status: "success", payload: products });
    } catch (error) {
        res.status(500).send({ status: "error", error });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productsManager.getProductById(pid);
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

    const validProduct = productsManager.invalidProduct(productNew, "add");
    if (!validProduct[0]) {
        res.status(400).send({ status: "error", error: validProduct[1] });
    } else {
        try {
            const result = await productsManager.addProducts(productNew);

            const io = req.app.get("socketio");
            io.emit("showProducts", await productsManager.getProducts());

            res.send({ status: "success", payload: result });
        } catch (error) {
            res.status(500).send({ status: "error", error });
        }
    }
});

router.put("/:pid", async (req, res) => {
    const pid = req.params.pid;
    const productUpdate = req.body;

    productsManager.invalidProduct(productUpdate, "update");

    try {
        const product = await productsManager.updateProduct(pid, productUpdate);

        const io = req.app.get("socketio");
        io.emit("showProducts", await productsManager.getProducts());

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
    const pid = req.params.pid;
    try {
        const product = await productsManager.deleteProduct(pid);

        const io = req.app.get("socketio");
        io.emit("showProducts", await productsManager.getProducts());

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
