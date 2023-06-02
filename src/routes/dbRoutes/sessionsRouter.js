import { Router } from 'express';
import userModel from "../../dao/models/usersModel.js";
import { createHash, isValidPassword } from '../../utils.js';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const exists = await userModel.findOne({ email });
        const role = "usuario";
        if (exists) return res.status(400).send({ status: 'error', error: 'User already exists' });

        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role
        }

        await userModel.create(user);
        res.send({ status: 'success', message: 'User registered' })
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
             req.session.user = {
                 name: 'adminCoder',
                 email: 'adminCoder@coder.com',
                 role: 'admin'
             }
        } else {

            const user = await userModel.findOne({ email });

            if (!user) return res.status(400).send({ status: 'error', error: 'Incorrect credentials' });
            
            if(!isValidPassword(user, password)) return res.status(401).send({ status: 'error', error: 'Incorrect password' });
            
            delete user.password;

            req.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role
            }
            
        }
        res.send({ status: 'success', message: 'Login success' })
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.status(500).send({ status: 'error', error: 'Logout fail' });
        res.redirect('/')
    })
});

export default router;