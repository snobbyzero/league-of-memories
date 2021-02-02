require('dotenv').config();
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const pino = require('pino');
const dest = pino.destination({sync: false});
const logger = pino(dest);
const {sequelize} = require('./db/index');
const cors = require('cors')

// Load tables
sequelize.sync().then(result => {
    logger.info('sync successfully');
    // Start server
    listen();
}).catch(err => {
    logger.info(err);
});

const app = express();

app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({
    origin: "http://localhost:3003", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    withCredentials: true
}));

app.set('port', process.env.PORT || 3001);

app.use('/api/account', require('./controllers/AccountController'));
app.use('/api/summoners', require('./controllers/SummonerController'));
app.use('/api/matches', require('./controllers/MatchController'));
app.use('/api/notes', require('./controllers/NoteController'));


const listen = () => {
    app.listen(app.get('port'), () => {
        logger.info(`App is listening at http://localhost:${app.get('port')}`);
    });
}
