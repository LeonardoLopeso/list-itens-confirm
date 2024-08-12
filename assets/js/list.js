// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
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

    const itensList = document.getElementById('itens-list');
    // const beverageList = document.getElementById('beverage-list');
    // const proteinList = document.getElementById('protein-list');
    const loading = document.getElementById('loading');
    const columns = document.querySelector('.columns');

    // Mostrar o loader
    loading.style.display = 'block';

    function sortItems(items) {
        return items.sort((a, b) => {
            const cleanTextA = a.text.replace(/^\d+\s/, '');
            const cleanTextB = b.text.replace(/^\d+\s/, '');
            return cleanTextA.localeCompare(cleanTextB);
        });
    }

    // Load items from Firebase
    const itemsRef = ref(database, 'items');
    onValue(itemsRef, (snapshot) => {
        // beverageList.innerHTML = '';
        // proteinList.innerHTML = '';

        const items = [];

        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            items.push(item);
        });

        const sortedItems = sortItems(items);

        sortedItems.forEach((item) => {
            addItemToList(itensList, item.text, item.name);

            // if (item.category === 'beverage') {
            //     addItemToList(beverageList, item.text, item.name);
            // } else if (item.category === 'protein') {
            //     addItemToList(proteinList, item.text, item.name);
            // }
        });

        // Esconder o loader e mostrar as colunas
        loading.style.display = 'none';
        columns.style.display = 'flex';
    });

    function addItemToList(list, text, name) {
        let break_line = false;
        let text2 = '';
        if (text.includes('-')) {
            text2 = text.split('-')[1];
            break_line = true;
        }

        const li = document.createElement('li');
        
        li.innerHTML = `
            <div class="itens-signature">
                <div class="text-wrapper">
                    <span>${break_line ? text.split('-')[0] : text}</span>
                    ${break_line ? `<br> <span>${text2}</span>` : ''}
                </div>
                <div class="wrapper-user-confirmed">
                    <span>${name ? name : 'Ninguém'}</span>
                    <span>${name ? '<i class="bi bi-check-lg"></i>' : ''}</span>
                </div>
            </div>
        `;

        if (!name) {
            li.style.opacity = '0.5';
        }

        if (name) {
            li.classList.add('confirmed-item');
        }

        list.appendChild(li);
    }
});