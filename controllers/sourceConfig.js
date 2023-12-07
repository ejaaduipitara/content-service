const { ResponseHandler } = require("../utils/ResponseHandler");

const sourceConfigUrl = process.env.SOURCE_CONFIG_URL
const metadataMappingUrl = process.env.META_DATA_MAPPING
const SourceConfig = async (req, res) => {
    return ResponseHandler.success(req, res, { sourceConfigUrl, metadataMappingUrl })
}

module.exports = { SourceConfig }