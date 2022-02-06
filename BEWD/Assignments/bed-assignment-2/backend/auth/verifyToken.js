const jwt=require('jsonwebtoken');

const config=require('../config.js');

function verifyToken(req,res,next){
    let token=req.headers['authorization']; //retrieve authorization header’s content
    if(!token || !token.includes('Bearer')){ //process the token
        res.status(403);
        return res.send({auth:'false',message:'Not authorized!'});
    }else{
        token=token.split('Bearer ')[1]; //obtain the token’s value
        jwt.verify(token,config.key,function(err,decoded){//verify token
            if (err){
                res.status(403);
                return res.end({auth:false,message:'Not authorized!'});
            }else{
                req.userid=decoded.userid; //decode the userid and store in req for use
                req.type=decoded.type;
                next();
            }

        });
    }

}

module.exports=verifyToken;
