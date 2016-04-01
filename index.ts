
import * as express from 'express'
import {ParseServer} from 'parse-server'

const kue = require('kue')
const queue = kue.createQueue()

const job = queue.create('email', {
    title: 'welcome email for tj',
    to: 'tj@learnboost.com',
    template: 'welcome-email'
}).save( function(err){
   if( !err ) console.log( job.id );
});


let databaseUri = process.env.MONGODB_URL
if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.')
  databaseUri =  'mongodb://127.0.0.1:27017/dev'
  //databaseUri = 'mongodb://aptible:CYdTDpUjL65NYgWZBnuLhVYec2usTl0s@127.0.0.1:64473/db?ssl=true' //'mongodb:localhost:27017/dev',
} else{
    console.log('Current DATABASE_URI' + databaseUri)
}


const api = new ParseServer({
  databaseURI: databaseUri, //'mongodb://localhost:27017/dev',
  cloud: __dirname + '/cloud/main.js',
  appId: 'MFv9KnsKigQT3xCzojePIduQmeA9xqfMscmPw3sj',
  masterKey: 'Wj6P2uj1CxUpwZAu1BpbF1l7bhYgQl5JTSM2WxPW',
  fileKey:'0e1eb489-e25d-429b-86a9-d75a65253a09',
  serverURL: 'http://localhost:1337/parse' //TODO: Don't forget to change to https if needed
});

//Note: Client-keys like the javascript key are not necessary with parse-server

const app = express()

//PARSE API

// Serve the Parse API on the /parse URL prefix
const mountPath = '/parse'

app.use(mountPath, api)

// Parse Server should play nicely with the rest of our Rest based GraphQL API
app.get('/', function(req:any, res:any) {
  res.status(200).send('You have reached the WELL SERVER. TO Acess GraphiQL append /graphql to url')
});

const port = '1337'
app.listen(port, function() {
    console.log('Well Parse API running on port ' + port + '.');
})

// GraphQL API
import * as graphqlHTTP from 'express-graphql'
import {GraphQLSchema,GraphQLObjectType,GraphQLString} from 'graphql'


const tempSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      donnyData: {
        type: GraphQLString,
        resolve() {
          return 'hello world';
        }
      }
    }
  })
})

app.use('/graphql', graphqlHTTP({ schema: tempSchema, graphiql: true }))


// Mongoose tests


import * as mongoose from 'mongoose'
import * as Promise from 'bluebird'

 mongoose.Promise = Promise
    // assert.equal(query.exec().constructor, require('bluebird'));

mongoose.connect(databaseUri)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function() {
  // we're connected!

})
