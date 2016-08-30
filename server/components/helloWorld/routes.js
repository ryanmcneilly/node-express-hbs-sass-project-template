/**
 * Created by ryanmc on 8/29/2016.
 */

const express = require('express');
const router = express.Router();

router.get('/:message', function (req, res) {
   res.render('components/helloWorld/helloWorld', {message: req.params['message']});
});

module.exports = router;