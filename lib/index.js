/*jslint node: true, nomen: true, plusplus: true, vars: true, eqeq: true*/
'use strict';

var Writable = require('flushwritable'),
    util = require('util');

function indexer(chunk, next) {
    this.bulk.push({"index": {}});
    this.bulk.push(chunk);
    next();
}

function BulkWriteStream(opts, withbulk) {
    Writable.call(this, {
        objectMode: true
    });
    this.client = opts.client;
    this.index = opts.indexName;
    this.type = opts.indexType;
    this.bulk = [];
    this.bulkSize = opts.bulkSize || 200;
    this.withbulk = (withbulk || indexer).bind(this);
}
util.inherits(BulkWriteStream, Writable);

BulkWriteStream.prototype._write = function (chunk, enc, next) {
    var self = this;
    this.withbulk(chunk, function (err, data) {
        if (err) {
            return next(err);
        }
        if (self.bulk.length >= self.bulkSize) {
            return self._flush(next);
        }
        next();
    });
};

BulkWriteStream.prototype._flush = function (next) {
    if (this.bulk.length == 0) {
        return next();
    }
    return this.client.bulk({
        index: this.index,
        type: this.type,
        body: this.bulk.splice(0)
    }, next);
};

module.exports = function (opts, withbulk) {
    return new BulkWriteStream(opts, withbulk);
};
