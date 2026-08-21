const { createRouter } = require('./shared/router');

const router = createRouter();

router.addRoute('tool', '/tools/tool.html');
router.addRoute('workspace', '/dashboard/workspace.html');

// add placeholder tool route
router.addRoute('placeholder', '/tools/placeholder/index.html');

module.exports = {
  router,
};