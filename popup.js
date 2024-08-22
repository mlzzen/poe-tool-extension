
document.querySelector('.btn_pob').addEventListener('click', () => getCookie(true));

document.querySelector('.btn_yishua').addEventListener('click', () => getCookie());

document.querySelector('.btn_clear').addEventListener('click', clearCookie);

document.querySelector('.btn_verify').addEventListener('click', loginVerify);

let poesessidPuin = '';
let POESESSID = '';
let p_uin = '';

document.addEventListener('DOMContentLoaded', async () => {
    await getCookieFromLocal();
    const Cookie = POESESSID && p_uin ? `POESESSID=${POESESSID};p_uin=${p_uin}` : undefined;
    const res = await fetch('https://poe.game.qq.com/my-account', {
        headers: {
            Cookie
        }
    })
    if (res.status === 401) {
        // clearCookie();
        writeMessage('未登录');
    } else if (res.status === 200) {
        if (POESESSID && p_uin) {
            saveCookie(POESESSID, p_uin);
        } else {
            getCookieFromNetwork();
        }
        writeMessage('已登录');
    }
});

// 获取现有的 cookie 并添加新字段
async function getCookiesAndAddFields(POESESSID, p_uin) {
    try {
        const cookies = await chrome.cookies.getAll({ url: 'https://poe.game.qq.com/my-account' });
        let cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        if (POESESSID && p_uin && !(cookieString.includes('POESESSID'))) {
            cookieString += `; POESESSID=${POESESSID}; p_uin=${p_uin}`;
        }

        return cookieString;
    } catch (error) {
        console.error('Error getting cookies:', error);
        throw error;
    }
}

async function loginVerify() {
    await getCookieFromLocal();
    const cookieString = await getCookiesAndAddFields(POESESSID, p_uin);
    const res = await fetch('https://poe.game.qq.com/my-account', {
        headers: {
            'Cookie': cookieString
        },
        credentials: 'include'
    })
    if (res.status === 401) {
        // clearCookie();
        writeMessage('未登录');
    } else if (res.status === 200) {
        if (POESESSID && p_uin) {
            saveCookie(POESESSID, p_uin);
        } else {
            getCookieFromNetwork();
        }
        writeMessage('已登录');
    }
}

async function getCookie(isPob) {
    await getCookieFromLocal();
    if (!POESESSID || !p_uin) {
        getCookieFromNetwork(isPob)
    } else {
        poesessidPuin = isPob ? `${POESESSID};p_uin=${p_uin}` : `POESESSID=${POESESSID};p_uin=${p_uin}`;
        copy(poesessidPuin);
    }
}

function clearCookie() {
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
