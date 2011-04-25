const clipboard = require("clipboard"),
      contextMenu = require("context-menu"),
      data = require("self").data,
      notify = require("simple-notify").notify;


exports.main = function(options, callbacks) {
    // Add and hook up context menu
    var item = contextMenu.Item({
        label: 'Copy URL',
        contentScriptFile: data.url('js/find-url.js'),
        onMessage: function(url) {
            if (url) {
                clipboard.set(url);
                notify("Copied URL to clipboard:\n" + url);
            } else {
                notify('ZOMG, error finding URL.');
            }
        }
    });
}
