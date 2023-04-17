const router = require('express').Router();
const authController = require('./controllers/auth-controller')
const activateController = require('./controllers/activate-controller')
const authMiddleware = require('./middlewares/auth-middleware');
const findRideController = require('./controllers/findRide-controller');
const bookRideController = require('./controllers/bookRide-controller');

router.post('/api/send-otp',authController.sendOtp)
router.post('/api/verify-otp',authController.verifyOtp)
router.post('/api/activate',authMiddleware,activateController.activate)
router.post('/api/find-ride',findRideController.findMatch)
router.post('/api/book-ride',bookRideController.bookRide)

module.exports = router;