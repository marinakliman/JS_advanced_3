"usr strict";

/*
Создайте интерактивную веб-страницу для оставления и просмотра отзывов о продуктах. Пользователи могут добавлять отзывы о различных продуктах и просматривать добавленные отзывы.

Страница добавления отзыва:

Поле для ввода названия продукта.
Текстовое поле для самого отзыва.
Кнопка "Добавить отзыв", которая сохраняет отзыв о продукте в LocalStorage.

Страница просмотра отзывов:

Показывает список всех продуктов, о которых были оставлены отзывы.
При клике на название продукта отображается список всех отзывов по этому продукту.
Возможность удаления отзыва (при нажатии на кнопку "Удалить" рядом с отзывом, данный отзыв удаляется из LocalStorage).

------------------------------------------------------------------
Замечание: здесь может пригодиться странный код из предыдущего ДЗ.

const initialData = [
    {
        product: "Apple iPhone 13",
        reviews: [
            {
                id: "1",
                text: "Отличный телефон! Батарея держится долго.",
            },
            {
                id: "2",
                text: "Камера супер, фото выглядят просто потрясающе.",
            },
        ],
    },
    {
        product: "Samsung Galaxy Z Fold 3",
        reviews: [
            {
                id: "3",
                text: "Интересный дизайн, но дорогой.",
            },
        ],
    },
    {
        product: "Sony PlayStation 5",
        reviews: [
            {
                id: "4",
                text: "Люблю играть на PS5, графика на высоте.",
            },
        ],
    },
];
------------------------------------------------------------------

Вы можете использовать этот массив initialData для начальной загрузки данных при запуске вашего приложения.
*/

// Некий начальный массив продуктов и комментариев к ним
let initialData = [
    {
        product: "Apple iPhone 13",
        reviews: [
            {
                id: "1",
                text: "Отличный телефон! Батарея держится долго.",
            },
            {
                id: "2",
                text: "Камера супер, фото выглядят просто потрясающе.",
            },
        ],
    },
    {
        product: "Samsung Galaxy Z Fold 3",
        reviews: [
            {
                id: "3",
                text: "Интересный дизайн, но дорогой.",
            },
        ],
    },
    {
        product: "Sony PlayStation 5",
        reviews: [
            {
                id: "4",
                text: "Люблю играть на PS5, графика на высоте.",
            },
        ],
    },
];

// Очистка localstorage
// localStorage.removeItem("user");

// Если localStorage пуст — помещаем в него initialData
// Если не пуст, помещаем его значение в initialData
if (localStorage.getItem("user") === null) {
    localStorage.setItem("user", JSON.stringify(initialData));
} else {
    initialData = JSON.parse(localStorage.getItem("user"));
}

// Считаем максимальный ID комментариев
// Он понадобится для добавления нового комментария с уникальным ID
let maxId = getMaxIdCommentary();

// Получаем объекты: блок продуктов, форму, ее элементы
const productDiv = document.getElementById("goods");
const appForm = document.getElementById("formBox");
const productForm = document.getElementById("formProduct");
const productCommentary = document.getElementById("formCommentary");

// Добавляем слушателя для кнопки формы
appForm.addEventListener("submit", handleFormSubmit);

// Слушаем клики в блоке продуктов
productDiv.onclick = function (event) {
    const productCounter = event.target.dataset.index;
    const actionType = event.target.dataset.type;
    // Удаляем конкретный комментарий из конкретного продукта
    // Регенерируем блок продуктов
    if (actionType === "delete") {
        deleteCommentary(event.target.dataset.index);
        event.target.parentElement.remove();
        render();
    }
    // Помещаем название конкретного продукта в поле "Название продукта"
    // Смещаем фокус на поле "Ваш комментарий"
    if (actionType === "add") {
        productForm.value = initialData[productCounter].product;
        productCommentary.focus();
    }
};

// Регенерируем блок продуктов
render();

// Функция нахождения максимального ID среди всех комментариев
function getMaxIdCommentary() {
    let maxId = 1;
    initialData.forEach(function (element) {
        for (const review of element.reviews) {
            if (parseInt(review.id) > maxId) {
                maxId = parseInt(review.id);
            }
        }
    });
    return maxId + 1;
}

// Функция сборки HTML для блока продуктов из массива initialData
// Последним действием регенерируем localStorage
function render() {
    productDiv.innerHTML = "";
    let productHTML = "";
    initialData.forEach(function (element, index) {
        productHTML += `
		<div class='product' id='product${index}'>
        `;
        if (element.reviews.length) {
            let reviewIndex = -1;
            productHTML += `
            <details>
				<summary>
					<h2 class='product__head'>${element.product + " "}<span>Комментариев${
                " " + element.reviews.length
            }</span></h2>
                </summary>`;
            for (const review of element.reviews) {
                productHTML += `
			<div class='product__commentary' id='commentary${review.id}'>
				${review.text} 
				<button class='product__button delete' data-index=${
                    index + "-" + reviewIndex
                } data-type='delete'>
                    Удалить
                </button>
			</div>`;
                reviewIndex++;
            }
            productHTML += "</details>";
        } else {
            productHTML += `
            <h2 class='product__head'>${element.product}</h2>
        `;
        }
        productHTML += `
            <button class='product__button add' data-index=${index} data-type='add'>
                Ваш комментарий
            </button>
        </div>`;
    });
    productDiv.innerHTML += productHTML;
    // Обновляем localStarage
    localStorage.setItem("user", JSON.stringify(initialData));
}

// Функция, возвращающая массив: [0] — индекс продукта, [1] — индекст комментария к нему
function getProductAndReviewIndex(string) {
    return string.split("-").map((x) => Number.parseInt(x));
}

// Функция, удаляющая комментарий из продукта
function deleteCommentary(string) {
    const productIndex = getProductAndReviewIndex(string)[0];
    const commentaryIndex = getProductAndReviewIndex(string)[1];
    const commentToRemove = initialData[productIndex].reviews;
    commentToRemove.splice(commentaryIndex, 1);
    if (commentToRemove.length === 0) {
        return false;
    }
    return true;
}

// Функция, сериализирующая информацию, полученную из формы
function serializeForm(formNode) {
    const formData = new FormData(formNode);
    return formData;
}

// Функция, обрабатывающая нажатие кнопки "Отправить" в форме
function handleFormSubmit(event) {
    event.preventDefault();
    const getProduct = serializeForm(appForm).get("product");
    const getCommentary = serializeForm(appForm).get("commentary");
    const foundItem = initialData.findIndex(
        (obj) => obj.product === getProduct
    );
    if (foundItem !== -1) {
        initialData[foundItem].reviews.push({
            id: maxId,
            text: getCommentary,
        });
        maxId++;
        render();
    } else {
        // Продукт не найден, о чем и сообщаем
        alert(`Продукта ${getProduct} нет в каталоге`);
    }
}