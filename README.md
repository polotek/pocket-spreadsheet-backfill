## pocket spreadsheet backfill

This script retrieves archived items from a [Pocket](http://getpocket.com/) account and adds them as rows to a google spreadsheet.

The repository is organized as a series of example implementations. I'm hoping it's a good illustration of how to get some practical stuff done in node. Each branch takes a different approaches to solving the problem, including tests. Many of the commit messages have some extended observations along the way.

* [starting-point](https://github.com/polotek/pocket-spreadsheet-backfill/tree/starting-point) - gets set up with the 2 APIs
* [plain-callbacks](https://github.com/polotek/pocket-spreadsheet-backfill/tree/plain-callbacks) - a straight forward implementation with callbacks
* [promises](https://github.com/polotek/pocket-spreadsheet-backfill/tree/promises) - a straight forward implementation with promises
* streams - coming soon
* modular - coming soon

## Background

I started on a weekend diversion to make my pocket archive more accessible to people with the help of the @jllord/sheetsee-pocket app. It was pretty simple to get up and running. http://polotek.github.io/sheetsee-pocket/

But the spreadsheet only had 1 item. The one I used to test the integration with [IFTTT](https://ifttt.com/). The weekend diversion continues. So I set out to backfill a few of the items from pocket into the spreadsheet to fill out the site. After messing with it for a bit, I wanted to save it, and use it as a practical way to explore some techniques.
