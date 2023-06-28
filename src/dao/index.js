import mongoProductDao from './dbManager/productManager.js'
import mongoUserDao from './dbManager/userManager.js'
import mongoCartDao from './dbManager/cartManager.js'

//Import del dao de manejo de datos con archivos

const MongoProductDao = new mongoProductDao();
const MongoUserDao = new mongoUserDao();
const MongoCartDao = new mongoCartDao();
//Crear las instancia de manejo de datos con archivos

//export const TOYSDAO = config.persistence === 'MEMORY' ? MemoryToyDao : MongoToyDao;
export const PRODUCTSDAO = MongoProductDao;
export const USERSDAO = MongoUserDao;
export const CARTSDAO = MongoCartDao;