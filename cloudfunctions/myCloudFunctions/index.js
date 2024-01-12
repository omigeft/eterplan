const getOpenId = require('./getOpenId/index');
const readPassage = require('./readPassage/index');
const library = require('./library/index');
const selectUserData = require('./selectUserData/index');
const getServerDate = require('./getServerDate/index');
const chapterCatagory = require('./chapterCatagory/index');
const readChapter = require('./readChapter/index');
const getBook = require('./getBook/index');
const addBook = require('./addBook/index');
const removeBook = require('./removeBook/index');
const learnChapter = require('./learnChapter/index');
const forgetChapter = require('./forgetChapter/index');
const reviewChapter = require('./reviewChapter/index');
const discardChapter = require('./discardChapter/index');
const memoryRateChange = require('./memoryRateChange/index');
const punch = require('./punch/index');


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context);
    case 'readPassage':
      return await readPassage.main(event, context);
    case 'library':
      return await library.main(event, context);
    case 'selectUserData':
      return await selectUserData.main(event, context);
    case 'getServerDate':
      return await getServerDate.main(event, context);
    case 'chapterCatagory':
      return await chapterCatagory.main(event, context);
    case 'readChapter':
      return await readChapter.main(event, context);
    case 'getBook':
      return await getBook.main(event, context);
    case 'addBook':
      return await addBook.main(event, context);
    case 'removeBook':
      return await removeBook.main(event, context);
    case 'learnChapter':
      return await learnChapter.main(event, context);
    case 'forgetChapter':
      return await forgetChapter.main(event, context);
    case 'reviewChapter':
      return await reviewChapter.main(event, context);
    case 'discardChapter':
      return await discardChapter.main(event, context);
    case 'memoryRateChange':
      return await memoryRateChange.main(event, context);
    case 'punch':
      return await punch.main(event, context);
  }
};
