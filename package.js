Package.describe({
  name: 'hualc:adhoc-server',
  version: '0.8.0',
  summary: 'Adhoc api for A/B testing',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('adhoc-server.js', 'server');
  api.export('adhoc', 'server')
});