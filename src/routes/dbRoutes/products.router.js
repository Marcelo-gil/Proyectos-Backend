import { Router } from "express";
import ProductManager from "../../dao/dbManager/productManager.js";

const router = Router();
const productsManager = new ProductManager();

router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const query = req.query.query || undefined;
    const sort = req.query.sort || undefined;

    try {
        const result = await productsManager.getProducts(limit,page,query,sort);
        console.log(result);
        const products=[...result.docs];

        res.send({ status: "success", 
            payload: products,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevLink,
            nextLink: result.nextLink
        });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    console.log(req.query)
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

            const resultProducts = await productManager.getProducts();
            const arrayProducts=[...resultProducts.docs];

            io.emit("showProducts", arrayProducts);

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
        if (product) {
            const io = req.app.get("socketio");
            const result = await productManager.getProducts();
            const arrayProducts=[...result.docs];
            
            io.emit("showProducts", arrayProducts);

            res.send({
                status: "success",
                message: "Producto Actualizado Correctamente",
                payload: product,
            });
        } else {
            res.status(400).send({
                status: "error",
                error: "Ocurrio un error: " + "Producto Inexistente",
            });
        }
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
        if (product.deletedCount === 0) {
            res.status(400).send({
                status: "error",
                error: "Producto Inexistente",
            });
        } else {
            const io = req.app.get("socketio");
            const result = await productManager.getProducts();
            const arrayProducts=[...result.docs];

            io.emit("showProducts", arrayProducts);

            res.send({
                status: "success",
                message: "Producto Eliminado Correctamente",
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

export default router;
