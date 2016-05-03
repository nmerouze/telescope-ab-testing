Package.describe({
  name: "abtests",
  summary: "Telescope abtests package",
  version: "0.26.0-nova",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@0.26.0-nova',
    'nova:base-components@0.26.0-nova'
  ]);

  api.addFiles([
    'lib/components.jsx',
    'lib/collection.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  api.export('ABTests');

});
