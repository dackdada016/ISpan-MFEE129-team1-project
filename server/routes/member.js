const express = require('express');
const db = require('../modules/connect-mysql');
const upload = require('../modules/upload-img');
const moment = require('moment-timezone');
const bcrypt = require('bcryptjs')


const router = express.Router();

//針對此模組的頂層 ; 經過路由前，會先經過此middleware
//url, baseUrl, originalUrl 要在這裡拿，若在index那裡拿，originalUrl會一樣，但url & baseUrl會不同 
router.use((req, res, next)=>{
  const{url, baseUrl, originalUrl} = req;
  res.locals={...res.locals,url, baseUrl, originalUrl};
  //不能使用-> res.locals.url = url (會將先前在index設定的middleware排除)
  
  //都要先經過登入才可以看=>擋住所有路由
  // if(!req.session.user){
  //   req.session.lastPage = res.originalUrl;
  //   return res.redirect('/login');
  // }
  next();
});

//呈現會員表單(m-list)
const getListData = async(req, res)=>{ 
  let page = +req.query.page || 1;
  //用戶想要看第幾頁 //加號->轉換成數值

  if(page<1){
    return res.redirect(req.baseUrl+trq.url); //頁面轉向
  }
  let where  = ' WHERE 1 ';   //1 = 相當於true

  //搜尋功能
  let search = req.query.search || '';
  let orderby = req.query.orderby || '';

  if(search){
    const esc_search = db.escape(`%${search}%`);  // SQL 跳脫單引號, 避免 SQL injection ; 頭尾加%
    console.log({esc_search});
    where += ` AND (\`name\` LIKE ${esc_search} OR \`mobile\` LIKE ${esc_search} OR \`address\` LIKE ${esc_search})`;  //頭尾給空格
  }
  let orderbySQL = 'ORDER BY mid ASC'; //預設值(編號升冪)
  switch(orderby){
    case 'mid_desc':
      orderbySQL = 'ORDER BY mid DESC';
      break;
    case 'birthday_asc':
      orderbySQL = 'ORDER BY birthday ASC';
      break;
    case 'birthday_desc':
      orderbySQL = 'ORDER BY birthday DESC';
      break;

  }

  const perPage = 20;
  const t_sql = `SELECT COUNT(1) totalRows FROM member ${where}`;  //總筆數
  const [[{totalRows}]] = await db.query(t_sql);  //解構
  const totalPages = Math.ceil(totalRows/perPage);  //總頁數

  let rows = [];
  if(totalRows>0){
    if(page>totalPages){
      return res.redirect("?page="+ totalPages); //如果超過頁面，轉到最後一頁
    }

    const sql = `SELECT * FROM member ${where} ${orderbySQL} LIMIT ${(page-1)*perPage}, ${perPage}`;

    // return res.send(sql); 輸出sql至頁面，除錯用
    [rows] = await db.query(sql);


  }

  return  {totalRows, totalPages, page, rows};
};

//新增會員api
router.get('/add', async(req, res)=>{ 
  //如果沒有登入，就看不到新增會員資料的表單
  if(!req.session.user){
    req.session.lastPage = res.originalUrl;
    return res.redirect('/login');
  }
  res.render('admin-add');
});

router.post('/add', upload.none(), async(req, res)=>{ 
  const output = {
    success:false,
    postData: req.body, //除錯用
    code:0,
    errors: {}
  };
  // let{filename: avatar}=req.file;

  let {name,email,mobile,birthday,address}=req.body; //解構

  if(!name || name.length<2 ){
    output.errors.name='請輸入正確的姓名';
    return res.json(output);   //輸出，但後面不執行時->加return
  }
  
  birthday = moment(birthday);
  birthday = birthday.isValid() ? birthday.format('YYYY-MM-DD') : null;   //如果格式錯誤，填空值

  //TODO: 資料檢查
    const sql = "INSERT INTO `member`(`name`, `email`,`mobile`, `birthday`, `address`,`created_at`)VALUES(?, ?, ?, ?, ?, ?, NOW())";
  const [result] = await db.query(sql, [name, email , mobile, birthday, address]);

  output.result = result; 
  output.success = !!result.affectedRows; //轉成boolean (affectedRows 1 : true ; affectedRows 0 :false )
  
  //affectedRows
  res.json(output);   //=>結束，所以不須加return                   
  //upload.none()->不要上傳，但需要middleware幫忙解析資料
});
// //圖片上傳
// router.post('/upload', upload.single('avatar'), async(req, res)=>{
//   const output = {
//     success:false,
//     postData: req.body, //除錯用
//     code:0,
//     errors: {}
//   };
//   let{filename: avatar}=req.file;

//   //TODO: 資料檢查
//   const sql = "INSERT INTO `member`(`avatar`)VALUES(?)";
//   const [result] = await db.query(sql, [avatar]);

//   output.result = result; 
//   output.success = !!result.affectedRows; //轉成boolean (affectedRows 1 : true ; affectedRows 0 :false )
  
//   //affectedRows
//   res.json(output);   //=>結束，所以不須加return 
// })

//新增寵物api
router.get('/addPet/:mid', async(req, res)=>{ 
  //如果沒有登入，就看不到新增寵物資料的表單
  if(!req.session.user){
    req.session.lastPage = res.originalUrl;
    return res.redirect('/login');
  }
  res.render('admin-addPet');
});

// router.post('/addPet/:mid', upload.none(), async(req, res)=>{ 
//   const output = {
//     success:false,
//     postData: req.body, //除錯用
//     code:0,
//     errors: {}
//   };

//   let {name,type,birthday,gender}=req.body; //解構

//   if(!name || name.length<2 ){
//     output.errors.name='請輸入正確的姓名';
//     return res.json(output);   //輸出，但後面不執行時->加return
//   }
  
//   birthday = moment(birthday);
//   birthday = birthday.isValid() ? birthday.format('YYYY-MM-DD') : null;   //如果格式錯誤，填空值

//   //TODO: 資料檢查
//     const sql = "INSERT INTO `pet`(`name`, `birthday`, `type`, `gender`,`mid`)VALUES(?, ?, ?, ?, ?)";
//   const [result] = await db.query(sql, [name, birthday, type, gender, req.params.mid]);

//   output.result = result; 
//   output.success = !!result.affectedRows; //轉成boolean (affectedRows 1 : true ; affectedRows 0 :false )
  
//   //affectedRows
//   res.json(output);   //=>結束，所以不須加return                   
//   //upload.none()->不要上傳，但需要middleware幫忙解析資料
// });

//編輯會員api
router.get('/edit/:mid', async(req, res)=>{ 
  const mid = +req.params.mid || 0; //轉換成數值
  if(!mid){
    return res.redirect(req.baseUrl); //呈現表單-> 轉向列表頁(不要用json)
  }
  const sql = "SELECT * FROM member WHERE mid=?";
  const [rows] = await db.query(sql,[mid]);
  if(rows.length<1){
    return res.redirect(req.baseUrl); //轉向列表頁
  }
  const row = rows[0];  //若有資料就拿第一筆資料
  res.json(row);

  //從哪邊來
  // const referer = req.get('Referer') || req.baseUrl; //若沒有值->回到baseUrl ->第一頁
  // res.render('admin-edit', {...row, referer});  //展開->email、name..這些變數 
});
//http方法->使用put;  RESTful API 基本規定-> CRUD -> get/ post / 修改:put / delete
router.put('/edit/:mid', upload.none(), async(req, res)=>{ 
  const output = {   //定義要輸出資訊的格式
    success:false,
    postData: req.body, //除錯用
    code:0,
    errors: {}
  };
  const mid = +req.params.mid || 0; //轉換成數值
  if(!mid){
    output.errors.mid='沒有會員資料編號'
    return res.json(output); //回傳錯誤訊息-> json(API不要用轉向->會將列表頁內容傳給前端)
  }

  let {name,email,mobile,birthday,address,member_status}=req.body; //解構
  // const {filename: avatar} = req.file;
  // console.log(req.file);


  // console.log('name', req.body)
  if(!name || name.length<2 ){
    output.errors.name='請輸入正確的姓名';
    return res.json(output);   //輸出，但後面不執行時->加return
  }
  
  birthday = moment(birthday);
  birthday = birthday.isValid() ? birthday.format('YYYY-MM-DD') : null;   //如果格式錯誤，填空值

  //TODO: 資料檢查
    const sql = "UPDATE `member` SET `name`=?,`email`=?,`mobile`=?,`birthday`=?,`address`=?,`member_status`=? WHERE `mid`=?";
  const [result] = await db.query(sql, [name, email, mobile, birthday, address, member_status, mid]);
 

  output.result = result; 
  output.success = !!result.changedRows; //轉成boolean (changedRows 1 : true ; changedRows 0 :false )
  
 
  res.json(output);   //=>結束，所以不須加return                   
  //upload.none()->不要上傳，但需要middleware幫忙解析資料
});

//登入後點選更新密碼
router.get('/changePassword/:mid', async(req, res)=>{ 
  const mid = +req.params.mid || 0; //轉換成數值
  if(!mid){
    return res.redirect(req.baseUrl); //呈現表單-> 轉向列表頁(不要用json)
  }
  const sql = "SELECT * FROM member WHERE mid=?";
  const [rows] = await db.query(sql,[mid]);
  if(rows.length<1){
    return res.redirect(req.baseUrl); //轉向列表頁
  }
  const row = rows[0];  //若有資料就拿第一筆資料
  res.json(row);

  //從哪邊來
  // const referer = req.get('Referer') || req.baseUrl; //若沒有值->回到baseUrl ->第一頁
  // res.render('admin-edit', {...row, referer});  //展開->email、name..這些變數 
});

router.put('/changePassword/:mid', upload.none(), async(req, res)=>{ 
  const output = {   //定義要輸出資訊的格式
    success:false,
    postData: req.body, //除錯用
    code:0,
    errors: {}
  };
  const mid = +req.params.mid || 0; //轉換成數值
  if(!mid){
    output.errors.mid='沒有會員資料編號'
    return res.json(output); //回傳錯誤訊息-> json(API不要用轉向->會將列表頁內容傳給前端)
  }

  let {password,password2}=req.body; //解構
  // console.log('name', req.body)
  // if(!name || name.length<1 ){
  //   output.errors.name='請輸入正確的姓名';
  //   return res.json(output);   //輸出，但後面不執行時->加return
  // }
  
  // birthday = moment(birthday);
  // birthday = birthday.isValid() ? birthday.format('YYYY-MM-DD') : null;   //如果格式錯誤，填空值

  //TODO: 資料檢查
  //先將密碼加密->更新進資料庫
  let hashedPassword = await bcrypt.hash(password, 10)
  const sql = "UPDATE `member` SET `password`=? WHERE `mid`=?";
  const [result] = await db.query(sql, [hashedPassword, mid]);

  if(password !== password2) {
    output.error = '密碼不一致!'
    return res.json(output)
  }

  console.log(hashedPassword);

  output.result = result; 
  output.success = !!result.affectedRows; //轉成boolean (changedRows 1 : true ; changedRows 0 :false )
  
 
  res.json({...output,message:'密碼重設成功'})//=>結束，所以不須加return                   
  //upload.none()->不要上傳，但需要middleware幫忙解析資料
});

//查看每位會員的各自寵物資訊
router.get('/pet-list/:mid', async(req, res)=>{ 
  const mid = +req.params.mid || 0; //轉換成數值
  if(!mid){
    return res.redirect(req.baseUrl); //呈現表單-> 轉向列表頁(不要用json)
  }
  // const sql = "SELECT m.name AS 'mName', pet.* FROM pet JOIN member AS m ON p.mid=m.mid WHERE pet_id=?";
  // const sql = "SELECT * FROM pet WHERE mid=?";
  //從資料庫抓會員名稱與他們所擁有的寵物資訊
  const sql = "SELECT m.name AS 'mName', pet.* FROM pet JOIN member AS m ON pet.mid=m.mid WHERE pet.mid=?";
  const [rows] = await db.query(sql,[mid]);
  if(rows.length<1){
    return res.redirect(req.baseUrl); //轉向列表頁
  }
  // res.json(row);

  // //從哪邊來
  const referer = req.get('Referer') || req.baseUrl; //若沒有值->回到baseUrl ->第一頁
  res.render('pet-list', {rows, referer});  //展開->name、birthday..這些變數 
});

//加入收藏
router.post('/toggle-like/:product_id', async (req, res)=>{
  const output = {
  success: false,
  error: '',
  action: '',
  };
  // 必須是已登入的會員
  // if(! req.session.user){
  // output.error = '必須登入會員, 才能加到最愛';
  // return res.json(output);
  // }
  const product_id = +req.params.product_id || 0;
  const {id: mid, typeID: type_id} = req.body

  const sql1 = "SELECT * FROM product_likes WHERE `mid`=? AND `product_id`=? AND `type_id`=?";
  const [likes] = await db.query(sql1, [mid, product_id, type_id]);

  if(likes.length){
  const sql2 = "DELETE FROM `product_likes` WHERE sid=" + likes[0].sid;
  const [result] = await db.query(sql2);
  output.success = !! result.affectedRows;
  output.action = 'delete';
  } else {
// TODO: 判斷有沒有這個商品
  const sql3 = "INSERT INTO `product_likes`(`mid`, `product_id`,`type_id`) VALUES (?,?,?)";
  const [result] = await db.query(sql3, [
     mid,product_id,type_id
  ]);
  output.success = !! result.affectedRows;
  output.action = 'insert';
  }
  res.json(output);
});

// 取得某個會員資料的api
router.get('/:mid', async (req, res) => {
  const mid = +req.params.mid || 0;
  const sql = 'SELECT * FROM member WHERE mid=?';
  const [result] = await db.query(sql, [mid])
  res.json(result)
})

//透過會員編號找到會員各自的收藏名單
router.get('/likes/:mid', async (req, res)=>{
  const output = {
      logined: false, // 有沒有登入
      error: '',
      likes: [],
  };
  const mid = +req.params.mid || 0 ;
  if(!mid){
      return res.json(output);
  }
  output.logined = true;

  const sql = "SELECT product_type.*, p.*, pl.*, member.mid FROM product_likes pl JOIN product p ON pl.product_id=p.product_id JOIN product_type ON product_type.type_id=pl.type_id JOIN member ON pl.mid=member.mid WHERE pl.mid=?";
  const [rows] = await db.query(sql,[mid]);
  output.likes = rows;

  res.json(output);
});

//刪除收藏
router.delete('/deleteLikes/:sid', async(req, res)=>{ 
  const output = {
    success:false,
    error:''
  }
  const sid = +req.params.sid || 0 ;
  // const product_id = +req.params.product_id ||0;
  // const mid = +req.params.mid || 0 ;
  // const product_id = +req.params.product_id ||0;

  if(!sid){
    output.error='沒有收藏編號'
    return res.json(output);
  }
  // const sql1 = "SELECT * FROM product_likes WHERE `mid`=? AND `product_id`=?";
  // const [likes] = await db.query(sql1, [mid, product_id]);
  const sql2 = "DELETE FROM product_likes WHERE sid=?";
  const [result] = await db.query(sql2,[sid]);
  output.success = !! result.affectedRows;
 
  res.json(output);
 });


//呈現會員表單(搭配getListData)
router.get('/', async(req, res)=>{ 
  const output = await getListData(req, res); //output
  res.render('m-list', output);
});


router.get('/api', async(req, res)=>{ 
  const output = await getListData(req, res); //output
  for(let item of output.rows){
    item.birthday = res.locals.toDateString(item.birthday); //修改birthday格式
    item.created_at = res.locals.toDatetimeString(item.created_at); //修改created_at格式
  }
  //TODO: 用output.rows.forEach()再寫一次功能
  res.json(output); //拿到路由-> 轉成json
});

//查看每位會員的各自寵物資訊
router.get('/pet/:mid', async(req, res)=>{ 
  const mid = +req.params.mid || 0; //轉換成數值
  if(!mid){
    return res.redirect(req.baseUrl); //呈現表單-> 轉向列表頁(不要用json)
  }
  const sql ="SELECT pet.* , member.* FROM pet JOIN member ON pet.mid=member.mid WHERE pet.mid=?";
  const [rows] = await db.query(sql,[mid]);
  if(rows.length<1){
    return res.redirect(req.baseUrl); //轉向列表頁
  }
  const referer = req.get('Referer') || req.baseUrl; //若沒有值->回到baseUrl ->第一頁
  // res.render('pet-list', {rows, referer});  //展開->name、birthday..這些變數
  res.json(rows); 
});

//新增寵物api
router.post('/addPet/:mid', upload.none(), async(req, res)=>{ 
  const output = {
    success:false,
    postData: req.body, //除錯用
    code:0,
    errors: {}
  };

  console.log(output)

  let {name: pet_name, type: pet_type, gender: pet_gender, activity_id: activity_id}=req.body; //解構

  if(!pet_name || pet_name.length<1 ){
    output.errors.name='請輸入正確的姓名';
    return res.json(output);   //輸出，但後面不執行時->加return
  }
  

  //TODO: 資料檢查
  const sql = "INSERT INTO `pet`(`pet_name`, `pet_type`, `pet_gender`,`mid`)VALUES(?, ?, ?, ?)";
  const [result] = await db.query(sql, [pet_name, pet_type, pet_gender, req.params.mid]);

  output.result1 = result; 
  output.success1 = !!result.affectedRows; //轉成boolean (affectedRows 1 : true ; affectedRows 0 :false )

  //affectedRows
  res.json(output);   //=>結束，所以不須加return                   
});


//刪除會員api
router.delete('/:mid', async(req, res)=>{ 
  const output = {
    success:false,
    error:''
  }
  const mid = +req.params.mid || 0 ;
  if(!mid){
    output.error='沒有mid'
    return res.json(output);
  }
  const sql = "DELETE FROM `member` WHERE  mid=?"; 

  const [result] = await db.query(sql,[mid]);
 
  output.success =!! result.affectedRows //boolean值轉換(1->true)
  res.json(output);
 });

module.exports = router;