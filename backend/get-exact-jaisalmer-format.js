const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function getJaisalmerFormat() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const pkg = await Package.findOne({ 
      destination: 'Jaisalmer, Rajasthan',
      price: 7000
    }).lean();

    if (!pkg) {
      console.log('Package not found!');
      return;
    }

    console.log('EXACT JAISALMER FORMAT:\n');
    console.log(JSON.stringify(pkg, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

getJaisalmerFormat();
