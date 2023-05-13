import { cartModel } from '../models/cartModel.js';

export default class CartManager {
    constructor() {
        console.log('Working Carts with DB')
    }

    getCarts = async () => {
        const carts = await cartModel.find().lean();
        return carts;
    };

    /**
     * Busca un Cart por Id
     * @param {*} idCart Id de un Carrito
     * @returns Cart
     */
    getCartById = async (idCart) => {
        const cart = await cartModel.findOne({ _id: idCart }).lean();
        return cart;
    };

    /**
     * Agrega un carrito
     * @param {*} cart Objeto del carrito
     * @returns
     */
    addCarts = async (cart) => {
        const result = await cartModel.create(cart);
        return result;
    };

    /**
     * Actualiza un Carrito
     *
     * @param {*} cid Id de un carrito
     * @param {*} pid Id de Producto
     * @returns
     */
    updateCart = async (cid, pid) => {
        const cart = await this.getCartById(cid)

        let product = cart.products.find(
            (pcart) => pcart.product === pid
        );
        if (product) {
            product.quantity++;
        } else {
            product = {
                product: pid,
                quantity: 1,
            };
            cart.products.push(product);
        }
        const result = await cartModel.updateOne({ _id: cid }, cart);
        return result;
    };

    /**
     * Borra un carrito de la colección
     * @param {*} idCart Id del carrito
     */
    deleteCart = async (idCart) => {
        const result = await cartModel.deleteOne({ _id: idCart });
        return result;
    };
}
