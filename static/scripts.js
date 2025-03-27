  let diseasesList = [];

  // Fetch diseases list from Flask backend
  fetch('/get_diseases')
    .then(response => response.json())
    .then(data => { diseasesList = data; });

  // Search and redirect to disease details page
  function searchDisease() {
    const query = document.getElementById('disease-search').value.toLowerCase();
    const matchedDisease = diseasesList.find(d => d.toLowerCase() === query);

    if (matchedDisease) {
      window.location.href = `/disease/${matchedDisease}`;
    } else {
      alert('Disease not found. Please try again!');
    }
  }

  // Autocomplete functionality
  document.getElementById('disease-search').addEventListener('input', function() {
    const searchBox = this;
    const query = searchBox.value.toLowerCase();
    const suggestions = diseasesList.filter(d => d.toLowerCase().includes(query));

    let dropdown = document.getElementById('autocomplete-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = 'autocomplete-dropdown';
      dropdown.classList.add('autocomplete-results');
      searchBox.parentNode.appendChild(dropdown);
    }

    dropdown.innerHTML = suggestions.slice(0, 5).map(suggestion => `<div class='autocomplete-item' onclick='selectDisease("${suggestion}")'>${suggestion}</div>`).join('');

    if (suggestions.length === 0) dropdown.innerHTML = '<div class="autocomplete-item">No matches found</div>';
  });

  function selectDisease(disease) {
    document.getElementById('disease-search').value = disease;
    document.getElementById('autocomplete-dropdown').remove();
  }



                        // Show/hide chatbot
            function toggleChatbot() {
                const chatbot = document.getElementById('chatbot-container');
                chatbot.classList.toggle('visible');
            }

            // Typing effect function
            function typeResponse(element, message, speed = 30) {
                let i = 0;
                element.innerHTML = ''; // Clear content first

                const typingInterval = setInterval(() => {
                    element.innerHTML += message[i];
                    i++;
                    if (i >= message.length) {
                        clearInterval(typingInterval);
                    }
                }, speed);
            }

            // Handle chat input
            function handleChat(event) {
                if (event.key === "Enter") {
                    const userInput = document.getElementById('chatbot-input').value.trim();
                    const chatContent = document.getElementById('chatbot-content');
                    if (!userInput) return;

                    // Display user message with a distinct style
                    const userMessage = document.createElement('div');
                    userMessage.className = "user-message";
                    userMessage.innerText = userInput;
                    chatContent.appendChild(userMessage);

                    document.getElementById('chatbot-input').value = '';

                    // Show "HealthBot is typing..." while processing
                    const botTyping = document.createElement('div');
                    botTyping.id = "bot-typing";
                    botTyping.innerHTML = `<em>Thinking...</em>`;
                    chatContent.appendChild(botTyping);
                    chatContent.scrollTop = chatContent.scrollHeight;

                    // Send user query to Flask backend
                    fetch('/chatbot', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: userInput })
                    })
                    .then(response => response.json())
                    .then(data => {
                        botTyping.remove(); // Remove typing indicator

                        // Create a bot message with the new style
                        const botMessage = document.createElement('div');
                        botMessage.className = "bot-message";
                        chatContent.appendChild(botMessage);

                        // Trigger typing effect for bot response
                        typeResponse(botMessage, `${data.response}`, 30);

                        // Keep scroll at the bottom
                        chatContent.scrollTop = chatContent.scrollHeight;
                    })
                    .catch(() => {
                        botTyping.remove();
                        const errorMessage = document.createElement('div');
                        errorMessage.className = "bot-message";
                        errorMessage.innerHTML = `⚠️ Sorry, I couldn't process that right now.`;
                        chatContent.appendChild(errorMessage);
                    });
                }
            }

document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "61f769173fc44524bd6630474cf57462"; // Replace with your API key
    const newsUrl = `https://newsapi.org/v2/top-headlines?category=health&country=us&apiKey=${apiKey}`;

    fetch(newsUrl)
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById("news-articles");
            newsContainer.innerHTML = "";

            if (data.articles.length > 0) {
                data.articles.slice(0, 5).forEach(article => {
                    let newsItem = document.createElement("div");
                    newsItem.classList.add("news-item");
                    newsItem.innerHTML = `
                        <a href="${article.url}" target="_blank">${article.title}</a>
                        <p>${article.description || "No description available."}</p>
                    `;
                    newsContainer.appendChild(newsItem);
                });
            } else {
                newsContainer.innerHTML = "<p>No health news available at the moment.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching news:", error);
            document.getElementById("news-articles").innerHTML = "<p>Failed to load news.</p>";
        });
});
