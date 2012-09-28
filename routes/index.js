// All routes for the application

exports.proxy = function (req, res) {
    res.send({
        title: 'Express',
        body: 'hello world'
    });
};