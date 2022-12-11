import { prisma } from '../../server';
const routeData = [
    {
        id: 1,
        startlocation: 5,
        endlocation: 7
    },
    {
        id: 2,
        startlocation: 7,
        endlocation: 5
    },
    {
        id: 3,
        startlocation: 5,
        endlocation: 8
    },
    {
        id: 4,
        startlocation: 8,
        endlocation: 5
    },
    {
        id: 5,
        startlocation: 5,
        endlocation: 9
    },
    {
        id: 6,
        startlocation: 9,
        endlocation: 5
    },
    {
        id: 7,
        startlocation: 1,
        endlocation: 3
    },
    {
        id: 8,
        startlocation: 3,
        endlocation: 1
    },
    {
        id: 9,
        startlocation: 2,
        endlocation: 4,
    },
    {
        id: 10,
        startlocation: 4,
        endlocation: 2
    }
];
const routeGenerate = async (req, res) => {
    if (req.method !== "GET") {
        res.status(200).json({ error: "Plese use a GET method" });
        return;
    }
    const { password } = req.query;
    console.log(password);
    if (!password || password !== "vexere123") {
        res.status(200).json({
            error: "Invalid request params",
            input: password ? password : "Unknow"
        });
        return;
    }
    await prisma.$connect();
    const createResult = await prisma.route.createMany({
        data: routeData,
        skipDuplicates: true
    });
    res.status(200).json({
        insertCount: createResult.count
    });
};
export default routeGenerate;
export { routeData };
