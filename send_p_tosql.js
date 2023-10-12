const fs = require('fs');  
const mysql = require('mysql');  
  
// 创建数据库连接  
const connection = mysql.createConnection({  
  host: 'localhost', // 数据库服务器地址  
  user: 'root', // 数据库用户名  
  password: 'root', // 数据库密码  
  database: 'photo', // 数据库名称  
  connectTimeout: 30000, // 连接超时时间（单位：毫秒）  
  socketTimeout: 30000 // Socket超时时间（单位：毫秒）  
});  
  
// 连接到数据库  
connection.connect((err) => {  
  if (err) {  
    console.error('连接数据库失败:', err);  
    return;  
  }  
  console.log('成功连接到数据库！');  
});  
  
const img_path = './public/img/bk.jpg';  
  
// 读取图片文件  
fs.readFile(img_path, (err, img_data) => {  
  if (err) {  
    console.error('读取图片文件失败:', err);  
    return;  
  }  
  
  // 插入图片数据到数据库  
  const sql = 'INSERT INTO images (image_data) VALUES (?)';  
  connection.query(sql, [img_data], (err, result) => {  
    if (err) {  
      console.error('插入图片数据失败:', err);  
      return;  
    }  
    console.log('成功插入图片数据！', result);  
  
    // 关闭数据库连接  
    connection.end((err) => {  
      if (err) {  
        console.error('关闭数据库连接失败:', err);  
      } else {  
        console.log('数据库连接已关闭。');  
      }  
    });  
  });  
});