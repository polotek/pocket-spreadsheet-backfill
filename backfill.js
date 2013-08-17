var cs = require('coffee-script')
  , Pocket = require('node-pocket')
  , GoogleSpreadsheet = require('google-spreadsheet');

var pConfig = require('./pocket_config.json')
, gConfig = require('./google_config.json')

var p = new Pocket(pConfig.consumer_key, pConfig.access_token)
  , sheet = new GoogleSpreadsheet(gConfig.spreadsheet_key);

p.get({
  state: 'archive'
  , sort: 'newest'
  , detailType: 'complete'
  , count: 10
}, function(err, data) {
  if(err) { throw err; }

  console.log(data);
});

// set auth to be able to edit/add/delete
sheet.setAuth(gConfig.username, gConfig.password, function(err){
  if(err) { throw err; }

  sheet.getInfo(function(err, sheetInfo) {
    if(err) { throw err; }

    console.log(sheetInfo);
  });
});
