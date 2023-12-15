const { ResponseHandler } = require("../utils/ResponseHandler");
const axios =   require("axios");
const Keyv = require('keyv');
const { logger } = require('../utils/logger');

const configUrl = process.env.CONFIG_URL
const configCacheTTL = process.env.CONFIG_CACHE_TTL || '1'
const keyv = new Keyv();
const Config = async (req, res) => {
    let config = {"pageConfig":[{"pageId":"djp.app.home","defaultFilter":{"id":"all","label":"All","query":"","filters":{"mimeType":["video/mp4","audio/mp3","video/x-youtube"]}},"additionalFilters":[{"id":"activity","label":"Activity","query":"Activities","filters":{},"index":1},{"id":"stories","label":"Stories","query":{"category":"Stories"},"filters":{},"index":2},{"id":"rhymes","label":"Rhymes","query":["Rhymes"],"filters":{},"index":3}]}],"languages":[{"id":"hi","label":"हिंदी","default":true},{"id":"en","label":"English"}]};
    try {
         const cacheConfig = await keyv.get('config')
         if(cacheConfig) {
            config = JSON.parse(cacheConfig)
         } else {
            const response = await axios.get(configUrl)
            config = response?.data
            await keyv.set('config', JSON.stringify(config), parseInt(configCacheTTL) * 36000);
            logger.info(`setting cache`);
         }
    } catch (error) {
        logger.error(`error while fetching config from cache or blob: ${JSON.stringify(error)}`);
    }

    return ResponseHandler.success(req, res, config)
}

module.exports = { Config }