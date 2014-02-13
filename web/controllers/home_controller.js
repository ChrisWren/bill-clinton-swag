/*
 * Public: Get action for them homepage
 *
 * Returns: HTML homepage.
 */
module.exports.index = function(req, resp) {
  resp.render('index', {
    layout: 'application'
  });
}
