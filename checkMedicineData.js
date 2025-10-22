// Database Check Script
// Save as: src/backend/checkMedicineData.js
// Run with: node src/backend/checkMedicineData.js

require('dotenv').config();
const { Medicine } = require('./src/models');
const { testConnection } = require('./src/config/database');

async function checkMedicineData() {
  try {
    console.log('🔍 Checking database connection...');
    await testConnection();
    console.log('✅ Database connected successfully!\n');

    // Get total count
    const totalCount = await Medicine.count();
    console.log(`📊 Total medicines in database: ${totalCount}\n`);

    if (totalCount === 0) {
      console.log('⚠️  No medicines found in database!');
      console.log('💡 Run this endpoint to add sample data:');
      console.log('   POST http://localhost:5000/test/create-sample-medicines\n');
      return;
    }

    // Check a few sample medicines
    console.log('📋 Sample medicines:');
    const samples = await Medicine.findAll({ limit: 3 });
    samples.forEach(med => {
      console.log(`\n  Name: ${med.name}`);
      console.log(`  Symptoms: ${JSON.stringify(med.symptoms)}`);
      console.log(`  Treats: ${JSON.stringify(med.treats)}`);
    });

    // Check for "fever" symptom
    console.log('\n\n🔍 Checking for medicines that treat "fever"...');
    
    const feverMedicines = await Medicine.findAll({
      where: {
        symptoms: { $contains: ['fever'] }
      }
    });

    console.log(`Found ${feverMedicines.length} medicines with "fever" in symptoms array`);
    
    if (feverMedicines.length > 0) {
      console.log('\n✅ Sample medicines for fever:');
      feverMedicines.slice(0, 3).forEach(med => {
        console.log(`  - ${med.name}`);
      });
    } else {
      console.log('\n⚠️  No medicines found with "fever" in symptoms!');
      console.log('💡 This might be why your search is not working.');
      console.log('   Check if symptoms are stored as lowercase in database.');
    }

    // Check case sensitivity
    console.log('\n\n🔍 Checking case sensitivity...');
    const capitalFever = await Medicine.findAll({
      where: {
        symptoms: { $contains: ['Fever'] }
      }
    });
    console.log(`Medicines with "Fever" (capital F): ${capitalFever.length}`);

    // Check treats array for fever
    console.log('\n🔍 Checking "treats" array for fever...');
    const treatsFever = await Medicine.findAll({
      where: {
        treats: { $overlap: ['Fever', 'fever'] }
      }
    });
    console.log(`Medicines that treat fever: ${treatsFever.length}`);

    if (treatsFever.length > 0) {
      console.log('\n✅ Sample medicines that treat fever:');
      treatsFever.slice(0, 3).forEach(med => {
        console.log(`  - ${med.name} (Treats: ${JSON.stringify(med.treats)})`);
      });
    }

    console.log('\n\n✅ Database check complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
}

// Run the check
checkMedicineData();