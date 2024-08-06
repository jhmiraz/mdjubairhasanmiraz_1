const searchInput = document.getElementById('search');
const suggestionsBox = document.getElementById('suggestions');
const topics = {
  'python': '#python',
  'JavaScript': '#JavaScript',
  'HTML': '#HTML',
  'CSS': '#CSS',
  'ERPNext': '#ERPNext',
  'Ubuntu': '#Ubuntu',
  'Git': '#Git',
  'OpenGL': '#OpenGL',
  'about': '#about',
  'skills': '#skills',
  'CV': 'cv.html',
  'projects': '#projects',
};

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.trim().toLowerCase();
  const matchedTopics = Object.keys(topics).filter((topic) => topic.toLowerCase().includes(searchTerm));

  if (matchedTopics.length > 0) {
    suggestionsBox.innerHTML = '';
    matchedTopics.forEach((topic) => {
      const suggestionItem = document.createElement('li');
      suggestionItem.textContent = topic;
      suggestionItem.dataset.url = topics[topic]; // Store URL or ID in data attribute
      suggestionsBox.appendChild(suggestionItem);
    });
    suggestionsBox.style.display = 'block';
  } else {
    suggestionsBox.style.display = 'none';
  }
});

suggestionsBox.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const url = e.target.dataset.url;
    if (url) {
      if (url.startsWith('#')) {
        // Scroll to the section if it's an internal ID
        const section = document.querySelector(url);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to the URL if it's an external link
        window.location.href = url;
      }
    }
    searchInput.value = '';
    suggestionsBox.style.display = 'none';
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var dropdowns = document.querySelectorAll(".dropdown-toggle");
  dropdowns.forEach(function (dropdown) {
    dropdown.addEventListener("click", function (event) {
      event.preventDefault();
      var dropdownMenu = dropdown.nextElementSibling;
      if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
      } else {
        dropdownMenu.style.display = "block";
      }
    });
  });
});
