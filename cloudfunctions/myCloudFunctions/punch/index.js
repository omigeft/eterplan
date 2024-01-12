const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
    try{
        let temp = await db.collection('userData').where({//获取用户的数据
            _openId: event._openId,
        }).get();
        let tempPunched = temp.data[0].punched;//获取用户的punched数据
        tempPunched.push(Number(new Date()));
        await db.collection('userData').where({//更新用户punched数据
            _openId: event._openId,
        }).update({
            data: {
                punched: tempPunched,
            }
        });
        return await db.collection('userData').where({
            _openId: event._openId,
        }).get();
    }catch(e){
      console.error(e);
    }
};
