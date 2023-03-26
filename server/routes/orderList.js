const express = require('express');
const db = require('../modules/connect-mysql');
const upload = require('../modules/upload-img');
const moment = require('moment-timezone');
const { query } = require('express');

const router = express.Router();

//針對此模組的頂層 ; 經過路由前，會先經過此middleware
//url, baseUrl, originalUrl 要在這裡拿，若在index那裡拿，originalUrl會一樣，但url & baseUrl會不同 
router.use((req, res, next) => {
    const { url, baseUrl, originalUrl } = req;

    res.locals = { ...res.locals, url, baseUrl, originalUrl };
    //不能使用-> res.locals.url = url (會將先前在index設定的middleware排除)
    // if(! req.session.user){  //如果沒有登入會員,就看不到新增會員表單
    //     req.session.lastPage = req.originalUrl;  
    //     return res.redirect('/login');
    // }

    next();
});

//訂單紀錄
const getListData = async (req, res) => {

    let page = +req.query.page || 1;   //用戶要看第幾頁

    if (page < 1) {
        return res.redirect(req.baseUrl + req.url);
    }

    //關鍵字搜尋
    let where = ' WHERE 1 ';
    let search = req.query.search || '';
    let orderby = req.query.orderby || '';


    if (search) {
        const esc_search = db.escape(`%${search}%`);  //sql跳脫單引號
        console.log({ esc_search });
        where += `AND \`member_id\` LIKE ${esc_search} `;
    }

    let orderbySQL = 'ORDER BY order_id ASC'; //預設值(編號升冪)
    switch (orderby) {
        case 'order_id_desc':
            orderbySQL = 'ORDER BY order_id DESC';
            break;
    }


    const perPage = 5;
    const t_sql = `SELECT COUNT(1) totalRows FROM od ${where}`;
    const [[{ totalRows }]] = await db.query(t_sql);

    const totalPages = Math.ceil(totalRows / perPage);

    let rows = [];
    if (totalRows > 0) {
        if (page > totalPages) {
            return res.redirect("?page=" + totalPages);  //頁面轉向到最後一頁
        }

        // const sql = `SELECT * FROM products ${where} ${orderbySQL} LIMIT ${(page-1)*perPage},${perPage}`;
        const sql = `SELECT od.*  FROM  od  ${where} LIMIT ${(page-1)*perPage},${perPage} ` ;

        // SELECT activitypettype.* , activity.* FROM `activity` JOIN `activitypettype` ON activity.activity_pettype=activitypettype.activity_pettype WHERE activity_id=1;
        [rows] = await db.query(sql);
    }
    // 搜尋order裡面mid=USER的資料，join加入orderdetail 用type分類 
    // select order.* ,orderdetail.* from od JOIN od_detail ON od.order_id=od_detail.order_id WHERE mid={user.id}
    // filter type={?} 


    return { totalRows, totalPages, page, rows };
}


// router.get("/add",async(req,res)=>{
//     res.render("order-add");
// });

// router.post("/add",upload.none(),async(req,res)=>{

//     const output = {
//         success:false,
//         postData:req.body,
//         code:0,
//         errors:{},
//     };

//     let {member_id, order_date, status, recipient_name, recipient_address, recipient_phone} = req.body;

//     if(!product_name || product_name.length<1){
//         output.errors.product_name = '請輸入正確的商品名稱';
//         return res.json(output);
//     }

//     const sql = "INSERT INTO `product`(`product_type`,`product_name`, `product_class`,`product_price`,`product_descripttion`,`product_unit`) VALUES (?, ?, ?, ?, ?, ?)";

//     const [result] = await db.query(sql,[product_type,product_name, product_class,product_price,product_descripttion,product_unit])

//     output.result = result;
//     output.success = !! result.affectedRows;
//     res.json(output);
// });


router.get("/edit/:order_id",async(req,res)=>{

    const order_id = +req.params.order_id ||0;
    if(!order_id){
        return res.redirect(req.baseUrl); //轉向到列表頁
    }

    const sql = "SELECT * FROM od WHERE order_id=?";
    const [rows] = await db.query(sql,[order_id]);
    if(rows.length<1){
        return res.redirect(req.baseUrl); //轉向到列表頁
    }
    const row = rows[0];
    // res.json(row);


    //從哪裡來
    const referer = req.get('Referer') || req.baseUrl;
    
    res.render("order-edit",{...row,referer});
});


router.put("/edit/:order_id",upload.none(),async(req,res)=>{
    // return res.json(req.body);

    const output = {
        success:false,
        postData:req.body,
        code:0,
        errors:{},
    };

    console.log(output);
    // return res.json(output);


    const order_id = +req.params.order_id ||0;
    if(!order_id){
        output.errors.order_id = '沒有訂單資料編號';
        return res.json(output);  //API不要用轉向
    }

    const {member_id, order_date, status,name:recipient_name, address:recipient_address, mobile:recipient_phone} = req.body;

    // if(!status || recipient_name.length<1 || !recipient_address || recipient_phone){
    if(!status || !recipient_name || recipient_name.length<2 || !recipient_address || recipient_address.length < 2 || !recipient_phone || recipient_phone<10){
        output.errors.recipient_name = '請輸入正確的客戶姓名';
        output.errors.recipient_address = '請輸入正確的客戶地址';
        output.errors.recipient_phone = '請輸入正確的客戶電話';
        return res.json(output);
    }

    console.log(output);
    const sql = "UPDATE `od` SET `status`=?,`recipient_name`=?,`recipient_address`=?,`recipient_phone`=? WHERE `order_id`=?";
    // const sql = "UPDATE `od` SET `status`=? WHERE `order_id`=?";

    const [result] = await db.query(sql,[status, recipient_name, recipient_address, recipient_phone,order_id])

    output.result = result;
    output.success = !! result.changedRows;
    console.log(result);

    res.json(output);
});

// 取得該會員的所有訂單紀錄
router.get("/order/:member_id", async (req, res) => {
    const output = {
        success: false,
        postData: req.body,
        code: 0,
        errors: {},
    };
    const member_id = +req.params.member_id || 0;
    if (!member_id) {
        output.error.member_id = '沒有資料編號';
        return res.json(output);  //API不要用轉向
    }
    const sql = "SELECT od.*, od_detail.`type_id`, od_detail.`product_price`, od_detail.`product_quantity` FROM od JOIN od_detail ON od.order_id = od_detail.order_id WHERE od.member_id = ? GROUP BY od.order_id";


    const [rows] = await db.query(sql, [member_id]);
    if (rows.length < 1) {


        return res.redirect(req.baseUrl); //轉向到列表頁
    }
    // const row = rows[0];
    res.json(rows);

})
//取得某一筆的訂單明細
router.get('/orderDetail/:order_id', async (req, res) => {
    const output = {
        success: false,
        postData: req.body,
        code: 0,
        errors: {},
    };
    const order_id = +req.params.order_id || 0;
    if (!order_id) {
        output.error.order_id = '沒有資料編號';
        return res.json(output);  //API不要用轉向
    }

    
    const sql = "SELECT od_detail.*, validity_period.*, product.*, od.order_date, od.recipient_name, od.recipient_address, od.recipient_phone, od.status, od.payment_method FROM od_detail JOIN od ON od.order_id = od_detail.order_id JOIN product ON product.product_id = od_detail.product_id LEFT JOIN validity_period ON validity_period.order_detail_id=od_detail.order_detail_id WHERE od_detail.order_id =?";
    const [rows] = await db.query(sql,[order_id]);




    if (rows.length < 1) {
        return res.redirect(req.baseUrl); //轉向到列表頁
    }
    // const row = rows[0];
    res.json(rows);

})



router.get("/", async (req, res) => {
    const output = await getListData(req, res);
    res.render('orderList', output);
});

router.get("/api", async (req, res) => {
    const output = await getListData(req, res);
    res.json(output);
});

router.delete("/:order_id", async (req, res) => {
    const output = {
        success: false,
        error: '',
    }

    const order_id = +req.params.order_id || 0;
    if (!order_id) {
        output.error = 'order_id';
        return res.json(output);
    }
    const sql = "DELETE FROM `od` WHERE order_id=?";
    const [result] = await db.query(sql, [order_id]);

    output.success = !!result.affectedRows;
    res.json(output);

});

module.exports = router;