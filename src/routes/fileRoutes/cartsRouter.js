import { Router } from "express";
import {__dirname} from "../../utils.js";
import CartManager from "../../dao/fileSystem/cartManager.js";
import ProductManager from "../../dao/fileSystem/productManager.js";

const router = Router();

const cartManager = new CartManager(__dirname + "/../files/Carrito.json");
const productManager = new ProductManager(
    __dirname + "/../files/Productos.json"
);

router.get("/:cid", async (req, res) => {
    try {
        const cid = Number(req.params.cid);
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
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);
    try {
        await productManager.getProductById(pid);
        const cart = await cartManager.updateCart(cid, pid);
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
export default router;
