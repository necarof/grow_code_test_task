"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const dialogPopUp = document.getElementById('modal');
    const dialogClose = document.getElementById('dialog_btn');

    dialogClose.onclick = () => {
        dialogPopUp.close();
    } 

    const form = document.getElementById('form');
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);

        if (error === 0) {
            dialogPopUp.showModal();

            // json с формы в консоль
            const formData = new FormData(this);
            const jsonObject = {};

            formData.forEach((value, key) => {
                jsonObject[key] = value;
            });

            console.log(JSON.stringify(jsonObject, null, 2));
        } else {
            alert('Нужно заполнить все поля и согласиться с правилами сервиса');
        }
    }

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for (let i = 0; i < formReq.length; i++) {
            const input = formReq[i];
            formRemoveError(input);
    
            if (input.classList.contains('_email')) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
                formAddError(input);
                error++;
            } else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }

    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }

    function emailTest(input) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input.value);
    }

    // Маска на телефон
    const phone = document.getElementById('input_tel');

    function setPhoneMask(input) {
        
        let keyCode;

        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            let pos = this.selectionStart;

            if (pos < 3) event.preventDefault();
            let matrix = "+7 (___) ___ ____",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function(a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");

            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }

            let reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function(a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");

            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            
            if (event.type == "blur" && this.value.length < 5)  this.value = ""
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false);

    }

    setPhoneMask(phone);

    //Только число с точкой на инпуте ожидаемый оборот
    const valInput = document.getElementById('input_val');

    valInput.addEventListener('keydown', (event) => {
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End', 'Control', 'a', '.'
        ];
        
        if (event.ctrlKey && event.key.toLowerCase() === 'a') return;
        
        if (allowedKeys.includes(event.key)) return;
        
        if (!/^[0-9]$/.test(event.key)) {
            event.preventDefault();
        }
    });
})