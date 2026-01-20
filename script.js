document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('menu-container');

    // Fetch the data from JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderMenu(data);
        })
        .catch(error => {
            console.error('Error loading menu:', error);
            container.innerHTML = '<p style="text-align:center; color:red;">Failed to load menu data. Please run on a local server.</p>';
        });

    function renderMenu(categories) {
        categories.forEach(category => {
            const section = document.createElement('section');
            section.className = 'category-section';

            // 1. Create Category Title
            let headerHTML = `<h2 class="category-title">${category.categoryName}</h2>`;
            if (category.note) {
                headerHTML += `<span class="set-note">${category.note}</span>`;
            }
            section.innerHTML = headerHTML;

            // 2. Check if it's a Set Menu (Card Style) or Regular (List Style)
            if (category.type === 'set') {
                const grid = document.createElement('div');
                grid.className = 'items-grid';
                
                category.items.forEach(item => {
                    grid.innerHTML += `
                        <div class="set-card">
                            <img src="${item.image}" alt="${item.name}" class="set-img" onerror="this.src='https://placehold.co/400x300?text=No+Image'">
                            <div class="set-content">
                                <div class="set-header">
                                    <span class="set-title">${item.name}</span>
                                    <span class="set-price">${item.price}</span>
                                </div>
                                <p class="set-desc">${item.description}</p>
                            </div>
                        </div>
                    `;
                });
                section.appendChild(grid);
            } 
            // 3. Regular Menu with Subcategories
            else {
                category.subcategories.forEach(sub => {
                    // Add Subcategory Title
                    if(sub.subName) {
                        const subTitle = document.createElement('div');
                        subTitle.className = 'sub-category-title';
                        subTitle.textContent = sub.subName;
                        section.appendChild(subTitle);
                    }

                    const grid = document.createElement('div');
                    grid.className = 'items-grid';

                    sub.items.forEach(item => {
                        // Check if meta exists
                        const metaHtml = item.meta ? `<div class="item-meta">${item.meta}</div>` : '';
                        
                        grid.innerHTML += `
                            <div class="menu-item">
                                <img src="${item.image}" alt="${item.name}" class="menu-item-img" onerror="this.src='https://placehold.co/150x150?text=No+Image'">
                                <div class="menu-details">
                                    <div class="item-top">
                                        <div>
                                            <span class="item-code">${item.code}</span>
                                            <span class="item-name">${item.name}</span>
                                        </div>
                                        <div class="item-price">${item.price}</div>
                                    </div>
                                    ${metaHtml}
                                </div>
                            </div>
                        `;
                    });
                    section.appendChild(grid);
                });
            }

            container.appendChild(section);
        });
    }
});