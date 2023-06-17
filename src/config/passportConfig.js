import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import userModel from '../dao/models/userModel.js';
import { createHash, isValidPassword } from '../utils.js';
import { PRIVATE_KEY } from './contants.js';
import jwt from 'passport-jwt';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken'];
    }
    return token;
}

const initializePassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user);
        } catch (error) {
            return done(error);
        }
    }))
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body;
        try {
            const user = await userModel.findOne({ email: username });

            if (user) {
                return done(null, false)
            }

            const userToSave = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role: 'USER',
                carts: []
            }
    
            const result = await userModel.create(userToSave);
            return done(null, result)

        } catch (error) {
            return done(`Error al obtener el usario: ${error}`)
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username});

            if (!user) {
                return done(null, false)
            }

            if (!isValidPassword(user, password)) return done(null, false)

            return done(null, user)

        } catch (error) {
            return done(`Error al obtener el usario: ${error}`)
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.0f68113f0374a068",
        clientSecret: "0fc3ca5173bd6c079d69aecfb99d1ac313df5e92",
        callbackURL: "http://localhost:8080/api/users/github-callback",
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const user = await userModel.findOne({ email })
            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email,
                    password: '' ,
                    role: 'USER',
                    carts: []
                }

                const result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;