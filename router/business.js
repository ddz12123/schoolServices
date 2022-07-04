const express=require('express');
const bcrypt=require('bcryptjs')
const router=express.Router();
//引入连接池模块
const pool=require('../pool.js');

//jwt
const jwt=require('jsonwebtoken')
const config=require('../config');
const { query } = require('../pool.js');

//获取所有商家
router.get('/getAllBusiness',(req,res)=>{
    const sql='select * from business ';
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'获取商家信息成功！',
                    data:result
                })
            } 
    })

})
//获取所有商家综合排序
router.get('/getBusiness',(req,res)=>{
    const page_num = req.query.page_num //当前的num
    const page_size = req.query.page_size //当前页的数量
    const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    const sql='select * from business order by score desc limit ?,?';
    pool.query(sql,params,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'获取商家信息成功！',
                    data:result
                })
            } 
    })

})
//商家信息按销量排序
router.get('/getBusinessBymcount',(req,res)=>{
    const page_num = req.query.page_num //当前的num
    const page_size = req.query.page_size //当前页的数量
    const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    const sql='select * from business order by mcount desc limit ?,?';
    pool.query(sql,params,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'获取商家信息成功！',
                    data:result
                })
            } 
    })

})
//商家信息按距离排序
router.get('/getBusinessByrange',(req,res)=>{
    const page_num = req.query.page_num //当前的num
    const page_size = req.query.page_size //当前页的数量
    const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    const sql='select * from business order by ranges  limit ?,?';
    pool.query(sql,params,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'获取商家信息成功！',
                    data:result
                })
            } 
    })

})

//获取猜你喜欢列表
router.get('/getAllLikesList',(req,res)=>{
    const page_num = req.query.page_num //当前的num
    const page_size = req.query.page_size //当前页的数量
    const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    const sql='select * from likes order by lid desc limit ?,?'
    pool.query(sql,params,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'获取猜你喜欢列表成功！',
                    data:result
                })
            } 
    })

})
//获取每日推荐列表
router.get('/getAllRecomendList',(req,res)=>{
    const sql='select * from recomend'
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'获取每日推荐列表成功！',
                    data:result
                })
            } 
    })

})
//根据uid查询用户信息
router.get('/getInfoById',(req,res)=>{
    const params=req.query;
    const sql='select * from user where uid=?'
    pool.query(sql,params.id,(err,result)=>{
        if(err){
            return res.send({
                msg:'查询失败',
                status:401
            })
        }
        if(result.length>0){
            return res.send({
                msg:'查询成功',
                status:200,
                data:result
            })
        }
    })
})
//获取优惠列表
router.get('/getAllDiscountList',(req,res)=>{
    const sql='select * from discount'
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'获取优惠列表成功！',
                    data:result
                })
            } 
    })

})

//根据id查询推荐列表详情
router.get('/getRecomendById',(req,res)=>{
    const sql='select * from recomend where rid=?';
    const params=req.query;
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
                    msg:'查询推荐详情成功！',
                    data:result
                })
            } 
    })

})
//根据id查询优惠列表详情
router.get('/getDiscountById',(req,res)=>{
    const sql='select * from discount where did=?';
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
                    msg:'查询优惠详情成功！',
                    data:result
                })
            } 
    })

})
//根据id查询猜你喜欢列表详情
router.get('/getLikesById',(req,res)=>{
    const sql='select * from likes where lid=?';
    const params=req.query;
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
                    msg:'查询详情成功！',
                    data:result
                })
            } 
    })

})
//查询新闻列表
router.post('/getNewList',(req,res)=>{
    const sql="select * from news where cate=?";
    const params=req.body;
    pool.query(sql,params.cate,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询新闻成功！',
                    data:result
                })
            } 
    })

})

//根据id查新闻详情
router.post('/getNewById',(req,res)=>{
    const sql="select * from news where nid=?";
    const params=req.body;
    pool.query(sql,params.nid,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询新闻成功！',
                    data:result
                })
            } 
    })

})

//获取失物招领列表
router.get('/getLostList',(req,res)=>{
    const page_num = req.query.page_num //当前的num
    const page_size = req.query.page_size //当前页的数量
    const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    const sql='select * from lost where flag=0 order by gid desc limit ?,?';
    pool.query(sql,params,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询失物招领列表成功！',
                    data:result
                })
            } 
    })

})

//根据gid查询失物招领列表
router.get('/getLostListById',(req,res)=>{
    const sql='select * from lost where gid=? order by gid desc';
    pool.query(sql,req.query.gid,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询失物招领列表成功！',
                    data:result
                })
            } 
    })

})
//根据分类查询失物招领列表
router.get('/getLostListBySort',(req,res)=>{
    const sql='select * from lost where sort=? order by gid desc';
    pool.query(sql,req.query.sort,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询失物招领列表成功！',
                    data:result
                })
            } 
    })

})

//查询求购表列表
router.get('/getLookingList',(req,res)=>{
    const sql='select * from lookgoods,user where lookgoods.uid=user.uid order by lid desc';
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询求购列表成功！',
                    data:result
                })
            } 
    })

})

//添加求购信息
router.post('/addLookingList',(req,res)=>{
    let params = req.body;
    const sql=`INSERT INTO lookgoods(title, content, cTime,uid) VALUES('${params.title}', '${params.content}', '${params.cTime}','${params.uid}')`;
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'添加求购信息成功！',
                    data:result
                })
            } 
    })
})
//添加失物
router.post('/addLostThings',(req,res)=>{
    let params = req.body;
    const sql=`INSERT INTO lost(title, content, publishTime,name,sort,area,imgList,phone,email,state) VALUES('${params.title}', '${params.content}', '${params.publishTime}','${params.name}','${params.sort}','${params.area}','${params.img}','${params.phone}','${params.email}','${params.state}')`;
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
                    msg:'添加登记成功！',
                    data:result
                })
            } 
    })

})
//获取分类信息
router.get('/getSortList',(req,res)=>{
    const sql='select * from sort';
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询分类列表成功！',
                    data:result
                })
            } 
    })

})

//根据分类id查询分类信息
router.get('/getSortListById',(req,res)=>{
    const params=req.query;
    const sql='select * from sort where sid=?';
    pool.query(sql,params.sid,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询分类详情成功！',
                    data:result
                })
            } 
    })

})

//获取闲置列表
router.get('/getSecondList',(req,res)=>{
    const sql='select * from secondhand,user where secondhand.uid=user.uid order by hid desc' ;
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询闲置列表成功！',
                    data:result
                })
            } 
    })

})

//添加闲置信息
router.post('/addSecondhand',(req,res)=>{
    let params = req.body;
    const sql=`INSERT INTO secondhand(title, content, cTime,uid,imglist,price) VALUES('${params.title}', '${params.content}', '${params.cTime}','${params.uid}','${params.imglist}','${params.price}')`;
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'添加闲置信息成功！',
                    data:result
                })
            } 
    })

})

//校园墙列表
router.get('/getWallList',(req,res)=>{
    const sql='select * from wall,user WHERE wall.uid=user.uid order by date desc';
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询校园墙列表成功！',
                    data:result
                })
            } 
    })

})

//根据ID获取校园墙详情
router.get('/getWallListByID',(req,res)=>{
    const sql='select * from wall,user WHERE wall.uid=user.uid and wall.wid=?';
    pool.query(sql,req.query.id,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询校园墙列表成功！',
                    data:result
                })
            } 
    })

})

//获取相应的留言列表
router.get('/getMsgListByID',(req,res)=>{
    const sql='select * from message,user WHERE message.uid=user.uid  and message.oid=? order by time desc';
    pool.query(sql,req.query.id,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询留言成功！',
                    data:result
                })
            } 
    })

})

//添加校园墙
router.post('/addWall',(req,res)=>{
    let params = req.body;
    const sql=`INSERT INTO wall(uid,title, content, date,imglist) VALUES('${params.uid}', '${params.title}', '${params.content}','${params.date}','${params.imglist}')`;
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'添加校园墙成功！',
                    data:result
                })
            } 
    })

})

//跳蚤市场出闲置模糊查询
router.get('/cxzsearch',(req,res)=>{
    const sql=`select * from secondhand,user where content like "%${req.query.item}%" and secondhand.uid=user.uid`;
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'出闲置搜索成功',
                    data:result
                })
            } 
    })

})

//跳蚤市场求购闲置模糊查询
router.get('/qxzsearch',(req,res)=>{
    const sql=`select * from lookgoods,user where content like "%${req.query.item}%" and lookgoods.uid=user.uid order by lid desc`;
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'求闲置搜索成功',
                    data:result
                })
            } 
    })

})
//失物招领页面搜索
router.get('/lostsearch',(req,res)=>{
    const sql=`select * from lost where content like "%${req.query.item}%"`;
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'搜索成功',
                    data:result
                })
            } 
    })

})
//获取学校新闻
router.get('/getNoticelist',(req,res)=>{
    const sql='select * from notic order by date desc';
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
                    msg:'查询列表成功！',
                    data:result
                })
            } 
    })
})
//根据id获取新闻详情
router.get('/getNoticelistByID',(req,res)=>{
    const sql='select * from notic where nid=?';
    pool.query(sql,req.query.id,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询列表成功！',
                    data:result
                })
            } 
    })
})



module.exports=router