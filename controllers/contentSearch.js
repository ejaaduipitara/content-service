const _ = require('lodash')
const { ResponseHandler } = require('../utils/ResponseHandler');
const { health, localContents } = require('../plugins/local');
const { logger } = require('../utils/logger');

const ContentSearch = (req, res) => {
    const deviceId =  req.get('x-device-id')
    if(!deviceId){
        logger.warn('x-device-id is requird in headers', deviceId);
        ResponseHandler.error(req, res, {
            err: "ERR_BAD_REQUEST",
            errmsg: "x-device-id is requird in headers"
        }, 400);
    }

    localContents(req.body?.request, res).then((result) => {
        logger.info(`local contents successfully: `, result);
        ResponseHandler.success(req, res, result)
    }).catch(error => {
        logger.error(`Error while getting contents: `, error);
        ResponseHandler.error(req, res, { errmsg: error.message})
    });
    
}

const Contenthealth = (req, res) => {
    health(req, res).then((result) => {
        logger.info(`result: `, result);
        ResponseHandler.success(req, res, result)
    }).catch(error => {
        logger.error(`Error while helth check: `, error);
        ResponseHandler.error(req, res, { errmsg: error.message})
    })
}


module.exports = { ContentSearch, Contenthealth }