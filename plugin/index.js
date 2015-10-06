function configurePaths(config) {
    var paths = this.paths = new Array(config.paths.length);

    for (var i = 0; i < config.paths.length; i++) {
        var path = config.paths[i];
        if (path.constructor === String) {
            path = {
                srcDir: path,
                localizedDir: path
            };
        } else {
            if (!path.localizedDir && !path.srcDir) {
                throw new Error('"srcDir" or "localizedDir" is required for i18n path');
            } else if(!path.localizedDir) {
                path.localizedDir = path.srcDir;
            } else if(!path.srcDir) {
                path.srcDir = path.localizedDir;
            }
        }

        paths[i] = path;
    }
    
    return paths;
}

module.exports = function plugin(lasso, config) {

    if (!config.paths) {
        throw new Error('"paths" configuration option is required');
    }

    config.paths = configurePaths(config);
    
    if (!config.locales || !config.locales.length) {
        config.locales = [''];
    } else {
        config.locales.push('');
    }

    lasso.dependencies.registerType('i18n', require('./dependency-i18n.js')(config));
    lasso.dependencies.registerPackageType('i18n-config', require('./dependency-i18n-config.js')(config));
    lasso.dependencies.registerJavaScriptType('i18n-config-def', require('./dependency-i18n-config-def.js')(config));
    lasso.dependencies.registerJavaScriptType('i18n-locale', require('./dependency-i18n-locale.js'));
    
    lasso.dependencies.registerExtension('i18n.json', 'i18n');
    lasso.dependencies.registerExtension('i18n-config', 'i18n-config');
    lasso.dependencies.registerExtension('i18n-config-def', 'i18n-config-def');
};