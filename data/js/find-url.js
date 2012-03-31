self.on('click', findUrl); // Context menu built-in click event.
self.port.on('click', findUrl); // Click event from addons bar tab worker.

function findUrl(node, data) {
    let url,
        canonical;

    // use canonical URL if it exists, current URL otherwise.
    canonical = document.querySelector("link[rel=canonical]");
    if (!(canonical && (url = canonical.href)))
        url = document.location.href;

    // return url with leading and trailing whitespace removed.
    self.postMessage(url.trim());
}
