const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files (e.g., CSS, JS)
app.use(express.static("public")); // Assuming your HTML, CSS, JS are in the "public" folder

// Serve the main poll page at the root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Poll logic API
let votes = { Yes: 0, No: 0 };
let voters = [];  // Store each vote along with the name

// Load previous poll results from file (if any)
function loadPollResults() {
    try {
        // Check if the file exists first
        if (fs.existsSync("pollResults.json")) {
            const data = fs.readFileSync("pollResults.json");
            const parsedData = JSON.parse(data);

            // Ensure the structure is valid
            if (parsedData && parsedData.votes && parsedData.voters) {
                votes = parsedData.votes;
                voters = parsedData.voters;
            } else {
                // If structure is invalid, reset votes and voters
                votes = { Yes: 0, No: 0 };
                voters = [];
            }
        } else {
            // If file does not exist, initialize with empty data
            votes = { Yes: 0, No: 0 };
            voters = [];
        }
    } catch (error) {
        // If error occurs, reset to default values
        console.error("Error reading poll results:", error);
        votes = { Yes: 0, No: 0 };
        voters = [];
    }
}

// Save the poll results to a file
function savePollResults() {
    const data = JSON.stringify({ votes, voters }, null, 2);
    fs.writeFileSync("pollResults.json", data);
}

// Load poll results when the server starts
loadPollResults();

// Handle vote submission
app.post("/submitVote", (req, res) => {
    const { name, vote } = req.body;

    if (!name || !vote) {
        return res.status(400).send("Name and vote are required.");
    }

    if (votes.hasOwnProperty(vote)) {
        // Update votes count and add the new vote with name
        votes[vote]++;
        voters.push({ name, vote });

        // Save updated results to the file
        savePollResults();

        return res.status(200).send({ message: "Vote submitted!" });
    } else {
        return res.status(400).send("Invalid vote option.");
    }
});

// API to get poll results (for admin access)
app.get("/results", (req, res) => {
    const password = req.query.password;

    // Check for password (basic example, consider a more secure method for production)
    if (password === "123") {
        return res.json({ votes, voters });
    } else {
        return res.status(403).send("Unauthorized access.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Poll server running on http://localhost:${port}`);
});
