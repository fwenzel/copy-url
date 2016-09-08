self.on('click', findUrl); // Context menu built-in click event.
self.port.on('click', findUrl); // Click event from addons bar tab worker.

function findUrl(node, data) {
  let url;
  let canonical;
  const selectors = ["link[rel=canonical]", "link[rel=permalink]", "meta[property='og:url']"];

  // Use canonical URL if it exists, current URL otherwise.
  for (let i=0; i<selectors.length; i++) {
    if (canonical = document.querySelector(selectors[i])) {
      url = canonical.href || canonical.content;
      break;
    }
  }
  if (!url) {
    url = window.location.href;
  }

  // Return found URL, fallback URL and hash to add-on for processing.
  self.postMessage({
    'url': url.trim(),
    'winLoc': window.location.href,
    'hash': window.location.hash
  });
}
