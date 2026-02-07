document.addEventListener('DOMContentLoaded', () => {
    // === 1. ОСНОВНЫЕ ПЕРЕМЕННЫЕ ===
    const cartWidget = document.getElementById('cart-widget');
    const modal = document.getElementById('cart-modal');
    const stage1 = document.getElementById('cart-stage-1');
    const stage2 = document.getElementById('cart-stage-2');
    
    // Поля формы (Stage 2)
    const userName = document.getElementById('user-name');
    const userAddress = document.getElementById('user-address');
    const userPhone = document.getElementById('user-phone');

    const itemsList = document.getElementById('cart-items-list');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');
    
    let cart = [];
    const myPhoneNumber = "77775644567"; // Твой номер из скриншота

    // === 2. ХЕДЕР (АНИМАЦИЯ ПАНЕЛИ) ===
    const header = document.querySelector('header');
    if (header) {
        header.addEventListener('mouseenter', () => header.classList.add('header-active'));
        header.addEventListener('mouseleave', () => header.classList.remove('header-active'));
    }

    // === 3. КНОПКА "ЗАКАЗАТЬ" В МЕНЮ ===
    document.querySelectorAll('.order-button').forEach(button => {
        button.onclick = function(e) {
            e.stopPropagation();
            // Находим карточку товара
            const card = this.closest('.menu-item, .kombo-item, .sakysku-item, .napitki-item');
            if (!card) return;

            // Анимация прыжка картинки
            const img = card.querySelector('img');
            if (img) {
                img.classList.remove('jump-animation');
                void img.offsetWidth; // Хаки для перезапуска CSS анимации
                img.classList.add('jump-animation');
            }
            
            const name = card.querySelector('h1').innerText;
            const price = parseInt(card.querySelector('.price').innerText.replace(/\D/g, ''));

            // Добавление в массив корзины
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.count++;
            } else {
                cart.push({ name, price, img: img ? img.src : '', count: 1 });
            }

            updateCart(); // Вызов из второй части
        };
    });

    document.querySelector('header').onclick = function() {
    this.classList.toggle('header-active');
};
    document.querySelector('header').onclick = function() {
    this.classList.toggle('header-active');
};
    // === 4. ОБНОВЛЕНИЕ ОТОБРАЖЕНИЯ КОРЗИНЫ ===
    window.updateCart = function() {
        if (!itemsList) return;
        itemsList.innerHTML = '';
        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            // Присваиваем класс для CSS стилей, которые мы писали
            itemDiv.className = "cart-item-row"; 
            itemDiv.style = "display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;";
            
            itemDiv.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px; flex:1;">
                    <img src="${item.img}" style="width:45px; height:45px; border-radius:5px; object-fit:cover;">
                    <div style="font-size:14px;">
                        <div style="font-weight:bold;">${item.name}</div>
                        <div style="color:#FF4500;">${item.price} тг</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span style="font-weight:bold; min-width:20px; text-align:center;">${item.count}</span>
                    <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
            `;
            itemsList.appendChild(itemDiv);
            total += item.price * item.count;
            count += item.count;
        });

        if (totalPriceElement) totalPriceElement.innerText = total.toLocaleString();
        if (cartCountElement) cartCountElement.innerText = count;

        // Виджет корзины виден только если есть товары
        cartWidget.style.display = count > 0 ? 'block' : 'none';
        if (count === 0) modal.style.display = 'none';
    };

    // Глобальная функция для кнопок +/-
    window.changeQuantity = (index, delta) => {
        cart[index].count += delta;
        if (cart[index].count <= 0) cart.splice(index, 1);
        updateCart();
    };

    // === 5. ОБРАБОТКА КЛИКОВ (ПЕРЕКЛЮЧЕНИЕ ЭТАПОВ) ===
    document.addEventListener('click', (e) => {
        // Открыть корзину (на этап 1)
        if (e.target.closest('#cart-widget')) {
            modal.style.display = 'block';
            stage1.style.display = 'block';
            stage2.style.display = 'none';
        }

        // Кнопка "Оформить заказ" (переход к форме)
        if (e.target.id === 'go-to-checkout') {
            stage1.style.display = 'none';
            stage2.style.display = 'block';
        }

        // Кнопка "Назад" (на этап 1)
        if (e.target.id === 'back-to-cart') {
            stage1.style.display = 'block';
            stage2.style.display = 'none';
        }

        // Закрытие модалки
        if (e.target.id === 'close-modal' || e.target === modal) {
            modal.style.display = 'none';
        }

        // ОТПРАВКА В WHATSAPP
        if (e.target.id === 'send-to-whatsapp') {
            if (!userName.value || !userAddress.value || !userPhone.value) {
                alert("Пожалуйста, заполните все поля доставки!");
                return;
            }

            let message = "🚀 *НОВЫЙ ЗАКАЗ С САЙТА*\n\n";
            message += `👤 *Имя:* ${userName.value}\n`;
            message += `📍 *Адрес:* ${userAddress.value}\n`;
            message += `📞 *Тел:* ${userPhone.value}\n\n`;
            message += "🛒 *Товары:*\n";

            cart.forEach((item, i) => {
                message += `${i + 1}. ${item.name} x${item.count} — ${item.price * item.count} тг\n`;
            });

            message += `\n💰 *ИТОГО: ${totalPriceElement.innerText} тг*`;

            window.location.href = `https://wa.me/${myPhoneNumber}?text=${encodeURIComponent(message)}`;
        }
    });
    document.querySelector('header').addEventListener('click', function() {
    this.classList.toggle('header-active');
});
});