var cs = require('coffee-script')
  , Pocket = require('node-pocket')
  , GoogleSpreadsheet = require('google-spreadsheet');

var pConfig = require('./pocket_config.json')
, gConfig = require('./google_config.json')

var p = new Pocket(pConfig.consumer_key, pConfig.access_token)
  , sheet = new GoogleSpreadsheet(gConfig.spreadsheet_key);

sheet.setAuth(gConfig.username, gConfig.password, function(err){
  if(err) { throw err; }

  sheet.getInfo(function(err, sheetInfo) {
    if(err) { throw err; }

    p.get({
      state: 'archive'
      , sort: 'newest'
      , detailType: 'complete'
      , count: 10
    }, function(err, results) {
      if(err) { throw err; }

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
      archiveList.forEach(function(item) {
        sheet.addRow(1, {
          date: date
          , article: item.resolved_title
          , tags: ''
          , url: item.resolved_url
          , excerpt: item.excerpt || ''
        }, function(err) {
          if(err) { throw err; }

          if(--ctr === 0) {
            console.log('successfully completed');
          }
        });
      });
    });
  });
});
