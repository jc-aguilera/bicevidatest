// REST API request/response example.
// Using Node's https module so as to not require any outside libraries.
// By Juan Carlos Aguilera

const https = require('https');

const options = {
    hostname: 'dn8mlk7hdujby.cloudfront.net',
    port: 443,
    path: '/interview/insurance/policy',
    method: 'GET'
  }
  

const requestData = new Promise((resolve) => {

    let data = '';

    const req = https.request(options, (res) => {
        res.on('data', d => {
            data += d;
        });
        res.on('end', () => {
            resolve(JSON.parse(data));
        });
    });
    req.end();
});

requestData.then((data) => {
    const { policy } = data;
    const { has_dental_care, workers, company_percentage } = policy;

    const coverage = workers.map((worker) => {
        const { age, childs } = worker;

        const cover_tables = {
            false: {
                0: 0.279,
                1: 0.4396,
                2: 0.5599,
            },
            true: {
                0: 0.12,
                1: 0.1950,
                2: 0.2480,
            }
        };
        const coverage = age >= 65 ? 0 : cover_tables[has_dental_care][Math.round(Math.min(2, childs))];
        const copayment = ((100 - company_percentage)/100 * coverage);
        return { age, childs, coverage, copayment };
    })

    // The actual REST payload goes here
    console.log({ has_dental_care, company_percentage, worker_coverages: coverage });
})
