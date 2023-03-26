const express = require('express');
const db = require('../modules/connect-mysql');
const upload = require('../modules/upload-img');
const moment = require('moment-timezone');
const { route } = require('./member');

const router = express.Router();

//針對此模組的頂層 ; 經過路由前，會先經過此middleware
//url, baseUrl, originalUrl 要在這裡拿，若在index那裡拿，originalUrl會一樣，但url & baseUrl會不同 
router.use((req,res,next)=>{
    const {url,baseUrl,originalUrl} = req;

    res.locals = {...res.locals,url,baseUrl,originalUrl};
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
    let where = ' WHERE 1 ';
    let search = req.query.search || '';
    let orderby = req.query.orderby || '';


    if(search){
        const esc_search = db.escape(`%${search}%`);  //sql跳脫單引號
        console.log({esc_search});
        where += `AND \`activity_name\` LIKE ${esc_search} `;
    }

    let orderbySQL = 'ORDER BY activity_id DESC'; //預設值(編號升冪)
  switch(orderby){
    case 'activity_id_asc':
      orderbySQL = 'ORDER BY activity_id ASC';
      break;
    case 'activity_datestart_asc':
      orderbySQL = 'ORDER BY activity_datestart ASC';
      break;
    case 'activity_datestart_desc':
      orderbySQL = 'ORDER BY activity_datestart DESC';
      break;
    case 'activity_dateend_asc':
      orderbySQL = 'ORDER BY activity_dateend ASC';
      break;
    case 'activity_dateend_desc':
      orderbySQL = 'ORDER BY activity_dateend DESC';
      break;

  }


    const perPage = 20;
    const t_sql = `SELECT COUNT(1) totalRows FROM activity ${where}`;
    const [[{totalRows}]] = await db.query(t_sql);

    const totalPages = Math.ceil(totalRows/perPage);

    let rows = [];
    if(totalRows>0){
        if(page>totalPages){
            return res.redirect("?page="+totalPages);  //頁面轉向到最後一頁
        }
        // const sql = `SELECT * FROM activity ${where} ${orderbySQL} LIMIT ${(page-1)*perPage},${perPage}`;
        const sql = `SELECT activitypettype.* , activity.* FROM  activity JOIN activitypettype ON activity.activity_pettype=activitypettype.activity_pettype ${where} ${orderbySQL} LIMIT ${(page-1)*perPage},${perPage}`;
        // SELECT activitypettype.* , activity.* FROM `activity` JOIN `activitypettype` ON activity.activity_pettype=activitypettype.activity_pettype WHERE activity_id=1;
        [rows] = await db.query(sql);
    }

    return {totalRows,totalPages,page,rows};
}

router.post("/upload-img",upload.array("images"),async(req,res)=>{
    res.json(req.files);
  });


router.get("/add",async(req,res)=>{
    res.render("activity-add");
});

router.post("/add",upload.none(),async(req,res)=>{

    const output = {
        success:false,
        postData:req.body,
        code:0,
        errors:{},
    };

    // let {filename: activity_image}=req.file;

    let {activity_name,activity_datestart, activity_dateend,activity_pettype,activity_location,activity_time,activity_decription, activity_notice,activity_notice2,activity_image} = req.body;

    if(!activity_name || activity_name.length<1){
        output.errors.activity_name = '請輸入正確的活動名稱';
        return res.json(output);
    }

    const sql = "INSERT INTO `activity`(`activity_name`,`activity_datestart`, `activity_dateend`,`activity_pettype`,`activity_location`,`activity_time`,`activity_decription`, `activity_notice`,`activity_notice2`,`activity_image`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const [result] = await db.query(sql,[activity_name,activity_datestart, activity_dateend,activity_pettype,activity_location,activity_time,activity_decription, activity_notice,activity_notice2,activity_image])

    output.result = result;
    output.success = !! result.affectedRows;
    res.json(output);
});


router.get("/edit/:activity_id",async(req,res)=>{

    const activity_id = +req.params.activity_id ||0;
    if(!activity_id){
        return res.redirect(req.baseUrl); //轉向到列表頁
    }

    const sql = "SELECT * FROM activity WHERE activity_id=?";
    const [rows] = await db.query(sql,[activity_id]);
    if(rows.length<1){
        return res.redirect(req.baseUrl); //轉向到列表頁
    }
    const row = rows[0];
    // res.json(row);

    //從哪裡來
    const referer = req.get('Referer') || req.baseUrl;
    
    res.render("activity-edit",{...row,referer});
});


router.put("/edit/:activity_id",upload.none(),async(req,res)=>{
    // return res.json(req.body);

    const output = {
        success:false,
        postData:req.body,
        code:0,
        errors:{},
    };

    const activity_id = +req.params.activity_id ||0;
    if(!activity_id){
        output.error.activity_id = '沒有資料編號';
        return res.json(output);  //API不要用轉向
    }

    const {activity_name,activity_datestart,activity_dateend,activity_pettype,activity_location,activity_time,activity_decription,activity_notice,activity_notice2,activity_image} = req.body;

    // const {filename: activity_image}=req.file;

    if(!activity_name || activity_name.length<1){
        output.errors.activity_name = '請輸入正確的活動名稱';
        return res.json(output);
    }

    const sql = "UPDATE `activity` SET `activity_name`=?,`activity_datestart`=?,`activity_dateend`=?,`activity_pettype`=?,`activity_location`=?,`activity_time`=?,`activity_decription`=?,`activity_notice`=?,`activity_notice2`=?,`activity_image`=? WHERE `activity_id`=?";

    const [result] = await db.query(sql,[activity_name,activity_datestart,activity_dateend,activity_pettype,activity_location,activity_time,activity_decription,activity_notice,activity_notice2,activity_image,activity_id])

    output.result = result;
    output.success = !! result.changedRows;

    res.json(output);
});

router.get("/",async(req,res)=>{
    const output = await getListData(req,res);
    res.render('activity-list',output);
});

router.get("/api",async(req,res)=>{
    const output = await getListData(req,res);
    for(let item of output.rows){
        item.activity_date = res.locals.toDateString(item.activity_datestart); //修改activity_date格式
        item.activity_enddate = res.locals.toDatetimeString(item.activity_dateend); //修改activity_enddate格式
      }
    res.json(output);
});
router.get("/activity-list/api",async(req,res)=>{
    const sql = "SELECT * FROM activity ";
    const [result] = await db.query(sql)
    res.json(result);
    
});

router.get("/activitydetail/:activity_id",async(req,res)=>{
    const output = {
        success:false,
        postData:req.body,
        code:0,
        errors:{},
    };
    const activity_id = +req.params.activity_id ||0;
    if(!activity_id){
        output.errors.activity_id = '沒有資料編號';
        return res.json(output);  //API不要用轉向
    }
    const sql = "SELECT * FROM activity WHERE activity_id=?";
    const [rows] = await db.query(sql,[activity_id]);
    if(rows.length<1){
        return res.redirect(req.baseUrl); //轉向到列表頁
    }
    // const row = rows[0];
    res.json(rows[0]);
});

//活動報名
router.post('/addForm', upload.none(), async(req, res)=>{ 
    const output = {
      success:false,
      postData: req.body, //除錯用
      code:0,
      errors: {}
    };
  
    console.log(output);
    // return res.json(output)
  
   
    let {mid, pets, activity_id} = req.body;
    const sql = "INSERT INTO `activityform`(`activityform_time`, `mid`, `activity_id`, `pet_id`) VALUES (NOW(), ?, ?, ?)"
    const [result] = await db.query(sql, [mid, activity_id, pets])
  
    output.result = result; 
    output.success = !!result.affectedRows;
  
    res.json(output);
  })

//活動狀態
router.put('/AformState/:activityform_id', upload.none(), async(req, res)=>{ 
    const output = {
        success:false,
        postData:req.params.activityform_id,
        code:0,
        errors:{},
    };
    // console.log(output);
    // return res.json(output)

    const {activityform_id } = req.params

    const sql = "UPDATE `activityform` SET `activityform_state`=0 WHERE `activityform_id`=?";

    const [result] = await db.query(sql,[activityform_id])

    output.result = result;
    output.success = !! result.changedRows;

    res.json(output);
  })

//取得該會員的所有預約活動紀錄
router.get("/ActivityRecord/:mid",async(req,res)=>{
    const output = {
        success:false,
        postData:req.body,
        code:0,
        errors:{},
    };
    const mid = +req.params.mid ||0;
    if(!mid){
        output.error.mid = '沒有資料編號';
        return res.json(output);  //API不要用轉向
    }
    const sql = "SELECT activity.*,activityform.*,pet.*,member.* FROM activityform JOIN activity ON activityform.activity_id=activity.activity_id JOIN pet ON pet.pet_id=activityform.pet_id JOIN member ON member.mid=activityform.mid WHERE activityform.mid=?";
    const [rows] = await db.query(sql,[mid]);
    // if(rows.length<1){
    //     return res.redirect(req.baseUrl); //轉向到列表頁
    // }
    // const row = rows[0];
    res.json(rows);
})

//取得某一筆預約活動的明細
router.get("/DetailActivityRecord/:activityform_id",async(req,res)=>{
    const output = {
        success:false,
        postData:req.body,
        code:0,
        errors:{},
    };
    const activityform_id = +req.params.activityform_id ||0;
    if(!activityform_id){
        output.error.activityform_id = '沒有資料編號';
        return res.json(output);  //API不要用轉向
    }
    const sql = "SELECT activity.*,activityform.*,pet.*,member.* FROM activityform JOIN activity ON activityform.activity_id=activity.activity_id JOIN pet ON pet.pet_id=activityform.pet_id JOIN member ON member.mid=activityform.mid WHERE activityform.activityform_id=?";
    const [rows] = await db.query(sql,[activityform_id]);
    // if(rows.length<1){
    //     return res.redirect(req.baseUrl); //轉向到列表頁
    // }
    // const row = rows[0];
    res.json(rows[0]);
})

router.delete("/:activity_id",async(req,res)=>{
    const output = {
        success:false,
        error:'',
    }

    const activity_id = +req.params.activity_id ||0;
    if(!activity_id){
        output.error = '沒有activity_id';
        return res.json(output);
    }
    const sql = "DELETE FROM `activity` WHERE activity_id=?";
    const [result] = await db.query(sql,[activity_id]);

    output.success = !! result.affectedRows;
    res.json(output);

});

module.exports=router;