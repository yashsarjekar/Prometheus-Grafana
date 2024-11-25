

const client = require('prom-client');


const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000] // Define your own buckets here
});

function runtime(req, res, next){
    let startTime = Date.now();
    next();
    let endTime = Date.now();
    console.log(`Request took ${endTime-startTime}ms`)
    const duration = endTime - startTime;
    httpRequestDurationMicroseconds.observe({
        method: req.method,
        route: req.route ? req.route.path : req.path,
        code: res.statusCode
    }, duration);
}

module.exports = runtime;