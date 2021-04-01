module.exports = {
  apps: [
    {
      name: "ot_server_80",
      script: "index.js",
      args: "-p 80",
      cwd: "/root/wiz-editor/wiki/server",
      instance_var: "INSTANCE_ID",
      time: false,
      env: {
        FORCE_DEBUG: 1,
      },
    },
  ],
};
