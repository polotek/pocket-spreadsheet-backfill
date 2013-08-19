var cs = require('coffee-script')
  , Q = require('q')
  , Pocket = require('node-pocket')
  , GoogleSpreadsheet = require('google-spreadsheet');

var pConfig = require('./pocket_config.json')
  , p = new Pocket(pConfig.consumer_key, pConfig.access_token)

var gConfig = require('./google_config.json')
  , sheet = new GoogleSpreadsheet(gConfig.spreadsheet_key);

var pGet = Q.nbind(p.get, p)
  , setAuth = Q.nbind(sheet.setAuth, sheet)
  , getInfo = Q.nbind(sheet.getInfo, sheet)
  , addRow = Q.nbind(sheet.addRow, sheet);

setAuth(gConfig.username, gConfig.password)
  .then(function(){
    var sInfo = getInfo()
      , pResults = pGet({
        state: 'archive'
        , sort: 'newest'
        , detailType: 'complete'
        , count: 10
      });

    return Q.all(sInfo, pResults);
  })
  .then(function(sheetInfo, results) {
    // The archive list is an object with sort ids rather than
    // an array. Needs to explicitly sorted.
    var archiveList = []
      , key
      , item
      , sortId;
    for(var key in results.list) {
      item = results.list[key];
      sortId = parseInt(item.sort_id, 10);
      archiveList[sortId] = item;
    }

    var date = 'August 17, 2013 at 8:04AM' // because pocket doesn't supply actual date info
      , ctr = archiveList.length;
    // Add each pocket item as a spreadsheet row
    var addResults = archiveList.map(function(item) {
      return addRow(1, {
        date: date
        , article: item.resolved_title
        , tags: ''
        , url: item.resolved_url
        , excerpt: item.excerpt || ''
      });
    });

    return Q.all(addResults);
  }, function(err) {
    throw err;
  })
  .then(function() {
    console.log('successfully completed');
  });
