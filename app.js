const express=require('express');

//config
const config=require('./config');
//jwt
const jwt=require('jsonwebtoken');
const expressJWT=require('express-jwt')

//路由分发
const userRouter=require('./router/user.js');
const accountRouter=require('./router/account.js')
const businessRouter=require('./router/business.js')
const otherRouter=require('./router/other.js')

//session中间件
const session=require('express-session');
//multer
const multer  = require('multer');
const upload=require('./router/upload.js');
//const proRouter=require('./routerpro.js');
//引入body-parser中间件模块
const bodyParser=require('body-parser');

//创建WEB服务器
const app=express();

app.use(expressJWT({secret:config.jwtSecretKey,algorithms:['HS256']}).unless({path:[/^\/users\//,/^\/public\//,/^\/bus\//,/^\/upload\//]}));
const verifyToken = function (token) {
  try {
    let tokenKey = jwt.verify(token, key)
    return {
      code: 200,
      msg: '校验成功',
      tokenKey,
    }
  } catch {
    return {
      code: 100,
      msg: '校验失败'
    }
  }
}

app.use((err, req, res, next)=>{
  //获取header中的token，并验证
  if(req.headers.authorization){
    const flag=verifyToken(req.headers.authorization)
    //验证失败
    if(!flag){
        res.send({status:'token过期'});
        //console.log(res);

    }
    if (err.status == 401) {   
      res.status(401).send({status:'token过期'});
     console.log(err);
  }
  if(err){
      res.status(500).send({status:'token过期'});
  }

}
//验证成功继续
  next()

})
//引入用户路由器

//托管静态资源到public目录
app.use( express.static('./public') );
//图片加载,存储在public/image下的所有图片
app.get('/public/image/*', function (req, res) {
  res.sendFile( __dirname + "/" + req.url );
  //console.log("Request for " + req.url + " received.");
})

//使用body-parser中间件，将post请求的数据解析为对象
app.use(bodyParser.urlencoded({
  extended:false
}));
  //session
  app.use(session({
    secret: 'keyboard cat',//设置签名秘钥  内容可以任意填写
    resave: true,//强制保存，如果session没有被修改也要重新保存
    saveUninitialized: true,//如果原先没有session那么就设置，否则不设置
    cookie: {maxAge:30*60*24*1000 }//设置cookie的过期时间，例：80s后session和相应的cookie失效过期

}));
// 允许跨域访问
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
});

//cors解决跨域
const cors=require('cors');
app.use(cors());

//解决端口跨域

const { createProxyMiddleware  } = require('http-proxy-middleware')

// 对/api开头请求进行转发处理
app.use('/api', createProxyMiddleware({ 
	// 转发到5500端口
	target: 'http://127.0.0.1:5500',
	// 转发时重写路径
	pathRewrite: {'^/api' : ''},
	changeOrigin: true })
  );

//设置端口
app.listen(5500,()=>{
  console.log("service running at http://127.0.0.1:5500");
});


//挂载路由器，添加前缀/users
app.use('/users',userRouter);
app.use('/account',accountRouter);
app.use('/upload',upload);
app.use('/bus',businessRouter)
app.use('/other',otherRouter)