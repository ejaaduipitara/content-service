require('dotenv').config()
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { Config } = require('./controllers/config');
const { ContentSearch, Contenthealth } = require('./controllers/contentSearch');
const { PageSearch } = require('./controllers/pageSearch');
const { ResponseHandler } = require('./utils/ResponseHandler');
const { logger } = require('./utils/logger');


const app = express();
// app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(helmet());
app.disable('x-powered-by')

app.get("/v1/config/read",ResponseHandler.setAPIInfo("api.djp.config.read", "1.0"), Config)
app.post("/v1/content/search",ResponseHandler.setAPIInfo("api.djp.content.search", "1.0"), ContentSearch)
app.post("/v1/page/search",ResponseHandler.setAPIInfo("api.djp.page.search", "1.0"), PageSearch)
app.get("/v1/health",ResponseHandler.setAPIInfo("api.djp.health", "1.0"), Contenthealth)
app.listen(process.env.PORT, (err) => {
    if(err) {
        logger.error(`error: ${JSON.stringify(err)}`);
        throw err;
    } else {
        logger.info(`App started on port ${process.env.PORT}`);
    }
})
