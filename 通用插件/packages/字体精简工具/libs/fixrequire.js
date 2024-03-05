// 'index.' character codes
if (Editor.remote.App.version === "2.4.5") return;
const pluginDistPath = Editor.url(global.pluginDistPath);
const Module = require.main.constructor;
const NativeModule = process.NativeModule;
const pluginNodeModulesPath = global.pluginNodeModulesPath;
// const panelId
if (!process.mainModule.paths.includes(pluginNodeModulesPath)) {
    process.mainModule.paths.push(pluginNodeModulesPath)
}
Module._resolveFilename = function(request, parent, isMain, options) {
    if (NativeModule.canBeRequiredByUsers(request)) {
        return request;
    }

    var paths;

    if (typeof options === 'object' && options !== null &&
        Array.isArray(options.paths)) {
        const fakeParent = new Module('', null);

        paths = [];

        for (var i = 0; i < options.paths.length; i++) {
            const path = options.paths[i];
            fakeParent.paths = Module._nodeModulePaths(path);
            const lookupPaths = Module._resolveLookupPaths(request, fakeParent, true);

            for (var j = 0; j < lookupPaths.length; j++) {
                if (!paths.includes(lookupPaths[j]))
                    paths.push(lookupPaths[j]);
            }
        }
    } else {
        paths = Module._resolveLookupPaths(request, parent, true);
    }

    // Look up the filename first, since that's the cache key.
    let filename = Module._findPath(request, paths, isMain);
    if (!filename) {
        //找不到，尝试去插件目录找啊---------
        filename = Module._findPath(request, [pluginDistPath], isMain);
        if (!filename) {
            const requireStack = [];
            for (var cursor = parent; cursor; cursor = cursor.parent) {
                requireStack.push(cursor.filename || cursor.id);
            }
            let message = `Cannot find module '${request}'`;
            if (requireStack.length > 0) {
                message = message + '\nRequire stack:\n- ' + requireStack.join('\n- ');
            }
            // eslint-disable-next-line no-restricted-syntax
            var err = new Error(message);
            err.code = 'MODULE_NOT_FOUND';
            err.requireStack = requireStack;
            throw err;
        }

    }
    return filename;
};