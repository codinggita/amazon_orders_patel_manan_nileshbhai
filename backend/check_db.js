import mongoose from 'mongoose';

async function check() {
  try {
    await mongoose.connect('mongodb://localhost:27017/amazon-ecommerce');
    console.log('Connected to DB');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('Collections in amazon-ecommerce:');
    for (const c of collections) {
      console.log(`- ${c.name}`);
      const count = await db.collection(c.name).countDocuments();
      console.log(`  count: ${count}`);
      if (count > 0) {
        const doc = await db.collection(c.name).findOne({});
        console.log(`  sample doc: ${JSON.stringify(doc).substring(0, 200)}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

check();
