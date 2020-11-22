# ebay-api-next

> eBay API calls wrapped in ECMAscript@next


# `/* CURRENTLY ABANDONED */`


## install and use

``` sh
npm i ebay-api-next
```

``` js
'use strict'

const eBayAPI = require( 'ebay-api-next' )
    , Config = require( './config.js' )

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
```

### raw XML

Accesable on `RES.response_body` and `RES.request_body` if the need be.


## tests

Fill out the [test-config](./config-test.js) -- those are the required headers and auth needed to make any API call.
Free eBay-developer credentials could be obtained on the [dev-portal](https://developer.ebay.com/my/auth?env=production&index=0&auth_type=oauth).


## todo
- [x] old eBay APIs
- [ ] tests
- [ ] new eBay APIs
- [ ] tests
- [ ] documentaion
- [ ] github:
    - [x] readme.md
    - [x] license.md
    - [ ] contribute.md
- [ ] tests
- [x] submit to [npm](https://npmjs.com/ebay-api-next)
- [ ] tests
- [ ] profit?
- [ ] tests
- [ ] ...
- [ ] tests


## mirrors
- https://npmjs.com/package/ebay-api-next
- https://github.com/dym-sh/ebay-api-next
- https://gitlab.com/dym-sh/ebay-api-next
- https://dym.sh/ebay-api-next
- hyper://81791b96acc6206a77ac8276341f56f2d3f6a1438512414a562faf4fa71f241f /[?](https://beakerbrowser.com)


## license
[mit](./license)
