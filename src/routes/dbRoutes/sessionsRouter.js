import Router from './router.js';
import { passportStrategiesEnum } from '../../config/enums.js';

export default class SessionsRouter extends Router {
    init() {

        this.get('/current', ['ADMIN','USER_PREMIUM','USER'],passportStrategiesEnum.JWT, (req, res) => {
            res.sendSuccess(req.user);
        })
        
    }
}

