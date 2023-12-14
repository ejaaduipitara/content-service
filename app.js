require('dotenv').config()
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { Config } = require('./controllers/config');
const { ContentSearch, Contenthealth } = require('./controllers/contentSearch');
const { PageSearch } = require('./controllers/pageSearch');
const { ResponseHandler } = require('./utils/ResponseHandler');


const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(helmet());
app.disable('x-powered-by')

app.get("/v1/config/read",ResponseHandler.setAPIInfo("api.djp.config.read", "1.0"), Config)
app.post("/v1/content/search",ResponseHandler.setAPIInfo("api.djp.content.search"), ContentSearch)
app.post("/v1/page/search",ResponseHandler.setAPIInfo("api.djp.content.search"), PageSearch)
app.get("/v1/content/health",ResponseHandler.setAPIInfo("api.djp.content.health"), Contenthealth)
app.listen(process.env.PORT, (err) => {
    if(err) {
        throw err;
    } else {
        console.log(`App started on port ${process.env.PORT}`)
    }
})
