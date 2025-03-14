// ==UserScript==
// @name         Auto Trading Script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automated trading operations with safety controls
// @author       You
// @match        https://app.defi.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=your-trading-website.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let intervalId = null;
    let isProcessing = false; // 状态锁
    let lastOperationTime = 0; // 最后操作时间
    const COOLDOWN_TIME = 30000; // 30秒冷却时间

    // 创建控制按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.right = '20px';
    toggleBtn.style.top = '20px';
    toggleBtn.style.zIndex = '9999';
    toggleBtn.style.padding = '10px 20px';
    toggleBtn.style.borderRadius = '5px';
    toggleBtn.style.cursor = 'pointer';
    updateButtonState();

    function updateButtonState() {
        toggleBtn.textContent = isRunning ? '🟢 运行中' : '🔴 已停止';
        toggleBtn.style.backgroundColor = isRunning ? '#4CAF50' : '#f44336';
        toggleBtn.style.color = 'white';
    }

    toggleBtn.addEventListener('click', () => {
        isRunning = !isRunning;
        updateButtonState();
        if (isRunning) {
            startChecking();
        } else {
            stopChecking();
        }
    });

    document.body.appendChild(toggleBtn);

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function handleSOL() {
        if (isProcessing || Date.now() - lastOperationTime < COOLDOWN_TIME) return;
        isProcessing = true;

        try {
            const inputField = document.getElementsByClassName("rounded-xl border disabled:bg-surface-secondary mt-0.5 min-h-[90px] w-full min-w-0 flex-1 rounded-t-none border-none bg-surface-secondary p-0 pb-6.5 pl-5 text-3xl font-semibold outline-none")[0];
            const valueElement = document.getElementsByClassName('shrink-1')[2];

            if (!inputField || !valueElement) {
                throw new Error('Required elements not found');
            }

            // 触发输入事件
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                'value'
            ).set;
            nativeInputValueSetter.call(inputField, parseFloat(valueElement.textContent) / 2);

            const inputEvent = new Event('input', { bubbles: true });
            inputField.dispatchEvent(inputEvent);

            const changeEvent = new Event('change', { bubbles: true });
            inputField.dispatchEvent(changeEvent);

            inputField.focus();
            inputField.blur();

            await delay(6000);
            const actionBtn = document.getElementsByClassName("flex cursor-pointer items-center justify-center gap-2 font-semibold disabled:cursor-auto disabled:text-text-readonly transition-colors ring-offset-2 focus:outline-none focus-visible:ring-2 bg-action-primary text-text-brand hover:bg-action-primary-hover active:bg-action-primary-active disabled:bg-action-primary-disabled rounded-xl px-4 py-3 text-lg relative h-13 w-full")[0];
            if (!actionBtn) throw new Error('Action button not found');
            actionBtn.click();


            await delay(2000);
            const confirmBtn = document.getElementsByClassName("flex cursor-pointer items-center justify-center gap-2 font-semibold disabled:cursor-auto disabled:text-text-readonly transition-colors ring-offset-2 focus:outline-none focus-visible:ring-2 disabled:bg-action-primary-disabled px-3 py-2.5 text-base absolute left-1/2 top-1.5 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-none bg-[#062118] text-white hover:bg-input-hover active:bg-input-active")[0];
            if (!confirmBtn) throw new Error('Confirm button not found');
            confirmBtn.click();


            lastOperationTime = Date.now();
        } catch (error) {
            console.error('SOL处理错误:', error);
        } finally {
            isProcessing = false;
        }
    }

    async function handleKHAI() {
        if (isProcessing || Date.now() - lastOperationTime < COOLDOWN_TIME) return;
        isProcessing = true;

        try {
            const firstBtn = document.getElementsByClassName("shrink-1 flex min-w-0")[0];
            firstBtn.click();

            await delay(6000);
            const actionBtn = document.getElementsByClassName("flex cursor-pointer items-center justify-center gap-2 font-semibold disabled:cursor-auto disabled:text-text-readonly transition-colors ring-offset-2 focus:outline-none focus-visible:ring-2 bg-action-primary text-text-brand hover:bg-action-primary-hover active:bg-action-primary-active disabled:bg-action-primary-disabled rounded-xl px-4 py-3 text-lg relative h-13 w-full")[0];
            if (!actionBtn) throw new Error('Action button not found');
            actionBtn.click();

            await delay(2000);
            const confirmBtn = document.getElementsByClassName("flex cursor-pointer items-center justify-center gap-2 font-semibold disabled:cursor-auto disabled:text-text-readonly transition-colors ring-offset-2 focus:outline-none focus-visible:ring-2 disabled:bg-action-primary-disabled px-3 py-2.5 text-base absolute left-1/2 top-1.5 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-none bg-[#062118] text-white hover:bg-input-hover active:bg-input-active")[0];
            if (!confirmBtn) throw new Error('Confirm button not found');
            confirmBtn.click();

            lastOperationTime = Date.now();
        } catch (error) {
            console.error('KHAI处理错误:', error);
        } finally {
            isProcessing = false;
        }
    }

    function startChecking() {
        intervalId = setTimeout(async function check() {
            if (!isRunning) return;

            const currencyElement = document.getElementsByClassName('text-base leading-6 font-semibold')[3];
            if (currencyElement) {
                try {
                    if (currencyElement.textContent === 'SOL') {
                        await handleSOL();
                    } else if (currencyElement.textContent !== 'SOL') {
                        await handleKHAI();
                    }
                } catch (error) {
                    console.error('货币处理错误:', error);
                }
            }

            startChecking(); // 递归调用
        }, 1000);
    }

    function stopChecking() {
        clearTimeout(intervalId);
    }
})();
