require('dotenv').config()
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { SourceConfig } = require('./controllers/sourceConfig');
const { ContentSearch } = require('./controllers/contentSearch');
const { ResponseHandler } = require('./utils/ResponseHandler');


const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(helmet());
app.disable('x-powered-by')

app.get("/config/v1/read",ResponseHandler.setAPIInfo("api.source-config.read", "1.0"), SourceConfig)
app.get("/content/v1/search",ResponseHandler.setAPIInfo("api.content.search"), ContentSearch)
app.listen(process.env.PORT, (err) => {
    if(err) {
        throw err;
    } else {
        console.log(`App started on port ${process.env.PORT}`)
    }
})
