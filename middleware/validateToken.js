const jwt=require('jsonwebtoken')


const validateToken=async(req,res,next)=>{
    let header=req.headers['authorization']
    if(header && header.startsWith('Bearer'))
    {
        token=header.split(' ')[1].toString()
       if(token){ jwt.verify(token,process.env.SECRET,(err,valid)=>{
     
        if(err)
        res.status(404).json("Authoisation failed")
        else
        {
console.log(valid.EmailExists);
req.id=valid.EmailExists._id
        next()
     
    console.log('success');}
       })
       }
    }
}
module.exports=validateToken