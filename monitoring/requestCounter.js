const client = require('prom-client');

const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

const activeUserGauge = new client.Gauge({
    name: 'acive_users',
    help: 'Total number of users whose request hasnt yet resolved',
    labelNames: ['method', 'route']
});

function requestCounterMiddleware(req, res, next){
    requestCounter.inc({
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status_code: res.statusCode
    });
    activeUserGauge.inc({
        method: req.method,
        route: req.route ? req.route.path : req.path
    });

    res.on("finish", ()=>{
        setInterval(()=>{
            activeUserGauge.dec({
                method: req.method,
                route: req.route ? req.route.path : req.path
            });
        }, 10000);
        
    });;
    next();
}

module.exports = requestCounterMiddleware;