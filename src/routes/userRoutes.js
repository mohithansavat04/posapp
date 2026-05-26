const express = require('express');
const router = express.Router();
const { getUsers, addUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getUsers)
  .post(addUser);

module.exports = router;
