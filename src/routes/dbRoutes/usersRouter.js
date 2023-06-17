import Router from './router.js';
import Users from '../../dao/dbManager/userManager.js';
import passport from 'passport';
import { passportStrategiesEnum } from '../../config/enums.js';
import { isValidPassword, generateToken, createHash } from '../../utils.js';

const usersManager = new Users();

export default class UsersRouter extends Router {
    init() {
        this.post('/login', ['PUBLIC'], passportStrategiesEnum.NOTHING, async (req, res) => {
            const { email, password } = req.body;
            const user = await usersManager.getByEmail(email);
            if (!user) return res.sendClientError('incorrect credentials');
            
            const comparePassword = isValidPassword(user, password);

            if (!comparePassword) {
                return res.sendClientError('incorrect credentials');
            }

            const accessToken = generateToken(user);

            res.cookie(
                'coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
            ).send({ status: 'success' });

       });

        this.post('/register', ['PUBLIC'], passportStrategiesEnum.NOTHING, async (req, res) => {
            try {
                const { first_name, last_name, email, password } = req.body;
                const role = 'USER';
                if (!first_name || !last_name || !role || !email || !password)
                    return res.sendClientError('incomplete values')

                const exists = await usersManager.getByEmail(email);

                if (exists)
                    return res.sendClientError('user already exists')
                
                const hashedPassword = createHash(password);

                const newUser = {
                    ...req.body
                };

                newUser.password = hashedPassword;

                const result = await usersManager.save(newUser);

                res.sendSuccess(result)
            } catch (error) {
                res.sendServerError(error.message);
            }
        })

        this.get('/fail-login', ['PUBLIC'], passportStrategiesEnum.NOTHING
        , async (req, res) => {
            res.send({ status: 'error', message: 'Login failed' });
        });

        this.get('/github', ['PUBLIC'], passportStrategiesEnum.NOTHING,passport.authenticate(
            'github', { scope: ['user:email'] }
        ), async (req, res) => {
            res.send({ status: "success", message: "User registered" })
        });

        this.get('/github-callback', ['PUBLIC'], passportStrategiesEnum.NOTHING,  passport.authenticate(
            'github', { failureRedirect: '/login' }
        ), async (req, res) => {

            const user = req.user;
            

            const accessToken = generateToken(user);

            res.cookie(
                'coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
            ).redirect('/');

           
        });

        this.post('/reset',  ['PUBLIC'], passportStrategiesEnum.NOTHING, async(req, res) => {
            try {
                const { email, password } = req.body;
                
                if (!email || !password) return res.status(400).send({ status: 'error', error: 'Incomplete values' });
        
                const user = await usersManager.getByEmail(email);
        
                if (!user) return res.status(400).send({ status: 'error', error: 'User not found' });
        
                user.password = createHash(password);
        
                await usersManager.updateOne( email , user);
        
                res.send({ status: 'success', message: 'Password reset' })
            } catch (error) {
                res.status(500).send({ status: 'error', error: error.message });   
            }
        })

        this.get('/logout', ['PUBLIC'], passportStrategiesEnum.NOTHING, (req, res) => {

            if (req.cookies['coderCookieToken']) {
                res
                .clearCookie('coderCookieToken')
                .redirect('/')
            } else {
                res.status(401).json({
                    error: 'Invalid jwt'
                })
            }

        });
    }
}