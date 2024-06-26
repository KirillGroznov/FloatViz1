document.addEventListener("DOMContentLoaded", function () {
    // Функция для преобразования шестнадцатеричного числа в двоичное
    function convertHexToBinary(hex) {
        return hex.split('').map(char => parseInt(char, 16).toString(2).padStart(4, '0')).join('');
    }

    // Функция для удаления пробелов из строки
    function removeSpaces(str) {
        return str.replace(/\s+/g, '');
    }

    // Функция для преобразования числа в формате MF в десятичное число
    function convertMFToNumber(hexNumber) {
        const mfStepsElement = document.getElementById('mf-steps');
        mfStepsElement.innerHTML = ''; // Очищаем предыдущие шаги преобразования

        // Дополнение числа до восьми цифр
        if (hexNumber.length < 8) {
            hexNumber = hexNumber.padEnd(8, '0');
            const stepElement = document.createElement('div');
            stepElement.classList.add('mf-step');
            stepElement.textContent = 'Число было дополнено нулями: ' + hexNumber;
            mfStepsElement.appendChild(stepElement);
        }

        // Преобразуем шестнадцатеричное число в двоичное
        let binaryNumber = convertHexToBinary(hexNumber);
        binaryNumber = binaryNumber.padStart(32, '0'); // Дополняем двоичное число до 32 бит

        // Извлекаем знак, экспоненту и мантиссу
        let sign = binaryNumber.charAt(0);
        let exponent = binaryNumber.substring(1, 8);
        let mantissa = binaryNumber.substring(8);

        // Обновляем значения в соответствующих полях
        document.getElementById('mf-sign').value = sign;
        document.getElementById('mf-exponent').value = exponent;
        document.getElementById('mf-mantissa').value = mantissa;

        // Удаляем пробелы из значений
        sign = removeSpaces(sign);
        exponent = removeSpaces(exponent);
        mantissa = removeSpaces(mantissa);

        // Производим вычисления и получаем шаги преобразования
        const steps = convertMFToSteps(sign, exponent, mantissa);

        // Выполняем функцию convertFromBinarySteps и получаем результаты
        const { result, steps: exponentSteps } = convertFromBinarySteps(exponent);

        // Отображаем результаты в первом шаге
        setTimeout(() => {
            const step1 = `Шаг 1: Результат преобразования из двоичного представления в десятичное число: ${result}`;
            const stepElement1 = document.createElement('div');
            stepElement1.classList.add('mf-step');
            stepElement1.textContent = step1;
            mfStepsElement.appendChild(stepElement1);

            // Добавляем шаги преобразования в отдельные элементы
            exponentSteps.forEach((step, index) => {
                const stepElement = document.createElement('div');
                stepElement.classList.add('mf-step');
                stepElement.textContent = step;
                mfStepsElement.appendChild(stepElement);
            });
        }, 1000);

        // Получаем значение мантиссы после вычислений в функции convertMFToSteps
        const adjustedMantissa = calculateAdjustedMantissa1(sign, exponent, mantissa);

        // Шаг 5: Переводим мантиссу в десятичное число
        const { result: mantissaResults, steps: mantissaSteps } = convertMantissaToHexSteps(mantissa);

        // Отображаем результаты в пятом шаге с использованием setTimeout
        setTimeout(() => {
            const step3 = `Шаг 3: Перевод мантиссы в десятичную форму:`;
            const stepElement3 = document.createElement('div');
            stepElement3.classList.add('mf-step');
            stepElement3.textContent = step3;
            mfStepsElement.appendChild(stepElement3);

            // Добавляем шаги преобразования мантиссы в отдельные элементы
            mantissaSteps.forEach((step, index) => {
                const stepElement3 = document.createElement('div');
                stepElement3.classList.add('mf-step');
                stepElement3.textContent = step;
                mfStepsElement.appendChild(stepElement3);
            });
        }, 3000);

        // Шаг 5: Переводим мантиссу в десятичное число
        const { result: mantissaResult, steps: mantissaSteps1 } = convertFromHexSteps(adjustedMantissa);

        // Отображаем результаты в пятом шаге с использованием setTimeout
        setTimeout(() => {
            const step5 = `Шаг 5: Перевод мантиссы в десятичную форму: ${mantissaResult}`;
            const stepElement5 = document.createElement('div');
            stepElement5.classList.add('mf-step');
            stepElement5.textContent = step5;
            mfStepsElement.appendChild(stepElement5);

            // Добавляем шаги преобразования мантиссы в отдельные элементы
            mantissaSteps1.forEach((step, index) => {
                const stepElement5 = document.createElement('div');
                stepElement5.classList.add('mf-step');
                stepElement5.textContent = step;
                mfStepsElement.appendChild(stepElement5);
            });
        }, 5000);

        // Отображение остальных шагов
        setTimeout(() => {
            mfStepsElement.innerHTML += `<div class="mf-step">${steps[1]}</div>`;
        }, 2000);
        setTimeout(() => {
            mfStepsElement.innerHTML += `<div class="mf-step">${steps[3]}</div>`;
        }, 4000);
        setTimeout(() => {
            mfStepsElement.innerHTML += `<div class="mf-step">${steps[4]}</div>`;
        }, 6000);
    }

    function convertMFToSteps(sign, exponent, mantissa) {
        // Преобразуем знак и экспоненту из двоичного формата в десятичный
        sign = parseInt(sign, 2);
        exponent = parseInt(exponent, 2);

        // Шаг 1: Выводим экспоненту в десятичной форме
        const step1 = `Шаг 1: Порядок в десятичной форме: ${exponent}`;

        // Шаг 2: Корректируем экспоненту, отнимая 64 (смещение в формате MF)
        const adjustedExponent = exponent - 64;
        const step2 = `Шаг 2: Отнимаем 64 от числа, которое мы получили (величина смещения в формате MF равна 64): ${adjustedExponent}`;

        // Преобразуем мантиссу из двоичного формата в шестнадцатеричный
        const mantissaHexString = parseInt(mantissa, 2).toString(16).toUpperCase().padStart(6, '0');
        const step3 = `Шаг 3: Переводим мантиссу в 16-ричный формат: ${mantissaHexString}`;

        // Шаг 4: Корректируем мантиссу, перемещая запятую согласно значению экспоненты
        let adjustedMantissa = mantissaHexString;
        if (adjustedExponent >= 0) {
            // Если экспонента положительная, сдвигаем запятую влево
            adjustedMantissa = adjustedMantissa.slice(0, adjustedExponent) + '.' + adjustedMantissa.slice(adjustedExponent);
            adjustedMantissa = adjustedMantissa.replace(/^0+|0+$/g, ''); // Удаляем лишние нули
        } else {
            // Если экспонента отрицательная, добавляем нули перед мантиссой
            adjustedMantissa = ' 0.' + '0'.repeat(-adjustedExponent) + adjustedMantissa;
            adjustedMantissa = adjustedMantissa.replace(/^0+|0+$/g, ''); // Удаляем лишние нули
        }
        const step4 = `Шаг 4: Двигаем запятую в мантиссе (на экспоненту, полученную во втором шаге): ${adjustedMantissa.toUpperCase()} * 16^${adjustedExponent}`;

        // Перевод целой части мантиссы из шестнадцатеричного в десятичный формат
        const integerPart = parseInt(adjustedMantissa.split('.')[0], 16);

        // Получение дробной части мантиссы
        let fractionalPart = adjustedMantissa.split('.')[1] || '';

        // Инициализация переменной для хранения дробной части мантиссы в десятичном формате
        let decimalFraction = 0;

        // Перевод дробной части мантиссы из шестнадцатеричного в десятичный формат
        for (let i = 0; i < fractionalPart.length; i++) {
            // Переводим каждую цифру из шестнадцатеричной системы в десятичную
            const digit = parseInt(fractionalPart[i], 16);
            // Умножаем каждую цифру на 16 в степени -(i + 1) и добавляем к общей сумме
            decimalFraction += digit * Math.pow(16, -(i + 1));
        }

        // Получаем итоговое десятичное значение мантиссы
        const mantissaDecimal = integerPart + decimalFraction;

        // Определяем знак числа
        const signDescription = (sign === 1) ? 'Ставим минус в начале, так как знак равен 1' : 'Число положительное, так как знак равен 0';

        // Получаем итоговый результат, учитывая знак и экспоненту
        const finalResult = (sign === 1 ? -mantissaDecimal : mantissaDecimal).toFixed(6);

        // Создаем шаг 5 с переводом мантиссы в десятичный формат
        const step5 = `ОТВЕТ: ${finalResult}.  ${signDescription}`;

        // Возвращаем все шаги в виде массива строк
        return [step1, step2, step3, step4, step5];
    }


    // Функция для конвертации мантиссы из двоичного формата в шестнадцатеричный с шагами
    function convertMantissaToHexSteps(mantissa) {
        const steps = [];
        let hexString = '';

        for (let i = 0; i < mantissa.length; i += 4) {
            // Берем по 4 бита за раз
            const binaryChunk = mantissa.slice(i, i + 4);
            const hexDigit = parseInt(binaryChunk, 2).toString(16).toUpperCase();
            hexString += hexDigit;
            steps.push(`Действие ${steps.length + 1}: ${binaryChunk}  → ${hexDigit}`);
        }

        // Дополнительно заполняем нулями до 6 символов
        while (hexString.length < 6) {
            hexString = '0' + hexString;
        }

        steps.push(`Конечный результат: ${hexString}`);
        return { hexString, steps };
    }

    // Функция для конвертации из шестнадцатеричного формата в десятичный с шагами
    function convertFromHexSteps(hexString) {
        // Разделяем строку на целую и дробную части (если есть)
        const parts = hexString.split('.');
        const integerHex = parts[0];
        const fractionalHex = parts[1] || '';

        let integerPart = 0;
        let fractionalPart = 0;

        // Преобразование целой части
        let integerSteps = [];
        for (let i = integerHex.length - 1; i >= 0; i--) {
            const digit = parseInt(integerHex[i], 16);
            integerPart += digit * Math.pow(16, integerHex.length - 1 - i);
            integerSteps.push(`Цифра ${digit} (${integerHex[i]}) * 16^${integerHex.length - 1 - i} = ${digit * Math.pow(16, integerHex.length - 1 - i)}`);
        }

        // Преобразование дробной части
        let fractionalSteps = [];
        for (let i = 0; i < fractionalHex.length; i++) {
            const digit = parseInt(fractionalHex[i], 16);
            fractionalPart += digit * Math.pow(16, -(i + 1));
            fractionalSteps.push(`Цифра ${digit} (${fractionalHex[i]}) * 16^-${i + 1} = ${digit * Math.pow(16, -(i + 1))}`);
        }

        // Объединяем целую и дробную части
        const result = integerPart + fractionalPart;

        // Возвращаем результат и подробные шаги
        return {
            result: result,
            steps: [
                ...integerSteps,
                `Целая часть: = ${integerPart}`,
                ...fractionalSteps,
                `Дробная часть: = ${fractionalPart}`,
                `Итоговое число: ${integerPart} + ${fractionalPart} = ${result}`
            ]
        };
    }

    // Функция для вычисления мантиссы с учетом экспоненты
    function calculateAdjustedMantissa1(sign, exponent, mantissa) {
        // Преобразуем экспоненту из двоичного формата в десятичный
        const exponentDecimal = parseInt(exponent, 2);
        // Вычитаем смещение (64)
        const adjustedExponent = exponentDecimal - 64;

        // Преобразуем мантиссу из двоичного в шестнадцатеричный формат
        const mantissaHexString = parseInt(mantissa, 2).toString(16).toUpperCase().padStart(6, '0');

        let adjustedMantissa = mantissaHexString;

        // Если экспонента положительная, сдвигаем запятую вправо
        if (adjustedExponent >= 0) {
            adjustedMantissa = adjustedMantissa.slice(0, adjustedExponent) + '.' + adjustedMantissa.slice(adjustedExponent);
            adjustedMantissa = adjustedMantissa.replace(/^0+|0+$/g, ''); // Удаляем лишние нули справа
        } else {
            // Если экспонента отрицательная, сдвигаем запятую влево
            adjustedMantissa = '0.' + '0'.repeat(-adjustedExponent) + adjustedMantissa;
            adjustedMantissa = adjustedMantissa.replace(/^0+|0+$/g, ''); // Удаляем лишние нули слева и справа
        }

        return adjustedMantissa;
    }

    // Добавляем обработчик события на кнопку с id 'convert-mf-button'
    document.getElementById('convert-mf-button').addEventListener('click', () => {
        // Получаем значение из поля ввода с id 'number'
        const hexNumber = document.getElementById('number').value;
        // Вызываем функцию конвертации числа MF
        convertMFToNumber(hexNumber);
    });
});