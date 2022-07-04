const express=require('express');
const bcrypt=require('bcryptjs')
const router=express.Router();
//引入连接池模块
const pool=require('../pool.js');

//jwt
const jwt=require('jsonwebtoken')
const config=require('../config');
const { query } = require('../pool.js');

//查询笔记列表（已完成）
router.get('/getNoteList',(req,res)=>{
    const sql='select * from notes where status=2 and uid=? order by id desc';
    pool.query(sql,req.query.uid,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询笔记列表成功！',
                    data:result
                })
            } 
    })

})

//查询草稿
router.get('/getDarft',(req,res)=>{
    const sql='select * from notes where status=0 and uid=? order by id desc';
    pool.query(sql,req.query.uid,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询笔记列表成功！',
                    data:result
                })
            } 
    })

})

//获取全部列表
router.get('/getAllNote',(req,res)=>{
    const sql='select * from notes where  uid=? order by id desc';
    pool.query(sql,req.query.uid,(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询笔记列表成功！',
                    data:result
                })
            } 
    })
})

//添加笔记
router.put('/addNote',(req,res)=>{
    const info=req.body;
    const sql=`insert into notes set ?`;
    pool.query(sql,{content:info.content,time:info.time,status:info.status,uid:info.uid,title:info.title,author:info.author},(err,result)=>{
        if(err){
            return res.send({
                status:400,
                msg:'添加失败'
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'添加成功！',
                    data:result
                })
            }
    })
})

//模糊查询笔记
router.get('/getNoteSearch',(req,res)=>{
    const sql=`select * from notes where content like "%${req.query.item}%"  and  uid=? order by id desc`;
    pool.query(sql,req.query.uid,(err,result)=>{
        if(err){
            return res.send({
                status:500,
                msg:'搜索失败'
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

//添加留言
router.put('/addMsg',(req,res)=>{
    const info=req.body;
    const sql=`insert into message set ?`;
    pool.query(sql,{oid:info.oid,time:info.time,content:info.content,uid:info.uid},(err,result)=>{
        if(err){
            return res.send({
                code:500,
                msg:'添加失败',
                data:err
            })
        }
        if(result){
                return res.send({
                    code:200,
                    msg:'添加成功！',
                    data:result
                })
            }
    })
})

//我发布的校园墙
router.get('/myWallList',(req,res)=>{
    const sql='select * from wall where uid=? order by wid desc';
    pool.query(sql,req.query.uid,(err,result)=>{
        if(err){
            return res.send({
                status:500,
                msg:'搜索失败'
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
//我发布的出闲置
router.get('/mySecondList',(req,res)=>{
    const sql='select * from secondhand where uid=? order by hid desc';
    pool.query(sql,req.query.uid,(err,result)=>{
        if(err){
            return res.send({
                status:500,
                msg:'搜索失败'
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
//我发布的求闲置
router.get('/myLookgoodsList',(req,res)=>{
    const sql='select * from lookgoods where uid=? order by lid desc';
    pool.query(sql,req.query.uid,(err,result)=>{
        if(err){
            return res.send({
                status:500,
                msg:'搜索失败'
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
//我发布的失物招领
router.get('/myLostList',(req,res)=>{
    const sql='select * from lost where phone=? order by gid desc';
    pool.query(sql,req.query.phone,(err,result)=>{
        if(err){
            return res.send({
                status:500,
                msg:'搜索失败'
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

//删除求闲置
router.delete('/deleteLooksByID',(req,res)=>{
    const sql='delete from lookgoods where lid=?';
    pool.query(sql,req.body.id,(err,result)=>{
        if(err){
            return res.send({
                status:500,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'删除成功！',
                    data:result
                })
            } 
    })
})
//删除出闲置
router.delete('/deleteSecondByID',(req,res)=>{
    const sql='delete from secondhand where hid=?';
    pool.query(sql,req.body.id,(err,result)=>{
        if(err){
            return res.send({
                status:500,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'删除成功！',
                    data:result
                })
            } 
    })
})
//删除失物招领
router.delete('/deleteLostByID',(req,res)=>{
    const sql='delete from lost where gid=?';
    pool.query(sql,req.body.id,(err,result)=>{
        if(err){
            return res.send({
                status:500,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'删除成功！',
                    data:result
                })
            } 
    })
})
//删除校园墙
router.delete('/deleteWallByID',(req,res)=>{
    const sql='delete from wall where wid=?';
    pool.query(sql,req.body.id,(err,result)=>{
        if(err){
            return res.send({
                status:500,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'删除成功！',
                    data:result
                })
            } 
    })
})
//根据id查笔记详情
router.get('/getNoteByID',(req,res)=>{
    const sql='select * from notes where id=?';
    pool.query(sql,req.query.id,(err,result)=>{
        if(err){
            return res.send({
                status:500,
                msg:'搜索失败'
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'查询成功',
                    data:result
                })
            } 
    })

})

//根据ID删除笔记
router.delete('/deleteNoteByID',(req,res)=>{
    const sql='delete from notes where id=?';
    pool.query(sql,req.body.id,(err,result)=>{
        if(err){
            return res.send({
                status:500,
                msg:err.message
            })
        }
        if(result){
                return res.send({
                    status:200,
                    msg:'删除成功！',
                    data:result
                })
            } 
    })
})
//首页模糊查询
router.get('/indexsearch',(req,res)=>{
    const sql=`select * from lost where title like "%${req.query.item}%" or content like "%${req.query.item}%"`;
    pool.query(sql,(err,result)=>{
        if(err){
            return res.send({
                status:500,
                msg:err.message
            })
        }
        if(result){
            if(req.query.item!=''){
                 return res.send({
                    status:200,
                    msg:'出搜索成功',
                    data:result
                })
            }else{
                return res.send({
                    status:201,
                    msg:'搜索内容为空',
                    data:[]
                })
            }
               
            } 
    })

})

module.exports=router