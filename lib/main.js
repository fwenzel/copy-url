const {Cc,Ci} = require("chrome"),
      clipboard = require("clipboard"),
      contextMenu = require("context-menu"),
      notifications = require("notifications"),
      prefs = require("preferences-service"),
      self = require("self"),
      tabs = require("tabs"),
      timer = require("timer");

/* String constants */
const addon_name = 'Copy URL',
      addon_icon = self.data.url('world_link.png'),
      addon_icon32 = self.data.url('world_link32.png'),

      // Preferences
      pref_base = 'extensions.copyurl.',
      notification_pref = pref_base + 'notifications',
      notification_default = 2;


/** Growl notifications with notificationbox fallback */
function notify(txt, win) {
    /* Set URL preference if not set. */
    if (!prefs.has(notification_pref))
        prefs.set(notification_pref, notification_default);

    switch (prefs.get(notification_pref, notification_default)) {
    // No notifications
    case 0:
        return;

    // Box only
    case 1:
        boxNotify(txt, win);
        break;

    // Growl with box fallback
    default:
    case 2:
        try {
            growlNotify(txt);
        } catch (e) {
            boxNotify(txt, win);
        }
        break;
    }
}

/** Notify via Growl */
function growlNotify(txt) {
    notifications.notify({
        title: addon_name,
        iconURL: addon_icon32,
        text: txt
    });
}

/** Notify via notification box. */
function boxNotify(txt, win) {
    console.log(txt);
    let nb = getNotificationBox(),
        notification = nb.appendNotification(
        txt,
        'jetpack-notification-box',
        addon_icon || 'chrome://browser/skin/Info.png',
        nb.PRIORITY_INFO_MEDIUM,
        []
    );
    timer.setTimeout(function() {
        notification.close();
    }, 10 * 1000);
}

/**
 * Get notification box ("yellow bar").
 * Courtesy of bug 533649.
 */
function getNotificationBox() {
    let wm = Cc["@mozilla.org/appshell/window-mediator;1"]
             .getService(Ci.nsIWindowMediator),
        chromeWindow = wm.getMostRecentWindow("navigator:browser"),
        notificationBox = chromeWindow.getNotificationBox(tabs.activeTab.contentWindow);
    return notificationBox;
}

exports.main = function(options, callbacks) {
    /* Add and hook up context menu */
    var item = contextMenu.Item({
        label: 'Copy URL',
        contentScript: 'on("click", function(node, data) {' +
            'let url, canonical;' +
            // use canonical URL if it exists, current URL otherwise.
            'canonical = document.querySelector("link[rel=canonical]");' +
            'if (!(canonical && (url = canonical.href)))' +
            '    url = document.location.href;' +
            'url = url.replace(/(^\s+|\s+$)/g, "");' +
            'postMessage(url);' +
            '});',
        onMessage: function(url) {
            if (url) {
                clipboard.set(url);
                notify("Copied URL to clipboard:\n" + url);
            } else {
                notify('ZOMG, error finding URL.');
            }
        }
    });
    contextMenu.add(item);
}
