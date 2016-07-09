# elastic-bulk-writable
expose elasticsearch Bulk as a writable stream

## Install 

> npm install --save elastic-bulk-writable

## Usage 

Simple use case :

```js
var BulkWritable = require('elastic-bulk-writable');
var client; // get elastic client
var opts = {
  client: client,
  index: 'myindex',
  type: 'mytype'
};
var writable = new BulkWritable(opts, function write(chunk, next) {
  this.bulk.push({"index": {}});
  this.bulk.push(chunk);
  next();
});

readable.pipe(writable);
```

Index shortcut:

```js
var BulkWritable = require('elastic-bulk-writable');
var client; // get elastic client
var opts = {
  client: client,
  index: 'myindex',
  type: 'mytype'
};
var writable = new BulkWritable(opts);
readable.pipe(writable);
```