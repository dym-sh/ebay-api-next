'use strict'

module.exports
= exports
= { eBay:
      { Headers:
          { 'X-EBAY-API-SITEID': 0
          , 'X-EBAY-API-COMPATIBILITY-LEVEL': 967
          , 'X-EBAY-API-APP-NAME': 'test'
          , 'X-EBAY-API-DEV-NAME': 'test'
          , 'X-EBAY-API-CERT-NAME': 'test'
          }
      , Presets:
          { RequesterCredentials:
              { eBayAuthToken: 'long BASE64 string' }
          }
      }
  }
