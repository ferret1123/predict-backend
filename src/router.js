var express = require('express');
const multer = require('multer');
var router = express.Router();

const{prediction} = require('./predict');

const multerr = multer({
    storage: multer.memoryStorage()
});

router.post('/', multerr.single('file'), prediction);

module.exports = router;