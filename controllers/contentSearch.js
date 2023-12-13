const { sunbirdContents } =  require('../plugins/sunbird')
const _ = require('lodash')
const { ResponseHandler } = require('../utils/ResponseHandler');
const { health } = require('../plugins/local');


const ContentSearch = (req, res) => {

    if(!req.headers['x-device-id']){
        ResponseHandler.error(req, res, {
            err: "ERR_BAD_REQUEST",
            errmsg: "x-device-id is requird in headers"
        }, 400);
    }

    const sourceType = _.get(req.body?.request, 'sourceType') || 'local';
    switch (sourceType) {
        case 'sunbird':
            sunbirdContents(req.body?.request, res)
            break;
        case 'local':
            
            break;
    }

    
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