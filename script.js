// 检测微信浏览器
function detectWeChat() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('micromessenger')) {
        document.getElementById('wechatWarning').classList.add('show');
        document.getElementById('mainContent').classList.add('hide');
    }
}

// 清空文本
function clearText(elementId) {
    document.getElementById(elementId).value = '';
}

// 标签切换
function showTab(tabName) {
    // 隐藏所有标签内容
    const tabContents = document.querySelectorAll('.tab-content');
    const tabs = document.querySelectorAll('.tab');
    
    tabContents.forEach(content => content.classList.remove('active'));
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // 显示选中的标签
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
    
    // 隐藏结果
    document.getElementById('encrypt-result').classList.remove('show');
    document.getElementById('decrypt-result').classList.remove('show');
}

// 生成随机密钥
function generateRandomKey() {
    return window.crypto.getRandomValues(new Uint8Array(32));
}

// 粘贴并加密
async function pasteAndEncrypt() {
    try {
        // 尝试从剪贴板读取文本
        const text = await navigator.clipboard.readText();
        
        if (text) {
            // 填入文本框
            document.getElementById('plaintext').value = text;
            // 执行加密
            encryptText();
        } else {
            showResult('encrypt', '剪贴板中没有文本', false);
        }
    } catch (error) {
        // 如果无法访问剪贴板API
        showResult('encrypt', '无法访问剪贴板，请手动粘贴文本', false);
        console.log('剪贴板访问失败:', error);
    }
}

// 加密文本
async function encryptText() {
    const plaintext = document.getElementById('plaintext').value;
    
    if (!plaintext) {
        showResult('encrypt', '请输入要加密的文本', false);
        return;
    }
    
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(plaintext);
        
        // 生成随机密钥和IV
        const key = await window.crypto.subtle.generateKey(
            {
                name: 'AES-GCM',
                length: 256
            },
            true,
            ['encrypt', 'decrypt']
        );
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        
        // 加密数据
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            data
        );
        
        // 导出密钥
        const exportedKey = await window.crypto.subtle.exportKey('raw', key);
        const keyArray = new Uint8Array(exportedKey);
        
        // 组合IV、密钥和加密数据
        const encryptedArray = new Uint8Array(encryptedData);
        const resultArray = new Uint8Array(iv.length + keyArray.length + encryptedArray.length);
        resultArray.set(iv);
        resultArray.set(keyArray, iv.length);
        resultArray.set(encryptedArray, iv.length + keyArray.length);
        
        // 转换为Base64
        const base64Result = btoa(String.fromCharCode(...resultArray));
        
        showResult('encrypt', base64Result, true);
        
    } catch (error) {
        showResult('encrypt', '加密失败：' + error.message, false);
        console.error('加密错误:', error);
    }
}

// 粘贴并解密
async function pasteAndDecrypt() {
    try {
        // 尝试从剪贴板读取文本
        const text = await navigator.clipboard.readText();
        
        if (text) {
            // 填入文本框
            document.getElementById('ciphertext').value = text;
            // 执行解密
            decryptText();
        } else {
            showResult('decrypt', '剪贴板中没有文本', false);
        }
    } catch (error) {
        // 如果无法访问剪贴板API
        showResult('decrypt', '无法访问剪贴板，请手动粘贴文本', false);
        console.log('剪贴板访问失败:', error);
    }
}

// 解密文本
async function decryptText() {
    const ciphertext = document.getElementById('ciphertext').value;
    
    if (!ciphertext) {
        showResult('decrypt', '请输入要解密的文本', false);
        return;
    }
    
    try {
        // 从Base64解码
        let decodedData;
        try {
            decodedData = atob(ciphertext);
        } catch (e) {
            showResult('decrypt', '解密失败：无效的加密文本格式', false);
            return;
        }
        
        const encryptedData = Uint8Array.from(decodedData, c => c.charCodeAt(0));
        
        // 提取IV、密钥和加密数据
        const iv = encryptedData.slice(0, 12);
        const keyData = encryptedData.slice(12, 44); // AES-256密钥长度为32字节
        const data = encryptedData.slice(44);
        
        // 导入密钥
        const key = await window.crypto.subtle.importKey(
            'raw',
            keyData,
            {
                name: 'AES-GCM',
                length: 256
            },
            false,
            ['decrypt']
        );
        
        // 解密数据
        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            data
        );
        
        // 转换为文本
        const decoder = new TextDecoder();
        const plaintext = decoder.decode(decryptedData);
        
        showResult('decrypt', plaintext, true);
        
    } catch (error) {
        showResult('decrypt', '解密失败：' + error.message, false);
        console.error('解密错误:', error);
    }
}

// 显示结果
function showResult(type, text, isSuccess) {
    const resultDiv = document.getElementById(type + '-result');
    const outputDiv = document.getElementById(type + '-output-text');
    
    // 根据类型处理显示方式
    if (type === 'decrypt' && isSuccess) {
        // 解密结果需要保留换行和空格
        outputDiv.innerHTML = text.replace(/\n/g, '<br>');
    } else if (type === 'encrypt' && isSuccess) {
        // 加密结果是纯Base64，直接显示，去除可能的首尾空格
        outputDiv.textContent = text.trim();
    } else {
        // 错误信息等直接显示
        outputDiv.textContent = text;
    }
    resultDiv.className = 'result show ' + (isSuccess ? 'success' : 'error');
}

// 复制到剪贴板
async function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    
    // 获取原始文本
    let text;
    if (element.innerHTML.includes('<br>')) {
        // 如果包含HTML标签，需要转换回纯文本
        text = element.innerHTML.replace(/<br>/g, '\n');
    } else {
        // 纯文本直接获取
        text = element.textContent;
    }
    
    const btn = event.target;
    
    // 方法1: 使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            showCopySuccess(btn);
            return;
        } catch (error) {
            console.log('Clipboard API 失败，尝试备用方法');
        }
    }
    
    // 方法2: 使用 document.execCommand (兼容性更好)
    try {
        // 创建临时文本区域
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        // 选择并复制
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        
        // 清理
        document.body.removeChild(textArea);
        
        if (successful) {
            showCopySuccess(btn);
        } else {
            showCopyError(btn);
        }
    } catch (error) {
        console.log('execCommand 失败，使用最后备用方法');
        showCopyError(btn);
    }
}

// 显示复制成功
function showCopySuccess(btn) {
    const originalText = btn.textContent;
    btn.textContent = '✅ 已复制';
    btn.style.background = '#20c997';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '#28a745';
    }, 2000);
}

// 显示复制失败
function showCopyError(btn) {
    const originalText = btn.textContent;
    btn.textContent = '❌ 复制失败';
    btn.style.background = '#dc3545';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '#28a745';
    }, 2000);
}

// 页面加载时检测微信
window.addEventListener('load', detectWeChat); 