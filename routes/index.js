const searchRoutes = require('./searchRoutes');
const router = require('express').Router();

router.use(searchRoutes);

module.exports = router;