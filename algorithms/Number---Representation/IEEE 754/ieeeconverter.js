document.addEventListener("DOMContentLoaded", function () {
    function convertIEEEToNumber(sign, exponent, mantissa) {
        // Преобразуем строковые значения в целые числа для знака и порядка
        sign = parseInt(sign, 2);
        exponent = parseInt(exponent, 2);

        // Шаг 1: Переводим порядок в десятичную форму
        const step1 = `Шаг 1: Порядок в десятичной форме: ${exponent}`;

        // Переводим порядок в десятичное число и корректируем его
        const adjustedExponent = exponent - 127;

        // Шаг 2: Отнимаем 127
        const step2 = `Шаг 2: Отнимаем 127 от числа, которое мы получили (Величина смещения в формате IEEE равна 127): ${adjustedExponent}`;

        // Восстанавливаем скрытый старший разряд мантиссы
        const hiddenBit = 1 << 23; // 2^23
        const mantissaWithHiddenBit = hiddenBit | parseInt(mantissa, 2);
        const mantissaBinaryString = mantissaWithHiddenBit.toString(2).padStart(24, '0');

        // Добавляем запятую после единицы в мантиссе
        const normalizedMantissaBinaryString = mantissaBinaryString.slice(0, 1) + '.' + mantissaBinaryString.slice(1);

        // Шаг 3: Восстанавливаем мантиссу со скрытым старшим разрядом
        const step3 = `Шаг 3: Восстанавливаем мантиссу со скрытым старшим разрядом (старшая единица мантиссы нормализованного числа является единицей целой части мантиссы, т. е. запятая в мантиссе фиксируется после старшей единицы): ${normalizedMantissaBinaryString}`;

        // Шаг 4: Двигаем запятую в мантиссе
        let adjustedMantissa = mantissaBinaryString;
        if (adjustedExponent >= 0) {
            adjustedMantissa = mantissaBinaryString.slice(0, adjustedExponent + 1) + '.' + mantissaBinaryString.slice(adjustedExponent + 1);
            adjustedMantissa = adjustedMantissa.replace(/^0+|0+$/g, ''); // Удаление лишних нулей справа
        } else {
            adjustedMantissa = ' 0.' + '0'.repeat(-adjustedExponent - 1) + mantissaBinaryString;
            adjustedMantissa = adjustedMantissa.replace(/^0+|0+$/g, ''); // Удаление лишних нулей справа
        }
        const step4 = `Шаг 4: Двигаем запятую в мантиссе (на экспоненту, полученную во втором шаге): ${adjustedMantissa} * 2^${adjustedExponent}`;

        // Шаг 5: Переводим мантиссу в десятичное число
        const integerPart = parseInt(adjustedMantissa.split('.')[0], 2); // Перевод целой части мантиссы в десятичное число
        let fractionalPart = adjustedMantissa.split('.')[1]; // Дробная часть мантиссы
        let decimalFraction = 0;
        for (let i = 0; i < fractionalPart.length; i++) {
            decimalFraction += parseInt(fractionalPart[i], 2) * Math.pow(2, -(i + 1)); // Перевод дробной части мантиссы в десятичное число
        }
        const mantissaDecimal = integerPart + decimalFraction; // Сложение целой и дробной частей
        const signDescription = (sign === 1) ? 'Ставим минус в начале, так как знак равен 1' : 'Число положительное, так как знак равен 0';
        const finalResult = (sign === 1 ? -mantissaDecimal : mantissaDecimal).toFixed(6);
        const step6 = `Число с плавающей запятой по его представлению формате IEEE: ${finalResult}.  ${signDescription}`;


        return { step1, step2, step3, step4, step6 };
    }

    function removeSpaces(str) {
        return str.replace(/\s+/g, '');
    }

    document.getElementById('convert-ieee-button').addEventListener('click', () => {
        let sign = document.getElementById('ieee-sign').value;
        let exponent = document.getElementById('ieee-exponent').value;
        let mantissa = document.getElementById('ieee-mantissa').value;

        // Удаляем пробелы из вводимых значений
        sign = removeSpaces(sign);
        exponent = removeSpaces(exponent);
        mantissa = removeSpaces(mantissa);

        // Очищаем предыдущие шаги
        const ieeeStepsElement = document.getElementById('ieee-steps');
        ieeeStepsElement.innerHTML = '';

        // Производим вычисления и получаем шаги
        const { step2, step3, step4, step6 } = convertIEEEToNumber(sign, exponent, mantissa);

        // Выполняем функцию convertFromBinarySteps и получаем результаты
        const { result, steps } = convertFromBinarySteps(exponent);

        // Отображаем результаты в первом шаге
        setTimeout(() => {
        const step1 = `Шаг 1: Результат преобразования из двоичного представления в десятичное число: ${result}`;
        const stepElement1 = document.createElement('div');
        stepElement1.classList.add('ieee-step');
        stepElement1.textContent = step1;
        ieeeStepsElement.appendChild(stepElement1);

        // Добавляем шаги преобразования в отдельные элементы
        steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.classList.add('ieee-step');
            stepElement.textContent = step;
            ieeeStepsElement.appendChild(stepElement);
        });
        }, 1000);

        // Получаем значение мантиссы после вычислений в функции convertIEEEToNumber
        const adjustedMantissa = calculateAdjustedMantissa(sign, exponent, mantissa);

        // Шаг 5: Переводим мантиссу в десятичное число
        const { result: mantissaResult, steps: mantissaSteps } = convertFromBinarySteps(adjustedMantissa); // Замените exponent на mantissa

        // Отображаем результаты в пятом шаге с использованием setTimeout
        setTimeout(() => {
            const step5 = `Шаг 5: Перевод мантиссы в десятичную форму: ${mantissaResult}`;
            const stepElement5 = document.createElement('div');
            stepElement5.classList.add('ieee-step');
            stepElement5.textContent = step5;
            ieeeStepsElement.appendChild(stepElement5);

            // Добавляем шаги преобразования мантиссы в отдельные элементы
            mantissaSteps.forEach((step, index) => {
                const stepElement5 = document.createElement('div');
                stepElement5.classList.add('ieee-step');
                stepElement5.textContent = step;
                ieeeStepsElement.appendChild(stepElement5);
            });
        }, 5000);


        setTimeout(() => {
            ieeeStepsElement.innerHTML += `<div class="ieee-step">${step2}</div>`;
        }, 2000);
        setTimeout(() => {
            ieeeStepsElement.innerHTML += `<div class="ieee-step">${step3}</div>`;
        }, 3000);
        setTimeout(() => {
            ieeeStepsElement.innerHTML += `<div class="ieee-step">${step4}</div>`;
        }, 4000);
        setTimeout(() => {
            ieeeStepsElement.innerHTML += `<div class="ieee-step">${step6}</div>`;
        }, 6000);
    });
});
function convertFromBinarySteps(binaryString) {
    // Разделяем строку на целую и дробную части (если есть)
    const parts = binaryString.split('.');
    const integerBinary = parts[0];
    const fractionalBinary = parts[1] || '';

    let integerPart = 0;
    let fractionalPart = 0;

    // Преобразование целой части
    let integerSteps = [];
    for (let i = integerBinary.length - 1; i >= 0; i--) {
        const digit = parseInt(integerBinary[i]);
        integerPart += digit * Math.pow(2, integerBinary.length - 1 - i);
        integerSteps.push(`Цифра ${digit} * 2^${integerBinary.length - 1 - i} = ${digit * Math.pow(2, integerBinary.length - 1 - i)}`);
    }

    // Преобразование дробной части
    let fractionalSteps = [];
    for (let i = 0; i < fractionalBinary.length; i++) {
        const digit = parseInt(fractionalBinary[i]);
        fractionalPart += digit * Math.pow(2, -(i + 1));
        fractionalSteps.push(`Цифра ${digit} * 2^-${i + 1} = ${digit * Math.pow(2, -(i + 1))}`);
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
function calculateAdjustedMantissa(sign, exponent, mantissa) {
    // Преобразуем строковые значения в целые числа для знака и порядка
    sign = parseInt(sign, 2);
    exponent = parseInt(exponent, 2);

    // Восстанавливаем скрытый старший разряд мантиссы
    const hiddenBit = 1 << 23; // 2^23
    const mantissaWithHiddenBit = hiddenBit | parseInt(mantissa, 2);
    const mantissaBinaryString = mantissaWithHiddenBit.toString(2).padStart(24, '0');

    // Добавляем запятую после единицы в мантиссе
    const normalizedMantissaBinaryString = mantissaBinaryString.slice(0, 1) + '.' + mantissaBinaryString.slice(1);

    // Двигаем запятую в мантиссе
    let adjustedMantissa = mantissaBinaryString;
    const adjustedExponent = exponent - 127;
    if (adjustedExponent >= 0) {
        adjustedMantissa = mantissaBinaryString.slice(0, adjustedExponent + 1) + '.' + mantissaBinaryString.slice(adjustedExponent + 1);
        adjustedMantissa = adjustedMantissa.replace(/^0+|0+$/g, ''); // Удаление лишних нулей справа
    } else {
        adjustedMantissa = '0.' + '0'.repeat(-adjustedExponent - 1) + mantissaBinaryString;
        adjustedMantissa = adjustedMantissa.replace(/^0+|0+$/g, ''); // Удаление лишних нулей справа
    }

    return adjustedMantissa;
}
