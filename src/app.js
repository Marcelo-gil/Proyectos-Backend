import express from "express";
import productsRouter from "./routes/dbRoutes/productsRouter.js";
import cartsRouter from "./routes/dbRoutes/cartsRouter.js";
import UsersRouter from "./routes/dbRoutes/usersRouter.js";
import SessionsRouter from './routes/dbRoutes/sessionsRouter.js'
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import ViewsRouter from "./routes/viewsRouter.js";
import {__dirname} from "./utils.js";
import mongoose from "mongoose";
import ProductManager from "./dao/dbManager/productManager.js";
import MessageManager from "./dao/dbManager/messageManager.js";
import session from 'express-session';
import initializePassport from './config/passportConfig.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';

const productManager = new ProductManager();
const messageManager = new MessageManager();

const usersRouter = new UsersRouter();
const sessionsRouter = new SessionsRouter();
const viewsRouter = new ViewsRouter();

const app = express();

try {
    await mongoose.connect(
        "mongodb+srv://marceloalgil:RRrQo5zW2vhLoHOU@cluster39760ap.e5cmjnv.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    console.log("DB CONNECTED");
} catch (error) {
    console.log(error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());

initializePassport();

app.use(session({
    secret: "CoderSecrets",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());



app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter.getRouter());
app.use('/api/users', usersRouter.getRouter());

app.use('/api/sessions', sessionsRouter.getRouter());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Error no controlado");
});


const server = app.listen(8080, () => console.log("Server running"));

const io = new Server(server);

app.set("socketio", io);

io.on("connection", async () => {
    console.log("Cliente Conectado");

    const result = await productManager.getProducts(999, 1);
    const arrayProducts = [...result.docs];
    io.emit("showProducts", arrayProducts);
});

const messages = [];

io.on("connection", (socket) => {
    console.log("Chat conectado");

    const cargarDatos = async () => {
        const historyMessages = await messageManager.getMessages();
        historyMessages.forEach((element) => {
            messages.push(element);
        });
        socket.emit("messageLogs", historyMessages);
    };

    socket.on("message", (data) => {
        const enviarMessage = async () => {
            const message = await messageManager.addMessages(data);
            messages.push(data);
            io.emit("messageLogs", messages);
        };
        enviarMessage();
    });

    socket.on("authenticated", (data) => {
        cargarDatos();
        socket.broadcast.emit("newUserConnected", data);
    });
});
