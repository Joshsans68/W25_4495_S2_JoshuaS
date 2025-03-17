document.addEventListener("DOMContentLoaded", function () {
    const newsFeed = document.getElementById("news-feed");
    const rssUrl = "https://rss.app/feeds/tHFXW4xEsCF7IzpG.xml";

    async function fetchNews() {
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
            const data = await response.json();
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "text/xml");
            const items = xml.querySelectorAll("item");

            let newsHtml = "";
            items.forEach((item, index) => {
                if (index < 10) { // Display top 10 news items
                    const title = item.querySelector("title").textContent;
                    const link = item.querySelector("link").textContent;
                    const description = item.querySelector("description").textContent;
                    const pubDate = new Date(item.querySelector("pubDate").textContent).toLocaleDateString();

                    newsHtml += `
                        <div class="news-item">
                            <h3><a href="${link}" target="_blank">${title}</a></h3>
                            <p>${description}</p>
                            <small>${pubDate}</small>
                        </div>
                    `;
                }
            });

            newsFeed.innerHTML = newsHtml || "<p>No news available.</p>";
        } catch (error) {
            console.error("Error fetching news:", error);
            newsFeed.innerHTML = "<p>Failed to load news.</p>";
        }
    }

    fetchNews();
});
