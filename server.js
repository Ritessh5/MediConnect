require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection, syncDatabase } = require('./src/config/database');
const { User, Doctor, Medicine, Appointment, Chat, Message, Prescription } = require('./src/models');
const { initializeSocket } = require('./src/config/socket'); // Import socket setup

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Allow React app to connect
app.use(cors({
  origin: 'http://localhost:5173', // React app URL (change to 3173 if needed)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const medicineRoutes = require('./src/routes/medicineRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const prescriptionRoutes = require('./src/routes/prescriptionRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Test route - Home
app.get('/', (req, res) => {
  res.json({
    message: '🚀 MediConnect Backend is running!',
    status: 'success',
    database: 'Connected',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    uptime: process.uptime()
  });
});

// Test route to create a user
app.post('/test/create-user', async (req, res) => {
  try {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123',
      phone: '9876543210',
      gender: 'Male',
      dateOfBirth: '1990-01-01',
      address: 'Test Address, Mumbai'
    });
    
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Test route to get all users
app.get('/test/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      status: 'success',
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Test route to create sample doctors
app.post('/test/create-sample-doctors', async (req, res) => {
  try {
    // First, create doctor users
    const doctorUsers = await Promise.all([
      User.create({
        username: 'dr_sarah',
        email: 'sarah@hospital.com',
        password: 'Doctor123',
        phone: '9876543211',
        gender: 'Female',
        dateOfBirth: '1985-05-15',
        address: 'Mumbai Hospital, Mumbai',
        role: 'doctor'
      }),
      User.create({
        username: 'dr_david',
        email: 'david@hospital.com',
        password: 'Doctor123',
        phone: '9876543212',
        gender: 'Male',
        dateOfBirth: '1982-08-20',
        address: 'City Clinic, Mumbai',
        role: 'doctor'
      }),
      User.create({
        username: 'dr_emily',
        email: 'emily@hospital.com',
        password: 'Doctor123',
        phone: '9876543213',
        gender: 'Female',
        dateOfBirth: '1988-03-10',
        address: 'Children Hospital, Mumbai',
        role: 'doctor'
      })
    ]);

    // Create doctor profiles
    const doctors = await Promise.all([
      Doctor.create({
        userId: doctorUsers[0].id,
        specialization: 'General Medicine',
        degree: 'MBBS, MD',
        experience: 12,
        consultationFee: 450,
        rating: 4.8,
        totalRatings: 150,
        bio: 'Experienced general physician with expertise in common ailments',
        languages: ['English', 'Hindi', 'Marathi'],
        isChatAvailable: true,
        isVideoCallAvailable: true,
        licenseNumber: 'MH-DOC-2011-001',
        isVerified: true
      }),
      Doctor.create({
        userId: doctorUsers[1].id,
        specialization: 'Cardiology',
        degree: 'MD (Cardiology)',
        experience: 8,
        consultationFee: 800,
        rating: 4.5,
        totalRatings: 98,
        bio: 'Specialist in heart diseases and cardiovascular conditions',
        languages: ['English', 'Hindi'],
        isChatAvailable: true,
        isVideoCallAvailable: false,
        licenseNumber: 'MH-DOC-2015-002',
        isVerified: true
      }),
      Doctor.create({
        userId: doctorUsers[2].id,
        specialization: 'Pediatrics',
        degree: 'MBBS, DCH',
        experience: 10,
        consultationFee: 600,
        rating: 4.9,
        totalRatings: 220,
        bio: 'Pediatric specialist caring for children\'s health',
        languages: ['English', 'Hindi', 'Marathi'],
        isChatAvailable: true,
        isVideoCallAvailable: true,
        licenseNumber: 'MH-DOC-2013-003',
        isVerified: true
      })
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Sample doctors created successfully',
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});
// Test route to create sample medicines
app.post('/test/create-sample-medicines', async (req, res) => {
  try {
    const medicines = await Promise.all([
      // Pain & Fever
      Medicine.create({
        name: 'Paracetamol',
        alternativeName: 'Acetaminophen, Crocin, Dolo',
        description: 'Pain reliever and fever reducer used to treat many conditions such as headache, muscle aches, arthritis, backache, toothaches, colds, and fevers.',
        manufacturer: 'GSK Pharmaceuticals',
        composition: 'Paracetamol 500mg',
        treats: ['Fever', 'Headache', 'Pain', 'Cold'],
        symptoms: ['fever', 'headache', 'body pain', 'toothache'],
        forms: ['Tablet', 'Syrup', 'Suspension'],
        dosage: 'Adults: 500-1000mg every 4-6 hours. Maximum 4000mg per day. Children: As per doctor\'s advice',
        sideEffects: 'Rare side effects include skin rash, nausea, stomach pain. Overdose can cause liver damage.',
        precautions: 'Do not exceed recommended dose. Avoid alcohol. Consult doctor if symptoms persist.',
        isOTC: true,
        isPrescriptionRequired: false,
        price: 25.00
      }),
      Medicine.create({
        name: 'Ibuprofen',
        alternativeName: 'Advil, Brufen, Motrin',
        description: 'Nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation.',
        manufacturer: 'Abbott',
        composition: 'Ibuprofen 400mg',
        treats: ['Fever', 'Pain', 'Inflammation', 'Arthritis'],
        symptoms: ['fever', 'headache', 'inflammation', 'arthritis pain', 'menstrual pain'],
        forms: ['Tablet', 'Gel Cap', 'Liquid', 'Suspension'],
        dosage: 'Adults: 200-400mg every 4-6 hours. Maximum 1200mg per day. Take with food.',
        sideEffects: 'Stomach upset, nausea, heartburn, dizziness, headache. Rare: stomach bleeding.',
        precautions: 'Take with food or milk. Avoid if you have stomach ulcers. Not for children under 6 months.',
        isOTC: true,
        isPrescriptionRequired: false,
        price: 35.00
      }),

      // Antibiotics
      Medicine.create({
        name: 'Amoxicillin',
        alternativeName: 'Amoxil, Novamox',
        description: 'Penicillin-type antibiotic used to treat bacterial infections including respiratory infections, urinary tract infections, and ear infections.',
        manufacturer: 'Cipla',
        composition: 'Amoxicillin 500mg',
        treats: ['Bacterial Infection', 'Respiratory Infection', 'UTI', 'Ear Infection'],
        symptoms: ['bacterial infection', 'throat infection', 'ear infection', 'respiratory infection'],
        forms: ['Capsule', 'Tablet', 'Syrup'],
        dosage: 'Adults: 250-500mg three times daily. Complete the full course as prescribed.',
        sideEffects: 'Diarrhea, nausea, rash. Allergic reactions in some people.',
        precautions: 'Complete full course. Inform doctor if allergic to penicillin. Take with or without food.',
        isOTC: false,
        isPrescriptionRequired: true,
        price: 65.00
      }),
      Medicine.create({
        name: 'Azithromycin',
        alternativeName: 'Zithromax, Azee',
        description: 'Macrolide antibiotic used to treat various bacterial infections including respiratory infections, skin infections, and ear infections.',
        manufacturer: 'Pfizer',
        composition: 'Azithromycin 500mg',
        treats: ['Bacterial Infection', 'Respiratory Infection', 'Skin Infection'],
        symptoms: ['bacterial infection', 'pneumonia', 'bronchitis', 'sinusitis'],
        forms: ['Tablet', 'Suspension'],
        dosage: 'Adults: 500mg once daily for 3 days or as prescribed by doctor.',
        sideEffects: 'Diarrhea, nausea, stomach pain, headache.',
        precautions: 'Take on empty stomach. Complete full course. Inform doctor about heart conditions.',
        isOTC: false,
        isPrescriptionRequired: true,
        price: 85.00
      }),

      // Cold & Cough
      Medicine.create({
        name: 'Cetirizine',
        alternativeName: 'Zyrtec, Alerid',
        description: 'Antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, and sneezing.',
        manufacturer: 'GSK',
        composition: 'Cetirizine Hydrochloride 10mg',
        treats: ['Allergy', 'Cold', 'Hay Fever', 'Itching'],
        symptoms: ['runny nose', 'sneezing', 'watery eyes', 'itching', 'allergy'],
        forms: ['Tablet', 'Syrup'],
        dosage: 'Adults & children above 6 years: 10mg once daily, preferably in the evening.',
        sideEffects: 'Drowsiness, dry mouth, headache, fatigue.',
        precautions: 'May cause drowsiness. Avoid driving after taking. Can be taken with or without food.',
        isOTC: true,
        isPrescriptionRequired: false,
        price: 45.00
      }),
      Medicine.create({
        name: 'Dextromethorphan',
        alternativeName: 'Benadryl DR, Cough Syrup',
        description: 'Cough suppressant used to treat cough caused by common cold, flu, or other conditions.',
        manufacturer: 'Johnson & Johnson',
        composition: 'Dextromethorphan Hydrobromide 15mg/5ml',
        treats: ['Cough', 'Cold'],
        symptoms: ['dry cough', 'persistent cough', 'cold'],
        forms: ['Syrup', 'Lozenges'],
        dosage: 'Adults: 10-20mg every 4 hours or 30mg every 6-8 hours. Max 120mg per day.',
        sideEffects: 'Dizziness, drowsiness, nausea, vomiting.',
        precautions: 'Do not use for chronic cough. Avoid if taking MAO inhibitors. Drink plenty of fluids.',
        isOTC: true,
        isPrescriptionRequired: false,
        price: 55.00
      }),

      // Stomach & Digestion
      Medicine.create({
        name: 'Omeprazole',
        alternativeName: 'Prilosec, Omez',
        description: 'Proton pump inhibitor (PPI) used to treat heartburn, acid reflux, and stomach ulcers.',
        manufacturer: 'Dr. Reddy\'s',
        composition: 'Omeprazole 20mg',
        treats: ['Acidity', 'Heartburn', 'Acid Reflux', 'Ulcers'],
        symptoms: ['acidity', 'heartburn', 'acid reflux', 'stomach pain', 'ulcer'],
        forms: ['Capsule', 'Tablet'],
        dosage: 'Adults: 20mg once daily before breakfast for 2-4 weeks.',
        sideEffects: 'Headache, nausea, diarrhea, stomach pain, gas.',
        precautions: 'Take before meals. Do not crush or chew capsules. Long-term use may affect bone health.',
        isOTC: false,
        isPrescriptionRequired: true,
        price: 75.00
      }),
      Medicine.create({
        name: 'Ranitidine',
        alternativeName: 'Zantac, Aciloc',
        description: 'H2 blocker used to decrease stomach acid production, treating ulcers and acid reflux.',
        manufacturer: 'Sun Pharma',
        composition: 'Ranitidine 150mg',
        treats: ['Acidity', 'Heartburn', 'Ulcers', 'GERD'],
        symptoms: ['acidity', 'heartburn', 'stomach pain'],
        forms: ['Tablet', 'Syrup'],
        dosage: 'Adults: 150mg twice daily or 300mg once daily at bedtime.',
        sideEffects: 'Headache, constipation, diarrhea, dizziness.',
        precautions: 'Can be taken with or without food. Inform doctor about kidney problems.',
        isOTC: true,
        isPrescriptionRequired: false,
        price: 40.00
      }),

      // Diabetes
      Medicine.create({
        name: 'Metformin',
        alternativeName: 'Glucophage, Glycomet',
        description: 'Oral diabetes medication that helps control blood sugar levels in people with type 2 diabetes.',
        manufacturer: 'USV',
        composition: 'Metformin Hydrochloride 500mg',
        treats: ['Diabetes', 'Type 2 Diabetes', 'PCOS'],
        symptoms: ['high blood sugar', 'diabetes'],
        forms: ['Tablet', 'Extended Release Tablet'],
        dosage: 'Adults: Starting 500mg twice daily with meals. Max 2000-2500mg per day.',
        sideEffects: 'Nausea, diarrhea, stomach upset, metallic taste in mouth.',
        precautions: 'Take with meals. Regular blood sugar monitoring required. Avoid alcohol.',
        isOTC: false,
        isPrescriptionRequired: true,
        price: 45.00
      }),

      // Blood Pressure
      Medicine.create({
        name: 'Amlodipine',
        alternativeName: 'Norvasc, Amlong',
        description: 'Calcium channel blocker used to treat high blood pressure and chest pain (angina).',
        manufacturer: 'Pfizer',
        composition: 'Amlodipine 5mg',
        treats: ['High Blood Pressure', 'Hypertension', 'Angina'],
        symptoms: ['high blood pressure', 'chest pain'],
        forms: ['Tablet'],
        dosage: 'Adults: 5-10mg once daily. Can be taken with or without food.',
        sideEffects: 'Swelling of ankles, dizziness, flushing, headache.',
        precautions: 'Regular blood pressure monitoring. Do not stop suddenly. Rise slowly from sitting/lying.',
        isOTC: false,
        isPrescriptionRequired: true,
        price: 55.00
      }),

      // Vitamins & Supplements
      Medicine.create({
        name: 'Vitamin D3',
        alternativeName: 'Cholecalciferol, Calcirol',
        description: 'Vitamin supplement used to treat or prevent vitamin D deficiency and support bone health.',
        manufacturer: 'Mankind',
        composition: 'Cholecalciferol 60000 IU',
        treats: ['Vitamin D Deficiency', 'Bone Health', 'Osteoporosis'],
        symptoms: ['vitamin d deficiency', 'weak bones', 'fatigue'],
        forms: ['Capsule', 'Tablet', 'Oral Solution'],
        dosage: 'Adults: 60000 IU once weekly for 8 weeks or as prescribed.',
        sideEffects: 'Rare: nausea, vomiting, constipation, loss of appetite.',
        precautions: 'Take with meals for better absorption. Regular monitoring of vitamin D levels.',
        isOTC: true,
        isPrescriptionRequired: false,
        price: 35.00
      }),
      Medicine.create({
        name: 'Multivitamin',
        alternativeName: 'Supradyn, Becosules',
        description: 'Comprehensive multivitamin and mineral supplement for overall health and wellness.',
        manufacturer: 'Bayer',
        composition: 'Multivitamins with Minerals',
        treats: ['Vitamin Deficiency', 'General Health', 'Weakness'],
        symptoms: ['weakness', 'fatigue', 'vitamin deficiency'],
        forms: ['Tablet', 'Capsule'],
        dosage: 'Adults: One tablet daily after meals.',
        sideEffects: 'Mild stomach upset, constipation in some cases.',
        precautions: 'Take with meals. Do not exceed recommended dose. Store in cool, dry place.',
        isOTC: true,
        isPrescriptionRequired: false,
        price: 120.00
      }),

      // Pain Killers
      Medicine.create({
        name: 'Diclofenac',
        alternativeName: 'Voltaren, Voveran',
        description: 'NSAID used to treat pain, inflammation, and stiffness caused by various conditions.',
        manufacturer: 'Novartis',
        composition: 'Diclofenac Sodium 50mg',
        treats: ['Pain', 'Inflammation', 'Arthritis', 'Joint Pain'],
        symptoms: ['joint pain', 'arthritis', 'inflammation', 'back pain'],
        forms: ['Tablet', 'Gel', 'Injection'],
        dosage: 'Adults: 50mg 2-3 times daily. Take with food or milk.',
        sideEffects: 'Stomach upset, heartburn, nausea, dizziness, headache.',
        precautions: 'Take with food. Not for long-term use without doctor supervision. Avoid in kidney disease.',
        isOTC: false,
        isPrescriptionRequired: true,
        price: 45.00
      }),

      // Anxiety & Sleep
      Medicine.create({
        name: 'Alprazolam',
        alternativeName: 'Xanax, Alprax',
        description: 'Benzodiazepine used to treat anxiety disorders and panic attacks.',
        manufacturer: 'Pfizer',
        composition: 'Alprazolam 0.5mg',
        treats: ['Anxiety', 'Panic Disorder', 'Stress'],
        symptoms: ['anxiety', 'panic attacks', 'stress', 'nervousness'],
        forms: ['Tablet'],
        dosage: 'Adults: 0.25-0.5mg 2-3 times daily or as prescribed. Do not exceed 4mg per day.',
        sideEffects: 'Drowsiness, dizziness, increased saliva production, change in sex drive.',
        precautions: 'Habit-forming. Do not stop suddenly. Avoid alcohol. May cause drowsiness.',
        isOTC: false,
        isPrescriptionRequired: true,
        price: 65.00
      }),

      // Thyroid
      Medicine.create({
        name: 'Levothyroxine',
        alternativeName: 'Synthroid, Eltroxin',
        description: 'Thyroid hormone replacement used to treat hypothyroidism (underactive thyroid).',
        manufacturer: 'Abbott',
        composition: 'Levothyroxine Sodium 50mcg',
        treats: ['Hypothyroidism', 'Thyroid Disorder'],
        symptoms: ['hypothyroidism', 'fatigue', 'weight gain'],
        forms: ['Tablet'],
        dosage: 'Adults: As prescribed by doctor based on TSH levels. Usually 50-200mcg once daily.',
        sideEffects: 'Weight loss, tremors, headache, increased appetite, nervousness.',
        precautions: 'Take on empty stomach, 30 minutes before breakfast. Regular thyroid function tests needed.',
        isOTC: false,
        isPrescriptionRequired: true,
        price: 55.00
      })
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Sample medicines created successfully',
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Start server with database connection
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync models with database
    await syncDatabase({ alter: true });
    
    // Start server and store the HTTP server instance
    const httpServer = app.listen(PORT, () => { // <-- Change 1: Store server instance
      console.log('='.repeat(50));
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🗄️  Database: ${process.env.DB_NAME}`);
      console.log('='.repeat(50));
    });
    
    // Initialize Socket.io with the HTTP server
    initializeSocket(httpServer); // <-- Change 2: Initialize Socket.io

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();