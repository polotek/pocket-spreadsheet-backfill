var cs = require('coffee-script')
  , assert = require('assert')
  , mock = require('mock')
  , sinon = require('sinon')
  , archiveList = require('./pocket-archive-list-fixture.json')
  , nop = function() {};

sinon.stub(console, 'log');

var pocketClientStub = {
  get: sinon.stub().yields(null, archiveList)
}
, Pocket = sinon.stub().returns(pocketClientStub);

var sheetStub = {
  setAuth: sinon.stub().yields(null)
  , getInfo: sinon.stub().yields(null)
  , addRow: sinon.stub().yields(null)
}
, GoogleSpreadsheet = sinon.stub().returns(sheetStub);

// Run the script
var backfill = mock('../backfill', {
  'node-pocket': Pocket
  , 'google-spreadsheet': GoogleSpreadsheet
}, require);

assert.ok(Pocket.calledOnce);
assert.ok(GoogleSpreadsheet.calledOnce);

assert.ok(pocketClientStub.get.calledWith({
  state: 'archive'
  , sort: 'newest'
  , detailType: 'complete'
  , count: 10
}));

assert.equal(10, sheetStub.addRow.callCount);

assert.ok(console.log.calledWith('successfully completed'));

