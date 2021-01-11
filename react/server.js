const { startServer } = require('wiz-editor/server');
const path = require('path');

console.log(startServer);

const options = {
  enableFakeTokenApi: true,
  serveStatic: true,
  staticDir: path.resolve('./build'),
  storage: {
    webhook: {
      enable: true,
      latestVersionDelay: 20,
      latestVersionURL: 'http://localhost:9000', // 推送文档内容到搜索引擎
    },
  },
};

console.log(options);

startServer(options);
