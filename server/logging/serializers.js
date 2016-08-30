/**
 * Created by ryanmc on 8/27/2016.
 */

const bunyan = require('bunyan');
const os = require('os');

module.exports.reqSerializer = (req) => {
    return {
        method: req.method,
        url: req.url,
        headers: req.headers,
        req_id: req.req_id,
        ips: req.ips
    }
}

module.exports.reqSerializer404 = (req) => {
    return {
        method: req.method,
        url: req.url,
        req_id: req.req_id,
        ips: req.ips,
        ip: req.ip,
        referrer: req.referrer
    }
}

module.exports.reqSerializerDebug = (req) => {
    return {
        method: req.method,
        url: req.url,
        req_id: req.req_id,
        headers: req.headers,
        body: req.body,
        hostname: req.hostname,
        params: req.params,
        query: req.query,
        xhr: req.xhr || false
    }
}

module.exports.resSerializer = (res) => {
    return {
        statusCode: res.statusCode,
        headers: res.headers
    }
}

module.exports.resSerializerDebug = (res) => {
    return {
        statusCode: res.statusCode,
        headers: res.headers,
        body: res.body
    }
}

module.exports.processInfoSerializer = () => {
    return {
        hostname: os.hostname(),
        arch: process.arch,
        args: process.argv,
        pid: process.pid,
        platform: process.platform,
        nodeVersion: process.version
    }
}