import { cartModel } from "../models/cartModel.js";

export default class CartManager {
    constructor() {
        console.log("Working Carts with DB");
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
        if (!cart) {
            return { status: "Error", error: "Producto no encontrado" };
        }

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
    updateCartOne = async (cid, pid, qty) => {
        const cart = await this.getCartById(cid);

        let product = cart.products.find((pcart) => pcart.product._id.toString() === pid);
        if (product) {
            product.quantity = qty;
        } else {
            product = {
                product: pid,
                quantity: qty,
            };
            cart.products.push(product);
        }
        const result = await cartModel.updateOne({ _id: cid }, cart);
        return result;
    };

  /**
     * Actualiza un Carrito
     *
     * @param {*} cid Id de un carrito
     * @param {*} products array de Producto
     * @returns
     */
  updateCart = async (cid, products) => {
    const cart = await this.getCartById(cid);
    const productsToPush=[];
    products.forEach(productEach => {
        let product = cart.products.find((pcart) => pcart.product._id.toString() === productEach.id);
        if (product) {
            product.quantity = productEach.quantity;
        } else {
            product = {
                product: productEach.id,
                quantity: productEach.quantity,
            };
            productsToPush.push(product);
        }
    });
    productsToPush.forEach( data =>{
        cart.products.push(data);
    });
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

      /**
     * Borra un Producto del carrito de la colección
     * @param {*} cid Id de un carrito
     * @param {*} pid Id de Producto
     */
    deleteCartProduct = async (cid, pid) => {
     //   const cart = await this.getCartById(cid);
        const result = await cartModel.updateOne({ _id: cid }, {$pull: {products: {product: pid}}});
        //let product = cart.products.delete((pcart) => pcart.product === pid);
        //const result = await cartModel.updateOne({ _id: cid }, cart);
        return result;
    };


}
