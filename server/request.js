const https = require('https');

const auth = Buffer
    .from(`${process.env.AUTH_EMAIL}:${process.env.AUTH_PASSWORD}`)
    .toString('base64');

const request = (options) => new Promise((resolve, reject) => {
    const requestOptions = {
        hostname: 'aperture.section.io',
        port: 443,
        path: options.path,
        method: options.method,
        headers: {
            'Authorization': `Basic ${auth}`,
        },
    };

    console.log(requestOptions.headers);

    if (options.method === 'POST') {
        requestOptions.headers = {
            'Content-Type': 'application/json',
        };
    }

    const req = https.request(requestOptions, (res) => {
        console.log('statusCode:', res.statusCode);

        res.on('data', (d) => {
            resolve({
                status: res.statusCode,
                message: d && d.toString(),
            });
        });
    });

    req.on('error', (e) => {
        console.error(e);
        reject({ 
            status: 500, 
            message: {
                error: e,
            },
        });
    });

    if (options.postData) {
        req.write(options.postData);
    }

    req.end();
});

module.exports = request;