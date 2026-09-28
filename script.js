let currentLang = localStorage.getItem('appLang') || 'bg';
let soundOn = localStorage.getItem('appSound') !== 'false';
let activeCategoryIndex = 'all';

const servicesData = [
    {
        cat_bg: "Монтаж на уреди",
        cat_en: "Appliances",
        items: [
            { id: "boiler", icon: "fa-bath", bg: "Бойлер", en: "Water Heater", price: 35, unit: "pcs" },
            { id: "oven", icon: "fa-fire-burner", bg: "Фурна за вграждане", en: "Built-in Oven", price: 30, unit: "pcs" },
            { id: "hob", icon: "fa-rug", bg: "Котлони", en: "Electric Hobs", price: 30, unit: "pcs" },
            { id: "hood", icon: "fa-wind", bg: "Аспиратор", en: "Range Hood", price: 30, unit: "pcs" },
            { id: "three_phase", icon: "fa-bolt", bg: "Трифазен уред", en: "Three-Phase Appliance", price: 60, unit: "pcs" },
            { id: "bath_fan", icon: "fa-fan", bg: "Вентилатор баня", en: "Bathroom Fan", price: 20, unit: "pcs" }
        ]
    },
    {
        cat_bg: "Пробиване & Конзоли",
        cat_en: "Drilling & Boxes",
        items: [
            { id: "drill_socket", icon: "fa-bore-hole", bg: "Конзолна кутия", en: "Socket Box", prices: { gypsum: 6, brick: 8, concrete: 15 }, unit: "material" },
            { id: "drill_junction", icon: "fa-dharmachakra", bg: "Разпределителна кутия", en: "Junction Box", prices: { gypsum: 8, brick: 10, concrete: 20 }, unit: "material" }
        ]
    },
    {
        cat_bg: "Ключове & Осветление",
        cat_en: "Switches & Lighting",
        items: [
            { id: "socket", icon: "fa-plug", bg: "Контакт", en: "Socket", price: 7, unit: "pcs" },
            { id: "switch", icon: "fa-toggle-on", bg: "Ключ", en: "Switch", price: 7, unit: "pcs" },
            { id: "double_socket", icon: "fa-plug-circle-plus", bg: "Двоен контакт", en: "Double Socket", price: 8, unit: "pcs" },
            { id: "ceiling_light", icon: "fa-lightbulb", bg: "Плафон / Лампа", en: "Ceiling Light", price: 20, unit: "pcs" },
            { id: "led_panel", icon: "fa-border-all", bg: "Лед панел", en: "LED Panel", price: 20, unit: "pcs" },
            { id: "spotlight", icon: "fa-circle-dot", bg: "Луничка", en: "Spotlight", price: 10, unit: "pcs" },
            { id: "chandelier", icon: "fa-gem", bg: "Полилей", en: "Chandelier", price: 30, unit: "pcs" },
            { id: "large_chandelier", icon: "fa-crown", bg: "Голям полилей", en: "Large Chandelier", price: 80, unit: "pcs" },
            { id: "led_strip", icon: "fa-grip-lines", bg: "Лед лента (лин.м)", en: "LED Strip (m)", price: 5, unit: "lm" },
            { id: "motion_sensor", icon: "fa-eye", bg: "Датчик движение", en: "Motion Sensor", price: 20, unit: "pcs" }
        ]
    },
    {
        cat_bg: "Ел. табла & Защити",
        cat_en: "Panels & Safety",
        items: [
            { id: "boiler_panel", icon: "fa-box-archive", bg: "Бойлерно табло", en: "Boiler Switchboard", price: 20, unit: "pcs" },
            { id: "circuit_breaker", icon: "fa-toggle-off", bg: "Автоматичен прекъсвач", en: "Circuit Breaker", price: 10, unit: "pcs" },
            { id: "rcd", icon: "fa-shield-halved", bg: "Дефектнотокова (ДТЗ)", en: "RCD Safety", price: 20, unit: "pcs" },
            { id: "panel_change", icon: "fa-sliders", bg: "Смяна на табло", en: "Panel Replacement", price: 150, unit: "pcs" },
            { id: "panel_box", icon: "fa-box", bg: "Кутия за табло", en: "Switchboard Box", price: 30, unit: "pcs" }
        ]
    },
    {
        cat_bg: "Кабели & Окабеляване",
        cat_en: "Cabling",
        items: [
            { id: "cable_pull", icon: "fa-sm划", bg: "Изтегляне кабел (лин.м)", en: "Cable Pulling (m)", price: 3.5, unit: "lm" },
            { id: "cable_conduit", icon: "fa-circle-nodes", bg: "Кабел в гофре (лин.м)", en: "Cable Conduit (m)", price: 4.5, unit: "lm" },
            { id: "cable_channel", icon: "fa-bars-staggered", bg: "Кабел канал (лин.м)", en: "Cable Trunking (m)", price: 2, unit: "lm" },
            { id: "junction_box", icon: "fa-network-wired", bg: "Разклонителна кутия", en: "Junction Box", price: 15, unit: "pcs" },
            { id: "new_el_point", icon: "fa-circle-plus", bg: "Нова Ел точка", en: "New Electrical Point", price: 30, unit: "pcs" },
            { id: "new_light_point", icon: "fa-sun", bg: "Нова осв. точка", en: "New Light Point", price: 30, unit: "pcs" },
            { id: "new_socket_point", icon: "fa-plug", bg: "Нова точка контакт", en: "New Socket Point", price: 35, unit: "pcs" },
            { id: "callout", icon: "fa-truck-medical", bg: "Посещение / Повикване", en: "Emergency Call-out", price: 50, unit: "pcs" }
        ]
    }
];

const selectedItems = {};

function renderCategoryFilters() {
    const bar = document.getElementById('calc-cats-bar');
    if (!bar) return;
    bar.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = `cat-filter-btn ${activeCategoryIndex === 'all' ? 'active' : ''}`;
    allBtn.innerText = currentLang === 'bg' ? 'Всички' : 'All';
    allBtn.onclick = () => { activeCategoryIndex = 'all'; renderCategoryFilters(); filterServices(); };
    bar.appendChild(allBtn);

    servicesData.forEach((cat, idx) => {
        const btn = document.createElement('button');
        btn.className = `cat-filter-btn ${activeCategoryIndex === idx ? 'active' : ''}`;
        btn.innerText = currentLang === 'bg' ? cat.cat_bg : cat.cat_en;
        btn.onclick = () => { activeCategoryIndex = idx; renderCategoryFilters(); filterServices(); };
        bar.appendChild(btn);
    });
}

function renderCalculator() {
    renderCategoryFilters();
    filterServices();
}

function filterServices() {
    const container = document.getElementById('calc-container');
    if (!container) return;
    container.innerHTML = '';
    const searchInput = document.getElementById('calc-search');
    const searchVal = searchInput ? searchInput.value.toLowerCase() : '';

    servicesData.forEach((cat, cIdx) => {
        if (activeCategoryIndex !== 'all' && activeCategoryIndex !== cIdx) return;

        cat.items.forEach(item => {
            const titleText = currentLang === 'bg' ? item.bg : item.en;
            if (searchVal && !titleText.toLowerCase().includes(searchVal)) return;

            const card = document.createElement('div');
            const isSelected = !!selectedItems[item.id];
            card.className = `calc-card ${isSelected ? 'selected' : ''}`;
            card.onclick = (e) => {
                if (e.target.closest('.card-controls')) return;
                toggleItemSelection(item);
            };

            let optionsHtml = '';
            const qty = selectedItems[item.id] ? selectedItems[item.id].qty : 1;

            if (item.unit === 'material') {
                const mat = selectedItems[item.id] ? selectedItems[item.id].mat : 'gypsum';
                optionsHtml = `
                    <select class="select-mat" onchange="updateItemMaterial('${item.id}', this.value)">
                        <option value="gypsum" ${mat === 'gypsum' ? 'selected' : ''}>Гипсокартон</option>
                        <option value="brick" ${mat === 'brick' ? 'selected' : ''}>Тухла</option>
                        <option value="concrete" ${mat === 'concrete' ? 'selected' : ''}>Бетон</option>
                    </select>
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateItemQty('${item.id}', -1)">-</button>
                        <input class="qty-val" type="text" value="${qty}" readonly>
                        <button class="qty-btn" onclick="updateItemQty('${item.id}', 1)">+</button>
                    </div>
                `;
            } else {
                optionsHtml = `
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateItemQty('${item.id}', -1)">-</button>
                        <input class="qty-val" type="text" value="${qty}" readonly>
                        <button class="qty-btn" onclick="updateItemQty('${item.id}', 1)">+</button>
                    </div>
                `;
            }

            const currentPrice = getItemPrice(item);

            card.innerHTML = `
                <div class="card-top">
                    <div class="card-icon"><i class="fa-solid ${item.icon}"></i></div>
                    <div class="card-title-text">${titleText}</div>
                </div>
                <div class="card-bottom">
                    <div class="card-controls">${optionsHtml}</div>
                    <div class="card-price">${currentPrice} €</div>
                </div>
            `;

            container.appendChild(card);
        });
    });

    recalculateTotal();
}

function getItemPrice(item) {
    if (!selectedItems[item.id]) {
        return item.price || item.prices.gypsum;
    }
    const sel = selectedItems[item.id];
    if (item.unit === 'material') {
        return item.prices[sel.mat] * sel.qty;
    }
    return item.price * sel.qty;
}

function toggleItemSelection(item) {
    playZapSound();
    if (selectedItems[item.id]) {
        delete selectedItems[item.id];
    } else {
        selectedItems[item.id] = {
            item: item,
            qty: 1,
            mat: item.unit === 'material' ? 'gypsum' : null
        };
    }
    filterServices();
}

function updateItemQty(id, change) {
    if (!selectedItems[id]) return;
    selectedItems[id].qty = Math.max(1, selectedItems[id].qty + change);
    filterServices();
}

function updateItemMaterial(id, mat) {
    if (!selectedItems[id]) return;
    selectedItems[id].mat = mat;
    filterServices();
}

function recalculateTotal() {
    let grandTotal = 0;
    Object.values(selectedItems).forEach(sel => {
        const item = sel.item;
        if (item.unit === 'material') {
            grandTotal += item.prices[sel.mat] * sel.qty;
        } else {
            grandTotal += item.price * sel.qty;
        }
    });

    const symbol = currentLang === 'bg' ? '€' : 'euro';
    const totalEl = document.getElementById('grand-total');
    if (totalEl) totalEl.innerText = `${grandTotal} ${symbol}`;
}

function generatePDF() {
    const keys = Object.keys(selectedItems);
    if (keys.length === 0) {
        alert(currentLang === 'bg' ? 'Моля, изберете поне една услуга!' : 'Please select at least one service!');
        return;
    }

    let itemsTable = '';
    let grandTotal = 0;

    keys.forEach(key => {
        const sel = selectedItems[key];
        const title = currentLang === 'bg' ? sel.item.bg : sel.item.en;
        let p = sel.item.price;
        let detail = `${sel.qty} ${sel.item.unit === 'lm' ? 'м' : 'бр.'}`;

        if (sel.item.unit === 'material') {
            p = sel.item.prices[sel.mat];
            detail += ` (${sel.mat})`;
        }

        const total = p * sel.qty;
        grandTotal += total;

        itemsTable += `
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px;">${title}</td>
                <td style="padding: 8px; text-align: center;">${detail}</td>
                <td style="padding: 8px; text-align: right;">${total} €</td>
            </tr>
        `;
    });

    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.innerHTML = `
        <h2 style="color: #f59e0b; text-align: center;">Ен Ти Консултинг ЕООД</h2>
        <h3 style="text-align: center; margin-bottom: 20px;">Оферта за Електроуслуги</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
                <tr style="background: #1e293b; color: #fff;">
                    <th style="padding: 8px; text-align: left;">Услуга</th>
                    <th style="padding: 8px; text-align: center;">Количество</th>
                    <th style="padding: 8px; text-align: right;">Цена</th>
                </tr>
            </thead>
            <tbody>
                ${itemsTable}
            </tbody>
        </table>
        <h3 style="text-align: right; color: #10b981;">Обща сума: ${grandTotal} €</h3>
    `;

    html2pdf().from(element).save('Оферта_Електроуслуги.pdf');
}

function sendOfferEmail() {
    const keys = Object.keys(selectedItems);
    if (keys.length === 0) {
        alert(currentLang === 'bg' ? 'Моля, изберете поне една услуга!' : 'Please select at least one service!');
        return;
    }

    let body = 'Здравейте, искам запитване за следните услуги:\n\n';
    let grandTotal = 0;

    keys.forEach(key => {
        const sel = selectedItems[key];
        const title = sel.item.bg;
        let p = sel.item.price;
        if (sel.item.unit === 'material') p = sel.item.prices[sel.mat];
        const total = p * sel.qty;
        grandTotal += total;
        body += `- ${title} x ${sel.qty} = ${total} €\n`;
    });

    body += `\nОбща сума: ${grandTotal} €\n`;
    window.location.href = `mailto:emil.st.nikolov@gmail.com?subject=Запитване за оферта&body=${encodeURIComponent(body)}`;
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
}

function toggleSound() {
    soundOn = !soundOn;
    localStorage.setItem('appSound', soundOn);
    updateControlsUI();
}

function toggleLanguage() {
    currentLang = currentLang === 'bg' ? 'en' : 'bg';
    localStorage.setItem('appLang', currentLang);
    applyLanguage();
    if (document.getElementById('calc-container')) {
        renderCalculator();
    }
}

function applyLanguage() {
    document.querySelectorAll('[data-bg]').forEach(el => {
        el.innerText = el.getAttribute(`data-${currentLang}`);
    });
    updateControlsUI();
}

function updateControlsUI() {
    const soundBtn = document.getElementById('sound-btn');
    if (soundBtn) soundBtn.innerText = soundOn ? '🔊 Sound ON' : '🔇 Sound OFF';
}

window.onload = function() {
    applyLanguage();
    updateControlsUI();
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playZapSound();
            triggerLightning();
        });
    });

    if (document.getElementById('calc-container')) {
        renderCalculator();
    }
};