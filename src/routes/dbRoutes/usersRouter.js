import Router from './router.js';
import { getUsers, saveUser, getByEmailUser, updateOneUser, loginUser, registerUser, failLoginUser, githubUser, githubCallbackUser, resetUser, logoutUser } from '../../controllers/usersController.js'

import passport from 'passport';
import { passportStrategiesEnum } from '../../config/enums.js';
// import { isValidPassword, generateToken, createHash } from '../../utils.js';

// const usersManager = new Users();

export default class UsersRouter extends Router {
    init() {
        this.post('/login', ['PUBLIC'], passportStrategiesEnum.NOTHING, loginUser )

        this.post('/register', ['PUBLIC'], passportStrategiesEnum.NOTHING, registerUser)

        this.get('/fail-login', ['PUBLIC'], passportStrategiesEnum.NOTHING,failLoginUser);

        this.get('/github', ['PUBLIC'], passportStrategiesEnum.NOTHING,passport.authenticate(
            'github', { scope: ['user:email'] }
        ), githubUser)

        this.get('/github-callback', ['PUBLIC'], passportStrategiesEnum.NOTHING,  passport.authenticate(
            'github', { failureRedirect: '/login' }
        ), githubCallbackUser)

        this.post('/reset',  ['PUBLIC'], passportStrategiesEnum.NOTHING, resetUser)

        this.get('/logout', ['PUBLIC'], passportStrategiesEnum.NOTHING, logoutUser)
    }
}