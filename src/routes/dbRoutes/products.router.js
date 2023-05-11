import { Router } from 'express';
import ProductManager from "../../dao/dbManagers/productManager.js";

const router = Router();
const productsManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productsManager.getProducts();
        res.send({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }
});

router.post('/', async (req, res) => {
    const { first_name, last_name, dni, email, birth_date, gender } = req.body;

    if (!first_name || !last_name || !email) {
        return res.status(400).send({ status: 'error', error: 'Incomplete values' });
    }

    try {
        const result = await productsManager.save({
            first_name,
            last_name,
            dni,
            email,
            birth_date,
            gender
        });

        res.send({ status: 'success', payload: result })
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }
});

export default router;