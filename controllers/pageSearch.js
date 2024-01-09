const { localContents } = require('../plugins/local');
const { ResponseHandler } = require('../utils/ResponseHandler');
const { logger } = require('../utils/logger')
const axios =  require("axios");
const _ = require('lodash')

const configUrl = process.env.CONFIG_URL
const PageSearch = async (req, res) => {
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

    if(configUrl){
        const response = await axios.get(configUrl)
        if(response?.data?.pageConfig){
            const config = response.data.pageConfig;
            const pageDetails = _.find(config, { 'pageId': pageId});
            if(!req.body?.request?.filters && pageDetails?.defaultFilter?.filters){
                req.body.request.filters = pageDetails.defaultFilter.filters
            }
        }
    }

    localContents(req, res).then((result) => {
        ResponseHandler.success(req, res, result)
    }).catch(error => {
        ResponseHandler.error(req, res, { errmsg: error.message})
    })
    
}

module.exports = { PageSearch }