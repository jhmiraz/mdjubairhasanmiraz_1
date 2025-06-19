document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    menuClose.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target) && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // Smooth Scroll and Active Link Highlight
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const href = anchor.getAttribute('href');
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    navLinks.forEach(link => link.classList.remove('active'));
                    anchor.classList.add('active');
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('open');
                    document.body.style.overflow = '';
                }
            } else {
                window.location.href = href;
            }
        });
    });

    // Scroll-based Active Link Highlight
    const sections = document.querySelectorAll('section[id]');
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const updateActiveLink = () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop - 60 && window.scrollY < sectionTop + sectionHeight - 60) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', debounce(updateActiveLink, 100));

    // Sticky Header Observer
    const header = document.querySelector('header');
    const observer = new IntersectionObserver(
        ([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        },
        { threshold: 0.1 }
    );
    observer.observe(document.querySelector('.hero'));

    // Search Functionality with Keyboard Navigation
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

    // Keyboard navigation for suggestions
    let selectedIndex = -1;
    searchInput.addEventListener('keydown', (e) => {
        const suggestions = suggestionsBox.querySelectorAll('li');
        if (suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
            updateSuggestionSelection(suggestions);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSuggestionSelection(suggestions);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            const url = suggestions[selectedIndex].dataset.url;
            navigateToSuggestion(url);
        }
    });

    function updateSuggestionSelection(suggestions) {
        suggestions.forEach((suggestion, index) => {
            suggestion.classList.toggle('selected', index === selectedIndex);
        });
        if (selectedIndex >= 0) {
            suggestions[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    function navigateToSuggestion(url) {
        if (url.startsWith('#')) {
            const section = document.querySelector(url);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.location.href = url;
        }
        searchInput.value = '';
        suggestionsBox.classList.add('hidden');
        selectedIndex = -1;
    }

    suggestionsBox.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const url = e.target.dataset.url;
            navigateToSuggestion(url);
        }
    });

    // Contact Form Submission with Validation
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const messageInput = contactForm.querySelector('#message');
        let messageDiv = contactForm.querySelector('.form-message');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.classList.add('form-message');
            contactForm.appendChild(messageDiv);
        }

        // Real-time validation
        const validateInput = (input, type) => {
            let isValid = true;
            let message = '';
            if (type === 'name') {
                isValid = input.value.trim().length >= 2;
                message = isValid ? '' : 'Name must be at least 2 characters long.';
            } else if (type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(input.value.trim());
                message = isValid ? '' : 'Please enter a valid email address.';
            } else if (type === 'message') {
                isValid = input.value.trim().length >= 10;
                message = isValid ? '' : 'Message must be at least 10 characters long.';
            }
            input.classList.toggle('border-red-500', !isValid);
            input.classList.toggle('border-gold', isValid);
            return { isValid, message };
        };

        [nameInput, emailInput, messageInput].forEach(input => {
            input.addEventListener('input', () => {
                const type = input.id;
                const { isValid, message } = validateInput(input, type);
                const errorDiv = input.parentElement.querySelector('.error-message');
                if (errorDiv) {
                    errorDiv.textContent = message;
                    errorDiv.style.display = message ? 'block' : 'none';
                } else if (message) {
                    const newErrorDiv = document.createElement('div');
                    newErrorDiv.classList.add('error-message');
                    newErrorDiv.style.color = '#DC2626';
                    newErrorDiv.style.fontSize = '0.75rem';
                    newErrorDiv.textContent = message;
                    input.parentElement.appendChild(newErrorDiv);
                }
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nameValid = validateInput(nameInput, 'name').isValid;
            const emailValid = validateInput(emailInput, 'email').isValid;
            const messageValid = validateInput(messageInput, 'message').isValid;

            if (!nameValid || !emailValid || !messageValid) {
                messageDiv.textContent = 'Please fix the errors in the form.';
                messageDiv.classList.add('error');
                messageDiv.style.display = 'block';
                return;
            }

            messageDiv.style.display = 'none';
            messageDiv.className = 'form-message';

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    messageDiv.textContent = 'Message sent successfully!';
                    messageDiv.classList.add('success');
                    messageDiv.style.display = 'block';
                    form.reset();
                    [nameInput, emailInput, messageInput].forEach(input => {
                        input.classList.remove('border-red-500', 'border-gold');
                        const errorDiv = input.parentElement.querySelector('.error-message');
                        if (errorDiv) errorDiv.remove();
                    });
                    setTimeout(() => {
                        messageDiv.style.display = 'none';
                    }, 3000);
                } else {
                    messageDiv.textContent = 'Failed to send message. Please try again.';
                    messageDiv.classList.add('error');
                    messageDiv.style.display = 'block';
                }
            })
            .catch(() => {
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.classList.add('error');
                messageDiv.style.display = 'block';
            });
        });
    }
});