const { ResponseHandler } = require("../utils/ResponseHandler");

const sourceConfigUrl = process.env.SOURCE_CONFIG_URL
const metadataMappingUrl = process.env.META_DATA_MAPPING
const SourceConfig = async (req, res) => {

    return ResponseHandler.success(req, res, {
        sourceConfig: {
            "configVersion": 1.0,
            "sources": [
                {
                    "sourceType": "sunbird",
                    "sourceName": "DIKSHA",
                    "baseURL": "https://diksha.gov.in",
                    "sbVersion": "5.2",
                    "searchCriteria": {
                        "filters": {
                            "keywords": [],
                            "primaryCategory": [],
                            "mimeType": [
                                "application/pdf",
                                "video/mp4",
                                "audio/mp3",
                                "video/x-youtube"
                            ]
                        },
                        "sort_by": {
                            "lastPublishedOn": "desc"
                        }
                    }
                }
            ]
        },
        metadataMapping: {
            "mappingVersion": 1.0,
            "mappings": [
                {
                    "sourceType": "sunbird",
                    "mapping": {
                        "identifier": "identifier",
                        "name": "name",
                        "thumbnail": "appIcon",
                        "description": "description",
                        "mimeType": "mimeType",
                        "url": "streamingUrl",
                        "focus": "audience",
                        "keywords": "keywords"
                    }
                }
            ]
        },
        filters: [{
            "identifier": "activity",
            "label": "Activity",
            "index": 1
        }, {
            "identifier": "stories",
            "label": "Stories",
            "index": 2
        }, {
            "identifier": "rhymes",
            "label": "Rhymes",
            "index": 3
        }],
        languages: [
            {
                "identifier": "hi",
                "label": "हिंदी"
            },
            {
                "identifier": "en",
                "label": "English"
            }
        ]
    })
}

module.exports = { SourceConfig }