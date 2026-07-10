// 1. Initial State Data
const galleryData = [
    { id: 1, title: 'Mountain Mist', category: 'nature', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80' },
    { id: 2, title: 'Modern Skyscraper', category: 'architecture', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' },
    { id: 3, title: 'Golden Retriever', category: 'animals', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80' },
    { id: 4, title: 'Forest Pathway', category: 'nature', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80' },
    { id: 5, title: 'Concrete Archway', category: 'architecture', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
    { id: 6, title: 'Majestic Lion', category: 'animals', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80' }
];

// 2. DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const searchBar = document.getElementById('searchBar');
const filterContainer = document.getElementById('filterContainer');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const photoForm = document.getElementById('photoForm');

let activeFilter = 'all';
let searchQuery = '';

// 3. Dynamic Filtering Button Generator
function updateFilterButtons() {
    const categories = new Set(galleryData.map(item => item.category.trim().toLowerCase()));
    
    let buttonsHtml = `<button class="filter-btn ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>`;
    
    categories.forEach(category => {
        if (category) {
            buttonsHtml += `<button class="filter-btn ${activeFilter === category ? 'active' : ''}" data-filter="${category}">${category}</button>`;
        }
    });

    filterContainer.innerHTML = buttonsHtml;

    // Re-attach listeners to dynamic buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeFilter = e.target.getAttribute('data-filter');
            renderGallery();
        });
    });
}

// 4. Render Gallery Items Dynamically
function renderGallery() {
    galleryGrid.innerHTML = '';

    const filteredData = galleryData.filter(item => {
        const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (filteredData.length === 0) {
        galleryGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6b7280; padding: 2rem;">No images found matching your criteria.</p>`;
        return;
    }

    // Render from newest to oldest
    [...filteredData].reverse().forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('gallery-item');
        itemElement.innerHTML = `
            <div class="image-container">
                <img src="${item.url}" alt="${item.title}" loading="lazy">
            </div>
            <div class="item-info">
                <h3>${item.title}</h3>
                <p>${item.category}</p>
            </div>
        `;
        
        itemElement.addEventListener('click', () => openLightbox(item.url));
        galleryGrid.appendChild(itemElement);
    });
}

// 5. Handle Form Submission with Custom Categories
photoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('photoTitle').value.trim();
    const category = document.getElementById('photoCategory').value.trim().toLowerCase();
    let url = document.getElementById('photoUrl').value.trim();

    if (!url) {
        url = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80`;
    }

    const newPhoto = {
        id: Date.now(),
        title: title,
        category: category,
        url: url
    };

    galleryData.push(newPhoto);
    photoForm.reset();

    updateFilterButtons();
    renderGallery();
});

// 6. Search Event Listener
searchBar.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGallery();
});

// 7. Lightbox Actions
function openLightbox(url) {
    lightboxImg.src = url;
    lightbox.classList.add('active');
}

function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if(e.target === lightbox) closeLightbox();
});

// Run Initial Layout Setup
updateFilterButtons();
renderGallery();