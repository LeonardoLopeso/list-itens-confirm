  // Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('item-list');

    // Lista de itens fixa
    const fixedItems = [
        "01 Água de Coco (natural) 2L",
        "01 Água de Coco (natural) 2L",
        "50 Descartáveis (copo, prato, talher)",
        "01 Farofa (caseira) 2,5kg",
        "01 Farofa (caseira) 2,5kg",
        "01 Refrigerante (Coca-Cola) 2,5L",
        "01 Refrigerante (Coca-Cola) 2,5L",
        "01 Refrigerante (Coca-Cola) 2,5L",
        "01 Refrigerante (Coca-Cola) 2,5L",
        "01 Refrigerante (Coca-Cola) 2,5L",
        "01 Refrigerante (Fanta) 2,5L",
        "01 Refrigerante (Guaraná) 2,5L",
        "01 Refrigerante (Sprite) 2,5L",
        "01 Vinagrete (caseiro) 2,5kg",
        "01 Vinagrete (caseiro) 2,5kg"
    ];

    // Load items from Firebase
    const itemsRef = ref(database, 'items-list');
    onValue(itemsRef, (snapshot) => {
        itemList.innerHTML = '';
        fixedItems.forEach((itemText, index) => {
            const itemSnapshot = snapshot.child(index);
            const itemData = itemSnapshot.exists() ? itemSnapshot.val() : { text: itemText, name: '' };
            addItemToList(index, itemData.text, itemData.name);
        });
    });

    function addItemToList(key, text, name) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${text}</span>
            <input type="text" class="name-input" placeholder="Seu nome" value="${name}" ${name ? 'disabled' : ''}>
        `;

        const nameInput = li.querySelector('.name-input');

        nameInput.addEventListener('blur', () => {
            if (nameInput.value.trim() !== '') {
                // Update item in Firebase
                const itemRef = ref(database, `items/${key}`);
                update(itemRef, { name: nameInput.value.trim() });
                nameInput.disabled = true;
            }
        });

        itemList.appendChild(li);
    }
});