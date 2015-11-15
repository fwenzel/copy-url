const clipboard = require("sdk/clipboard"),
      cm = require("sdk/context-menu"),
      data = require("sdk/self").data,
      notifications = require("sdk/notifications"),
      tabs = require("sdk/tabs"),
      ui = require("sdk/ui");

const addon_name = 'Copy URL',
      addon_icon = data.url('img/world_link.png'),
      addon_icon32 = data.url('img/world_link32.png');


exports.main = function(options, callbacks) {
    // Add a one-click option to toolbar.
    var btn = ui.ActionButton({
        id: "copy-url",
        label: "Copy URL",
        icon: data.url('img/world_link.png'),
        onClick: function() {
            var tabworker = tabs.activeTab.attach({
                contentScriptFile: data.url('js/find-url.js'),
                onMessage: processUrl
            });
            tabworker.port.emit('click');
        },
    })

    // Add and hook up context menu
    var ctxMenu = cm.Item({
        label: addon_name,
        image: addon_icon,
        context: cm.PageContext(),
        contentScriptFile: data.url('js/find-url.js'),
        onMessage: processUrl
    });
}

function notify(txt) {
    notifications.notify({
        title: addon_name,
        text: txt,
        iconURL: addon_icon32
    })
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
