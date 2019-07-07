// Copyright (c) Codescoop Oy 2019. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const request = require('request-promise');
const config = require('../config/config').config;

const jobApi = {
    get: async () => {
        const options = {
            method: 'GET',
            uri: config.getJobUrl,
            headers: {
                'Accept': 'application/json'
            }
        };
        return await request(options);
    },
    finish: async (id) => {
        const options = {
            method: 'PUT',
            uri: config.getFinishJob(id),
            headers: {
                'Accept': 'application/json'
            }
        };
        return await request(options);
    },
    upload: async (scan, component, version) => {
        const options = {
            method: 'POST',
            uri: config.getUploadScan(component, version),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(scan)
        };
        return await request(options);
    },
    error: async (error, component, version) => {
        const options = {
            method: 'POST',
            uri: config.getUploadError(component, version),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain'
            },
            body: error
        };
        return await request(options);
    }
};

exports.jobApi = jobApi;