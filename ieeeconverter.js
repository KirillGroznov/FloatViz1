document.addEventListener("DOMContentLoaded", function () { // Ждет полной загрузки HTML-документа перед выполнением кода
    function convertIEEEToNumber(sign, exponent, mantissa) {
        // Преобразуем строковые значения в целые числа для знака и порядка
        sign = parseInt(sign, 2); // Преобразует знак из двоичной строки в целое число
        exponent = parseInt(exponent, 2); // Преобразует порядок из двоичной строки в целое число

        // Шаг 1: Переводим порядок в десятичную форму
        const step1 = `Шаг 1: Порядок в десятичной форме: ${exponent}`; // Создает строку для отображения значения порядка в десятичной форме

        // Переводим порядок в десятичное число и корректируем его
        const adjustedExponent = exponent - 127; // Корректирует порядок, вычитая 127

        // Шаг 2: Отнимаем 127
        const step2 = `Шаг 2: Отнимаем 127 от числа, которое мы получили (Величина смещения в формате IEEE равна 127): ${adjustedExponent}`; // Создает строку для отображения скорректированного значения порядка

        // Восстанавливаем скрытый старший разряд мантиссы
        const hiddenBit = 1 << 23; // 2^23 - задает скрытый старший разряд мантиссы
        const mantissaWithHiddenBit = hiddenBit | parseInt(mantissa, 2); // Добавляет скрытый старший разряд к мантиссе
        const mantissaBinaryString = mantissaWithHiddenBit.toString(2).padStart(24, '0'); // Преобразует мантиссу в двоичную строку с ведущими нулями

        // Добавляем запятую после единицы в мантиссе
        const normalizedMantissaBinaryString = mantissaBinaryString.slice(0, 1) + '.' + mantissaBinaryString.slice(1); // Добавляет запятую после первого разряда мантиссы

        // Шаг 3: Восстанавливаем мантиссу со скрытым старшим разрядом
        const step3 = `Шаг 3: Восстанавливаем мантиссу со скрытым старшим разрядом (старшая единица мантиссы нормализованного числа является единицей целой части мантиссы, т. е. запятая в мантиссе фиксируется после старшей единицы): ${normalizedMantissaBinaryString}`; // Создает строку для отображения нормализованной мантиссы

        // Шаг 4: Двигаем запятую в мантиссе
        let adjustedMantissa = mantissaBinaryString;
        if (adjustedExponent >= 0) {
            adjustedMantissa = mantissaBinaryString.slice(0, adjustedExponent + 1) + '.' + mantissaBinaryString.slice(adjustedExponent + 1); // Двигает запятую вправо, если порядок положительный
            adjustedMantissa = adjustedMantissa.replace(/^0+|0+$/g, ''); // Удаляет лишние нули слева и справа
        } else {
            adjustedMantissa = '0.' + '0'.repeat(-adjustedExponent - 1) + mantissaBinaryString; // Двигает запятую влево, если порядок отрицательный
            adjustedMantissa = adjustedMantissa.replace(/^0+|0+$/g, ''); // Удаляет лишние нули слева и справа
        }
        const step4 = `Шаг 4: Двигаем запятую в мантиссе (на экспоненту, полученную во втором шаге): ${adjustedMantissa} * 2^${adjustedExponent}`; // Создает строку для отображения мантиссы с учетом порядка

        // Шаг 5: Переводим мантиссу в десятичное число
        const integerPart = parseInt(adjustedMantissa.split('.')[0], 2); // Перевод целой части мантиссы в десятичное число
        let fractionalPart = adjustedMantissa.split('.')[1]; // Дробная часть мантиссы
        let decimalFraction = 0;
        for (let i = 0; i < fractionalPart.length; i++) {
            decimalFraction += parseInt(fractionalPart[i], 2) * Math.pow(2, -(i + 1)); // Перевод дробной части мантиссы в десятичное число
        }
        const mantissaDecimal = integerPart + decimalFraction; // Сложение целой и дробной частей
        const signDescription = (sign === 1) ? 'Ставим минус в начале, так как знак равен 1' : 'Число положительное, так как знак равен 0'; // Описание знака числа
        const finalResult = (sign === 1 ? -mantissaDecimal : mantissaDecimal).toFixed(6); // Конечный результат с учетом знака, округленный до 6 знаков после запятой
        const step6 = `Число с плавающей запятой по его представлению формате IEEE: ${finalResult}.  ${signDescription}`; // Создает строку для отображения конечного результата

        return { step1, step2, step3, step4, step6 }; // Возвращает шаги в виде объекта
    }

    function removeSpaces(str) {
        return str.replace(/\s+/g, ''); // Удаляет все пробелы из строки
    }


    document.getElementById('convert-ieee-button').addEventListener('click', () => { // Добавляет обработчик события "click" для кнопки с id "convert-ieee-button"
        let sign = document.getElementById('ieee-sign').value; // Получает значение поля ввода с id "ieee-sign"
        let exponent = document.getElementById('ieee-exponent').value; // Получает значение поля ввода с id "ieee-exponent"
        let mantissa = document.getElementById('ieee-mantissa').value; // Получает значение поля ввода с id "ieee-mantissa"

        // Удаляем пробелы из вводимых значений
        sign = removeSpaces(sign); // Удаляет пробелы из строки "sign"
        exponent = removeSpaces(exponent); // Удаляет пробелы из строки "exponent"
        mantissa = removeSpaces(mantissa); // Удаляет пробелы из строки "mantissa"

        // Очищаем предыдущие шаги
        const ieeeStepsElement = document.getElementById('ieee-steps'); // Получает элемент с id "ieee-steps"
        ieeeStepsElement.innerHTML = ''; // Очищает содержимое элемента

        // Производим вычисления и получаем шаги
        const { step2, step3, step4, step6 } = convertIEEEToNumber(sign, exponent, mantissa); // Вызывает функцию convertIEEEToNumber и извлекает шаги 2, 3, 4 и 6

        // Выполняем функцию convertFromBinarySteps и получаем результаты
        const { result, steps } = convertFromBinarySteps(exponent); // Вызывает функцию convertFromBinarySteps с "exponent" и получает результат и шаги

        // Отображаем результаты в первом шаге
        setTimeout(() => {
            const step1 = `Шаг 1: Результат преобразования из двоичного представления в десятичное число: ${result}`; // Создает строку для отображения результата первого шага
            const stepElement1 = document.createElement('div'); // Создает новый элемент "div"
            stepElement1.classList.add('ieee-step'); // Добавляет класс "ieee-step" элементу
            stepElement1.textContent = step1; // Устанавливает текстовое содержимое элемента
            ieeeStepsElement.appendChild(stepElement1); // Добавляет элемент в родительский элемент "ieee-steps"

            // Добавляем шаги преобразования в отдельные элементы
            steps.forEach((step, index) => { // Для каждого шага из массива "steps"
                const stepElement = document.createElement('div'); // Создает новый элемент "div"
                stepElement.classList.add('ieee-step'); // Добавляет класс "ieee-step" элементу
                stepElement.textContent = step; // Устанавливает текстовое содержимое элемента
                ieeeStepsElement.appendChild(stepElement); // Добавляет элемент в родительский элемент "ieee-steps"
            });
        }, 1000); // Выполняет код с задержкой в 1000 миллисекунд (1 секунда)

        // Получаем значение мантиссы после вычислений в функции convertIEEEToNumber
        const adjustedMantissa = calculateAdjustedMantissa(sign, exponent, mantissa); // Вызывает функцию calculateAdjustedMantissa для получения скорректированной мантиссы

        // Шаг 5: Переводим мантиссу в десятичное число
        const { result: mantissaResult, steps: mantissaSteps } = convertFromBinarySteps(adjustedMantissa); // Вызывает функцию convertFromBinarySteps с "adjustedMantissa" и получает результат и шаги

        // Отображаем результаты в пятом шаге с использованием setTimeout
        setTimeout(() => {
            const step5 = `Шаг 5: Перевод мантиссы в десятичную форму: ${mantissaResult}`; // Создает строку для отображения результата пятого шага
            const stepElement5 = document.createElement('div'); // Создает новый элемент "div"
            stepElement5.classList.add('ieee-step'); // Добавляет класс "ieee-step" элементу
            stepElement5.textContent = step5; // Устанавливает текстовое содержимое элемента
            ieeeStepsElement.appendChild(stepElement5); // Добавляет элемент в родительский элемент "ieee-steps"

            // Добавляем шаги преобразования мантиссы в отдельные элементы
            mantissaSteps.forEach((step, index) => { // Для каждого шага из массива "mantissaSteps"
                const stepElement5 = document.createElement('div'); // Создает новый элемент "div"
                stepElement5.classList.add('ieee-step'); // Добавляет класс "ieee-step" элементу
                stepElement5.textContent = step; // Устанавливает текстовое содержимое элемента
                ieeeStepsElement.appendChild(stepElement5); // Добавляет элемент в родительский элемент "ieee-steps"
            });
        }, 5000); // Выполняет код с задержкой в 5000 миллисекунд (5 секунд)

        setTimeout(() => {
            ieeeStepsElement.innerHTML += `<div class="ieee-step">${step2}</div>`; // Добавляет элемент с текстом "step2" в родительский элемент "ieee-steps" с задержкой 2 секунды
        }, 2000);
        setTimeout(() => {
            ieeeStepsElement.innerHTML += `<div class="ieee-step">${step3}</div>`; // Добавляет элемент с текстом "step3" в родительский элемент "ieee-steps" с задержкой 3 секунды
        }, 3000);
        setTimeout(() => {
            ieeeStepsElement.innerHTML += `<div class="ieee-step">${step4}</div>`; // Добавляет элемент с текстом "step4" в родительский элемент "ieee-steps" с задержкой 4 секунды
        }, 4000);
        setTimeout(() => {
            ieeeStepsElement.innerHTML += `<div class="ieee-step">${step6}</div>`; // Добавляет элемент с текстом "step6" в родительский элемент "ieee-steps" с задержкой 6 секунд
        }, 6000);
    });
});
function convertFromBinarySteps(binaryString) { // Функция преобразования двоичного числа в десятичное с пошаговым описанием
    // Разделяем строку на целую и дробную части (если есть)
    const parts = binaryString.split('.'); // Разделяет строку на целую и дробную части по точке
    const integerBinary = parts[0]; // Целая часть числа
    const fractionalBinary = parts[1] || ''; // Дробная часть числа, если она есть

    let integerPart = 0; // Переменная для хранения целой части числа
    let fractionalPart = 0; // Переменная для хранения дробной части числа

    // Преобразование целой части
    let integerSteps = []; // Массив для хранения шагов преобразования целой части
    for (let i = integerBinary.length - 1; i >= 0; i--) { // Проходим по каждой цифре целой части с конца
        const digit = parseInt(integerBinary[i]); // Преобразуем символ в число
        integerPart += digit * Math.pow(2, integerBinary.length - 1 - i); // Вычисляем значение текущей цифры в десятичной системе
        integerSteps.push(`Цифра ${digit} * 2^${integerBinary.length - 1 - i} = ${digit * Math.pow(2, integerBinary.length - 1 - i)}`); // Сохраняем шаг в массиве
    }

    // Преобразование дробной части
    let fractionalSteps = []; // Массив для хранения шагов преобразования дробной части
    for (let i = 0; i < fractionalBinary.length; i++) { // Проходим по каждой цифре дробной части
        const digit = parseInt(fractionalBinary[i]); // Преобразуем символ в число
        fractionalPart += digit * Math.pow(2, -(i + 1)); // Вычисляем значение текущей цифры в десятичной системе
        fractionalSteps.push(`Цифра ${digit} * 2^-${i + 1} = ${digit * Math.pow(2, -(i + 1))}`); // Сохраняем шаг в массиве
    }

    // Объединяем целую и дробную части
    const result = integerPart + fractionalPart; // Суммируем целую и дробную части для получения окончательного результата

    // Возвращаем результат и подробные шаги
    return {
        result: result, // Окончательный результат преобразования
        steps: [
            ...integerSteps, // Шаги преобразования целой части
            `Целая часть: = ${integerPart}`, // Итоговый результат целой части
            ...fractionalSteps, // Шаги преобразования дробной части
            `Дробная часть: = ${fractionalPart}`, // Итоговый результат дробной части
            `Итоговое число: ${integerPart} + ${fractionalPart} = ${result}` // Итоговое число с объединением целой и дробной частей
        ]
    };
}

function calculateAdjustedMantissa(sign, exponent, mantissa) { // Функция для вычисления скорректированной мантиссы
    // Преобразуем строковые значения в целые числа для знака и порядка
    sign = parseInt(sign, 2); // Преобразуем строковое значение знака в целое число
    exponent = parseInt(exponent, 2); // Преобразуем строковое значение порядка в целое число

    // Восстанавливаем скрытый старший разряд мантиссы
    const hiddenBit = 1 << 23; // 2^23, устанавливаем скрытый бит
    const mantissaWithHiddenBit = hiddenBit | parseInt(mantissa, 2); // Восстанавливаем скрытый старший разряд мантиссы
    const mantissaBinaryString = mantissaWithHiddenBit.toString(2).padStart(24, '0'); // Преобразуем мантиссу в строку и добавляем ведущие нули

    // Добавляем запятую после единицы в мантиссе
    const normalizedMantissaBinaryString = mantissaBinaryString.slice(0, 1) + '.' + mantissaBinaryString.slice(1); // Нормализуем мантиссу, добавляя запятую после первой цифры

    // Двигаем запятую в мантиссе
    let adjustedMantissa = mantissaBinaryString; // Начальное значение скорректированной мантиссы
    const adjustedExponent = exponent - 127; // Корректируем порядок, вычитая 127
    if (adjustedExponent >= 0) { // Если скорректированный порядок неотрицательный
        adjustedMantissa = mantissaBinaryString.slice(0, adjustedExponent + 1) + '.' + mantissaBinaryString.slice(adjustedExponent + 1); // Двигаем запятую вправо
        adjustedMantissa = adjustedMantissa.replace(/^0+|0+$/g, ''); // Удаляем лишние нули
    } else { // Если скорректированный порядок отрицательный
        adjustedMantissa = '0.' + '0'.repeat(-adjustedExponent - 1) + mantissaBinaryString; // Двигаем запятую влево, добавляя нули перед мантиссой
        adjustedMantissa = adjustedMantissa.replace(/^0+|0+$/g, ''); // Удаляем лишние нули
    }

    return adjustedMantissa; // Возвращаем скорректированную мантиссу
}

