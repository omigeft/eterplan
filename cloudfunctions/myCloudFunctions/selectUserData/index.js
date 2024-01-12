const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
    try{
        let res = await db.collection('userData').where({
            _openId: event._openId,
        }).count();
        if (res.total == 0){
            await db.collection('userData').add({
                data: {
                    _openId: event._openId,
                    book: [],
                    ratedMemoryRate: 0.6,
                    punched: [],
                }
            })
        }
        return await db.collection('userData').get({
            _openId: event._openId,
        });
    }catch(e){
        console.error(e);
    }
};
