
document.querySelector('.btn_pob').addEventListener('click', () => {
    getCookie(true);
});

document.querySelector('.btn_yishua').addEventListener('click', () => {
    getCookie();
});


function getCookie(isPob) {
    const url = document.querySelector('#select').value;
    let poesessidPuin = '';
    chrome.cookies.get(
        {
            name: 'POESESSID',
            url,
        },
    ).then(res1 => {
        if (res1 === null) {
            writeMessage('未登录');
            return;
        }
        poesessidPuin += isPob ? `${res1.value};`: `POESESSID=${res1.value};`;
        return chrome.cookies.get(
            {
                name: 'p_uin',
                url,
            }
        )
    }).then(res2=>{
        if (res2 === null) {
            writeMessage('未登录');
            return;
        }
        poesessidPuin += `p_uin=${res2.value}` ;
        copy(poesessidPuin);
    })
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
    writeMessage('已复制');
}
