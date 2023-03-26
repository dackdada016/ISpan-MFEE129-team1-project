const express = require('express');

const router = express.Router();

router.get('/admin2/:action?/:id?', (req, res)=>{
  const {url, baseUrl, originalUrl} = req;
  res.json({
    ...req.params,
    url,
    baseUrl,
    originalUrl,
  });
});

module.exports = router;