const express=require('express');
const bcrypt=require('bcryptjs')
const router=express.Router();
//引入连接池模块
const pool=require('../pool.js');

//jwt
const jwt=require('jsonwebtoken')
const config=require('../config')

//验证码
// 在接口方法中使用
// 引入模块
const email=require('../email.js')


//获取用户密码
router.post('/getPwd',(req,res)=>{
    const userInfo=req.body;
    const sql='select password from user where username=?';
    pool.query(sql,userInfo.username,(err,result)=>{
        if(err){
            return res.send({
                msg:err.message
            })
        }
        if(result.length>0){
            return res.send({
                data:result
            })
        }
    })
})
//修改用户密码
router.put('/updatePwd',(req,res)=>{
    const userInfo=req.body;
    const sql='update user set password=? where phone=?';
    pool.query(sql,[userInfo.password,userInfo.phone],(err,result)=>{
        if(err){
            return res.send({
                msg:"修改失败，请稍后重试"
            })
        }
        if(result){
            return res.send({   
                status:201,
                data:result,
                msg:'修改密码成功'
            })
        }
    })
})
//修改多个数据
router.put('/updateUser',(req,res)=>{
    const userInfo=req.body;
    const sql='update user set username=?,sex=?,email=? where phone=?';
    pool.query(sql,[userInfo.username,userInfo.sex,userInfo.email,userInfo.phone],(err,result)=>{
        if(err){
            return res.send({
                msg:"修改失败，请稍后重试"
            })
        }
        if(result){
            return res.send({
                status:201,
                data:result,
                msg:'修改成功'
            })
        }
    })
})
//发送验证码
    function MathRand(num) {
        var Num = "";
        for (var i = 0; i < num; i++) {
            Num += Math.floor(Math.random() * 10);
        }
        return Num;
    }

    router.post('/sendCode',(req,res) => {
        let params=req.body;
        let code=email.MathRand(6);
        if(res){
            email.sendMail(params.email, '重置密码', 'Hi 你好,你的验证码为:' +code);
            return res.send({
                msg:'发送验证码成功',
                data:code
            })
            
        }

         
      });
    //修改头像
router.put('/upic',(req,res)=>{
    let ava=req.body.pic;
    pool.query('update user set  pic=? where phone=?',[ava,req.body.phone],(err,result)=>{
      if(err){
          console.log(err);
          res.send({code:500,msg:'服务器端错误'});
          return;
        }
      console.log(result);
        //通过result下的affectedRows判断是否成功，如果是0表示失败
        if(result.affectedRows===0){
          res.send({code:201,msg:'修改失败'});
        }else{
          res.send({code:200,msg:'修改成功'});
        }
    });
 });

 //查询用户收货地址 根据用户id
 router.get('/getAddressById',(req,res)=>{
    const sql='select * from address where uid=?';
    const params=req.body;
    pool.query(sql,params.id,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询地址成功！',
                    data:result
                })
            } 
    })

})

//找回密码


module.exports=router