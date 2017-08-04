let defaultHeaders = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
});

export default function fetchJson(url, options={}) {
    var fetchOptions = {
        credentials: "same-origin",
        method: options.method || 'GET',
        body: JSON.stringify(options.body),
        headers: defaultHeaders
    }
    return fetch(url, fetchOptions).
        then(response => response.json());
}
