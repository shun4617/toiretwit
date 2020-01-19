const aws = require('aws-sdk'),
    dynamo = new aws.DynamoDB.DocumentClient(),
    twitter = require('twitter');

const util = require('util')
exports.handler = async () => {
    const user = await getUserFromDB()
    const message = await getMessageFromDB()
    const tweet = message.Item[Math.floor(Math.random() * message.Item.length)].message
    console.log('user: '+JSON.stringify(user))
    console.log('user: '+JSON.stringify(message))
    const twitterkey = {
        consumer_key        :process.env['CONSUMER_KEY'],
        consumer_secret     :process.env['CONSUMER_SECRET'],
        access_token_key    :user.Item.access_token_key,
        access_token_secret :user.Item.access_token_secret
    }
    console.log(JSON.stringify(twitterkey))
    await doTweet(twitterkey, tweet)
    console.log('finish')
}

async function getUserFromDB(){
   return await dynamo.get( {
        "TableName": "toiretwit",
        "Key": {
            'user':process.env['USER']
        }
      }, function( err, data ) {
            if(err){
                console.error( JSON.stringify( err ) );
            }
      } ).promise()
}

async function getMessageFromDB(){
    return await dynamo.scan( {
         "TableName": "toiretwit-message"
       }, function( err, data ) {
             if(err){
                 console.error( JSON.stringify( err ) );
             }
       } ).promise()
 }

async function doTweet(api, tweet){
    const client = new twitter(api) 
    return new Promise (resolve => {client.post('statuses/update', { status: tweet }, function (error, twe, response) {
        if (!error) {
            console.log('success:' + JSON.stringify(twe));
            resolve(twe)
        }
        else {
            console.error('faild: ' + JSON.stringify(error));
        }
    })})
}