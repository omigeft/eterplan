const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
    try{
        let temp = await db.collection('userData').where({//获取用户的book数据
            _openId: event._openId,
        }).get();
        let tempBook = temp.data[0].book;
        let theBookIndex = tempBook.findIndex((item) => {
            return item.set == event.bookName;
        });
        let theChapterIndex = tempBook[theBookIndex].status.findIndex((item) => {
            return item.name == event.chapterName;
        });
        tempBook[theBookIndex].status[theChapterIndex].reviewTime.push(
            Number(new Date())
        );
        await db.collection('userData').where({//更新用户book数据
            _openId: event._openId,
        }).update({
            data: {
                book: tempBook,
            }
        });
        return await db.collection('userData').where({
            _openId: event._openId,
        }).get();
    }catch(e){
      console.error(e);
    }
};
