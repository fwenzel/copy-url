const clipboard = require('sdk/clipboard'),
cm = require('sdk/context-menu'),
data = require('sdk/self').data,
notifications = require('sdk/notifications'),
prefs = require('sdk/simple-prefs').prefs,
tabs = require('sdk/tabs'),
ui = require('sdk/ui');

const addon_name = 'Copy URL';
const addon_icons = {
  '16': data.url('img/copy-url-16.png'),
  '32': data.url('img/copy-url-32.png'),
  '64': data.url('img/copy-url-64.png')
}


exports.main = function(options, callbacks) {
  // Add a one-click option to toolbar.
  var btn = ui.ActionButton({
    id: 'copy-url',
    label: 'Copy URL',
    icon: addon_icons,
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
    image: addon_icons['16'],
    context: cm.PageContext(),
    contentScriptFile: data.url('js/find-url.js'),
    onMessage: processUrl
  });
}

function notify(txt) {
  notifications.notify({
    title: addon_name,
    text: txt,
    iconURL: addon_icons['32']
  })
}

/** Take posted URL and copy to clipboard. */
function processUrl(data) {
  if (!data.url) {
    notify('ZOMG, error finding URL.');
    return;
  }

  var url = data.url;

  // Add or remove hash according to setting.
  var hasHash = (data.hash && url.match(data.hash + '$'));
  if (prefs.includeHash && !hasHash) {
    url += data.hash;
  } else if (!prefs.includeHash && hasHash) {
    url = url.slice(0, - data.hash.length);
  }

  clipboard.set(url);

  if (prefs.notify === 'always' ||
    (prefs.notify === 'diff' && url !== data.winLoc)) {
    notify('Copied URL to clipboard:\n' + url);
  }
}
