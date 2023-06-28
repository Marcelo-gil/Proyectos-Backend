import { USERSDAO } from "../dao/index.js";

const saveUser = async (user) => {
    const result = await USERSDAO.save(user);
    return result;
}

const getUsers = async () => {
    const users = await USERSDAO.getAll();
    return users;
}

const getByEmailUser = async (email) => {
    
    // email
    console.log("user Service");
    console.log(email);
    const user = await USERSDAO.getByEmail(email);
    return user;
}

const updateOneUser = async () => {
    const result = await USERSDAO.updateOne(email,user);
    return result;
}

export {
    saveUser,
    getUsers,
    getByEmailUser,
    updateOneUser
}