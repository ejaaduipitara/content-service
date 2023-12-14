const { localContents } = require('../plugins/local');
const { ResponseHandler } = require('../utils/ResponseHandler');

const PageSearch = (req, res) => {

    if(!req.headers['x-device-id']){
        return ResponseHandler.error(req, res, {
            err: "ERR_BAD_REQUEST",
            errmsg: "x-device-id is requird in headers"
        }, 400);
    }

    if(!req.body?.request?.pageId){
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