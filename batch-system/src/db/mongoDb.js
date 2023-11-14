const { MongoClient, ServerApiVersion } = require("mongodb");
const { Constants } = require("../util/constants");

module.exports = {
  MongoDBClient: class MongoDBClient {
    constructor(uri) {
      this.uri = uri;
      this.client = new MongoClient(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
      });
    }
    
    async insertDoc(collectionName, data) {
      try {
        const database = this.client.db(Constants.dbName);
        const formFourCollection = database.collection(collectionName);
        const result = await formFourCollection.insertOne(JSON.parse(data));
        
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        return result.insertedId;
  
      } catch(error) {
        console.log(error);
        return null;
      }
    }
  },
};
