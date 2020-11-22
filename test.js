'use strict'

const eBayAPI = require( './index.js' )
    , Config = require( './config-test.js' )

eBayAPI.useHeaders( Config.eBay.Headers )
eBayAPI.usePresets( Config.eBay.Presets )

const REQ =
  { ItemID: '123456789012'
  , IncludeItemSpecifics: true
  }


console.info( 'call using Promises with then/catch' )
eBayAPI.GetItem( REQ )
       .then( RES => console.log( 'Response:', RES ) )
       .catch( ERR => console.error( 'Error:', ERR ) )


console.info( 'call using async/await notation' )
const eBay_async_await = API =>
  async OBJ =>
    console.log( await eBayAPI[ API ]( OBJ ) )

eBay_async_await( 'GetItem' )( REQ )
