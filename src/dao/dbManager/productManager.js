import { productModel } from "../models/productModel.js";

export default class ProductManager {
    constructor() {
        console.log("Working products with DB");
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
                return [false, "Producto invalido, faltan campos"];
            } else {
                return [true, "Producto valido"];
            }
        }

        if (
            product.status !== undefined &&
            typeof product.status !== "boolean"
        ) {
            return [false, "Status Invalido, faltan campos"];
        } else {
            return [true, "Producto valido"];
        }

        if (product.title !== undefined && product.title.trim().length === 0) {
            return [false, "Debe Ingresar un Titulo"];
        } else {
            return [true, "Producto valido"];
        }

        if (
            product.description !== undefined &&
            product.description.trim().length === 0
        ) {
            return [false, "Debe Ingresar la Descripción"];
        } else {
            return [true, "Producto valido"];
        }

        if (product.code !== undefined && product.code.trim().length === 0) {
            return [false, "Debe Ingresar el código"];
        } else {
            return [true, "Producto valido"];
        }

        if (
            (product.price !== undefined && isNaN(product.price)) ||
            product.price <= 0
        ) {
            return [false, "Debe Ingresar  un Precio Valido"];
        } else {
            return [true, "Producto valido"];
        }

        if (
            (product.stock !== undefined && isNaN(product.stock)) ||
            product.stock <= 0
        ) {
            return [false, "El Stock debe ser mayor a Cero"];
        } else {
            return [true, "Producto valido"];
        }

        if (
            product.category !== undefined &&
            product.category.trim().length === 0
        ) {
            return [false, "Debe Ingresar la categoria"];
        } else {
            return [true, "Producto valido"];
        }
    }

    getProducts = async (limit, page, query, sort) => {
        let locQuery;
        if (!query) {
            locQuery = {};
        } else {
            const arrayQuery = query.split("=");
            locQuery = {
                [arrayQuery[0]]: arrayQuery[1],
            };
        }
        const locLimit = limit === undefined ? 10 : limit;
        const locPage = page === undefined ? 1 : page;
        let prodSort;
        if (sort) {
            prodSort = sort === "asc" ? -1 : 1;
        }
        const options = {
            limit: locLimit,
            page: locPage,
        };

        if (sort) {
            options.sort = { price: prodSort };
        }
        const products = await productModel.paginate(locQuery, options);
        return products;
    };

    /**
     * Busca un Producto por Id
     * @param {*} idProduct Id de Producto
     * @returns Producto
     */
    getProductById = async (idProduct) => {
        const product = await productModel.findOne({ _id: idProduct }).lean();
        if (!product) {
            return { status: "Error", error: "Producto no encontrado" };
        }
        return product;
    };

    addProducts = async (product) => {
        if (product.status === undefined) {
            product.status = true;
        }

        const result = await productModel.create(product);
        return result;
    };

    /**
     * Actualiza un producto
     *
     * @param {*} idProduct Id del producto
     * @param {*} productUpdate Producto a Acutualizar
     * @returns
     */
    updateProduct = async (idProduct, productUpdate) => {
        const result = await productModel.updateOne(
            { _id: idProduct },
            productUpdate
        );
        return result;
    };

    /**
     * Borra un producto de la colección
     * @param {*} idProduct Id del producto
     */
    deleteProduct = async (idProduct) => {
        const result = await productModel.deleteOne({ _id: idProduct });
        return result;
    };
}
