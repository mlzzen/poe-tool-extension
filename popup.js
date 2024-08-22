
document.querySelector('.btn_pob').addEventListener('click', () => getCookie(true));

document.querySelector('.btn_yishua').addEventListener('click', () => getCookie());

document.querySelector('.btn_clear').addEventListener('click', clearCookie);


let poesessidPuin = '';
let POESESSID = '';
let p_uin = '';

async function getCookie(isPob) {
    await getCookieFromLocal();
    if (!POESESSID || !p_uin) {
        getCookieFromNetwork(isPob)
    } else{
        poesessidPuin = isPob ? `${POESESSID};p_uin=${p_uin}` : `POESESSID=${POESESSID};p_uin=${p_uin}`;
        copy(poesessidPuin);
    }
}

function clearCookie(){
    chrome.storage.local.remove('POESESSID');
    chrome.storage.local.remove('p_uin');
    writeMessage('清除成功');
}

async function getCookieFromLocal() {
    const sidData = await chrome.storage.local.get('POESESSID');
    const puinData = await chrome.storage.local.get('p_uin');
    POESESSID = sidData.POESESSID || ''
    p_uin = puinData.p_uin || ''
}

function saveCookie(POESESSID, p_uin) {
    chrome.storage.local.set({ POESESSID, }, () => { });
    chrome.storage.local.set({ p_uin }, () => { });
}

function getCookieFromNetwork(isPob) {
    const url = document.querySelector('#select').value;
    chrome.cookies.get(
        {
            name: 'POESESSID',
            url,
        },
    ).then(res => {
        if (res === null) {
            writeMessage('未登录');
            return;
        }
        POESESSID = res.value;
        poesessidPuin += isPob ? `${res.value};` : `POESESSID=${res.value};`;
        return chrome.cookies.get(
            {
                name: 'p_uin',
                url,
            }
        )
    }).then(res => {
        if (res === null) {
            writeMessage('未登录');
            return;
        }
        p_uin = res.value;
        poesessidPuin += `p_uin=${res.value}`;
        saveCookie(POESESSID, p_uin)
        copy(poesessidPuin);
    })
}

function writeMessage(param) {
    const messageContent = document.querySelector('.message-wrap');
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
