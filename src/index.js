// Copyright (c) Codescoop Oy 2019. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const scheduler = require('node-schedule');
const cp = require('child-process-promise');
const plimit = require('promise-limit');
const limit = plimit(50);

const jobApi = require('./job/job').jobApi;

console.log('');
console.log('');
console.log('Fossy started with 1 min schedule...');
console.log('');
console.log('');

let processing = false;
scheduler.scheduleJob('*/1 * * * *', async () => {
    if (!processing) {
        processing = true;
        try {
            let job = await jobApi.get();
            if (job) {
                job = JSON.parse(job);
                console.log(`job started : ${job.id}`);

                const path = job.payload.componentPath;
                const result = await analyzeGitRepo(path);

                if (result.error) {
                    console.error(`component scan error : ${job.payload.component} : ${result.error}`);
                } else {
                    console.log(`component scan success : ${job.payload.component}`);
                }
                await jobApi.upload(result, job.payload.component, job.payload.componentVersion);
                console.log(`component scan uploaded : ${job.payload.component}`);

                await jobApi.finish(job.id);
                console.log(`job finished : ${job.id}`);
            } else {
                console.log('no job in db');
            }
        } catch (e) {
            console.error(e);
        }
        processing = false;
    }
});


const analyzeGitRepo = async (pathToComponent) => {
    console.log(`analyze repo : ${pathToComponent}`);

    const resultData = {
        'error': '',
        'main-license': {},
        'file-licenses': []
    };

    await cp.exec('ls', {cwd: pathToComponent})
        .then(() => console.log(`cd : ${pathToComponent}`)).catch(err => resultData.error = err.toString())
        .then(() => mainLicenseForRepo(pathToComponent).then(output => {
            resultData['main-license'] = output
        })).catch(err => resultData.error = err.toString())
        .then(() => cp.exec(`find ${pathToComponent} -name .git -prune -or -type f -print`, {maxBuffer: 10000 * 1024}).then(pickStdout))
        .then(output => output.split('\n'))
        .then(files => {
            console.log(`total files : ${files.length}`);
            const promises =
                files.map((file) => limit(() => {
                    return analyzeFile(file).then(output => {
                        const row = {
                            'file': JSON.stringify(file.replace(pathToComponent, '')),
                            'output': output
                        };
                        resultData['file-licenses'].push(row);
                    })
                }));
            return Promise.all(promises);
        }).catch(err => resultData.error = err.toString())
        .then(() => {
            console.log(`component scan complete ${pathToComponent}`);
        });

    return resultData;
};

const analyzeFile = (localFile) => {
    const cmd = (agent) =>
        cp.spawn(`/usr/local/etc/fossology/mods-enabled/${agent}/agent/${agent}`, ['-J', localFile], {capture: ['stdout']})
            .then(pickStdout);

    const scans = [
        cmd('nomos'),
        cmd('copyright')
    ];

    return Promise.all(scans).then(([nomosStdout, copyrightStdout]) => {

        return {
            nomos: nullableParse(nomosStdout) || [],
            copyright: nullableParse(copyrightStdout).results || []
        };
    });
};

const mainLicenseForRepo = (dir) => {
    return cp.exec(`find ${dir} -iname license\* -or -iname copying\* -or -iname notice\*`)
        .then(pickStdout)
        .then(output => output.split('\n'))
        .then(files => files.sort((a, b) => a.length - b.length).filter(x => x.length > 0))
        .then(files => files.length > 0 ? analyzeFile(files[0]) : Promise.resolve({
            nomos: [],
            copyright: []
        }));
};

const pickStdout = ({stdout}) => {
    return stdout.trim();
};

const nullableParse = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.error(e);
        return null;
    }
};