
/*
 * All routes for the application
 */

exports.proxy = function(req, res){
    res.render('layout', { title: 'Express', body: 'hello world' })
};