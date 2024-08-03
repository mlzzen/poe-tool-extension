
document.querySelector('#btn').addEventListener('click', () => {
    const url = document.querySelector('#select').value;
    let poesessidPuin = '';
    chrome.cookies.get(
        {
            name: 'POESESSID',
            url,
        },
    ).then(res1 => {
        if (res1 === null) {
            writeMessage('not found');
            return;
        }
        poesessidPuin += res1.value;
        return chrome.cookies.get(
            {
                name: 'p_uin',
                url,
            }
        )
    }).then(res2=>{
        if (res2 === null) {
            writeMessage('not found');
            return;
        }
        poesessidPuin += `;p_uin=${res2.value}` ;
        copy(poesessidPuin);
    })


});

function getCookie() {
    chrome.cookies.get(
        {
            name: 'p_uin',
            url,
        },
        function (cookie) {
            console.log('cookie', cookie);
            if (cookie === null) {
                writeMessage('not found');
            } else {
                // copy(cookie.value);
                poesessidPuin += cookie.value;
            }
        },
    );
}

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
