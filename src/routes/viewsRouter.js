import { Router } from "express";
import ProductManager from "../dao/dbManager/productManager.js";
import __dirname from "../utils.js";
import { productModel } from "../dao/models/productModel.js";
import CartManager from "../dao/dbManager/cartManager.js";

const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

const publicAccess = (req, res, next) => {
    if(req.session.user) return res.redirect('/');
    next();
}

const privateAccess = (req, res, next) => {
    if(!req.session.user) return res.redirect('/login');
    next();
}


router.get('/register', publicAccess, (req, res) => {
    res.render('register');
});

router.get('/login', publicAccess, (req, res) => {
    res.render('login');
});

router.get('/', privateAccess, async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
        await productModel.paginate({}, { limit, page, lean: true });

    const products = docs;

    res.render('products', {
        user: req.session.user,
        products,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
    });
});

router.get("/home", async (req, res) => {
    const result = await productManager.getProducts(999, 1);
    const arrayProducts = [...result.docs].map((product) => product.toJSON());
    res.render("home", { products: arrayProducts });
});

router.get("/carts/:cid", async (req, res) => {
    const cid = req.params.cid;
    const result = await cartManager.getCartById(cid);
    const cart = result;

    res.render("carts", { cart: cart });
});

router.get("/products", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
        await productModel.paginate({}, { limit, page, lean: true });

    const products = docs;

    res.render("products", {
        products,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
    });
});

router.get("/realtimeproducts", async (req, res) => {
    const result = await productManager.getProducts();
    const arrayProducts = [...result.docs];
    res.render("realTimeProducts", { products: arrayProducts });
});

router.get("/chat", async (req, res) => {
    res.render("chat");
});

export default router;
