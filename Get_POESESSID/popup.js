document.querySelector('#btn').addEventListener('click', () => {
    const url = document.querySelector('#select').value;
    chrome.cookies.get(
        {
            name: 'POESESSID',
            url,
        },
        function (cookie) {
            console.log('cookie', cookie);
            if (cookie === null) {
                writeMessage('not found');
            } else {
                copy(cookie.value);
            }
        },
    );
});

function writeMessage(param) {
    const messageContent = document.querySelector('.message-content');
    messageContent.innerText = param;
}

function copy(value) {
    const copyipt = document.createElement('input');
    copyipt.setAttribute('value', value);
    document.body.appendChild(copyipt);
    copyipt.select();
    document.execCommand('copy');
    document.body.removeChild(copyipt);
    writeMessage('Copied');
}
