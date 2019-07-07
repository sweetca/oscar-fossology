// Copyright (c) Codescoop Oy 2019. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const profileConst = require('./profile.json');

const {PROFILE} = process.env;

const profileString = PROFILE || 'local';
console.log(`Install profile for fossology : ${profileString}`);

let config = profileConst[profileString];
config.getJobUrl = `${config.job}/find_job/${config.jobType}/oscar-fossology-1`;
config.getFinishJob = (jobId) => {
    return `${config.job}/finish_job/${jobId}/oscar-fossology-1`;
};
config.getUploadScan = (component, version) => {
    return `${config.job}/fossology/result/${component}/${version}`;
};
config.getUploadError = (component, version) => {
    return `${config.job}/fossology/error/${component}/${version}`;
};

exports.config = config;