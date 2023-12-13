const axios =  require('axios')
const { ResponseHandler } = require('../utils/ResponseHandler');

const sunbirdContents = async (req, res) => {

    let options = {
        method: req.method || 'POST',
        url: req.url,
        responseType: 'stream',
        data: req.body
    };


    axios(options).then((response) => {
        res.set(response.headers)
        response.data.pipe(res)
    }).catch((error) => {
        ResponseHandler.error(req, res, {err: error.code, errmsg: error.message}, error.response.status)
    });
}

module.exports = { sunbirdContents }