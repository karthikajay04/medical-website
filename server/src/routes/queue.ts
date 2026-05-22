import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { sseManager } from '../services/sse.js';

const router = Router();

// GET /api/queue/live — Server-Sent Events stream
router.get('/live', async (req, res) => {
  await sseManager.registerClient(res);
});

// POST /api/queue/next/:doctorId — Advance queue to next token (Admin only)
router.post('/next/:doctorId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Increment currentToken
    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        currentToken: doctor.currentToken + 1,
      },
    });

    // --- Live SMS/WhatsApp Notification Delivery ---
    try {
      const todayStr = new Date().toISOString().split('T')[0];

      // 1. Alert the patient whose turn is IMMEDIATELY up
      const immediateBooking = await prisma.booking.findFirst({
        where: {
          doctorId,
          date: todayStr,
          tokenNumber: updatedDoctor.currentToken,
          status: 'Pending',
        },
      });

      if (immediateBooking) {
        console.log(`\n============== 🔔 [AETHERA IMMEDIATE ALERT] ==============`);
        console.log(`TO: ${immediateBooking.patientPhone} (${immediateBooking.patientName})`);
        console.log(`MESSAGE: "Hi ${immediateBooking.patientName}, your token #${immediateBooking.tokenNumber} is NOW being served by ${doctor.name}. Please enter the consultation room."`);
        console.log(`==========================================================\n`);
      }

      // 2. Alert the patient who is nearing their turn (e.g. 2 tokens away)
      const alertLimitSetting = await prisma.clinicSettings.findUnique({
        where: { key: 'notifyOnToken' },
      });
      const alertLimit = alertLimitSetting ? Number(alertLimitSetting.value) : 2;

      const targetToken = updatedDoctor.currentToken + alertLimit;
      const warningBooking = await prisma.booking.findFirst({
        where: {
          doctorId,
          date: todayStr,
          tokenNumber: targetToken,
          status: 'Pending',
        },
      });

      if (warningBooking) {
        console.log(`\n============== 📱 [AETHERA QUEUE WARNING SMS] ==============`);
        console.log(`TO: ${warningBooking.patientPhone} (${warningBooking.patientName})`);
        console.log(`MESSAGE: "Hi ${warningBooking.patientName}, your token #${warningBooking.tokenNumber} with ${doctor.name} is coming up shortly. You are currently ${alertLimit} turns away from being served. Please proceed to the clinic lobby."`);
        console.log(`============================================================\n`);
      }
    } catch (notifyError) {
      console.error('Notification worker failure:', notifyError);
    }
    // --------------------------------------------------

    // Broadcast queue update to all SSE clients!
    await sseManager.broadcastQueueUpdate();

    return res.json({
      message: 'Queue advanced to next token',
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error('Advance queue error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/queue/status/:doctorId — Update doctor status (Admin only)
router.put('/status/:doctorId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status } = req.body;

    if (!['Serving', 'On Break', 'Coming Soon', 'Inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid doctor status value' });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: { status },
    });

    // Broadcast queue update to all SSE clients!
    await sseManager.broadcastQueueUpdate();

    return res.json({
      message: 'Doctor status updated successfully',
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error('Update doctor status error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
