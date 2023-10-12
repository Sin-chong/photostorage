const express = require('express');  
const mysql = require('mysql');  
  
const app = express();  
  
// 创建数据库连接  
const connection = mysql.createConnection({  
  host: 'localhost',  
  user: 'root',  
  password: 'root',  
  database: 'photo'  
});  
  
// 连接到数据库  
connection.connect((err) => {  
  if (err) throw err;  
  console.log('成功连接到数据库！');  
});  
  
// 处理图片检索请求  
app.get('/image/:id', (req, res) => {  
  const id = req.params.id;  
  const sql = 'SELECT image_data FROM image_data WHERE id = ?';  
  connection.query(sql, [id], (err, results) => {  
    if (err) {  
      res.sendStatus(500); // 内部服务器错误  
      return;  
    }  
    if (results.length > 0) {  
      const imageData = results[0].imageData;  
      res.setHeader('Content-Type', 'image/jpeg'); // 根据实际情况设置正确的MIME类型  
      res.send(imageData); // 将图片数据作为响应发送给前端  
    } else {  
      res.sendStatus(404); // 图片未找到，返回404状态码  
    }  
  });  
});  
  
// 监听3000端口，启动服务器  
app.listen(3000, () => {  
  console.log('服务器正在监听3000端口...');  
});