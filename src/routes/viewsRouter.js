import ProductManager from "../dao/dbManager/productManager.js";
import {__dirname } from "../utils.js";
import { productModel } from "../dao/models/productModel.js";
import CartManager from "../dao/dbManager/cartManager.js";
import Router from './dbRoutes/router.js';
import { passportStrategiesEnum } from '../config/enums.js';
const cartManager = new CartManager();
const productManager = new ProductManager();

export default class ViewsRouter extends Router {
    init() {
        
        this.get('/register', ['PUBLIC'], passportStrategiesEnum.NOTHING , (req, res) => {
            res.render('register');
        });

        this.get('/reset',  ['PUBLIC'], passportStrategiesEnum.NOTHING , (req, res) => {
            res.render('reset');
        });

        this.get('/login',  ['PUBLIC'], passportStrategiesEnum.NOTHING , (req, res) => {
            res.render('login');
        });

        this.get('/', ['ADMIN','USER_PREMIUM','USER'],passportStrategiesEnum.JWT , async (req, res) => {
            const { page = 1, limit = 10 } = req.query;
            const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
                await productModel.paginate({}, { limit, page, lean: true });

            const products = docs;

            res.render('products', {
                user: req.user,
                products,
                hasPrevPage,
                hasNextPage,
                nextPage,
                prevPage
            });
        });

        this.get("/home", ['ADMIN','USER_PREMIUM','USER'],passportStrategiesEnum.JWT , async (req, res) => {
            const result = await productManager.getProducts(999, 1);
            const arrayProducts = [...result.docs].map((product) => product.toJSON());
            res.render("home", { products: arrayProducts });
        });

        this.get("/carts/:cid", ['ADMIN','USER_PREMIUM','USER'],passportStrategiesEnum.JWT , async (req, res) => {
            const cid = req.params.cid;
            const result = await cartManager.getCartById(cid);
            const cart = result;
            res.render("carts", { cart: cart });
        });

        this.get("/products", ['ADMIN','USER_PREMIUM','USER'],passportStrategiesEnum.JWT , async (req, res) => {
            const { page = 1, limit = 10 } = req.query;
            const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
                await productModel.paginate({}, { limit, page, lean: true });
            const user=req.user;
            const products = docs;

            res.render("products", {
                products,
                hasPrevPage,
                hasNextPage,
                nextPage,
                prevPage,
                user
            });
        });

        this.get("/realtimeproducts", ['ADMIN','USER_PREMIUM','USER'],passportStrategiesEnum.JWT  , async (req, res) => {
            const result = await productManager.getProducts();
            const arrayProducts = [...result.docs];
            res.render("realTimeProducts", { products: arrayProducts });
        });

        this.get("/chat", ['ADMIN','USER_PREMIUM','USER'],passportStrategiesEnum.JWT , async (req, res) => {
            res.render("chat");
        });

    }
}

