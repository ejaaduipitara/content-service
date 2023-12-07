const httpStatus = require("http-status");
const { v4: uuidv4 } = require('uuid');

const ResponseHandler = {

    setAPIInfo: (id, ver) => (req, res, next) => {
        req.id = id;
        req.ver = ver;
        console.log(`body`, req?.body?.params?.msgid)
        next();
    },
    success: (req, res, data, statusCode = httpStatus.OK) => {
        res.status(statusCode).send({
            "id": req?.id || "api",
            "params":
            {
                resmsgid: uuidv4(),
                msgid: req?.body?.params?.msgid || uuidv4()
            },
            "responseCode": httpStatus[statusCode],
            "result": data
        })
    }

}

module.exports = { ResponseHandler }