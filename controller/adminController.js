const db=require('../model/connection')

const objectid=require('objectid')

const AllProducts=async(req,res)=>{
    let products=await db.get().collection('products').find({status:'pending'}).toArray()
     products.length!==[]?res.status(200).json(products):res.status(404).json('No user requests')
}
const Action=(req,res)=>{
    db.get().collection('products').updateOne({_id:objectid(req.params.id)},{status:req.action}).then(()=>res.status(200).json('Succesfully changed status')).catch(()=>res.status(404).json('Error occured'))
}
module.exports={AllProducts,Action}