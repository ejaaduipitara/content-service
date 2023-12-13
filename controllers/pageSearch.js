const { ResponseHandler } = require('../utils/ResponseHandler');

const PageSearch = (req, res) => {

    if(!req.headers['x-device-id']){
        ResponseHandler.error(req, res, {
            err: "ERR_BAD_REQUEST",
            errmsg: "x-device-id is requird in headers"
        }, 400);
    }

    if(!req.body?.request?.pageId){
        ResponseHandler.error(req, res, {
            err: "ERR_BAD_REQUEST",
            errmsg: "pageId is requird"
        }, 400);
    }

    res.send("Page search")
}

module.exports = { PageSearch }