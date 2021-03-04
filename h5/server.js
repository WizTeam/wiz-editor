const { startServer } = require('wiz-editor/server');
const path = require('path');

console.log(startServer);

// 参考node_modules/wiz-editor/config/server.json 文件
const options = {
  enableFakeTokenApi: true,
  serveStatic: true,
  staticDir: path.resolve('./dist'),
};

console.log(options);

startServer(options);
