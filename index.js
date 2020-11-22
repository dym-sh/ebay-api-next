'use strict'

const fetch = require( 'node-fetch' )
    , xml2json = require( 'xml2json' )

const api_list = require( './api-list.json' )
    , default_headers = require( './default-headers.json' )
    , default_presets = require( './default-presets.json' )

let custom_headers = {}
  , custom_presets = {}


const type_of = obj =>
  Object.prototype.toString
    .call( obj )
    .replace( /(\[object )|(\])/g, '' )


const add_text_nodes = json =>
  {
    let converted = {}

    if( ![ 'Object','Array' ].includes( type_of( json ) ) )
      { return { '$t': json } }

    for( const node_name in json )
      {
        if( !json.hasOwnProperty( node_name ) )
          { continue }

        const part = json[ node_name ]
            , type_of_part = type_of( part )

        if( 'Object' == type_of_part )
          { converted[ node_name ] =
              add_text_nodes( part )
          }
        else if( 'Array' == type_of_part )
          { converted[ node_name ] =
              part.map( element => add_text_nodes( element ) )
          }
        else
          {
            if( '@' == node_name[ 0 ] )
              { converted[ node_name.slice( 1 ) ] = part }
            else
              { converted[ node_name ] = { '$t': part } }
          }
      }

    return converted
  }


const construct_json = ( api_call_name, contents ) =>
  {
    let json = {}

    json[ api_call_name + 'Request' ] =
      Object.assign
        ( {}
        , default_presets
        , custom_presets
        , contents
        )

    return add_text_nodes( json )
  }

const remove_text_nodes = json =>
  {
    // TODO?
    // text_nodes coz of
    // - .currencyID on monetary values
    //   > Param = Param.$t + ' ' + Param.currencyID
    // - .unit and .measurementSystem on masses and distances/lengths
    //   > Param = Param.$t + ' ' + Param.unit

    return json
  }


const make_api_call
= ( api_call_name, contents ) =>
new Promise( ( resolve, reject ) =>
  {
    const url = 'https://api.ebay.com/ws/api.dll'
        , method = 'POST'
        , json = construct_json( api_call_name, contents )
        , body = '<?xml version="1.0" encoding="UTF-8"?>'
               + xml2json.toXml( json )

    const headers = Object.assign
      ( {}
      , default_headers
      , custom_headers
      , { 'X-EBAY-api-CALL-NAME': api_call_name }
      )

    fetch( url, { body, method, headers } )
      .then( res => res.text() )
      .then( xml =>
        {
          const resolved = Object.assign
            ( {}
            , { request_body: body }
            , { response_body: xml }
            , xml2json.toJson( xml, { object:true } )
                [ api_call_name + 'Response' ]
            )

          resolve( resolved )
        })
      .catch( err =>
        {
          console.error( JSON.stringify( { body, err }, false, 2 ) )
          reject( err )
        })

  }).catch( err => console.error
      ({ Time: ( new Date ).toJSON()
       , Function: 'ebay-api-next [ make_api_call ]'
       , Error: JSON.stringify( err, false, 2 )
       }) )


module.exports = exports =
new Proxy( {}, { get( target, call_name )
  { return ( contents ) =>

new Promise( async ( resolve, reject ) =>
  {
    // TODO: check if there are APIs with no params
    // if( !contents || ( 'object' != typeof contents ) )
    //   { reject( 'empty call' ) }

    if( 'useHeaders' == call_name )
      {
        custom_headers = contents
        resolve( true )
      }
    else if( 'usePresets' == call_name )
      {
        custom_presets = contents
        resolve( true )
      }
    else if( api_list[ 'REST' ].includes( call_name ) )
      { // new REST-based eBay APIs
        // lower case create|get|update|delete|...
      }

    else
      { // old XML-based eBay APIs

        // TODO: compile full list of APIs
        // if( !api_list.contains( call_name ) )
        //   { reject( 'api call not on the list' ) }

        const response = await make_api_call( call_name, contents )
        if( response )
          {
            const parsed = remove_text_nodes( response )

            // if( [ 'Success','Warning' ].includes( parsed.Ack ) )
            //   {
                resolve( parsed )
            //   }
            // else
            //   {
            //     // console.error( JSON.stringify( parsed, false, 2 ) )
            //     reject( parsed )
            //   }
          }
        else
          {
            // console.error( JSON.stringify( response, false, 2 ) )
            reject( response )
          }
      }

  }).catch( err =>
    {
      console.error
        ( `Error [ ebay-api-next [ ${ call_name } ] ( ${ contents } ) ) ]:`
        , err
        )
      throw err
    })

  }
})
