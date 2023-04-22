import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
// app.use('/realtimeproducts', viewsRouter)

app.use((err, req, res, next) => {
    res.status(500).send("Error no contralado");
});

//app.listen(8080, () => console.log("Listening on 8080"));

const server = app.listen(8080, () => console.log('Server running'));

const io = new Server(server);

app.set('socketio', io);

io.on('connection', () => {
    console.log('Conectado');
});