require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(process.env.DB_CONNECTION_STRING_TEST, { useNewUrlParser: true, useUnifiedTopology: true });

async function updateDocuments() {
  try {
    await client.connect();
    console.log('Connected to the database');

    const database = client.db('Inside4');
    const collection = database.collection('formFours');

    // Update documents where the field exists
    const result = await collection.updateMany(
      { 'nonDerivativeTable.nonDerivativeTransaction.transactionDate.value': { $exists: true } },
      [
        {
          $set: {
            'nonDerivativeTable.nonDerivativeTransaction.transactionDate.value': {
              $toDate: '$nonDerivativeTable.nonDerivativeTransaction.transactionDate.value'
            }
          }
        }
      ]
    );

    console.log(`${result.modifiedCount} documents updated successfully`);
  } finally {
    await client.close();
    console.log('Disconnected from the database');
  }
}

// Call the update function
updateDocuments().then(result => console.log(result)).catch(err => console.log(err));
