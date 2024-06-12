document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы формы и результатов
    const fnumberInput = document.getElementById('fnumber');
    const fnumberInfinitySelect = document.getElementById('fnumber-infinity');
    const snumberInput = document.getElementById('snumber');
    const snumberInfinitySelect = document.getElementById('snumber-infinity');
    const operationSelect = document.getElementById('operation');
    const resultInput = document.getElementById('result');
    const nanReason = document.getElementById('nan-reason');
    const nanReasonText = document.getElementById('nan-reason-text');
    const errorImage = document.createElement('img'); // Создаем элемент изображения для отображения ошибки

    // Путь к изображению ошибки
    errorImage.src = 'https://otvet.imgsmail.ru/download/203835580_19f0a93232a9a1e7f0d293579807b437_800.jpg';
    errorImage.style.width = '300px';
    errorImage.style.height = 'auto';

    function calculate() {
        let fnumber, snumber;
        // Получаем значения из полей ввода или устанавливаем Infinity, если выбрано
        if (fnumberInfinitySelect.value === 'positive') {
            fnumber = Infinity;
        } else if (fnumberInfinitySelect.value === 'negative') {
            fnumber = -Infinity;
        } else {
            fnumber = parseFloat(fnumberInput.value);
        }
        if (snumberInfinitySelect.value === 'positive') {
            snumber = Infinity;
        } else if (snumberInfinitySelect.value === 'negative') {
            snumber = -Infinity;
        } else {
            snumber = parseFloat(snumberInput.value);
        }

        const operation = operationSelect.value; // Получаем выбранную операцию

        let result;

        // Выполнение операции в зависимости от выбранной операции
        switch (operation) {
            case '+':
                result = fnumber + snumber;
                break;
            case '-':
                result = fnumber - snumber;
                break;
            case '*':
                result = fnumber * snumber;
                break;
            case '/':
                result = fnumber / snumber;
                break;
        }

        // Проверка на NaN и отображение результата
        if (isNaN(result)) {
            resultInput.value = "NaN"; // Устанавливаем результат в "NaN"
            nanReason.style.display = "block"; // Показываем элемент, объясняющий причину NaN
            nanReasonText.innerText = getNaNReason(fnumber, snumber, operation); // Получаем и отображаем причину NaN
            nanReason.appendChild(errorImage); // Добавляем изображение ошибки
        } else {
            resultInput.value = result; // Отображаем результат
            nanReason.style.display = "none"; // Скрываем элемент с объяснением NaN
            nanReasonText.innerText = ""; // Очищаем текст объяснения NaN
            if (nanReason.contains(errorImage)) {
                nanReason.removeChild(errorImage); // Удаляем изображение ошибки, если оно было добавлено ранее
            }
            updateFloatingPoint(result); // Обновляем отображение числа с плавающей запятой
        }
    }

    function getNaNReason(fnumber, snumber, operation) {
        // Возвращает причину получения NaN
        if (operation === '/' && snumber === 0) {
            return "Деление на ноль.";
        }
        if (isNaN(fnumber)) {
            return "Первое число не введено.";
        }
        if (isNaN(snumber)) {
            return "Второе число не введено.";
        }
        // Возвращает общее объяснение NaN
        return "Неопределённость или NaN (от “not a number”) – это представление,\n придуманное для того, чтобы арифметическая операция\n могла всегда вернуть какое-то не бессмысленное значение.";
    }

    function updateFloatingPoint(inputNumber) {
        // Обновляет отображение числа в формате с плавающей запятой
        const signOutputElement = document.getElementById("sign-output-nan");
        const exponentOutputElement = document.getElementById("exponent-output-nan");
        const mantissaOutputElement = document.getElementById("mantissa-output-nan");

        if (isNaN(inputNumber)) {
            // Если ввод - NaN, отображает "Invalid input"
            signOutputElement.innerHTML = "Invalid input";
            exponentOutputElement.innerHTML = "";
            mantissaOutputElement.innerHTML = "";
            return;
        }

        // Вычисление знака, экспоненты и мантиссы
        const sign = inputNumber >= 0 ? "0" : "1";
        const absoluteValue = Math.abs(inputNumber);
        const exponent = Math.floor(Math.log2(absoluteValue));
        const mantissa = absoluteValue / Math.pow(2, exponent);

        // Преобразование экспоненты и мантиссы в двоичные строки
        let exponentBinary = (exponent + 127).toString(2).padStart(8, '0');
        let mantissaBinary = mantissa.toString(2).substring(2).padEnd(23, '0').slice(0, 23); // Ограничиваем длину мантиссы 23 битами

        // Комбинирование знака, экспоненты и мантиссы в одну двоичную строку
        let signBit = `<div class="bit sign">${sign}</div>`;
        let exponentBits = '';
        for (let i = 0; i < exponentBinary.length; i++) {
            exponentBits += `<div class="bit exponent">${exponentBinary[i]}</div>`;
        }
        let mantissaBits = '';
        for (let i = 0; i < mantissaBinary.length; i++) {
            mantissaBits += `<div class="bit mantissa">${mantissaBinary[i]}</div>`;
        }

        // Отображение двоичных строк как отдельных битов
        signOutputElement.innerHTML = signBit;
        exponentOutputElement.innerHTML = exponentBits;
        mantissaOutputElement.innerHTML = mantissaBits;
    }

// Слушатели событий для ввода и изменения значений в форме
    fnumberInput.addEventListener('input', calculate);
    snumberInput.addEventListener('input', calculate);
    fnumberInfinitySelect.addEventListener('change', () => {
        // Обработка изменений значения Infinity/Finite для первого числа
        if (fnumberInfinitySelect.value === 'finite') {
            fnumberInput.type = 'number';
            fnumberInput.removeAttribute('readonly');
        } else {
            fnumberInput.type = 'text';
            fnumberInput.value = fnumberInfinitySelect.value === 'positive' ? 'Infinity' : '-Infinity';
            fnumberInput.setAttribute('readonly', 'readonly');
        }
        calculate();
    });
    snumberInfinitySelect.addEventListener('change', () => {
        // Обработка изменений значения Infinity/Finite для второго числа
        if (snumberInfinitySelect.value === 'finite') {
            snumberInput.type = 'number';
            snumberInput.removeAttribute('readonly');
        } else {
            snumberInput.type = 'text';
            snumberInput.value = snumberInfinitySelect.value === 'positive' ? 'Infinity' : '-Infinity';
            snumberInput.setAttribute('readonly', 'readonly');
        }
        calculate();
    });
    operationSelect.addEventListener('change', calculate); // Обновление результата при изменении операции
});
