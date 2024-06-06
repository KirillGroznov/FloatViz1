function roundAndDisplay(inputNumber) {
    // Округляем введенное число
    const roundedValue = Math.round(inputNumber);

    // Отображаем округленное число во втором поле ввода
    document.getElementById("rounded-output").value = roundedValue;

    // Обновляем знак, порядок и мантиссу для второго числа
    updateSecondFloatingPoint(roundedValue);
}

function updateSecondFloatingPoint(inputNumber) {
    const signOutputElement = document.getElementById("sign-output-second");
    const exponentOutputElement = document.getElementById("exponent-output-second");
    const mantissaOutputElement = document.getElementById("mantissa-output-second");

    if (isNaN(inputNumber)) {
        signOutputElement.innerHTML = "Invalid input";
        exponentOutputElement.innerHTML = "";
        mantissaOutputElement.innerHTML = "";
        return;
    }

    const sign = inputNumber >= 0 ? "0" : "1";
    const absoluteValue = Math.abs(inputNumber);
    const exponent = Math.floor(Math.log2(absoluteValue));
    const mantissa = absoluteValue / Math.pow(2, exponent);

    // Convert exponent and mantissa to binary strings
    let exponentBinary = (exponent + 127).toString(2).padStart(8, '0');
    let mantissaBinary = mantissa.toString(2).substring(2).padEnd(23, '0').slice(0, 23); // Ограничиваем длину мантиссы 23 битами

    // Combine the sign, exponent, and mantissa into a single binary string
    let signBit = `<div class="bit sign">${sign}</div>`;
    let exponentBits = '';
    for (let i = 0; i < exponentBinary.length; i++) {
        exponentBits += `<div class="bit exponent">${exponentBinary[i]}</div>`;
    }
    let mantissaBits = '';
    for (let i = 0; i < mantissaBinary.length; i++) {
        mantissaBits += `<div class="bit mantissa">${mantissaBinary[i]}</div>`;
    }

    // Display the binary string as individual bits
    signOutputElement.innerHTML = signBit;
    exponentOutputElement.innerHTML = exponentBits;
    mantissaOutputElement.innerHTML = mantissaBits;
}
