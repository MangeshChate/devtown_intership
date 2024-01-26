const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient} = require('@aws-sdk/lib-dynamodb');

const dbClient = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'AKIATOJA5W2ZDDPI4FZJ',
        secretAccessKey: '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'
    }
});

const  marshallOptions = {
    /**
     * Whether to automatically convert empty strings, blobs, and sets to `null`
     */
    convertEmptyValues: false,

    /**
     * Whether to remove undefined values while marshalling.
     */
    removeUndefinedValues: false,
    /**
     * Whether to convert typeof object to map attribute.
     */
    convertClassInstanceToMap: false,
}
  
  const unmarshallOptions ={
    /**
     * Whether to return numbers as a string instead of converting them to native JavaScript numbers.
     * This allows for the safe round-trip transport of numbers of arbitrary size.
     */
    wrapNumbers: false,
  
    
  }
  
  
  
  const translateConfig = { marshallOptions, unmarshallOptions };


  const DocumentClient =DynamoDBDocumentClient.from(dbClient ,translateConfig)

  module.exports = DocumentClient;