const { localContents } = require('../plugins/local');
const { ResponseHandler } = require('../utils/ResponseHandler');
const { logger } = require('../utils/logger')

const PageSearch = (req, res) => {
    const deviceId =  req.get('x-device-id')
    if(!deviceId){
        logger.warn('PageSearch: x-device-id is requird in headers deviceId: ', deviceId);
        return ResponseHandler.error(req, res, {
            err: "ERR_BAD_REQUEST",
            errmsg: "x-device-id is requird in headers"
        }, 400);
    }
    const pageId = req.body?.request?.pageId
    if(!pageId){
        logger.warn('PageSearch: pageId is requird', pageId);
        return ResponseHandler.error(req, res, {
            err: "ERR_BAD_REQUEST",
            errmsg: "pageId is requird"
        }, 400);
    }

    localContents(req.body?.request, res).then((result) => {
        ResponseHandler.success(req, res, result)
    }).catch(error => {
        ResponseHandler.error(req, res, { errmsg: error.message})
    })
    
}

module.exports = { PageSearch }