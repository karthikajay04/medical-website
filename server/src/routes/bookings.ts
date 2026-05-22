import { Router, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth.js';
import { sseManager } from '../services/sse.js';

const router = Router();

const bookingSchema = z.object({
  doctorId: z.string(),
  date: z.string(), // YYYY-MM-DD
  patientName: z.string().min(2),
  patientPhone: z.string().min(10),
  patientAge: z.string().optional().nullable(),
  reason: z.string().optional(),
});

// Helper: Generate estimated time based on token number
// Assume clinic sessions start at 9:00 AM, and each consultation takes 12 minutes.
const estimateConsultationTime = (tokenNumber: number): string => {
  const startHour = 9;
  const startMinute = 0;
  const minutesPerPatient = 12;
  
  const totalMinutes = (tokenNumber - 1) * minutesPerPatient;
  const targetTime = new Date();
  targetTime.setHours(startHour, startMinute + totalMinutes, 0, 0);
  
  return targetTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Create a booking (optionally authenticated)
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const body = bookingSchema.parse(req.body);
    
    // 1. Verify doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: body.doctorId },
    });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // 2. Count existing bookings for this doctor on this specific date to assign consecutive token number
    const bookingCount = await prisma.booking.count({
      where: {
        doctorId: body.doctorId,
        date: body.date,
      },
    });
    
    const tokenNumber = bookingCount + 1;
    const estimatedTime = estimateConsultationTime(tokenNumber);
    
    // 3. Generate random unique reference like ATH-K6Y8E1
    let bookingRef = '';
    let isUnique = false;
    while (!isUnique) {
      bookingRef = 'ATH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const existingRef = await prisma.booking.findUnique({
        where: { bookingRef },
      });
      if (!existingRef) isUnique = true;
    }
 
    // 4. Decode optional authorization header to bind to User account
    let userId: string | undefined = undefined;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET || 'aethera_super_secret_jwt_token_key_2026';
      try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: string };
        userId = decoded.userId;
      } catch (err) {
        // Skip link if token is invalid, but process the booking as guest
      }
    }
 
    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        tokenNumber,
        date: body.date,
        estimatedTime,
        patientName: body.patientName,
        patientPhone: body.patientPhone,
        patientAge: body.patientAge || null,
        reason: body.reason || null,
        doctorId: body.doctorId,
        userId: userId || null,
        status: 'Pending',
      },
      include: {
        doctor: true,
      },
    });

    // Broadcast queue size change
    await sseManager.broadcastQueueUpdate();

    return res.status(201).json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    console.error('Create booking error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET bookings for authenticated patient
router.get('/my', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.userId },
      include: { doctor: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(bookings);
  } catch (error) {
    console.error('Fetch user bookings error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET all bookings (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { doctor: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(bookings);
  } catch (error) {
    console.error('Fetch all bookings error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT update booking status (Admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status value' });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { doctor: true },
    });

    // Broadcast queue size change
    await sseManager.broadcastQueueUpdate();

    return res.json(updatedBooking);
  } catch (error) {
    console.error('Update booking status error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST cancel booking (Authenticated patient)
router.post('/:id/cancel', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Secure: verify that the booking belongs to the authenticated user
    if (booking.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You cannot cancel someone else\'s booking' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'Cancelled' },
      include: { doctor: true },
    });

    // Broadcast queue update to sync SSE boards
    await sseManager.broadcastQueueUpdate();

    return res.json(updatedBooking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET bookings assigned to logged-in doctor
router.get('/doctor', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'DOCTOR' || !req.user.doctorId) {
      return res.status(403).json({ message: 'Forbidden: Doctor credentials required' });
    }

    const bookings = await prisma.booking.findMany({
      where: { doctorId: req.user.doctorId },
      include: { doctor: true },
      orderBy: [
        { date: 'desc' },
        { tokenNumber: 'asc' }
      ],
    });

    return res.json(bookings);
  } catch (error) {
    console.error('Fetch doctor bookings error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT save prescription and diagnosis for booking (Doctor only)
router.put('/:id/prescription', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'DOCTOR' || !req.user.doctorId) {
      return res.status(403).json({ message: 'Forbidden: Doctor credentials required' });
    }

    const { id } = req.params;
    const { vitals, diagnosis, prescriptionMeds, prescriptionNotes, status } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify booking is for this doctor
    if (booking.doctorId !== req.user.doctorId) {
      return res.status(403).json({ message: 'Forbidden: You cannot prescribe for another doctor\'s patient' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        vitals: vitals || null,
        diagnosis: diagnosis || null,
        prescriptionMeds: prescriptionMeds || null,
        prescriptionNotes: prescriptionNotes || null,
        status: status || booking.status,
      },
      include: { doctor: true },
    });

    // Broadcast queue size / live token changes via SSE
    await sseManager.broadcastQueueUpdate();

    return res.json(updatedBooking);
  } catch (error) {
    console.error('Save prescription error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
