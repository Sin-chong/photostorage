const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'photo',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});


app.post('/upload', function(req, res){  
  // 你的处理代码  
  res.sendStatus(200);
});

// 添加这行代码来提供静态文件  
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/page1.html');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

/* 退出网页关闭数据库 */
app.get('/exit', (req, res) => {
  connection.end((err) => {
    if (err) {
      console.error('Error closing database connection: ' + err.stack);
      return;
    }
    console.log('Database connection closed.');
  })
});