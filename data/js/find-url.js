on('click', function(node, data) {
    let url,
        canonical;

    // use canonical URL if it exists, current URL otherwise.
    canonical = document.querySelector("link[rel=canonical]");
    if (!(canonical && (url = canonical.href)))
        url = document.location.href;

    // return url with leading and trailing whitespace removed.
    postMessage(url.trim());
});
