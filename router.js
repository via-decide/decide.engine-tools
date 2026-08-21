const registeredTools = require('./shared/tool-registry');

const toolRoutes = {
  ...registeredTools.reduce((acc, tool) => ({
    ...acc,
    [tool]: `./${tool}/index.html`
  }), {}),
};

export const routes = {
  ...toolRoutes,
};