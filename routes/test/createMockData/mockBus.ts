import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../server';

const busData = [
  { "id": 1, "plate": "WBAYB6C53FG161804", "seatAmount": 19, "type": 2, "busHouse": 2 },
  { "id": 2, "plate": "3N1AB7AP0FY078430", "seatAmount": 23, "type": 3, "busHouse": 1 },
  { "id": 3, "plate": "KNAFK4A67F5321976", "seatAmount": 16, "type": 1, "busHouse": 1 },
  { "id": 4, "plate": "2C3CCAAG5EH328818", "seatAmount": 36, "type": 3, "busHouse": 2 },
  { "id": 5, "plate": "5NPEB4AC8BH815567", "seatAmount": 21, "type": 1, "busHouse": 1 },
  { "id": 6, "plate": "5J8TB3H58EL523685", "seatAmount": 35, "type": 1, "busHouse": 1 },
  { "id": 7, "plate": "KNADM5A39D6068518", "seatAmount": 29, "type": 2, "busHouse": 2 },
  { "id": 8, "plate": "1D7RE5GK1BS454204", "seatAmount": 36, "type": 3, "busHouse": 2 }
]

const busGenerate = async (req: Request, res: Response) => {

  if (req.query && req.query.password && req.query.password === "vexere123") {
    await prisma.$connect();
    const inserted = await prisma.bus.createMany({
      data: busData,
      skipDuplicates: true
    });

    res.status(200).json({
      busCreated: inserted.count
    });
    return;
  }

  res.status(200).json({
    error: "Wrong queuery params"
  })
}

export default busGenerate;