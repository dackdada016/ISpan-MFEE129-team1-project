if (process.argv[2] === 'production') {
  require('dotenv').config({ path: __dirname + '/production.env' });
} else {
  require('dotenv').config({ path: __dirname + '/dev.env' });
};

const bcrypt = require('bcryptjs')
const multer = require('multer');
const upload = require('./modules/upload-img');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const session = require('express-session');  //session 放最前面(注意順序!)
const MYsqlStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
const db = require('./modules/connect-mysql');
const sessionStore = new MYsqlStore({}, db);  //{}->放連線的帳號和密碼，因已設定，所以不用放
const express = require('express');

const app = express();

const http = require("http");
const { Server } = require("socket.io");






const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    console.log({ origin });
    callback(null, true);
  },
};
app.use(require('cors')(corsOptions));
// const server = http.createServer(app);

const io = new Server(3005, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});



io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.set('view engine', 'ejs');
//路由設定,routes

//top-level middleware 
//解析cookie，拿到sessionId，再把session資料放到req.session
app.use(session({
  saveUninitialized: false, //session尚未初始化時 是否存起來(與儲存媒介有關)
  resave: false,  //沒變更內容是否強制回存
  secret: 'skdjskdakslkdjlkflqwlkelkdjs', //加密
  store: sessionStore,
  // cookie:{
  //   maxAge: 1200_000    //存活20分鐘
  // }   //瀏覽器持續開著，session基本上一直存活
}));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use((req, res, next) => {
  res.locals.title = process.env.SITE_TITLE || "*** 沒有設定 ***";
  //res.locals =>進到template
  //掛在locals底下的屬性會變成template裡的全域變數

  //樣板輔助函式 helper function
  res.locals.toDateString = d => moment(d).format('YYYY-MM-DD');
  res.locals.toDatetimeString = d => moment(d).format('YYYY-MM-DD HH:mm:ss');
  //直接將session 資料放到locals(res.locals.sessiond)，讓template可以吃到session
  res.locals.session = req.session;
  next();   //若要往下傳->必須呼叫next()
});



app.get("/", (req, res) => {
  res.render('main', { name: '專題' });
});

// app.use(express.static('node_modules/bootstrap/dist'));


//member.json
app.get('/memberlist', (req, res) => {
  const data = require(__dirname + '/data/member.json');
  //require 可以在程式的任何地方使用
  console.log(data); //取得已經是原生類型
  // res.json(data);  
  res.render('memberlist', { data });
});

//取得queryString資料
//可重複給值 (變成陣列)
app.get('/try-qs', (req, res) => {
  res.json(req.query);
});

app.post(['/try-post', '/try-post2'], (req, res) => {
  res.json(req.body);
});
//若沒使用urlencodedParser幫忙處理，req.body為undefined
//根據檔頭來判斷 資料進來時是否要運作

app.get('/try-post-form', (req, res) => {
  res.render('try-post-form');
});

app.post('/try-post-form', (req, res) => {
  // res.json(req.body);
  res.render('try-post-form', req.body);
});

app.post('/try-upload', upload.single('avatar'), (req, res) => {
  res.json(req.file); //上傳單一檔案
});

app.post('/try-uploads', upload.array('photos'), (req, res) => {
  res.json(req.files); //上傳多個檔案
});

//寬鬆規則
app.get('/my-params1/:action?/:id?', (req, res) => {
  res.json(req.params);
});

//手機號碼
app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
  let u = req.url.slice(3);  // 從第三個以後開始顯示
  u = u.split('?')[0];       //丟掉query String
  u = u.split('-').join(''); //去掉減號
  res.send(u);
});


//嚴謹規則(因放於寬鬆規則後，此路由永遠無法拜訪)
app.get('/my-params1/abc', (req, res) => {
  res.json(req.params);
});
//!!越寬鬆規則放越後面，嚴謹放前面

//可同時把router掛在不同baseUrl底下
app.use(require('./routes/admin2'));
app.use('/admins', require('./routes/admin2'));
// app.use('/admins-new', require('./routes/new')); //切換版本(admin3做法)

app.get('/try-sess', (req, res) => {
  req.session.my_var = req.session.my_var || 0;  //預設為0
  req.session.my_var++;
  res.json({
    my_var: req.session.my_var,
    session: req.session          //session不要取名為cookie
  })
});

app.get('/try-moment', (req, res) => {
  const d1 = new Date();
  const m1 = moment();  //new Date()
  const m1a = m1.format('YYYY/MM/DD');
  const m1b = m1.format('YYYY-MM-DD HH:mm:ss');
  const m1c = m1.tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss');
  const m2 = moment('2023-01-05');  //new Date()
  res.json({ m1a, m1b, d1, m1c, m2 });
});


//註冊
app.get('/register', (req, res) => {
  res.render('register');
});

// /auth/register
app.post("/auth/register", upload.none(), async (req, res) => {
  const output = {
    success: false,
    postData: req.body, //除錯用
    code: 0,
    errors: {}
  };

  let { name, email, mobile, birthday, address, password, password2 } = req.body;

  if (!name || name.length < 2) {
    output.errors.name = '請輸入正確的姓名';
    return res.json(output);   //輸出，但後面不執行時->加return
  }
  birthday = moment(birthday);
  birthday = birthday.isValid() ? birthday.format('YYYY-MM-DD') : null;

  const sql = "SELECT email FROM member WHERE email=?";
  const [rows] = await db.query(sql, [email]);
  if (rows.length > 0) {
    output.error = '信箱已註冊過!'
    return res.json(output)
  }

  if (password !== password2) {
    output.error = '密碼不一致!'
    return res.json(output)
  }


  let hashedPassword = await bcrypt.hash(password, 10)

  console.log(hashedPassword);

  const newSQL = "INSERT INTO `member`(`name`, `email`,`mobile`, `birthday`, `address`,`password`,`created_at`)VALUES(?, ?, ?, ?, ?, ?,NOW())";

  const [result] = await db.query(newSQL, [name, email, mobile, birthday, address, hashedPassword]);

  output.result = result;
  output.success = !!result.affectedRows;

  return res.json(output);

  // if(error) {
  //   console.log(error)
  //   } else {
  //   return res.render('register', {
  //   message: 'User registered!'
  //   })
  //   }
})
// 前端取得某個會員資料的api
// app.get('/member/:mid?', async (req, res) => {
//   const mid = +req.params.mid || 0;
//   const sql = 'SELECT * FROM member WHERE mid=?';
//   const [result] = await db.query(sql, [mid])
//   res.json(result)
// })


//新增會員資料
app.get('/add-member', async (req, res) => {
  return res.json({}); //已新增就不要再新增了
  const sql = "INSERT INTO `member`(`name`, `email`, `password`, `hash`, `created_at`) VALUES ('tester', ?, ?, '', Now())";
  const password = await bcrypt.hash('13579', 10);
  const [result] = await db.query(sql, ['tester@test.com', password]);

  res.json(result);
});
//登入
//呈現登入表單
app.get('/login', async (req, res) => {
  return res.render('login');
});

//處理登入後，有無email、password這兩值
app.post('/login', upload.none(), async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: '',
    // email:'',
  };
  const { email, password } = req.body;
  if (!email | !password) {  //若email或密碼 其中一個沒有
    output.error = '欄位資料不足'
    output.code = 400;
    return res.json(output);
  }
  // if(email){
  //   output.email= '',
  //   output.code = 200;
  //   return res.json(output);
  // }
  // output.id =id;
  output.email = email;
  const sql = "SELECT * FROM  member WHERE email =?";
  const [rows] = await db.query(sql, [email]); //上方的? => [email]
  if (rows.length < 1) {
    output.error = '信箱錯誤'
    output.code = 410;
    return res.json(output);
  }
  const row = rows[0];

  //密碼比對
  const result = await bcrypt.compare(password, row.password);
  if (result) {
    output.success = true;
    output.id = row.mid;
    output.name = row.name;
    //成功登入->設定session
    req.session.user = {
      id: row.mid,
      email,  //=>[email]
      name: row.name,
    };
  } else {
    output.error = "密碼錯誤";
    output.code = 420;
  }

  return res.json(output);
});

//登出
app.get('/logout', async (req, res) => {
  delete req.session.user; //刪掉session
  return res.redirect('/');  //轉向首頁
});

//不透過表單登入流程(不使用帳密)
//快速登入
app.get('/fake1', async (req, res) => {
  req.session.user = {
    id: 1,
    email: 'test123@test.com',
    name: '管理者'  //密碼: 24680
  };
  return res.redirect('/');  //轉向首頁
});

//忘記密碼
app.post('/forget-password', async (req, res) => {
  const { email } = req.body;

  const token = crypto.randomBytes(20).toString('hex');

  //nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'testerforispanproject@gmail.com',
      pass: 'hjpucggdagcfnvws'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  await transporter.sendMail({
    from: 'testerforispanproject@gmail.com',
    to: email,
    subject: '重設密碼',
    text: `點擊下方連結即可重設密碼:http://localhost:3000/ResetPassword?email=${email}&token=${token}`
  })
  res.json({ message: '重設密碼信已寄出!' })
})

//重設密碼
app.post('/reset-password', async (req, res) => {
  const output = {   //定義要輸出資訊的格式
    success: false,
    postData: req.query, //除錯用
    postData2: req.body, //除錯用
    code: 0,
    errors: {}
  };

  // return res.json(output)
  const { token, email } = req.query;
  const { password, password2 } = req.body;
  if (!token || !password || !password2) {
    return res.status(400).json({ ...output, message: 'token and password are required' })
  }

  // const user = await user.findOne({resetToken:token});
  // if(!user){
  //   return res.status(400).json({message:'Invalid Token'})
  // }

  let hashedPassword = await bcrypt.hash(password, 10)
  const sql = "UPDATE `member` SET `password`=? WHERE `email`=?";
  const [result] = await db.query(sql, [hashedPassword, email]);

  if (password !== password2) {
    output.error = '密碼不一致!'
    return res.json(output)
  }
  // let hashedPassword = await bcrypt.hash(password, 10)

  console.log(hashedPassword);

  output.result = result;
  output.success = !!result.affectedRows; //轉成boolean (changedRows 1 : true ; changedRows 0 :false )


  // res.json(output);   //=>結束，所以不須加return   
  // user.password = password;
  // user.resetToken = null;
  // await user.save();


  res.json({ ...output, message: '密碼重設成功' })

})

// 前端發送取得圖片的api
app.get('/uploads/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = __dirname + '/public/uploads/' + fileName;

  res.sendFile(filePath);
});

app.post('/order/:mid', async (req, res) => {
  const mid = +req.params.mid || 0
  if (mid == null) {
    return res.json({ success: false, message: 'Member is undefined' })
  }
  // console.log(req.body)
  const member_id = mid
  const status = 0
  const {
    payment_method,
    recipient_name,
    recipient_address,
    recipient_phone,
    detailData,
  } = req.body;
  const order_date = moment.tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')
  let aid = 0
  let tid = 0
  let order_id = 0
  try {
    const sql = 'INSERT INTO od(member_id, status, payment_method, order_date, recipient_name, recipient_address, recipient_phone) VALUES(?, ?, ?, ?, ?, ?, ?)'
    const [addOrderResult] = await db.query(sql, [member_id, status, payment_method, order_date, recipient_name, recipient_address, recipient_phone])
    // 取得剛才新增的訂單ID
    order_id = addOrderResult.insertId
    const order_details = req.body.detailData || [];
    const detailSql = 'INSERT INTO od_detail(order_id, product_id, type_id, product_quantity, product_price) VALUES ?'
    const values = order_details.map((v, i) => {
      const { product_id, product_type, product_quantity, product_price } = v
      tid = product_type
      return [order_id, product_id, product_type, product_quantity, product_price]

    })
    console.log(values)
    const [addDetailResult] = await db.query(detailSql, [values])

    console.log(addDetailResult)
    aid = addDetailResult.insertId
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
  try {
    // 取得Detail裡的type_id
    const detailId = aid

    const {start_time,end_time,additional}=req.body;
    
    // 判斷是否新增Validity Period資料表
    if (tid == 1 || tid == 2|| tid == 4) {
      //return addDetailResult;
      return res.json({ success: true, message: 'Order details added successfully', order_id });
    } else if (tid == 3) {
      const addValidityPeriodSql = 'INSERT INTO validity_period(order_detail_id, start_time,end_time, additional) VALUES (?,?,?,?)'
      const [addValidityPeriodResult] = await db.query(addValidityPeriodSql, [detailId, start_time, end_time, additional])
      return res.json({ success: true, message: 'validity_period added successfully', detailId });

    } else {
      throw new Error("TypeID is undefined");
    }
    res.json({ success: true, message: 'Order details added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



//baseUrl
app.use('/member', require('./routes/member'));
app.use('/orderList', require('./routes/orderList'));
app.use('/activity', require('./routes/activity'));
app.use('/product', require('./routes/product'));
app.use('/room',require('./routes/room'));
app.use('/meals',require('./routes/meals'));
// 前端讀取圖片時使用的URL
app.use('/uploads/:fileName?', express.static(__dirname + '/public/uploads'));

app.use(express.static('public/uploads'));
//搜尋資料庫的課程商品並顯示到前端的API
app.get("/courses", async(req, res) => {
  const [rows]=await  db.query("SELECT * FROM product WHERE product_type=4");
   
   res.json(rows);
    });

//按照課程主題分類分別顯示相關課程的API
app.get("/meals:class", async(req, res) => {
      const param=req.params.class;
      const [rows]=await  db.query(`SELECT * FROM product WHERE product_class=${param}`);
       
       res.json(rows);
        });
//找單堂課的API
app.get("/mealss:name", async(req, res) => {
          const param=req.params.name;
          const [rows]=await  db.query(`SELECT * FROM product WHERE product_name=${param}`);
           
           res.json(rows);
            });

//*****所有路由設定都要放在這行之前*****
app.use((req, res) => {
  res.type('text/html');
  res.status(404).send(`<h1>404找不到你要的頁面</h1>`);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`伺服器啟動: ${port}`);
});