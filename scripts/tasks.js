const { mkdir } = require('shelljs');

require('shelljs/global');

const targetBrowser = process.env.TARGET_BROWSER;

exports.replaceWebpack = () => {
  const replaceTasks = [
    {
      from: 'webpack/replace/JsonpMainTemplate.runtime.js',
      to: 'node_modules/webpack/lib/JsonpMainTemplate.runtime.js'
    },
    {
      from: 'webpack/replace/process-update.js',
      to: 'node_modules/webpack-hot-middleware/process-update.js'
    }
  ];

  replaceTasks.forEach((task) => cp(task.from, task.to));
};

exports.copyAssets = (type) => {
  mkdir(type);

  const dest = `${type}/${targetBrowser}`;
  mkdir(dest);

  mkdir(`${dest}/css`);
  exec(`cleancss -o ${dest}/css/overrides.min.css app/styles/overrides/*.css`);
};
