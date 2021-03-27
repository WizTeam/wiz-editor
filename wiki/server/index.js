const { startServer } = require("wiz-editor/server");
const path = require("path");

// 参考node_modules/wiz-editor/config/server.json 文件
const options = {
  enableFakeTokenApi: true, // 仅用于demo，测试和生产环境，都不要启用这个功能，具体token生成方式，请在自己的业务中实现。
  serveStatic: true, // 发布静态文件
  staticDir: path.resolve("./dist"), //静态文件目录
  database: {
    use: "sqlite",
    opUse: "memory",
    mysql: {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "root",
      database: "ot",
      connectionLimit: 100,
    },
  },
};

console.log(options);

startServer(options);
