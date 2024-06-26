// Флаг для отслеживания состояния анимации изменения порядка числа в формате VAX
let isVAXExponentAnimationRunning = false;

// Переменная для хранения начального значения порядка числа в формате VAX
let initialVAXExponentValue = '';

// Функция для анимации изменения порядка числа в формате VAX
function animateVAXExponentChange(inputValue) {
    // Проверяем, выполняется ли уже анимация
    if (isVAXExponentAnimationRunning) {
        return;
    }

    // Сохраняем начальное значение порядка перед запуском анимации
    initialVAXExponentValue = document.getElementById("exponent-vax").innerHTML;

    // Устанавливаем флаг, что анимация начата
    isVAXExponentAnimationRunning = true;

    // Получаем элемент вывода порядка в формате VAX
    const exponentOutputElement = document.getElementById("exponent-vax");
    exponentOutputElement.innerHTML = '';
    exponentOutputElement.style.transition = "background-color 0.5s, color 0.5s"; // Добавляем плавный переход
    exponentOutputElement.style.color = "white"; // Устанавливаем белый цвет текста для анимации

    // Шаг 1: Преобразование числа в двоичный формат
    const step1 = createStepElement('Шаг 1: Преобразование числа в двоичный формат');
    exponentOutputElement.appendChild(step1);
    setTimeout(() => {
        // Получаем шаги преобразования числа в двоичный формат
        const binarySteps = convertToBinarySteps(inputValue);
        let binaryDetail = `<br>Число: ${inputValue} → Двоичный формат: <br>`;
        // Формируем подробности преобразования для шага
        binarySteps.forEach(step => {
            binaryDetail += `${step}<br>`;
        });
        step1.innerHTML += binaryDetail; // Добавляем подробности преобразования в шаг


        // Шаг 2: Нормализация числа
        const step2 = createStepElement('Шаг 2: Нормализация числа');
        exponentOutputElement.appendChild(step2);
        setTimeout(() => {
            const binary = Math.abs(inputValue).toString(2); // Преобразуем число в двоичную форму
            step2.innerHTML += `<br>Число: ${inputValue} → Двоичный формат: ${binary}`;

            // Нормализация числа
            const normalizedBinary = binary.indexOf('.') === -1 ? binary : binary.replace('.', ''); // Убираем точку (если есть)
            let exponent = calculateVAXExponent(inputValue) + 1; // Добавляем 1 к экспоненте

            // Показываем число в нормализованном виде с указанием сдвига десятичной точки
            const shiftedComma = exponent >= 0 ? '0' + normalizedBinary.substring(-1, 0) + ',' + normalizedBinary.substring(0) :
                normalizedBinary.substring(0, 1) + '.' + normalizedBinary.substring(1 - exponent);
            const normalizedNumber = `${shiftedComma} * 2^(сдвинуто число на ${Math.abs(exponent)} разрядов)`;
            step2.innerHTML += `<br>При нормализации числа для представления в формате с плавающей запятой, мы представляем его в виде 0,1xxx * 2^n(в формате VAX запятая в мантиссе фиксируется перед старшей единицей). Это делается для того, чтобы получить нормализованную форму числа, где n является порядком.<br>Нормализация числа: ${normalizedNumber}`;

            // Пояснение про направление сдвига
            if (exponent >= 0) {
                step2.innerHTML += `<br>Так как порядок положительный (${exponent}), десятичная точка сдвигается влево.`;
            } else {
                step2.innerHTML += `<br>Так как порядок отрицательный (${exponent}), десятичная точка сдвигается вправо.`;
            }

            // Шаг 3: Вычисление экспоненты
            const step3 = createStepElement('Шаг 3: Вычисление порядка');
            exponentOutputElement.appendChild(step3);
            setTimeout(() => {
                let exponent = calculateVAXExponent(Math.abs(inputValue)) + 1; // Добавляем 1 к экспоненте
                step3.innerHTML += `<br>Вычисление порядка: n = ${exponent}`;

                // Шаг 4: Смещение экспоненты
                const step4 = createStepElement('Шаг 4: Смещение порядка');
                exponentOutputElement.appendChild(step4);
                setTimeout(() => {
                    let shiftedExponent = exponent + 128; // Для VAX смещение +128
                    step4.innerHTML += `<br>Величина смещения в формате VAX равна 128<br>Смещение порядка: ${exponent} + 128 = ${shiftedExponent}`;

                    // Шаг 5: Преобразование экспоненты в двоичное представление
                    const step5 = createStepElement('Шаг 5: Преобразование порядка в двоичное представление');
                    exponentOutputElement.appendChild(step5);
                    setTimeout(() => {
                        const binarySteps = convertToBinarySteps(shiftedExponent);
                        let binaryDetail = `<br>Число: ${shiftedExponent} → Двоичный формат: <br>`;
                        binarySteps.forEach(step => {
                            binaryDetail += `${step}<br>`;
                        });
                        step5.innerHTML += binaryDetail;
                        // Пояснение про порядок
                        if (exponent >= 0) {
                            step5.innerHTML += `Для чисел с положительным порядком ничего не меняется`;
                        } else {
                            step5.innerHTML += `Для чисел с отрицательным порядком, значение смещённого порядка будет представлять собой число, полученное из обратного кода от исходной экспоненты с одним дополнительным правилом: старший (самый левый) разряд в этом смещённом порядке всегда равен 0.`;
                        }
                        setTimeout(() => {
                            // Восстанавливаем начальное значение порядка
                            exponentOutputElement.innerHTML = initialVAXExponentValue;
                            exponentOutputElement.style.backgroundColor = "";
                            exponentOutputElement.style.color = "";
                            exponentOutputElement.style.transition = "";
                            isVAXExponentAnimationRunning = false;
                        }, 4000);
                    }, 4000);
                }, 3500);
            }, 3500);
        }, 3500);
    }, 3500);
}

    // Получаем элемент метки "Порядок"
const exponentOutputElementVAX = document.getElementById("exponent-vax");

    // Добавляем слушатель события клика к значению порядка
exponentOutputElementVAX.addEventListener('click', function() {
    // Получаем текущее значение числа из поля ввода
    const inputValue = parseFloat(document.getElementById('vaxx').value);
    // Вызываем функцию анимации изменения порядка
    animateVAXExponentChange(inputValue);
});

// Функция для создания элемента шага анимации с заданным текстом
function createStepElement(stepText) {
    // Создаем новый элемент div
    const step = document.createElement('div');
    // Добавляем класс для стилизации анимации
    step.classList.add('step-animation');
    // Устанавливаем текст шага
    step.innerHTML = stepText;
    // Возвращаем созданный элемент
    return step;
}

function calculateVAXExponent(number) {
    if (number === 0) return -128; // Если число равно 0, возвращаем -128
    return Math.floor(Math.log2(number)); // Возвращаем экспоненту числа в формате с плавающей запятой
}
