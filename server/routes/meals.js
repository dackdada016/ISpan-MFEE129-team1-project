const express = require('express');
const db = require('../modules/connect-mysql');
const upload = require('../modules/upload-img');
// const moment = require('moment-timezone');
const router = express.Router();

router.use((req,res,next)=>{
    const {url,baseUrl,originalUrl} = req;

    res.locals = {...res.locals,url,baseUrl,originalUrl};

//針對此模組的頂層 ; 經過路由前，會先經過此middleware
//url, baseUrl, originalUrl 要在這裡拿，若在index那裡拿，originalUrl會一樣，但url & baseUrl會不同 
    //不能使用-> res.locals.url = url (會將先前在index設定的middleware排除)
    // if(! req.session.user){  //如果沒有登入會員,就看不到新增會員表單
    //     req.session.lastPage = req.originalUrl;  
    //     return res.redirect('/login');
    // }

    next();
});

const getListData = async(req,res)=>{

    let page = +req.query.page || 1;   //用戶要看第幾頁

    if(page<1){
        return res.redirect(req.baseUrl+req.url);
    }

    //關鍵字搜尋
    let where = ' WHERE product_type = 4 ';
    let search = req.query.search || '';
    let orderby = req.query.orderby || '';


    if(search){
        const esc_search = db.escape(`%${search}%`);  //sql跳脫單引號
        console.log({esc_search});
        where += `AND \`product_name\` LIKE ${esc_search} `;
    }

    let orderbySQL = 'ORDER BY product_id ASC'; //預設值(編號升冪)
  switch(orderby){
    case 'product_id_desc':
      orderbySQL = 'ORDER BY product_id DESC';
      break;
  }


    const perPage = 5;
    const t_sql = `SELECT COUNT(1) totalRows FROM product ${where}`;
    const [[{totalRows}]] = await db.query(t_sql);

    const totalPages = Math.ceil(totalRows/perPage);

    let rows = [];
    if(totalRows>0){
        if(page>totalPages){
            return res.redirect("?page="+totalPages);  //頁面轉向到最後一頁
        }

        const sql = `SELECT product_type.* , product.* FROM  product JOIN product_type ON product.product_type=product_type.type_id ${where} ${orderbySQL} LIMIT ${(page-1)*perPage},${perPage}`;
        [rows] = await db.query(sql);
    }

    return {totalRows,totalPages,page,rows};
}


router.get("/add",async(req,res)=>{
    res.render("meals-add");
});

router.post("/add",upload.single("product_image"),async(req,res)=>{

    const output = {
        success:false,
        postData:req.body,
        code:0,
        errors:{},
    };
    let {filename: product_image}=req.file;

    let {product_type,product_name, product_class,product_price,product_descripttion,product_unit} = req.body;

    if(!product_name || product_name.length<1){
        output.errors.product_name = '請輸入正確的商品名稱';
        return res.json(output);
    }

    const sql = "INSERT INTO `product`(`product_type`,`product_name`, `product_class`,`product_price`,`product_descripttion`,`product_unit`,`product_image`) VALUES (?, ?, ?, ?, ?, ?, ?)";

    const [result] = await db.query(sql,[product_type,product_name, product_class,product_price,product_descripttion,product_unit,product_image]);

    output.result = result;
    output.success = !! result.affectedRows;
    res.json(output);
});


router.get("/edit/:product_id",async(req,res)=>{

    const product_id = +req.params.product_id ||0;
    if(!product_id){
        return res.redirect(req.baseUrl); //轉向到列表頁
    }

    const sql = "SELECT * FROM product WHERE product_id=?";
    const [rows] = await db.query(sql,[product_id]);
    if(rows.length<1){
        return res.redirect(req.baseUrl); //轉向到列表頁
    }
    const row = rows[0];
    // res.json(row);

    //從哪裡來
    const referer = req.get('Referer') || req.baseUrl;
    
    res.render("meals-edit",{...row,referer});
});

router.put("/edit/:product_id",upload.single("product_image"),async(req,res)=>{
    // return res.json(req.body);

    const output = {
        success:false,
        postData:req.body,
        code:0,
        errors:{},
    };

    const product_id = +req.params.product_id ||0;
    if(!product_id){
        output.error.product_id = '沒有資料編號';
        return res.json(output);  //API不要用轉向
    }

    const {product_type,product_name,product_class,product_price,product_descripttion,product_unit} = req.body;
    const {filename: product_image}=req.file;

    if(!product_name || product_name.length<1){
        output.errors.product_name = '請輸入正確的商品名稱';
        return res.json(output);
    }



    const sql = "UPDATE `product` SET `product_type`=?,`product_name`=?,`product_class`=?,`product_price`=?,`product_descripttion`=?,`product_unit`=?,`product_image`=? WHERE `product_id`=?";

    const [result] = await db.query(sql,[product_type,product_name,product_class,product_price,product_descripttion,product_unit,product_image,product_id])

    output.result = result;
    output.success = !! result.changedRows;

    res.json(output);
});

router.get("/",async(req,res)=>{
    const output = await getListData(req,res);
    res.render('meals-list',output);
});

router.get("/api",async(req,res)=>{
    const output = await getListData(req,res);
    res.json(output);
});

router.get("/list-product/:product_type",async(req,res)=>{

    const product_type = +req.params.product_type || 0;
    if(!product_type){
        return res.redirect(req.baseUrl); //轉向到列表頁
    }

    const sql = "SELECT * FROM product WHERE product_type=?";
    const [rows] = await db.query(sql,[product_type]);
    res.json(rows);

})

router.get("/list-detail/:product_id",async(req,res)=>{

    const product_id = +req.params.product_id || 0;
    if(!product_id){
        return res.redirect(req.baseUrl); //轉向到列表頁
    }

    const sql = "SELECT * FROM product WHERE product_id=?";
    const [rows] = await db.query(sql,[product_id]);
    res.json(rows);

})

router.delete("/:product_id",async(req,res)=>{
    const output = {
        success:false,
        error:'',
    }

    const product_id = +req.params.product_id ||0;
    if(!product_id){
        output.error = 'product_id';
        return res.json(output);
    }
    const sql = "DELETE FROM `product` WHERE product_id=?";
    const [result] = await db.query(sql,[product_id]);

    output.success = !! result.affectedRows;
    res.json(output);

});

module.exports=router;