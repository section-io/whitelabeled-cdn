require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const request = require('./request');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.PORT || 8080;

app.post('/initializeDomain', async (req, resp) => {
    const { body: { domain }} = req;
    
    const response = await request({
        path: `/api/v1/account/${process.env.ACCOUNT}/application/${process.env.APPLICATION}/environment/${process.env.ENVIRONMENT}/domain/${domain}`,
        method: 'POST',
    });

    resp.status(response.status);
    resp.json(response.message);
});

app.get('/verifyDomainEngaged', async (req, resp) => {
    const domain = req.query.domain;

    const response = await request({
        path: `/api/v1/account/${process.env.ACCOUNT}/domain/${domain}/verifyEngaged`,
        method: 'GET',
    });

    resp.setHeader('Content-Type', 'application/json');
    resp.status(response.status);
    resp.send(response.message);
});

app.post('/provisionCertificate', async (req, resp) => {
    const { body: { domain }} = req;
    
    const response = await request({
        path: `/api/v1/account/${process.env.ACCOUNT}/domain/${domain}/renewCertificate`,
        method: 'POST',
    });

    resp.status(response.status);
    resp.json(response.message);
});

app.use('/', (req, resp) => {
    resp.status(403);
    resp.send();
});

app.listen(port);
console.log(`Server listening on port: ${port}`);