
let currentLang = localStorage.getItem('site_lang') || 'bg';
let soundOn = localStorage.getItem('site_sound') !== 'false';

const servicesData = [
    {
        cat_bg: "Монтаж на уреди и оборудване",
        cat_en: "Appliance & Equipment Installation",
        items: [
            { id: "boiler", bg: "Бойлер", en: "Water Heater / Boiler", price: 35, unit: "pcs" },
            { id: "oven", bg: "Фурна за вграждане", en: "Built-in Oven", price: 30, unit: "pcs" },
            { id: "hob", bg: "Котлони", en: "Electric Hobs", price: 30, unit: "pcs" },
            { id: "hood", bg: "Аспиратор", en: "Range Hood", price: 30, unit: "pcs" },
            { id: "three_phase", bg: "Трифазен уред", en: "Three-Phase Appliance", price: 60, unit: "pcs" },
            { id: "bath_fan", bg: "Вентилатор баня", en: "Bathroom Fan", price: 20, unit: "pcs" }
        ]
    },
    {
        cat_bg: "Пробиване на отвори и конзоли",
        cat_en: "Drilling & Mounting Boxes",
        items: [
            { id: "drill_socket", bg: "Монтаж конзола с пробиване отвор", en: "Socket Box Hole Drilling", prices: { gypsum: 6, brick: 8, concrete: 15 }, unit: "material" },
            { id: "drill_junction", bg: "За разпределителна кутия (пробиване)", en: "Junction Box Hole Drilling", prices: { gypsum: 8, brick: 10, concrete: 20 }, unit: "material" }
        ]
    },
    {
        cat_bg: "Ключове, контакти и осветителни тела",
        cat_en: "Switches, Sockets & Lighting",
        items: [
            { id: "socket", bg: "Монтаж контакт", en: "Socket Installation", price: 7, unit: "pcs" },
            { id: "switch", bg: "Монтаж ключ", en: "Switch Installation", price: 7, unit: "pcs" },
            { id: "double_socket", bg: "Двоен контакт", en: "Double Socket Installation", price: 8, unit: "pcs" },
            { id: "ceiling_light", bg: "Монтаж плафон и лампа", en: "Ceiling Light Installation", price: 20, unit: "pcs" },
            { id: "led_panel", bg: "Монтаж лед панел", en: "LED Panel Installation", price: 20, unit: "pcs" },
            { id: "spotlight", bg: "Монтаж луничка", en: "Spotlight / Downlight", price: 10, unit: "pcs" },
            { id: "chandelier", bg: "Монтаж полилей", en: "Chandelier Installation", price: 30, unit: "pcs" },
            { id: "large_chandelier", bg: "Монтаж голям полилей", en: "Large Chandelier Installation", price: 80, unit: "pcs" },
            { id: "led_strip", bg: "Монтаж лед лента (линеен метър)", en: "LED Strip Installation (linear meter)", price: 5, unit: "lm" },
            { id: "motion_sensor", bg: "Датчик движение", en: "Motion Sensor", price: 20, unit: "pcs" }
        ]
    },
    {
        cat_bg: "Ел. табла и защити",
        cat_en: "Switchboards & Safety Devices",
        items: [
            { id: "boiler_panel", bg: "Бойлерно табло", en: "Boiler Switchboard", price: 20, unit: "pcs" },
            { id: "circuit_breaker", bg: "Автоматичен прекъсвач", en: "Circuit Breaker", price: 10, unit: "pcs" },
            { id: "rcd", bg: "Дефектнотокова защита (ДТЗ)", en: "Residual Current Device (RCD)", price: 20, unit: "pcs" },
            { id: "panel_change", bg: "Смяна на табло", en: "Switchboard Replacement", price: 150, unit: "pcs" },
            { id: "panel_box", bg: "Монтаж кутия табло", en: "Switchboard Box Installation", price: 30, unit: "pcs" }
        ]
    },
    {
        cat_bg: "Кабели и точки",
        cat_en: "Cables & Electrical Points",
        items: [
            { id: "cable_pull", bg: "Изтегляне на кабел (линеен метър)", en: "Cable Pulling (linear meter)", price: 3.5, unit: "lm" },
            { id: "cable_conduit", bg: "Кабел в гофре (линеен метър)", en: "Cable in Conduit (linear meter)", price: 4.5, unit: "lm" },
            { id: "cable_channel", bg: "Кабел канал (линеен метър)", en: "Cable Trunking (linear meter)", price: 2, unit: "lm" },
            { id: "junction_box", bg: "Разклонителна кутия", en: "Junction Box Wiring", price: 15, unit: "pcs" },
            { id: "new_el_point", bg: "Нова Ел точка", en: "New Electrical Point", price: 30, unit: "pcs" },
            { id: "new_light_point", bg: "Нова осветителна точка", en: "New Lighting Point", price: 30, unit: "pcs" },
            { id: "new_socket_point", bg: "Нова точка за контакт", en: "New Socket Point", price: 35, unit: "pcs" },
            { id: "callout", bg: "Повикване / Посещение", en: "Emergency Call-out / Visit", price: 50, unit: "pcs" }
        ]
    }
];

function navigateWithEffect(url) {
    playZapSound();
    triggerLightning();
    setTimeout(() => {
        window.location.href = url;
    }, 150);
}

function renderCalculator() {
    const container = document.getElementById('calc-container');
    if (!container) return;
    container.innerHTML = '';

    servicesData.forEach((cat) => {
        const catDiv = document.createElement('div');
        catDiv.className = 'service-category';
        
        const catTitle = document.createElement('h3');
        catTitle.innerText = currentLang === 'bg' ? cat.cat_bg : cat.cat_en;
        catDiv.appendChild(catTitle);

        cat.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'calc-item';

            let optionsHtml = '';
            if (item.unit === 'material') {
                optionsHtml = `
                    <select class="select-material" id="mat-${item.id}" onchange="recalculate()">
                        <option value="gypsum">${currentLang === 'bg' ? 'Гипсокартон (6€)' : 'Gypsum (6€)'}</option>
                        <option value="brick">${currentLang === 'bg' ? 'Тухла (8€)' : 'Brick (8€)'}</option>
                        <option value="concrete">${currentLang === 'bg' ? 'Бетон (15€)' : 'Concrete (15€)'}</option>
                    </select>
                    <input type="number" class="qty-input" id="qty-${item.id}" value="1" min="1" oninput="recalculate()">
                `;
            } else {
                const unitLabel = item.unit === 'lm' ? (currentLang === 'bg' ? 'л.м.' : 'm') : (currentLang === 'bg' ? 'бр.' : 'pcs');
                optionsHtml = `
                    <input type="number" class="qty-input" id="qty-${item.id}" value="1" min="1" oninput="recalculate()">
                    <span style="font-size:12px; color:var(--text-muted);">${unitLabel}</span>
                `;
            }

            const basePriceText = item.price ? `${item.price} €` : `от ${item.prices.gypsum} €`;

            itemDiv.innerHTML = `
                <label class="calc-label">
                    <input type="checkbox" id="chk-${item.id}" onchange="recalculate()">
                    <span>${currentLang === 'bg' ? item.bg : item.en}</span>
                </label>
                <div class="calc-options">
                    ${optionsHtml}
                    <div class="item-price" id="prc-${item.id}">${basePriceText}</div>
                </div>
            `;
            catDiv.appendChild(itemDiv);
        });

        container.appendChild(catDiv);
    });
    recalculate();
}

function recalculate() {
    let grandTotal = 0;
    const currencySymbol = currentLang === 'bg' ? '€' : 'euro';

    servicesData.forEach(cat => {
        cat.items.forEach(item => {
            const chk = document.getElementById(`chk-${item.id}`);
            const qtyInput = document.getElementById(`qty-${item.id}`);
            const priceDisplay = document.getElementById(`prc-${item.id}`);

            if (chk && chk.checked) {
                let unitPrice = item.price || 0;
                const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;

                if (item.unit === 'material') {
                    const matSelect = document.getElementById(`mat-${item.id}`);
                    const mat = matSelect ? matSelect.value : 'gypsum';
                    unitPrice = item.prices[mat];
                }

                const itemTotal = unitPrice * qty;
                grandTotal += itemTotal;
                if (priceDisplay) priceDisplay.innerText = `${itemTotal} ${currencySymbol}`;
            } else if (priceDisplay) {
                const defaultPrice = item.price ? `${item.price} ${currencySymbol}` : `${item.prices.gypsum} ${currencySymbol}`;
                priceDisplay.innerText = defaultPrice;
            }
        });
    });

    const totalEl = document.getElementById('grand-total');
    if (totalEl) totalEl.innerText = `${grandTotal} ${currencySymbol}`;
}

function triggerLightning() {
    const canvas = document.getElementById('lightning-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#38bdf8';

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    let x = canvas.width / 2;
    let y = 0;

    while (y < canvas.height) {
        x += (Math.random() - 0.5) * 100;
        y += Math.random() * 50;
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    setTimeout(() => { canvas.style.display = 'none'; }, 150);
}

function playZapSound() {
    if (!soundOn) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
}

function toggleSound() {
    soundOn = !soundOn;
    localStorage.setItem('site_sound', soundOn);
    updateSoundBtn();
}

function updateSoundBtn() {
    const btn = document.getElementById('sound-btn');
    if (btn) btn.innerText = soundOn ? '🔊 Sound ON' : '🔇 Sound OFF';
}

function toggleLanguage() {
    currentLang = currentLang === 'bg' ? 'en' : 'bg';
    localStorage.setItem('site_lang', currentLang);
    applyLanguage();
}

function applyLanguage() {
    document.querySelectorAll('[data-bg]').forEach(el => {
        el.innerText = el.getAttribute(`data-${currentLang}`);
    });
    renderCalculator();
}

window.addEventListener('DOMContentLoaded', () => {
    updateSoundBtn();
    applyLanguage();
});
