import { Router } from "express";
import CartManager from "../../dao/dbManager/cartManager.js";
import ProductManager from "../../dao/dbManager/productManager.js";

const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const cart = await cartManager.getCarts();
        res.send(cart);
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartById(cid);
        res.send(cart);
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const cart = {
            products: [],
        };
        const newCart = await cartManager.addCarts(cart);
        if (newCart) {
            res.send({
                status: "success",
                message: "Carrito Creado Correctamente",
                payload: newCart,
            });
        }
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const qty = 1;
    try {
        await productManager.getProductById(pid);
        const cart = await cartManager.updateCartOne(cid, pid, qty);
        if (cart) {
            res.send({
                status: "success",
                message: "Producto agregado al Carrito Correctamente",
                payload: cart,
            });
        }
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
});


router.put("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const qty = Number(req.body.quantity);
    try {
        await productManager.getProductById(pid);
        const cart = await cartManager.updateCartOne(cid, pid, qty);
        if (cart) {
            res.send({
                status: "success",
                message: "Producto actualizado en el Carrito Correctamente",
                payload: cart,
            });
        }
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
});


router.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const products = req.body;
    try {
        const cart = await cartManager.updateCart(cid, products);
        if (cart) {
            res.send({
                status: "success",
                message: "Productos actualizados en el Carrito Correctamente",
                payload: cart,
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
        const cart = await cartManager.deleteCart(pid);
        if (cart.deletedCount === 0) {
            res.status(400).send({
                status: "error",
                error: "Carrito Inexistente",
            });
        } else {
            res.send({
                status: "success",
                message: "Carrito Eliminado Correctamente",
                payload: cart,
            });
        }
    } catch (error) {
        res.status(400).send({
            status: "error",
            error: "Ocurrio un error: " + error.message,
        });
    }
});

router.delete("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const cart = await cartManager.deleteCartProduct(cid, pid);
        if (cart) {
            res.send({
                status: "success",
                message: "Producto Borrado del Carrito Correctamente",
                payload: cart,
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
