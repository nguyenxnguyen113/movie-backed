const { createFilmError, getFilmError, removeFilmError } = require('../controller/filmError');

const router = require('express').Router();

router.post('/filmError/createFilmError',createFilmError)
router.get('/filmError/getFilmError',getFilmError)
router.post('/filmError/delete',removeFilmError)
module.exports = router