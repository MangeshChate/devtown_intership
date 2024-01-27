const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient} = require('@aws-sdk/lib-dynamodb');
app.use(express.json());
const dbClient = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});

const  marshallOptions = {
    
    convertEmptyValues: false,


    removeUndefinedValues: false,

    convertClassInstanceToMap: false,
}
  
  const unmarshallOptions ={

    wrapNumbers: false,
  
    
  }
  
  
  
  const translateConfig = { marshallOptions, unmarshallOptions };


  const DocumentClient =DynamoDBDocumentClient.from(dbClient ,translateConfig)

  module.exports = DocumentClient;