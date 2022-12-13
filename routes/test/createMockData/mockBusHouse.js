import { prisma } from '../../../server';
const busHouseData = [
    { "Name": "Mayer, Mayer and Jerde", "id": 1 },
    { "Name": "Green-Murazik", "id": 2 },
    { "Name": "Vandervort, Crona and Boyle", "id": 3 }
];
const busHouseGenerate = async (req, res) => {
    if (req.query && req.query.password && req.query.password === "vexere123") {
        await prisma.$connect();
        const inserted = await prisma.busHouse.createMany({
            data: busHouseData,
            skipDuplicates: true
        });
        res.status(200).json({
            busHouseCreated: inserted.count
        });
        return;
    }
    res.status(200).json({
        error: "Wrong queuery params"
    });
};
export default busHouseGenerate;
