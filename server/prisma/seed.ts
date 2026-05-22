import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing database records
  await prisma.booking.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();
  console.log('🧹 Cleaned existing database entries.');

  // 2. Create users (Admin & Patient)
  const hashedAdminPassword = await bcrypt.hash('adminpassword', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@aethera.com',
      password: hashedAdminPassword,
      name: 'Administrator',
      phone: '+91 99999 99999',
      role: 'ADMIN',
    },
  });
  console.log('👤 Created Admin user: admin@aethera.com / adminpassword');

  const hashedPatientPassword = await bcrypt.hash('patientpassword', 10);
  const patient = await prisma.user.create({
    data: {
      email: 'patient@aethera.com',
      password: hashedPatientPassword,
      name: 'John Doe',
      phone: '+91 98765 43210',
      role: 'PATIENT',
    },
  });
  console.log('👤 Created Patient user: patient@aethera.com / patientpassword');

  // 3. Create Doctors
  const doctorsData = [
    {
      name: 'Dr. Robert Chen',
      specialty: 'General Physician',
      availability: 'Mon - Sat',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&w=200&q=80',
      status: 'Serving',
      type: 'General',
      currentToken: 12,
    },
    {
      name: 'Dr. Sarah Adams',
      specialty: 'Pediatrician',
      availability: 'Mon, Wed, Fri',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80',
      status: 'Serving',
      type: 'General',
      currentToken: 4,
    },
    {
      name: 'Dr. Amit Patel',
      specialty: 'Orthopedics',
      availability: 'Tue, Thu',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
      status: 'Serving',
      type: 'Visiting',
      currentToken: 2,
    },
    {
      name: 'Dr. Emily Lee',
      specialty: 'Gynecologist',
      availability: 'Sat',
      image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&w=200&q=80',
      status: 'Coming Soon',
      type: 'Visiting',
      currentToken: 0,
    },
    {
      name: 'Dr. Elena Rodriguez',
      specialty: 'Dermatologist',
      availability: 'Tue, Fri',
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      status: 'On Break',
      type: 'Visiting',
      currentToken: 8,
    },
  ];

  const doctors = [];
  for (const doc of doctorsData) {
    const createdDoc = await prisma.doctor.create({
      data: doc,
    });
    doctors.push(createdDoc);
    console.log(`🩺 Created Doctor: ${doc.name} (${doc.specialty})`);
  }

  // 3.5 Create Doctor login user account linked to Dr. Robert Chen
  const hashedDoctorPassword = await bcrypt.hash('doctorpassword', 10);
  await prisma.user.create({
    data: {
      email: 'doctor@aethera.com',
      password: hashedDoctorPassword,
      name: 'Dr. Robert Chen',
      phone: '+91 99999 88888',
      role: 'DOCTOR',
      doctorId: doctors[0].id,
    },
  });
  console.log('👤 Created Doctor user: doctor@aethera.com / doctorpassword');

  // 4. Create some sample bookings for today
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Seed bookings for Dr. Robert Chen
  const chenDoc = doctors[0];
  
  // Create 15 bookings (12 completed, 3 pending)
  for (let i = 1; i <= 15; i++) {
    const isPending = i > 12;
    await prisma.booking.create({
      data: {
        bookingRef: `ATH-CH${1000 + i}`,
        tokenNumber: i,
        date: todayStr,
        estimatedTime: `${9 + Math.floor((i-1)*12/60)}:${((i-1)*12)%60 === 0 ? '00' : ((i-1)*12)%60 === 0 ? '00' : String(((i-1)*12)%60).padStart(2, '0')} AM`,
        patientName: `Patient ${i}`,
        patientPhone: `+91 90000 000${i.toString().padStart(2, '0')}`,
        reason: 'Regular consultation checkup',
        status: isPending ? 'Pending' : 'Completed',
        doctorId: chenDoc.id,
        // Bind one of the pending bookings to our test patient
        userId: i === 13 ? patient.id : null,
      },
    });
  }
  console.log('📅 Seeded 15 bookings for Dr. Robert Chen (12 completed, 3 pending).');

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
