// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

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

function sortObject(obj) {
    return Object.keys(obj).sort().reduce((result, key) => {
        result[key] = obj[key];
        return result;
    }, {});
}

document.addEventListener('DOMContentLoaded', () => {
    const beverageList = document.getElementById('beverage-list');
    const proteinList = document.getElementById('protein-list');
    const loading = document.getElementById('loading');
    const columns = document.querySelector('.columns');

    // Mostrar o loader
    loading.style.display = 'block';

    // Lista de itens fixa
    const fixedItems = [
        { text: "04 Sacos de Gelo", category: "beverage" },
        { text: "01 Água de Coco (natural) 2L", category: "beverage" },
        { text: "01 Água de Coco (natural) 2L", category: "beverage" },
        { text: "50 Descartáveis (copo, prato, talher)", category: "beverage" },
        { text: "01 Farofa (caseira) 2,5kg", category: "beverage" },
        { text: "01 Farofa (caseira) 2,5kg", category: "beverage" },
        { text: "01 Refrigerante (Coca-Cola) 2,5L", category: "beverage" },
        { text: "01 Refrigerante (Coca-Cola) 2,5L", category: "beverage" },
        { text: "01 Refrigerante (Coca-Cola) 2,5L", category: "beverage" },
        { text: "01 Refrigerante (Coca-Cola) 2,5L", category: "beverage" },
        { text: "01 Refrigerante (Coca-Cola) 2,5L", category: "beverage" },
        { text: "01 Refrigerante (Fanta) 2,5L", category: "beverage" },
        { text: "01 Refrigerante (Guaraná) 2,5L", category: "beverage" },
        { text: "01 Refrigerante (Sprite) 2,5L", category: "beverage" },
        { text: "01 Vinagrete (caseiro) 2,5kg", category: "beverage" },
        { text: "01 Vinagrete (caseiro) 2,5kg", category: "beverage" },
        { text: "01 Carvão 10kg", category: "protein" },
        { text: "01 Carne (alcatra) 1kg", category: "protein" },
        { text: "01 Carne (bisteca) 1kg", category: "protein" },
        { text: "01 Carne (contrafilé) 1kg", category: "protein" },
        { text: "01 Carne (costela) 1kg", category: "protein" },
        { text: "01 Carne (coxão mole) 1kg", category: "protein" },
        { text: "01 Carne (cupim) 1kg", category: "protein" },
        { text: "01 Carne (fraudinha) 1kg", category: "protein" },
        { text: "01 Carne (lombo) 1kg", category: "protein" },
        { text: "01 Carne (maminha) 1kg", category: "protein" },
        { text: "01 Frango (asa) 1kg", category: "protein" },
        { text: "01 Frango (sobrecoxa) 1kg", category: "protein" },
        { text: "01 Linguiça (calabresa) 1kg", category: "protein" },
        { text: "01 Linguiça (frango) 1kg", category: "protein" },
        { text: "01 Linguiça (toscana) 1kg", category: "protein" },
    ];

    const itensSorted = sortObject(fixedItems);

    // Initialize fixed items in Firebase if they don't exist
    const itemsRef = ref(database, 'items');
    onValue(itemsRef, (snapshot) => {
        if (!snapshot.exists()) {
            itensSorted.forEach((item, index) => {
                set(ref(database, `items/${index}`), {
                    text: item.text,
                    category: item.category,
                    name: ''
                });
            });
        }
    });

    // Load items from Firebase
    onValue(itemsRef, (snapshot) => {
        beverageList.innerHTML = '';
        proteinList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            if (item.category === 'beverage') {
                addItemToList(beverageList, childSnapshot.key, item.text, item.name);
            } else if (item.category === 'protein') {
                addItemToList(proteinList, childSnapshot.key, item.text, item.name);
            }
        });

        // Esconder o loader e mostrar as colunas
        loading.style.display = 'none';
        columns.style.display = 'flex';
    });

    function addItemToList(list, key, text, name) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${text}</span>
            <input type="text" class="name-input" placeholder="Seu nome" value="${name}" ${name ? 'disabled' : ''}>
            <button class="confirm-btn" ${name ? 'disabled' : ''}>${name ? 'Assinado' : 'Não assinado'}</button>
        `;
        const nameInput = li.querySelector('.name-input');
        const confirmBtn = li.querySelector('.confirm-btn');

        if (name) {
            li.classList.add('confirmed-item');
            li.style.display = 'none';
        }

        confirmBtn.addEventListener('click', () => {
            if (nameInput.value.trim() !== '') {
                // Update item in Firebase
                const itemRef = ref(database, `items/${key}`);
                update(itemRef, { name: nameInput.value.trim() });
                nameInput.disabled = true;
                confirmBtn.disabled = true;
                confirmBtn.textContent = 'Assinado';
                confirmBtn.classList.add('confirmed-btn');
                li.classList.add('confirmed-item');

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
            } else {
                Toastify({
                    text: "Preencha o campo com o seu nome!",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#dc3545",
                    stopOnFocus: true
                }).showToast();
            }
        });

        list.appendChild(li);
    }
});