const { createFilmError, getFilmError } = require('../controller/filmError');

const router = require('express').Router();

router.post('/filmError/createFilmError',createFilmError)
router.get('/filmError/getFilmError',getFilmError)

module.exports = router