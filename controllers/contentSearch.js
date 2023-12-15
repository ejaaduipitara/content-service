const _ = require('lodash')
const { ResponseHandler } = require('../utils/ResponseHandler');
const { health, localContents } = require('../plugins/local');
const { logger } = require('../utils/logger');

const ContentSearch = (req, res) => {

    if(!req.get('x-device-id')){
        logger.warn('x-device-id is requird in headers');
        ResponseHandler.error(req, res, {
            err: "ERR_BAD_REQUEST",
            errmsg: "x-device-id is requird in headers"
        }, 400);
    }

    localContents(req.body?.request, res).then((result) => {
        logger.info(`local contents successfully: ${JSON.stringify(result)}`);
        ResponseHandler.success(req, res, result)
    }).catch(error => {
        logger.error(`Error while getting contents: ${JSON.stringify(error)}`);
        ResponseHandler.error(req, res, { errmsg: error.message})
    });
    
}

const Contenthealth = (req, res) => {
    health(req, res).then((result) => {
        logger.info(`result: ${JSON.stringify(result)}`);
        ResponseHandler.success(req, res, result)
    }).catch(error => {
        logger.error(`Error while helth check: ${JSON.stringify(error)}`);
        ResponseHandler.error(req, res, { errmsg: error.message})
    })
}


module.exports = { ContentSearch, Contenthealth }