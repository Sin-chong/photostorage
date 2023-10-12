const express = require('express');  
const mysql = require('mysql');  
const fs = require('fs');  
const multer = require('multer');  
  
const app = express();  
  
// 创建数据库连接  
const connection = mysql.createConnection({  
  host: 'localhost',  
  user: 'root',  
  password: 'root',  
  database: 'images'  
});  
  
// 连接到数据库  
connection.connect((err) => {  
  if (err) throw err;  
  console.log('成功连接到数据库！');  
});  
  
// 配置 Multer 中间件以处理文件上传  
const storage = multer.diskStorage({  
  destination: (req, file, cb) => {  
    cb(null, 'uploads/'); // 指定上传目录为 "uploads/"  
  },  
  filename: (req, file, cb) => {  
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]); // 自定义文件名  
  }  
});  
const upload = multer({ storage: storage });  
  
// 处理图片上传请求  
app.post('/upload', upload.single('image'), (req, res) => {  
  if (!req.file) {  
    res.sendStatus(400); // 错误的请求格式，返回400状态码  
    return;  
  }  
  const imageData = fs.readFileSync(req.file.path); // 读取上传的图片数据  
  const sql = 'INSERT INTO image_data (imageData) VALUES (?)'; // 插入图片数据的SQL语句  
  connection.query(sql, [imageData], (err, result) => {  
    if (err) {  
      res.sendStatus(500); // 内部服务器错误，返回500状态码  
      return;  
    } else {  
      res.sendStatus(200); // 图片上传成功，返回200状态码  
    }  
  });  
});  
  
// 处理图片检索请求  
app.get('/image/:imageId', (req, res) => {  
    const imageId = req.params.imageId; // 获取图片ID参数  
    connection.query(`SELECT imageData FROM image_data WHERE id=${imageId}`, (err, results) => {  
      if (err) {  
        console.error('Error:', err); // 打印错误信息  
        res.sendStatus(500); // 内部服务器错误，返回500状态码  
        return;  
      } else if (results.length === 0) {  
        res.sendStatus(404); // 图片不存在，返回404状态码  
        return;  
      }  
      const imageData = results[0].imageData; // 获取图片数据  
      console.log('ImageData:', imageData); // 打印图片数据  
      res.setHeader('Content-Type', 'image/jpeg'); // 设置响应头为JPEG图片  
      res.send(imageData); // 发送图片数据
    });  
  });
  
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });
// 监听端口  
app.listen(3000, () => {  
  console.log('服务器正在监听3000端口...');  
});