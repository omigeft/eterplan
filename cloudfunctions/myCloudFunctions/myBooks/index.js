const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
    try{
        let tempBook = await db.collection('userData').where({
            _openId: event._openId,
        }).get();
        return tempBook.data[0].book;
    }catch(e){
        console.error(e);
    }
};
