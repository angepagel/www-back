const config = require('./config');
const routes = require('./routes');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const serveStatic = require('serve-static')


const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/uploads', serveStatic(`${__dirname}/uploads`));
app.use('/api', routes);

app.listen(config.PORT, () => {
    console.log(`Listening on port ${config.PORT}`);
});


module.exports = app;
