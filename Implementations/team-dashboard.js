
document.addEventListener("DOMContentLoaded", () => {
    const teamId = localStorage.getItem("favoriteTeamId");
    const teamName = localStorage.getItem("favoriteTeamName");

    if (teamId && teamName) {
        loadTeamDashboard(teamId, teamName);
    }

    async function loadTeamDashboard(teamId, teamName) {
        const main = document.querySelector("main");

        const dashboard = document.createElement("section");
        dashboard.innerHTML = `
            <h2>${teamName} Team Dashboard</h2>
            <div id="team-live">Loading live match...</div>
            <div id="team-form"></div>
            <div id="team-standings">Loading standings...</div>
            <div id="team-history">Loading match history...</div>
        `;
        main.appendChild(dashboard);

        fetchLiveMatch(teamId);
        fetchMatchHistory(teamId);
        fetchTeamStanding(teamId);
    }

    async function fetchLiveMatch(teamId) {
        const container = document.getElementById("team-live");
        try {
            const res = await fetch(`https://v3.football.api-sports.io/fixtures?live=all&team=${teamId}`, {
                headers: { "x-apisports-key": "4efe1cd6f46d836644f4d4e5be9d61b3" }
            });
            const data = await res.json();
            if (data.response.length > 0) {
                const match = data.response[0];
                container.innerHTML = `
                    <h3>Live Match</h3>
                    <p><strong>${match.teams.home.name}</strong> ${match.goals.home} - ${match.goals.away} <strong>${match.teams.away.name}</strong></p>
                    <small>${match.fixture.status.long}</small>
                `;
            } else {
                container.innerHTML = "<p>No live matches currently.</p>";
            }
        } catch (err) {
            console.error("Live Match Error:", err);
            container.innerHTML = "<p>Failed to load live match data.</p>";
        }
    }

    async function fetchMatchHistory(teamId) {
        const container = document.getElementById("team-history");
        try {
            let res = await fetch(`https://v3.football.api-sports.io/fixtures?team=${teamId}&season=2023`, {
                headers: { "x-apisports-key": "4efe1cd6f46d836644f4d4e5be9d61b3" }
            });
            let data = await res.json();
            if (data.response.length === 0) {
                res = await fetch(`https://v3.football.api-sports.io/fixtures?team=${teamId}&season=2022`, {
                    headers: { "x-apisports-key": "4efe1cd6f46d836644f4d4e5be9d61b3" }
                });
                data = await res.json();
            }

            container.innerHTML = "<h3>Recent Matches</h3>";
            if (data.response.length === 0) {
                container.innerHTML += "<p>No match history found.</p>";
                return;
            }
            data.response.slice(0, 5).forEach(function(match) {
                const el = document.createElement("p");
                el.textContent = `${match.teams.home.name} ${match.goals.home} - ${match.goals.away} ${match.teams.away.name}`;
                container.appendChild(el);
            });
        } catch (err) {
            console.error("Match History Error:", err);
            container.innerHTML += "<p>Failed to load match history.</p>";
        }
    }

    async function fetchTeamStanding(teamId) {
        const container = document.getElementById("team-standings");
        try {
            let res = await fetch("https://v3.football.api-sports.io/standings?league=39&season=2023", {
                headers: { "x-apisports-key": "4efe1cd6f46d836644f4d4e5be9d61b3" }
            });
            let data = await res.json();

            if (!data.response || data.response.length === 0 || !data.response[0].league) {
                res = await fetch("https://v3.football.api-sports.io/standings?league=39&season=2022", {
                    headers: { "x-apisports-key": "4efe1cd6f46d836644f4d4e5be9d61b3" }
                });
                data = await res.json();
            }

            if (!data.response || data.response.length === 0 || !data.response[0].league) {
                container.innerHTML = "<p>Standings not available at this time.</p>";
                return;
            }

            const standings = data.response[0].league.standings[0];
            const teamRow = standings.find(row => row.team.id == teamId);
            if (teamRow) {
                container.innerHTML = `
                    <h3>League Standing</h3>
                    <table style="width:100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="background: #3b4cc0; color: white;">
                                <th style="padding: 8px;">#</th>
                                <th style="padding: 8px;">Team</th>
                                <th style="padding: 8px;">Pts</th>
                                <th style="padding: 8px;">W</th>
                                <th style="padding: 8px;">D</th>
                                <th style="padding: 8px;">L</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="background: rgba(255,255,255,0.9);">
                                <td style="padding: 8px;">${teamRow.rank}</td>
                                <td style="padding: 8px;">${teamRow.team.name}</td>
                                <td style="padding: 8px;">${teamRow.points}</td>
                                <td style="padding: 8px;">${teamRow.all.win}</td>
                                <td style="padding: 8px;">${teamRow.all.draw}</td>
                                <td style="padding: 8px;">${teamRow.all.lose}</td>
                            </tr>
                        </tbody>
                    </table>
                `;
            } else {
                container.innerHTML = "<p>Team not found in league standings.</p>";
            }
        } catch (err) {
            console.error("Standings Error:", err);
            container.innerHTML = "<p>Failed to load standings.</p>";
        }
    }
});
