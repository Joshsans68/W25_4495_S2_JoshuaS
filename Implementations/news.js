
document.addEventListener("DOMContentLoaded", function () {
    const newsFeed = document.getElementById("news-feed");
    const rssUrl = "https://www.espn.com/espn/rss/soccer/news";

    async function fetchNews() {
        const proxies = [
            "https://api.allorigins.win/get?url=",
            "https://corsproxy.io/?"
        ];

        let success = false;

        for (let proxy of proxies) {
            try {
                console.log(`Trying proxy: ${proxy}`);
                const response = await fetch(`${proxy}${encodeURIComponent(rssUrl)}`);
                const data = await response.json();

                const parser = new DOMParser();
                const xml = parser.parseFromString(data.contents, "text/xml");
                const items = xml.querySelectorAll("item");

                let newsHtml = "";
                items.forEach((item, index) => {
                    if (index < 10) {
                        const title = item.querySelector("title").textContent;
                        const link = item.querySelector("link").textContent;
                        const description = item.querySelector("description").textContent;
                        const pubDate = new Date(item.querySelector("pubDate").textContent).toLocaleDateString();
                        
                        // Attempt to find image (some feeds may not include this)
                        let imageUrl = "";
                        const enclosure = item.querySelector("enclosure");
                        if (enclosure && enclosure.getAttribute("url")) {
                            imageUrl = enclosure.getAttribute("url");
                        }

                        newsHtml += `
                            <div class="news-item">
                                ${imageUrl ? `<img src="${imageUrl}" alt="news image">` : ""}
                                <div>
                                    <h3><a href="${link}" target="_blank">${title}</a></h3>
                                    <p>${description}</p>
                                    <small>${pubDate}</small>
                                </div>
                            </div>
                        `;
                    }
                });

                newsFeed.innerHTML = newsHtml || "<p>No news available.</p>";
                success = true;
                break;
            } catch (error) {
                console.error(`Failed with proxy: ${proxy}`, error);
            }
        }

        if (!success) {
            newsFeed.innerHTML = "<p>Failed to load news.</p>";
        }
    }

    fetchNews();
});
