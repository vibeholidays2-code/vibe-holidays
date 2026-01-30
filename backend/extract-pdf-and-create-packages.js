const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-holidays')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Package Schema
const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

async function extractPDFText(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf.default(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error reading PDF ${pdfPath}:`, error.message);
    return null;
  }
}

async function createPackagesFromPDFs() {
  console.log('📄 Extracting information from PDFs...\n');

  const pdfsDir = path.join(__dirname, '..', 'pdfs');
  const pdfFiles = fs.readdirSync(pdfsDir).filter(file => file.endsWith('.pdf'));

  console.log(`Found ${pdfFiles.length} PDF files:\n`);

  for (const pdfFile of pdfFiles) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing: ${pdfFile}`);
    console.log('='.repeat(60));

    const pdfPath = path.join(pdfsDir, pdfFile);
    const text = await extractPDFText(pdfPath);

    if (text) {
      console.log('\n📝 Extracted Text:');
      console.log('-'.repeat(60));
      console.log(text.substring(0, 500)); // Show first 500 characters
      console.log('-'.repeat(60));
      
      // Extract price from filename
      const priceMatch = pdfFile.match(/(\d+)/);
      const price = priceMatch ? parseInt(priceMatch[0]) : 25000;
      
      console.log(`\n💰 Detected Price: ₹${price}`);
    }
  }

  console.log('\n\n📋 PDF Content Extracted!');
  console.log('\nPlease review the extracted text above.');
  console.log('I will now wait for you to confirm the package details.');
  
  process.exit(0);
}

createPackagesFromPDFs();
