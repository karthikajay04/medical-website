import { Response } from 'express';
import prisma from '../lib/prisma.js';

class SSEManager {
  private clients: Response[] = [];

  // Register a new client connection
  public async registerClient(res: Response) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    this.clients.push(res);

    // Stream initial data to this client immediately
    try {
      const doctors = await this.getQueueData();
      res.write(`data: ${JSON.stringify(doctors)}\n\n`);
    } catch (error) {
      console.error('Error fetching initial queue data for client:', error);
    }

    // Remove client when connection closes
    res.on('close', () => {
      this.clients = this.clients.filter(client => client !== res);
    });
  }

  // Broadcast the latest queue data to all connected clients
  public async broadcastQueueUpdate() {
    try {
      const doctors = await this.getQueueData();
      const payload = `data: ${JSON.stringify(doctors)}\n\n`;
      this.clients.forEach(client => {
        client.write(payload);
      });
    } catch (error) {
      console.error('Error broadcasting queue updates:', error);
    }
  }

  // Private helper to get queue information from the database
  private async getQueueData() {
    // Fetch all doctors with their token information
    const doctors = await prisma.doctor.findMany({
      orderBy: { name: 'asc' },
    });

    // Map database model to queue representation
    const todayStr = new Date().toISOString().split('T')[0];
    const queueData = await Promise.all(
      doctors.map(async (doc) => {
        // Calculate total pending bookings for this doctor for today
        const pendingCount = await prisma.booking.count({
          where: {
            doctorId: doc.id,
            date: todayStr,
            status: 'Pending',
          },
        });

        // Let's count completed/cancelled bookings too to get total tokens allocated today
        const totalAllocatedToday = await prisma.booking.count({
          where: {
            doctorId: doc.id,
            date: todayStr,
          },
        });

        return {
          id: doc.id,
          name: doc.name,
          specialization: doc.specialty,
          currentToken: doc.currentToken,
          totalTokens: totalAllocatedToday,
          status: doc.status,
          type: doc.type,
          image: doc.image,
        };
      })
    );

    return queueData;
  }
}

export const sseManager = new SSEManager();
