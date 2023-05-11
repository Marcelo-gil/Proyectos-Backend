import { productModel } from '../models/productModel.js';

export default class ProductManager {
    constructor() {
        console.log('Working products with DB')
    }

    /**
     * Valida los campos de un producto
     * @param {*} product  Objeto del Producto
     * @returns True producto Invalido
     */
    invalidProduct(product, origin) {
        if (origin === "add") {
            if (
                !product.title ||
                !product.description ||
                !product.code ||
                product.price == undefined ||
                product.stock == undefined ||
                !product.category
            ) {
                throw new Error("producto invalido, faltan campos");
            }
        }

        if (product.status !== undefined && typeof product.status !== "boolean")
            throw new Error("Estatus Invalido");

        if (product.title !== undefined && product.title.trim().length === 0)
            throw new Error("Debe Ingresar un Titulo");

        if (
            product.description !== undefined &&
            product.description.trim().length === 0
        )
            throw new Error("Debe Ingresar la Descripción");

        if (product.code !== undefined && product.code.trim().length === 0)
            throw new Error("Debe Ingresar el Codigo");

        if (
            (product.price !== undefined && isNaN(product.price)) ||
            product.price <= 0
        )
            throw new Error("Debe Ingresar un Precio Valido");

        if (
            (product.stock !== undefined && isNaN(product.stock)) ||
            product.stock <= 0
        )
            throw new Error("El Stock debe ser mayor a Cero");

        if (
            product.category !== undefined &&
            product.category.trim().length === 0
        )
            throw new Error("Debe Ingresar la categoria ");
    }

    getProducts = async () => {
        const products = await productModel.find().lean();
        return products;
    }

    /**
         * Busca un Producto por Id
         * @param {*} idProduct Id de Producto
         * @returns Producto
         */
    getProductById = async (idProduct) => {
        const product = await productModel.find({ _id: idProduct }).lean();
        return product;
    };

    addProducts = async (product) => {
        if (product.status === undefined) {
            product.status = true;
        }
        this.invalidProduct(product, "add");
        
        const result = await productModel.create(product);
        return result;
    }

    /**
     * Actualiza un producto
     *
     * @param {*} idProduct Id del producto
     * @param {*} productUpdate Producto a Acutualizar
     * @returns
     */
    updateProduct = async (idProduct, productUpdate) => {
        this.invalidProduct(productUpdate, "update");
        
        const result = await productModel.updateOne({ _id: idProduct }, productUpdate);
        return result;
    }

    /**
     * Borra un producto de la colección
     * @param {*} idProduct Id del producto
     */
    deleteProduct = async (idProduct) => {
        const result = await productModel.deleteOne({ _id: idProduct});
        return result;
    }
}