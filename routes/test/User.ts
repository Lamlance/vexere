// import express, {Request, Response} from 'express';
// import { prisma } from '../../server';

// const userData:{
//   id: number;
//   Name: string;
//   email: string | null;
//   phone: string;
// }[] = [{"id":1,"Name":"rburges0","email":null,"phone":"125-268-2451"},
// {"id":2,"Name":"gdegoey1","email":"sjambrozek1@umich.edu","phone":"510-155-2831"},
// {"id":3,"Name":"mgillbard2","email":"raloshechkin2@devhub.com","phone":"351-527-5732"},
// {"id":4,"Name":"ghardin3","email":null,"phone":"876-514-3533"},
// {"id":5,"Name":"dbentall4","email":null,"phone":"416-966-2580"},
// {"id":6,"Name":"wgarard5","email":"ksitlinton5@edublogs.org","phone":"760-128-2993"},
// {"id":7,"Name":"jlalonde6","email":"gdrewitt6@shareasale.com","phone":"429-531-6073"},
// {"id":8,"Name":"bgooble7","email":"eshekle7@redcross.org","phone":"488-890-2704"},
// {"id":9,"Name":"dallridge8","email":"sstenyng8@spiegel.de","phone":"122-759-3595"},
// {id:10,Name:"HoangLam",email:"bruhlance@lolol.com",phone:"122-420-6969"}
// ]

// const routeGenerate = async (req:Request,res:Response)=>{
//   if(req.method !== "GET"){
//     res.status(200).json({error:"Plese use a GET method"});
//     return;
//   }

//   const {password} = req.query;
//   console.log(password);

//   if(!password || password !== "vexere123"){
//     res.status(200).json({
//       error:"Invalid request params",
//       input: password ? password : "Unknow"
//     });
//     return;
//   }

//   await prisma.$connect();
//   const createResult = await prisma.user.createMany({
//     data:userData,
//     skipDuplicates:true
//   });
  
//   res.status(200).json({
//     insertCount: createResult.count
//   });
// }