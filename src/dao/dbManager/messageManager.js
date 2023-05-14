import { messageModel } from "../models/messageModel.js";

export default class MessageManager {
    constructor() {
        console.log("Working Messages with DB");
    }

    getMessages = async () => {
        const messages = await messageModel.find().lean();
        return messages;
    };

    /**
     * Agrega un Mensaje
     * @param {*} message Objeto del mensaje
     * @returns
     */
    addMessages = async (message) => {
        const result = await messageModel.create(message);
        return result;
    };
}
