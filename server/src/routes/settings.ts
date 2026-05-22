import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET all clinic settings
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.clinicSettings.findMany();
    
    // Map list of key-value records to a friendly flat object
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return res.json(settingsObj);
  } catch (error) {
    console.error('Fetch settings error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST save/update clinic settings (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const body = req.body; // Key-value map like { clinicName: 'Aethera', slotDuration: '12', notifyOnToken: '2' }

    for (const [key, value] of Object.entries(body)) {
      await prisma.clinicSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    return res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
