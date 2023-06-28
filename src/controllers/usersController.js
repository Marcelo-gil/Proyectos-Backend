import { 
    saveUser as saveUserService, 
    getUsers as getUsersService,
    getByEmailUser as getByEmailUserService,
    updateOneUser as updateOneUserService

} from '../services/usersService.js'

import { isValidPassword, generateToken, createHash } from '../utils.js';

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    const user = await getByEmailUserService(email);
    
     if (!user) return res.sendClientError('incorrect credentials');
    
    const comparePassword = isValidPassword(user, password);

    if (!comparePassword) {
        return res.sendClientError('incorrect credentials');
    }

    const accessToken = generateToken(user);

    res.cookie(
        'coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
    ).send({ status: 'success' }); 

};

const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const role = 'USER';
        if (!first_name || !last_name || !role || !email || !password)
            return res.sendClientError('incomplete values')

        const exists = await getByEmailUserService(email);

        if (exists)
            return res.sendClientError('user already exists')
        
        const hashedPassword = createHash(password);

        const newUser = {
            ...req.body
        };

        newUser.password = hashedPassword;

        const result = await saveUserService(newUser);

        res.sendSuccess(result)
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const failLoginUser = async (req, res) => {
    res.send({ status: 'error', message: 'Login failed' });
}

const githubUser = async (req, res) => {
    res.send({ status: "success", message: "User registered" })
}

const githubCallbackUser = async (req, res) => {

    const user = req.user;
    
    const accessToken = generateToken(user);

    res.cookie(
        'coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
    ).redirect('/');
   
}

const resetUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) return res.status(400).send({ status: 'error', error: 'Incomplete values' });

        const user = await getByEmailUserService(email);

        if (!user) return res.status(400).send({ status: 'error', error: 'User not found' });

        user.password = createHash(password);

        await updateOneUserService( email , user);

        res.send({ status: 'success', message: 'Password reset' })
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });   
    }
}

const logoutUser =  (req, res) => {

    if (req.cookies['coderCookieToken']) {
        res
        .clearCookie('coderCookieToken')
        .redirect('/')
    } else {
        res.status(401).json({
            error: 'Invalid jwt'
        })
    }

}

const saveUser = async (req, res) => {
    const user = req.body
    const result = await saveUserService(user)
    res.send(result)
}

const getUsers = async (req, res) => {
    const users = await getUsersService()
    res.send(users)
}

const getByEmailUser = async (req, res) => {

    const { email } = req.body;

    const user = await getByEmailUserService(email);
    
    return user;
}

const updateOneUser = async () => {
    const result = await updateOneUserService(email,user);
    return result;
}

export {
    saveUser,
    getUsers,
    getByEmailUser,
    updateOneUser,
    loginUser,
    registerUser,
    failLoginUser,
    githubUser,
    githubCallbackUser,
    resetUser,
    logoutUser
}