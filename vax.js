document.addEventListener("DOMContentLoaded", function () {
    function convertToVAX(number) {
        let float32Array = new Float32Array(1);
        float32Array[0] = number;
        let int32Array = new Int32Array(float32Array.buffer);

        let intRepresentation = int32Array[0];

        let sign = (intRepresentation >> 31) & 1;
        let exponent = (intRepresentation >> 23) & 0xFF;
        let mantissa = intRepresentation & 0x7FFFFF;

        exponent -= 126;
        exponent += 128;

        return {
            sign: sign,
            exponent: exponent,
            mantissa: mantissa
        };
    }

    function updateVAXRepresentation(number) {
        let vaxRepresentation = convertToVAX(number);

        document.getElementById("sign-vax").innerHTML = `<div class="bit sign">${vaxRepresentation.sign}</div>`;
        document.getElementById("exponent-vax").innerHTML = vaxRepresentation.exponent.toString(2).padStart(8, '0').split('').map(bit => `<div class="bit exponent">${bit}</div>`).join('');
        document.getElementById("mantissa-vax").innerHTML = vaxRepresentation.mantissa.toString(2).padStart(23, '0').split('').map(bit => `<div class="bit mantissa">${bit}</div>`).join('');
    }

    function init() {
        let numberInput = document.getElementById("vaxx");
        numberInput.value = "1"; // Установка значения по умолчанию в "1"
        updateVAXRepresentation(1); // Обновление представления для значения по умолчанию
        numberInput.addEventListener("input", function () {
            let number = parseFloat(numberInput.value);
            if (!isNaN(number)) {
                updateVAXRepresentation(number);
            } else {
                document.getElementById("sign-vax").textContent = "";
                document.getElementById("exponent-vax").textContent = "";
                document.getElementById("mantissa-vax").textContent = "";
            }
        });
    }

    // Флаг, указывающий, выполняется ли анимация в данный момент
    let isAnimationRunning = false;

    // Функция для анимации изменения значения знака числа
    function animateSignChange(newSign) {
        // Проверяем, выполняется ли уже анимация
        if (isAnimationRunning) {
            return; // Если да, прекращаем выполнение функции
        }

        // Устанавливаем флаг, что анимация начата
        isAnimationRunning = true;

        const signOutputElement = document.getElementById("sign-vax");
        // Изменяем цвет и фон элемента для анимации
        signOutputElement.style.transition = "background-color 0.5s, color 0.5s"; // Добавляем плавный переход
        signOutputElement.style.backgroundColor = "orange";
        signOutputElement.style.color = "white";

        // Создаем элементы для анимации сравнения с нулем
        const comparisonAnimation = document.createElement('div');
        comparisonAnimation.classList.add('comparison-animation');
        comparisonAnimation.innerHTML = 'Сравниваем введенное число с 0';
        const zeroAnimation = document.createElement('div');
        zeroAnimation.classList.add('zero-animation');

        // Добавляем анимацию сравнения с нулем
        signOutputElement.appendChild(comparisonAnimation);
        signOutputElement.appendChild(zeroAnimation);

        // Ждем некоторое время для анимации
        setTimeout(function() {
            // Плавно меняем цвет в соответствии с полученным значением знака
            if (newSign === "0") {
                zeroAnimation.style.backgroundColor = "green";
                comparisonAnimation.innerHTML = 'Число больше 0, знак = 0';
            } else {
                zeroAnimation.style.backgroundColor = "red";
                comparisonAnimation.innerHTML = 'Число меньше 0, знак = 1';
            }
        }, 2500);

        // Ждем некоторое время перед обновлением значения знака
        setTimeout(function() {
            // Удаляем анимации после завершения
            signOutputElement.removeChild(comparisonAnimation);
            signOutputElement.removeChild(zeroAnimation);
            // Обновляем значение знака
            signOutputElement.innerHTML = `<div class="bit sign">${newSign}</div>`;
            // Возвращаем изначальные стили через короткое время
            setTimeout(function() {
                signOutputElement.style.backgroundColor = "";
                signOutputElement.style.color = "";
                signOutputElement.style.transition = ""; // Сбрасываем переход
                // Снимаем флаг, что анимация завершена
                isAnimationRunning = false;
            }, 1);
        }, 4500);
    }

// Получаем элемент метки "Знак"
    const signOutputElement = document.getElementById("sign-vax");

// Добавляем слушатель события клика к значению знака
    signOutputElement.addEventListener('click', function() {
        // Получаем текущее значение числа из поля ввода
        const inputValue = parseFloat(document.getElementById('vaxx').value);
        // Определяем значение знака числа
        const sign = inputValue >= 0 ? "0" : "1";
        // Отображаем анимацию изменения значения знака
        animateSignChange(sign);
    });


    init();
});
