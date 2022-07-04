var express = require('express');
var router = express.Router();
const path=require("path");   
var fs = require('fs');
var multer  = require('multer');

// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, './public/image/upload');    
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

var uploadFolder = './public/image/upload';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({ storage: storage });

router.post("/uploads",upload.single("file"),(req,res)=>{
    //let imgFile=req.file;//获取图片上传的资源
    //var tmp=imgFile.path;//获取临时资源
    //let ext=path.extname(imgFile.originalname);//利用path模块获取 用户上传图片的 后缀名
    //let newName=""+(new Date().getTime())+Math.round(Math.random()*10000)+ext;  //给用户上传的图片重新命名 防止重名
    //let newPath="../public/upload/"+newName; //给图片设置存放目录  提前给当前文件夹下建立一个     ！！！！
    //let fileData=fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
    //fs.writeFileSync(path.join(__dirname,newPath),fileData);//重新书写图片文件  写入到指定的文件夹下
    res.send("写入图片成功!");//上传成功之后  给客户端响应
})

// 导出模块（在 app.js 中引入）
module.exports = router;
