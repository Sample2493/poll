const votes = { Yes: 0, No: 0 };
let voters = [];  // Store name and vote of each user

function showVotingOptions() {
    const name = document.getElementById("name").value;
    if (!name) {
        alert("Please enter your name.");
        return;
    }

    // Hide name input and show voting options
    document.querySelector(".name-input").style.display = "none";
    document.querySelector(".options").style.display = "block";
}

function submitVote(option) {
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    // Send vote to the server
    fetch("http://localhost:3000/submitVote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, vote: option }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.message) {
            alert(data.message);
        }

        // Hide the options and name/password input after voting
        document.querySelector(".options").style.display = "none";
        document.querySelector(".name-input").style.display = "none";

        // Show the user's vote confirmation
        showUserVote(option);

        // If admin entered the correct password, show full results
        if (password === "123") {
            showResults();
        }
    })
    .catch((error) => {
        alert("Error submitting vote. Please try again.");
    });
}

function showUserVote(option) {
    const resultsDiv = document.getElementById("results");

    // Display confirmation of the user's vote
    resultsDiv.innerHTML = `
        <h2>Thank you for voting!</h2>
        <p>You voted: ${option}</p>
    `;
}

function showResults() {
    const password = document.getElementById("password").value;
    
    // Send the password to the server to get the results
    fetch(`http://localhost:3000/results?password=${password}`)
        .then((response) => response.json())
        .then((data) => {
            const resultsDiv = document.getElementById("results");

            // Display overall vote counts
            resultsDiv.innerHTML = `
                <h3>Admin Results:</h3>
                <p>Yes: ${data.votes.Yes}</p>
                <p>No: ${data.votes.No}</p>
                <p>Voters:</p>
                <div class="voters">${generateVoterList(data.voters)}</div>
            `;
        })
        .catch((error) => {
            alert("Error fetching results. Please check the password.");
        });
}

function generateVoterList(voters) {
    return voters.map(voter => {
        return `<div class="voter">🌸 ${voter.name}: ${voter.vote}</div>`;
    }).join('');
}
