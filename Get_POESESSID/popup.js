document.querySelector('#btn').addEventListener('click', () => {
    const url = document.querySelector('#select').value;
    chrome.cookies.get(
        {
            name: 'POESESSID',
            url,
        },
        function (cookie) {
            copy(cookie.value);
        },
    );
});

function copy(value) {
    var copyipt = document.createElement('input');
    copyipt.setAttribute('value', value);
    document.body.appendChild(copyipt);
    copyipt.select();
    document.execCommand('copy');
    document.body.removeChild(copyipt);
    alert('Success');
}
