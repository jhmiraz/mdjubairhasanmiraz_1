document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('open');
    });

    menuClose.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('open');
    });

    // Smooth Scroll and Active Link Highlight
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const href = anchor.getAttribute('href');
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    anchor.classList.add('active');
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('open');
                }
            } else {
                window.location.href = href;
            }
        });
    });

    // Search Functionality
    const searchInput = document.getElementById('search');
    const suggestionsBox = document.getElementById('suggestions');
    const topics = {
        'python': '#skills',
        'javascript': '#skills',
        'html': '#skills',
        'css': '#skills',
        'erpnext': '#skills',
        'ubuntu': '#skills',
        'git': '#skills',
        'opengl': '#skills',
        'about': '#about',
        'skills': '#skills',
        'cv': 'cv.html',
        'projects': '#projects',
        'contact': '#contact',
        'hobby': '#hobby'
    };

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        const matchedTopics = Object.keys(topics).filter((topic) => topic.toLowerCase().includes(searchTerm));

        suggestionsBox.innerHTML = '';
        if (matchedTopics.length > 0 && searchTerm) {
            matchedTopics.forEach((topic) => {
                const suggestionItem = document.createElement('li');
                suggestionItem.textContent = topic;
                suggestionItem.dataset.url = topics[topic];
                suggestionsBox.appendChild(suggestionItem);
            });
            suggestionsBox.classList.remove('hidden');
        } else {
            suggestionsBox.classList.add('hidden');
        }
    });

    suggestionsBox.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const url = e.target.dataset.url;
            if (url) {
                if (url.startsWith('#')) {
                    const section = document.querySelector(url);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    window.location.href = url;
                }
            }
            searchInput.value = '';
            suggestionsBox.classList.add('hidden');
        }
    });
});