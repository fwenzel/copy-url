const clipboard = require("clipboard"),
      contextMenu = require("context-menu"),
      data = require("self").data,
      notify = require("simple-notify").notify,
      tabs = require("tabs"),
      widgets = require("widget");


exports.main = function(options, callbacks) {
    // Add a one-click option to addons bar.
    var widget = widgets.Widget({
        id: "copy-url",
        label: "Copy URL",
        contentURL: data.url('img/world_link.png'),
        onClick: function() {
            var tabworker = tabs.activeTab.attach({
                contentScriptFile: data.url('js/find-url.js'),
                onMessage: processUrl
            });
            tabworker.port.emit('click');
        },
    });

    // Add and hook up context menu
    var ctxMenu = contextMenu.Item({
        label: 'Copy URL',
        contentScriptFile: data.url('js/find-url.js'),
        onMessage: processUrl
    });
}

/** Take posted URL and copy to clipboard. */
function processUrl(url) {
    if (url) {
        clipboard.set(url);
        notify("Copied URL to clipboard:\n" + url);
    } else {
        notify('ZOMG, error finding URL.');
    }
}
