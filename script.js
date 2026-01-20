document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch the JSON data
    fetch('menu.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            initMenu(data);
        })
        .catch(function(err) {
            console.error("Failed to load menu.json:", err);
            document.getElementById('menuContainer').innerHTML = "<p>Error loading menu data.</p>";
        });
});

let allMenuItems = [];
let currencySymbol = "";

// 2. Initialize the Menu
function initMenu(data) {
    allMenuItems = data.menu_items;
    currencySymbol = data.restaurant_info.currency;
    
    // Set Header Info
    document.querySelector('h1').innerText = data.restaurant_info.name;
    document.querySelector('.subtitle').innerText = data.restaurant_info.location;

    renderCategories(allMenuItems);
    renderMenu(allMenuItems);
}

// 3. Render Category Buttons
function renderCategories(items) {
    const filterContainer = document.getElementById('filterContainer');
    const categories = new Set(items.map(item => item.category));
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.innerText = cat;
        btn.onclick = () => filterMenu(cat);
        filterContainer.appendChild(btn);
    });
}

// 4. Filter Function
function filterMenu(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Toggle Active Class
    buttons.forEach(btn => {
        if(btn.innerText === category || (category === 'all' && btn.innerText === 'All')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Filter Logic
    if (category === 'all') {
        renderMenu(allMenuItems);
    } else {
        const filtered = allMenuItems.filter(item => item.category === category);
        renderMenu(filtered);
    }
}

// 5. Render Menu Cards
function renderMenu(items) {
    const container = document.getElementById('menuContainer');
    container.innerHTML = ''; // Clear current content

    items.forEach(item => {
        // Default description if missing
        const desc = item.description ? item.description : 'Delicious authentic cuisine.';
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-image-placeholder">🍽️</div>
            <div class="card-content">
                <span class="category-tag">${item.category}</span>
                <h3 class="card-title">${item.name} <small style="font-size:0.8em; color:#888">(${item.id})</small></h3>
                <p class="card-desc">${desc}</p>
                <div class="card-price">${currencySymbol} ${item.price}</div>
                <div class="button-group">
                    <button class="btn btn-secondary" onclick="openModal('${item.name}')">Click Here</button>
                    <a href="${item.product_link}" class="btn btn-primary">Go to Product</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 6. Modal Functions
function openModal(itemName) {
    const modal = document.getElementById('quickViewModal');
    document.getElementById('modalTitle').innerText = itemName;
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById('quickViewModal').style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('quickViewModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}