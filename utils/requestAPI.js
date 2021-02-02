const pino = require('pino');
const https = require("https");
const querystring = require('querystring');
const dest = pino.destination({ sync: false });
const logger = pino(dest);

const requestAPI = (options) => {
    return new Promise(((resolve, reject) => {
        options.timeout = 60000;
        options.path = encodeURI(options.path);
        const req = https.request(options, (response) => {
            let body = []
            response.on('data', (data) => {
                body.push(data);
            }).on('end', async () => {
                // Rate limit exceeded
                if (response.statusCode === 429) {
                    console.log(response.headers);
                    logger.info(`Retry-After header: ${response.headers['retry-after']}`);
                    await timeout((Number.parseInt(response.headers['retry-after']) || 5) * 1000);
                    await requestAPI(options);
                }
                const json = await JSON.parse(Buffer.concat(body).toString());
                resolve(createResponse(json));
            });
        }).on('error', async (err) => {
            logger.error(err);
            if (err.message.code === 'ETIMEDOUT') {
                console.log("ETIMEDOUT. Trying again");
                await requestAPI(options);
            }
            reject(err);
        }).end();
    }));
}

const createResponse = (json) => {
    let response;
    const status = json.status;
    if (status) {
        response = {
            'status': status.status_code,
            'body': {
                'message': status.message
            }
        }
    } else {
        response = {
            'status': 200,
            'body': json
        }
    }
    return response;
}

const timeout = async (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}

module.exports.requestAPI = requestAPI;
