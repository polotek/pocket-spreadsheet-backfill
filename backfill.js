var cs = require('coffee-script') // Needed for node-pocket. grrr.
  , Pocket = require('node-pocket')
  , GoogleSpreadsheet = require('google-spreadsheet');

// Setup the Pocket API
var pConfig = require('./pocket_config.json')
  , pocketClient = new Pocket(pConfig.consumer_key, pConfig.access_token);

// Setup the Google API
var gConfig = require('./google_config.json')
  , sheet = new GoogleSpreadsheet(gConfig.spreadsheet_key);

// The Google client needs to be authorized explicitly
sheet.setAuth(gConfig.username, gConfig.password, function(err){
  if(err) { throw err; }

  // I don't know if I need to get the sheet info
  sheet.getInfo(function(err, sheetInfo) {
    if(err) { throw err; }

    // Get the pocket archive list
    pocketClient.get({
      state: 'archive'
      , sort: 'newest'
      , detailType: 'complete'
      , count: 10
    }, function(err, results) {
      if(err) { throw err; }

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
      archiveList.forEach(function(item) {
        sheet.addRow(1, {
          date: date
          , article: item.resolved_title
          , tags: ''
          , url: item.resolved_url
          , excerpt: item.excerpt || ''
        }, function(err) {
          if(err) { throw err; }

          // Log when we're done
          if(--ctr === 0) {
            console.log('successfully completed');
          }
        });
      });
    });
  });
});
