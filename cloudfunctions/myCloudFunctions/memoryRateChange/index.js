const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  try{
      console.log(event);
    return await db.collection('userData').where({//更新用户book数据
        _openId: event._openId,
    }).update({
        data: {
            ratedMemoryRate: event.value,
        }
    });
  }catch(e){
    console.error(e);
  }
};
