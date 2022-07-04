const express=require('express');
//const bcrypt=require('bcryptjs')
const router=express.Router();
//引入连接池模块
const pool=require('../pool.js');

//jwt
const jwt=require('jsonwebtoken')
const config=require('../config')
//注册用户
router.post('/register',(req,res)=>{
    const userInfo=req.body;
    const sql='select * from user where phone=?';
    pool.query(sql,userInfo.phone,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(!userInfo.phone||!userInfo.password){
            return res.send({
                status:'401',
                msg:'用户名或密码不合法'
            })
        }
        if(result.length>0){
            return res.send({
                status:401,
                msg:'手机号被占用，请更换手机号'
            })
        }else{
            insertSql='insert into user set ?'
            pool.query(insertSql,{phone:userInfo.phone,password:userInfo.password},(err,result)=>{
                if(err){
                    return res.send({
                        status:401,
                        msg:err.message
                    })
                }
                if(result.affectedRows!==1){
                    return res.send({
                        status:401,
                        msg:'注册失败，请稍后重试'
                    })
                }
                return res.send({
                    status:200,
                    msg:'注册成功'
                })
            })
        }
        //加密密码
        //userInfo.password=bcrypt.hashSync(userInfo.password,10);
        //console.log(userInfo);
    })
    
  
})

//登录
router.post('/login',(req,res)=>{
    const userInfo=req.body;
    const sql='select * from user where phone=?';
    pool.query(sql,userInfo.phone,(err,result)=>{
        if(err){
            return res.send({
                msg:err.message
            })
        }
        const user={...result[0],password:''};
        const tokenStr='Bearer '+jwt.sign(user,config.jwtSecretKey,{expiresIn:'10h'});
       // console.log(tokenStr);
        //判断密码是否正确
       if(result.length>0){
           if(result[0].password==userInfo.password){
            req.session.islogin =true;
            req.session.userInfo=userInfo;
            console.log('登陆成功',req.session.islogin)
               res.send({
                   msg:'登录成功',
                   status:200,
                   token:tokenStr
               })
              
           }else{
               res.send({
                    status:401,
                    msg:'用户名或密码错误'
               })
              
              
           }
       }else{
            res.send({
                status:402,
                msg:'用户不存在'
        })
       }
           
        
    })
   
   
})


//退出登录
router.post('/quit',(req,res)=>{
    req.session.islogin =false;
    console.log('退出登录', req.session.islogin)
    res.send({
        status:200,
        msg:'退出登录成功'
    })    
   
})

//判断登录状态
router.get('/getUserInfo',(req,res)=>{
    console.log('登录状态',req.session)
    if(!req.session.islogin){
        return res.send({
            status:500,
            msg:'用户身份验证失效，请重新登陆'
        })
    }else{
        res.send({
            status:200,
            data:req.session.user,
            msg:'获取用户信息成功'
        }) 
    }
  
})
//根据手机号查找用户信息
router.get('/findUser',(req,res)=>{
    const userInfo=req.query;
    const sql='select * from user where phone=?';
    let tokenVlaue=req.headers.authorization;
    pool.query(sql,userInfo.phone,(err,result)=>{
        if(err){
            return res.send({
                msg:err.message
            })
        }
        if(result.length>0){
            res.send({
                status:200,
                data:result,
                msg:'获取用户信息成功'
            }) 
           
        }else{
            res.send({
                status:201,
                msg:'查询失败',
                data:result
            })
        }
    })
  
    
})

//admin登录
router.get('/adminLogin',(req,res)=>{
    const userInfo=req.query;
    console.log(userInfo)
   
    if(userInfo.username=='admin'&&userInfo.password=='12345'){
        res.send({
            status:200,
            msg:'登录成功'
        })  
    }else{
        res.send({
            status:500,
            msg:'用户名或密码错误'
        }) 
    }
     
   
})

//查询用户表
router.get('/getUserList',(req,res)=>{
    const sql='select * from user';
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:500,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询用户列表成功！',
                    data:result
                })
            } 
    })
})
const path=require("path");   
var fs = require('fs');
var multer  = require('multer');

// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, './public/upload/');    
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, file.originalname);  
    }
});

// 创建文件夹
var createFolder = function(folder){
    try{
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder); 
    }catch(e){
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = './public/upload/';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({ storage: storage });

router.post("/uploads",upload.single("file"),(req,res)=>{
    let imgFile=req.file;//获取图片上传的资源
    var tmp=imgFile.path;//获取临时资源
    let ext=path.extname(imgFile.originalname);//利用path模块获取 用户上传图片的 后缀名
    let newName=""+(new Date().getTime())+Math.round(Math.random()*10000)+ext;  //给用户上传的图片重新命名 防止重名
    let newPath="../public/upload/"+newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
    let fileData=fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
    fs.writeFileSync(path.join(__dirname,newPath),fileData);//重新书写图片文件  写入到指定的文件夹下
    res.send("写入图片成功!");//上传成功之后  给客户端响应
})
   
module.exports=router