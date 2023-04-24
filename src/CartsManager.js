import fs from "fs";

export default class CartManager {
    constructor(path) {
        this.path = path;
    }

    getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const cartsTxt = await fs.promises.readFile(this.path, "utf-8");
                const carts = JSON.parse(cartsTxt);
                return carts;
            } else {
                return [];
            }
        } catch (error) {
            throw error;
        }
    };

    /**
     * Busca un Cart por Id
     * @param {*} idCart Id de un Carrito
     * @returns Cart
     */
    getCartById = async (idCart) => {
        const carts = await this.getCarts();
        const cart = carts.find((cart) => cart.id === idCart);

        if (!cart) {
            throw new Error("Not found");
        }

        return cart;
    };

    /**
     * Agrega un carrito
     * @param {*} cart Objeto del carrito
     * @returns
     */
    addCarts = async (cart) => {
        try {
            const carts = await this.getCarts();

            if (carts.length === 0) {
                cart.id = 1;
            } else {
                cart.id = carts[carts.length - 1].id + 1;
            }
            carts.push(cart);

            await fs.promises.writeFile(
                this.path,
                JSON.stringify(carts, null, "\t")
            );

            return cart;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Actualiza un Carrito
     *
     * @param {*} cid Id de un carrito
     * @param {*} pid Id de Producto
     * @returns
     */
    updateCart = async (cid, pid) => {
        try {
            const carts = await this.getCarts();
            const cart = carts.find((cart) => cart.id === cid);
            if (cart) {
                const indexCart = carts.indexOf(cart);
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
                const updatedCart = { ...cart, id: cart.id };
                carts[indexCart] = updatedCart;
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(carts, null, "\t")
                );
                return updatedCart;
            } else {
                throw new Error("Carrito Inexistente");
            }
        } catch (error) {
            throw error;
        }
    };

    /**
     * Borra un carrito de la colección
     * @param {*} idCart Id del carrito
     */
    deleteCart = async (idCart) => {
        try {
            const carts = await this.getCarts();
            const cart = carts.find((cart) => cart.id === idCart);
            if (cart) {
                const cartsnew = carts.filter((cart) => cart.id !== idCart);
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(cartsnew, null, "\t")
                );
            } else {
                throw new Error("Not found");
            }
        } catch (error) {
            throw error;
        }
    };
}
