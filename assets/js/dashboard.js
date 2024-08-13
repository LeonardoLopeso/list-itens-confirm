// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyQwMtnQAneAXVp9m181OOIvr_V0TDE4Y",
    authDomain: "itens-list.firebaseapp.com",
    projectId: "itens-list",
    storageBucket: "itens-list.appspot.com",
    messagingSenderId: "443618326670",
    appId: "1:443618326670:web:ca97eac33975c6020eb1df",
    measurementId: "G-HJFY0T0R9E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function sortItems(items) {
    return items.sort((a, b) => {
        const cleanTextA = a.text.replace(/^\d+\s/, '');
        const cleanTextB = b.text.replace(/^\d+\s/, '');
        return cleanTextA.localeCompare(cleanTextB);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Mostrar o loader
    loading.style.display = 'flex';

    const allItemsElement = document.getElementById('all-items');
    const totalConfirmedElement = document.getElementById('total-confirmed');
    const confirmedVsPendingElement = document.getElementById('confirmed-vs-pending');
    const itemDistributionChartElement = document.getElementById('item-distribution-chart');
    const totalSpecificItemsElement = document.getElementById('total-specific-items');
    const signerListElement = document.getElementById('signer-list');

    let totalItems = 0;
    let confirmedItems = 0;
    let specificItemsCount = 0;

    const specificItems = [
        "Água de Coco",
        "Carne",
        "Carvão",
        "Descartáveis",
        "Farofa",
        "Frango",
        "Gelo",
        "Linguiça",
        "Refrigerante",
        "Vinagrete",
        "Sal Grosso",
        "Batata Palha"
    ];

    const itemTypes = {
        'Água de Coco': 0,
        'Descartáveis': 0,
        'Farofa': 0,
        'Refrigerante': 0,
        'Vinagrete': 0
    };

    // Load items from Firebase
    const itemsRef = ref(database, 'items');
    onValue(itemsRef, (snapshot) => {
        totalItems = 0;
        confirmedItems = 0;
        specificItemsCount = 0;
        const signerCounts = {};
        for (let key in itemTypes) {
            itemTypes[key] = 0;
        }

        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            totalItems++;
            if (item.name) {
                confirmedItems++;
                if (signerCounts[item.name]) {
                    signerCounts[item.name]++;
                } else {
                    signerCounts[item.name] = 1;
                }
            }

            // Categorize items for distribution
            if (item.text.includes('Água de Coco')) itemTypes['Água de Coco']++;
            if (item.text.includes('Descartáveis')) itemTypes['Descartáveis']++;
            if (item.text.includes('Farofa')) itemTypes['Farofa']++;
            if (item.text.includes('Refrigerante')) itemTypes['Refrigerante']++;
            if (item.text.includes('Vinagrete')) itemTypes['Vinagrete']++;

            // Count specific items
            specificItems.forEach(specificItem => {
                if (item.text.includes(specificItem)) {
                    specificItemsCount++;
                }
            });
        });

        signerListElement.innerHTML = '';

        if (allItemsElement) {
            allItemsElement.textContent = totalItems;
        }

        // Update metrics
        if (totalConfirmedElement) {
            totalConfirmedElement.textContent = confirmedItems;
        }

        if (confirmedVsPendingElement) {
            confirmedVsPendingElement.textContent = `${confirmedItems} / ${totalItems - confirmedItems}`;
        }

        if (totalSpecificItemsElement) {
            totalSpecificItemsElement.textContent = specificItemsCount;
        }

        // Update chart using ECharts
        if (itemDistributionChartElement) {
            updateChart(itemDistributionChartElement, itemTypes);
        }

        for (const [name, count] of Object.entries(signerCounts)) {
            const divBox = document.createElement('div');
            const spanName = document.createElement('span');
            const spanCount = document.createElement('span');

            divBox.classList.add('signer-box');
            spanName.classList.add('signer-name');
            spanCount.classList.add('signer-count');

            const fullName = name.split(' ');

            spanName.textContent = `${fullName[0]} ${fullName[1] ? fullName[1] : ''}`;
            spanCount.textContent = count;

            divBox.appendChild(spanName);
            divBox.appendChild(spanCount);

            signerListElement.appendChild(divBox);
        }

        // Hide loader
        loading.style.display = 'none';
    });

    function updateChart(chartElement, data) {
        const chart = echarts.init(chartElement);
        const labels = Object.keys(data);
        const values = Object.values(data);

        const option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'horizontal',
                left: 'center'
            },
            series: [
                {
                    name: 'Itens',
                    type: 'pie',
                    radius: '50%',
                    data: labels.map((label, index) => ({
                        value: values[index],
                        name: label
                    })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        chart.setOption(option);
    }
});

// Evento para abri o modal e preencher o formulário
const modal = document.querySelector('.modal');
const modalBody = document.querySelector('.modal-body');
const openModalButton = document.querySelector('.new');
const closeModalButton = document.querySelector('.close-modal');
const newForm = document.querySelector('#new-item-form');
const itemNameInput = document.querySelector('#item-name');
const itemTypeInput = document.querySelector('#item-type');
const btnPasswd = document.querySelector('#verify-password');
const loginScreen = document.querySelector('.login-wrapper');

openModalButton.addEventListener('click', () => {
    modal.style.display = 'block';
});
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});
btnPasswd.addEventListener('click', () => {
    const password = document.querySelector('#password').value;
    if (password === '270854') {
        loginScreen.style.display = 'none';
        newForm.style.display = 'flex';
    } else {
        Toastify({
            text: "Senha inválida.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#dc3545",
            stopOnFocus: true
        }).showToast();
        document.querySelector('#password').value = '';
        document.querySelector('#password').focus();
    }
})
newForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const itemName = itemNameInput.value.trim();
    const itemType = itemTypeInput.value;

    // Verificar se o nome e o tipo de item foram preenchidos
    if (!itemName || !itemType) {
        Toastify({
            text: "Por favor, preencha todos os campos.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#dc3545",
            stopOnFocus: true
        }).showToast();
        return;
    }

    addItem(itemName, itemType);
    modal.style.display = 'none';
});

function addItem(name, type) {
    if (name && type) {
        let totalItems = 0;

        // Get a reference to the 'items' path in the database
        const itemsRef = ref(database, 'items');

        onValue(itemsRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                totalItems++;
            })
        })

        console.log(totalItems + 2);
        // Create a new item object
        const newItem = {
            text: name,
            category: type,
            name: ''
        };

        // Push the new item to Firebase
        set(ref(database, `items/${totalItems + 2}`), newItem)
            .then(() => {
                // Exibir toast de confirmação
                Toastify({
                    text: "Item confirmado com sucesso!",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#28a745",
                    stopOnFocus: true
                }).showToast();
                document.getElementById('new-item-form').reset(); // Clear the form
                document.querySelector('#password').value = '';
                loginScreen.style.display = 'block';
                newForm.style.display = 'none';
            })
            .catch((error) => {
                Toastify({
                    text: 'Erro ao adicionar item: ' + error.message,
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#dc3545",
                    stopOnFocus: true
                }).showToast();
            });
    }
}


