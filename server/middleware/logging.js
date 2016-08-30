/**
 * Created by ryanmc on 8/27/2016.
 */

const bunyan = require('bunyan');
const uuid = require('node-uuid');
const serializers = require('../logging/serializers');

module.exports = function(log) {
    return function(req, res, next) {
        let date = new Date();
        let startTime = Date.now();
        req.log = log;
        req.req_id = uuid.v4();
        req.log.debug({
            req: serializers.reqSerializerDebug(req)
        }, 'Request received');
        next();
        let endTime = Date.now();
        let duration = endTime - startTime;
        req.log.info({
            duration: duration,
            req: serializers.reqSerializer(req),
            res: serializers.resSerializer(res)
        }, 'Request completed');
    }
}