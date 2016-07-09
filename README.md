# elastic-bulk-writable
expose elasticsearch Bulk as a writable stream

## Install 

> npm install --save elastic-bulk-writable

## Usage 

Simple use case :

```js
var BulkWritable = require('elastic-bulk-writable');
var col; // get a collection object from driver
var writable = new BulkWritable(col.initializeOrderedBulkOp(), function write(chunk, next) {
  this.bulk.push({"index": {}});
  this.bulk.push(chunk);
  next();
});
