var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');

smtpTransport = nodemailer.createTransport({
    service: 'QQ',
    auth: {
        user: '1769096110@qq.com',//自己的QQ邮箱地址
        pass: 'pdyicmjsypomfaec'//使用自己的QQ邮箱申请一个，下边会有详细讲解
    }
});

//生成一个随机的六位数验证码
var MathRand=function(num){
    var Num = "";
    for (var i = 0; i < num; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}


/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function(recipient, subject, html) {

    smtpTransport.sendMail({

        from: '1769096110@qq.com',
        to: recipient,
        subject: subject,
        html: html

    }, function(error, response) {
        if (error) {
            console.log(error);
        }
        //console.log(response,'发送成功')
    });
    //console.log(randomNum);
}
exports.sendMail=sendMail;
exports.MathRand=MathRand;
//sendMail('770083376@qq.com', '重置密码', 'Hi 你好,验证码为:' + randomNum);
//参数：
//1.接收邮件的邮箱地址
//2.邮件的标题
//3.邮箱内容
