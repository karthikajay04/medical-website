import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { sseManager } from '../services/sse.js';

const router = Router();

const doctorSchema = z.object({
  name: z.string().min(2),
  specialty: z.string().min(2),
  availability: z.string().min(2),
  image: z.string().url().optional().default('https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&w=200&q=80'),
  status: z.enum(['Serving', 'On Break', 'Coming Soon', 'Inactive']).optional().default('Serving'),
  type: z.enum(['General', 'Visiting']).optional().default('General'),
});

// GET all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json(doctors);
  } catch (error) {
    console.error('Fetch doctors error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST create doctor (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const body = doctorSchema.parse(req.body);
    const doctor = await prisma.doctor.create({
      data: body,
    });
    
    // Broadcast status update
    await sseManager.broadcastQueueUpdate();
    
    return res.status(201).json(doctor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    console.error('Create doctor error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT update doctor (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const body = doctorSchema.partial().parse(req.body);
    
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
    });
    
    if (!existingDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: body,
    });
    
    // Broadcast status update to all SSE clients!
    await sseManager.broadcastQueueUpdate();
    
    return res.json(updatedDoctor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    console.error('Update doctor error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE doctor (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
    });
    
    if (!existingDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    await prisma.doctor.delete({
      where: { id },
    });
    
    // Broadcast status update
    await sseManager.broadcastQueueUpdate();
    
    return res.json({ message: 'Doctor successfully deleted' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET doctor availability schedule & leaves
router.get('/:id/schedule', async (req, res) => {
  try {
    const { id } = req.params;
    const schedules = await prisma.doctorSchedule.findMany({
      where: { doctorId: id },
    });
    const leaves = await prisma.customLeave.findMany({
      where: { doctorId: id },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ schedules, leaves });
  } catch (error) {
    console.error('Fetch schedule error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST save/update weekly schedule (Admin only)
router.post('/:id/schedule', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { schedules } = req.body; // Array of { day, start, end, active }

    if (!Array.isArray(schedules)) {
      return res.status(400).json({ message: 'Schedules must be an array' });
    }

    // Process each schedule item using PostgreSQL upsertion
    for (const item of schedules) {
      await prisma.doctorSchedule.upsert({
        where: {
          doctorId_day: {
            doctorId: id,
            day: item.day,
          },
        },
        update: {
          startTime: item.start,
          endTime: item.end,
          active: item.active,
        },
        create: {
          doctorId: id,
          day: item.day,
          startTime: item.start,
          endTime: item.end,
          active: item.active,
        },
      });
    }

    return res.json({ message: 'Schedule updated successfully' });
  } catch (error) {
    console.error('Update schedule error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST add a custom leave (Admin only)
router.post('/:id/leaves', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { dateRange, reason } = req.body;

    if (!dateRange || !reason) {
      return res.status(400).json({ message: 'dateRange and reason are required' });
    }

    const leave = await prisma.customLeave.create({
      data: {
        doctorId: id,
        dateRange,
        reason,
      },
    });

    return res.status(201).json(leave);
  } catch (error) {
    console.error('Add leave error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE remove a custom leave (Admin only)
router.delete('/:id/leaves/:leaveId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { leaveId } = req.params;

    await prisma.customLeave.delete({
      where: { id: leaveId },
    });

    return res.json({ message: 'Leave removed successfully' });
  } catch (error) {
    console.error('Delete leave error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
