var child_process = require('child_process');

// Open file in default browser
exports.open = function (file) {
	var browser;
	switch (process.platform) {
    case "win32":
        browser = "start";
        break;
	case "darwin":
        browser = "open";
        break;
	default:
        browser = "xdg-open";
        break;
	}
	child_process.spawn(browser, [file]);
};
