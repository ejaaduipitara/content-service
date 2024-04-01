# Content-service
The Content Service provides the capability to store and retrieve metadata and links to the list of contents shown in the Mobile app of AI Assistant. It also provides the capability to store and retrieve the app configurations.

# Prerequisites
* NodeJs 14+
* PostgreSQL

# Installation
1. Clone the repository
   ```
   git clone https://github.com/Sunbird-AIAssistant/content-service.git
   ```
2. Go to the root directory
   ```
   cd content-service
   ```
3. Please upload the JSON file to a location where it can be publicly accessed.
   ```
   https://ax2cel5zyviy.objectstorage.ap-hyderabad-1.oci.customer-oci.com/n/ax2cel5zyviy/b/sbdjpbotspublic/o/config.json
   ```
4. Set up environment variables. Create a .env file in the root and add the following variables
   ```
   POSTGRES_USERNAME= # postgresql db username
   POSTGRES_HOST= # postgresql db hostname or ip address 
   POSTGRES_DB= # postgresql database name
   POSTGRES_PASSWORD= # postgresql db password
   POSTGRES_PORT= 5432
   PORT= 3000
   CONFIG_URL= # Use the URL where you upload JOSN file in step3
   CONFIG_CACHE_TTL= 10 # this value in seconds
   LOG_LEVEL= 'info', # info, debug, error
   SSL_ENABLED= true # true or false
   TABLE_NAME= # postgresql table name
   ```
6. [click here](https://github.com/Sunbird-AIAssistant/content-service/blob/main/postgres.sql) and RUN scripts in PostgreSQL to create tables.
7. Run `npm install` to install node modules
8. Run `node app.js`

# API Specification and Documentation
### Content search
The Content Search API allows searching for content within a specified dataset. This API is designed to provide a powerful and flexible search functionality for applications that require content retrieval based on user queries.

|                |                          |
| --------       | -------                  |
| API end point  |  `/api/content/v1/content/search`     |
| Method         | `POST`                   |
| Headers        | `X-device-id` <br> `x-preferred-language`  |
| Request        | `{"request":{"query":"[LIST]/{MAP}/String","filters":{"category":"Stories","mimeType":["video/mp4","audio/mp3","video/x-youtube"]}}}` <br> **Note**: either a query or filters is required.  |
| Response       | `{"id":"api.djp.content.search","params":{"resmsgid":"3346f79c-8693-4bc4-b1c5-e6e8bdd0e6a0","msgid":"1598a038-e48b-475b-8313-69e8ddeebf01"},"responseCode":"OK","result":[{"identifier":"DBcYhYCLBM8","name":"Counting on fingers","thumbnail":null,"description":null,"mimetype":"video/x-youtube","url":"https://www.youtube.com/watch?v=DBcYhYCLBM8&list=PLi7eEmku9VQLV_A2Vf5rgGxUrmG61L_k3&index=3","media":null,"agegroup":"6-8","domain":null,"curriculargoal":null,"competencies":null,"language":"English","category":"Activities","sourceorg":"Key Education Foundation","audience":["Teacher"],"keywords":["Counting","Numbers","Beads","Colours","Butterfly","DJP"],"status":"Live","learningoutcomes":null,"createdon":"2023-12-22T10:53:20.368Z","lastupdatedon":null}]}`    |
| Example cURL   | `curl --location '{{host}}/api/content/v1/content/search' \` <br> `--header 'x-device-id: 123' \` <br> `--header 'x-preferred-language: English' \` <br> `--header 'Content-Type: application/json' \` <br> `--data '{"request":{"query":"Activities","filters":{"mimeType":["video/mp4","audio/mp3","video/x-youtube"]}}}'`                     |

### Page search
The Page Search API allows developers to retrieve search results for a specific page based on its unique identifier (pageId). The search criteria are pre-defined in the API configuration, providing a straightforward way to obtain relevant information for a given page. This enables managing the list of content to be shown on an app page easily - without requiring changes to the app code.

|                |                          |
| --------       | -------                  |
| API end point  |  `/api/content/v1/page/search`     |
| Method         | `POST`                   |
| Headers        | `X-device-id` <br> `x-preferred-language`  |
| Request        | `{"request":{"pageId":"djp.app.home","query":"[LIST]/{MAP}/String","filters":{"category":"Stories","mimeType":["video/mp4","audio/mp3","video/x-youtube"]}}} <br> **Note**: pageId required. query or filters are optional.` |
| Response       | `{"id":"api.djp.page.search","params":{"resmsgid":"2ad1193b-31e4-4898-803e-93094d577401","msgid":"18998741-154e-4994-b800-fc7404182e50"},"responseCode":"OK","result":[{"identifier":"pj1n-gKJeJo","name":"Stacking Cups Tower","thumbnail":null,"description":null,"mimetype":"video/x-youtube","url":"https://www.youtube.com/watch?v=pj1n-gKJeJo&list=PLi7eEmku9VQLV_A2Vf5rgGxUrmG61L_k3&index=21","media":null,"agegroup":"6-8","domain":null,"curriculargoal":null,"competencies":null,"language":"English","category":"Activities","sourceorg":"Key Education Foundation","audience":["Teacher"],"keywords":["Counting","Numbers","Beads","Colours","DJP"],"status":"Live","learningoutcomes":null,"createdon":"2023-12-22T10:53:20.368Z","lastupdatedon":null}]}`    |
| Example cURL   | `curl --location '{{host}}/api/content/v1/page/search' \` <br> `--header 'x-device-id: 123' \` <br> `--header 'x-preferred-language: English' \` <br> `--header 'Content-Type: application/json' \` <br> `--data '{"request":{"pageId":"djp.app.home","query":"Activities","filters":{"mimeType":["video/mp4","audio/mp3","video/x-youtube"]}}}'`                     |

### Config Read
The Config Read API allows retrieving configuration information related to pages and default languages supported by the system. This information is crucial for applications(mobile app) that need to adapt to specific settings or languages.
The set of app configurations supported by this service are:
1. List of Languages to be shown and default language to be selected
2. List of content “Filters” to be shown and the default filter to be selected

|                |                          |
| --------       | -------                  |
| API end point  |  `/api/content/v1/config/read`     |
| Method         | `GET`                   |
| Headers        | `X-device-id` |
| Request        | NA |
| Response       | `{"id":"api.djp.config.read","params":{"resmsgid":"dbe27e10-a19c-4f73-b527-4109df0a0c74","msgid":"d7790ef6-2a14-49b0-b1d5-1faa99b53274"},"responseCode":"OK","result":{"pageConfig":[{"pageId":"djp.app.home","defaultFilter":{"id":"all","label":"All","query":"","filters":{"mimeType":["video/mp4","audio/mp3","video/x-youtube"]}},"additionalFilters":[{"id":"activity","label":"Activity","query":"Activities","filters":{},"index":1},{"id":"stories","label":"Stories","query":{"category":"Stories"},"filters":{},"index":2},{"id":"rhymes","label":"Rhymes","query":["Rhymes"],"filters":{},"index":3},{"id":"for_teachers","label":"For Teachers","query":["For Teachers"],"filters":{},"index":4},{"id":"cards","label":"Cards","query":["Cards"],"filters":{},"index":6},{"id":"puzzles","label":"Puzzles","query":["Puzzles"],"filters":{},"index":5},{"id":"posters","label":"Posters","query":["Posters"],"filters":{},"index":7}]}],"languages":[{"id":"hi","label":"हिंदी","default":true},{"id":"en","label":"English"},{"id":"te","label":"తెలుగు"},{"id":"or","label":"ଓଡିଆ"},{"id":"ta","label":"தமிழ்"},{"id":"as","label":"অসমীয়া"},{"id":"pa","label":"ਪੰਜਾਬੀ"},{"id":"ml","label":"മലയാളം"}]}}`    |
| Example cURL   | `curl --location '{{host}}/api/content/v1/config/read'`                     |



# License
This project is licensed under the MIT License.

