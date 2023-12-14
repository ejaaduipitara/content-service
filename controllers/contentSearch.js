const _ = require('lodash')
const { ResponseHandler } = require('../utils/ResponseHandler');
const { health, localContents } = require('../plugins/local');


const ContentSearch = (req, res) => {

    if(!req.get('x-device-id')){
        ResponseHandler.error(req, res, {
            err: "ERR_BAD_REQUEST",
            errmsg: "x-device-id is requird in headers"
        }, 400);
    }

    localContents(req.body?.request, res).then((result) => {
        ResponseHandler.success(req, res, result)
    }).catch(error => {
        ResponseHandler.error(req, res, { errmsg: error.message})
    });
    
}

const Contenthealth = (req, res) => {
    health(req, res).then((result) => {
        console.log("result ", result)
        ResponseHandler.success(req, res, result)
    }).catch(error => {
        console.log("error ", error)
        ResponseHandler.error(req, res, { errmsg: error.message})
    })
}


module.exports = { ContentSearch, Contenthealth }