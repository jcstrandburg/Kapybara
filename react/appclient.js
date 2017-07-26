//let csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
let csrftoken = "";

// todo remove 'things' default value here, it makes no sense
let defaultHeaders = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': 'things',
});

export function fetchJson(url, options={}) {
    var method = options.method || 'GET';

    var fetchOptions = {
        credentials: "same-origin",
        method: options.method || 'GET',
        body: JSON.stringify(options.body),
        headers: {
            defaultHeaders,
            'X-CSRFToken': csrftoken,
        }
    }
    return fetch(url, fetchOptions).
        then(response => response.json());
}
