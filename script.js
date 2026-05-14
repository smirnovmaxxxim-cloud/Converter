const lengthUnits = [
    { name: "Метры (m)", factor: 1 },
    { name: "Километры (km)", factor: 0.001 },
    { name: "Сантиметры (cm)", factor: 100 },
    { name: "Миллиметры (mm)", factor: 1000 },
    { name: "Мили (mi)", factor: 0.000621371 },
    { name: "Футы (ft)", factor: 3.28084 },
    { name: "Дюймы (in)", factor: 39.3701 }
];

const massUnits = [
    { name: "Килограммы (kg)", factor: 1 },
    { name: "Граммы (g)", factor: 1000 },
    { name: "Тонны (t)", factor: 0.001 },
    { name: "Фунты (lb)", factor: 2.20462 },
    { name: "Унции (oz)", factor: 35.274 }
];

const volumeUnits = [
    { name: "Литры (L)", factor: 1 },
    { name: "Миллилитры (mL)", factor: 1000 },
    { name: "Кубические метры (m³)", factor: 0.001 },
    { name: "Галлоны (gal)", factor: 0.264172 },
    { name: "Кварты (qt)", factor: 1.05669 }
];

const tempUnits = [
    "Цельсий (°C)",
    "Фаренгейт (°F)",
    "Кельвин (K)"
];

let currentCategory = "length";

const fromSelect = document.getElementById("fromUnit");
const toSelect = document.getElementById("toUnit");
const inputValue = document.getElementById("inputValue");
const resultDisplay = document.getElementById("resultDisplay");
const errorDiv = document.getElementById("errorMsg");

function convertTemperatureValue(value, fromUnit, toUnit) {
    let celsius = 0;
    
    if (fromUnit === "Цельсий (°C)") celsius = value;
    else if (fromUnit === "Фаренгейт (°F)") celsius = (value - 32) * 5/9;
    else if (fromUnit === "Кельвин (K)") celsius = value - 273.15;

    if (toUnit === "Цельсий (°C)") return celsius;
    if (toUnit === "Фаренгейт (°F)") return celsius * 9/5 + 32;
    if (toUnit === "Кельвин (K)") return celsius + 273.15;
    return value;
}

function performConversion() {
    let value = parseFloat(inputValue.value);
    const errorElement = document.getElementById("errorMsg");

    if (isNaN(value)) {
        errorElement.textContent = "❌ Введите корректное число!";
        errorElement.classList.add("show");
        resultDisplay.textContent = "—";
        return;
    }

    if (currentCategory === "temp") {
        const fromUnit = fromSelect.value;
        let celsiusCheck = 0;
        if (fromUnit === "Цельсий (°C)") celsiusCheck = value;
        else if (fromUnit === "Фаренгейт (°F)") celsiusCheck = (value - 32) * 5/9;
        else if (fromUnit === "Кельвин (K)") celsiusCheck = value - 273.15;
        
        if (celsiusCheck < -273.15) {
            errorElement.textContent = "⚠️ Температура не может быть ниже абсолютного нуля (-273.15 °C)";
            errorElement.classList.add("show");
            resultDisplay.textContent = "—";
            return;
        }
    }

    errorElement.classList.remove("show");
    let result = 0;

    try {
        if (currentCategory === "length") {
            const fromFactor = lengthUnits.find(u => u.name === fromSelect.value).factor;
            const toFactor = lengthUnits.find(u => u.name === toSelect.value).factor;
            result = (value / fromFactor) * toFactor;
        } 
        else if (currentCategory === "mass") {
            const fromFactor = massUnits.find(u => u.name === fromSelect.value).factor;
            const toFactor = massUnits.find(u => u.name === toSelect.value).factor;
            result = (value / fromFactor) * toFactor;
        }
        else if (currentCategory === "volume") {
            const fromFactor = volumeUnits.find(u => u.name === fromSelect.value).factor;
            const toFactor = volumeUnits.find(u => u.name === toSelect.value).factor;
            result = (value / fromFactor) * toFactor;
        }
        else if (currentCategory === "temp") {
            result = convertTemperatureValue(value, fromSelect.value, toSelect.value);
        }
        
        resultDisplay.textContent = result.toFixed(4) + " ";
    } catch(e) {
        resultDisplay.textContent = "Ошибка";
    }
}

function populateUnits() {
    let optionsFrom = "";
    let optionsTo = "";
    
    if (currentCategory === "length") {
        lengthUnits.forEach(unit => {
            optionsFrom += `<option value="${unit.name}">${unit.name}</option>`;
            optionsTo += `<option value="${unit.name}">${unit.name}</option>`;
        });
    } 
    else if (currentCategory === "mass") {
        massUnits.forEach(unit => {
            optionsFrom += `<option value="${unit.name}">${unit.name}</option>`;
            optionsTo += `<option value="${unit.name}">${unit.name}</option>`;
        });
    }
    else if (currentCategory === "volume") {
        volumeUnits.forEach(unit => {
            optionsFrom += `<option value="${unit.name}">${unit.name}</option>`;
            optionsTo += `<option value="${unit.name}">${unit.name}</option>`;
        });
    }
    else if (currentCategory === "temp") {
        tempUnits.forEach(unit => {
            optionsFrom += `<option value="${unit}">${unit}</option>`;
            optionsTo += `<option value="${unit}">${unit}</option>`;
        });
    }
    
    fromSelect.innerHTML = optionsFrom;
    toSelect.innerHTML = optionsTo;
    
    if (currentCategory === "length") {
        toSelect.value = "Километры (km)";
        fromSelect.value = "Метры (m)";
    } else if (currentCategory === "mass") {
        fromSelect.value = "Килограммы (kg)";
        toSelect.value = "Фунты (lb)";
    } else if (currentCategory === "volume") {
        fromSelect.value = "Литры (L)";
        toSelect.value = "Галлоны (gal)";
    } else if (currentCategory === "temp") {
        fromSelect.value = "Цельсий (°C)";
        toSelect.value = "Фаренгейт (°F)";
    }
    performConversion();
}

function switchCategory(category) {
    currentCategory = category;
    document.querySelectorAll(".tab-btn").forEach(btn => {
        if(btn.dataset.category === category) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    populateUnits();
}

function swapUnits() {
    const fromVal = fromSelect.value;
    const toVal = toSelect.value;
    fromSelect.value = toVal;
    toSelect.value = fromVal;
    performConversion();
}

function resetConverter() {
    inputValue.value = "1";
    if (currentCategory === "length") {
        fromSelect.value = "Метры (m)";
        toSelect.value = "Километры (km)";
    } else if (currentCategory === "mass") {
        fromSelect.value = "Килограммы (kg)";
        toSelect.value = "Фунты (lb)";
    } else if (currentCategory === "volume") {
        fromSelect.value = "Литры (L)";
        toSelect.value = "Галлоны (gal)";
    } else if (currentCategory === "temp") {
        fromSelect.value = "Цельсий (°C)";
        toSelect.value = "Фаренгейт (°F)";
    }
    performConversion();
}

inputValue.addEventListener("input", performConversion);
fromSelect.addEventListener("change", performConversion);
toSelect.addEventListener("change", performConversion);
document.getElementById("swapBtn").addEventListener("click", swapUnits);
document.getElementById("resetBtn").addEventListener("click", resetConverter);

document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        switchCategory(btn.dataset.category);
    });
});

populateUnits();