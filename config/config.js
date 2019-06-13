// Copyright (c) Codescoop Oy 2019. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const profileConst = require('./profile.json');

const profileString = process.env.PROFILE || 'local';
console.log(`Install profile for fossy : ${profileString}`);

let config = profileConst[profileString];
config.mongoUrl = config.mongo.replace('{LOGIN}', process.env.MONGO_LOGIN).replace('{PASS}', process.env.MONGO_PASS);
config.getJobUrl = `${config.job}find_job?type=103`;
config.finishJobUrl = `${config.job}finish_job/`;
config.repositoryDir = process.env.OSCAR_DIR ? process.env.OSCAR_DIR : config.repositoryDir;

exports.config = config;