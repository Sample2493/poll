const votes = { Yes: 0, No: 0 };
let names = [];

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

    if (votes.hasOwnProperty(option)) {
        votes[option]++;
        names.push(name);
        alert("Vote submitted!");

        // Hide the options and name/password input after voting
        document.querySelector(".options").style.display = "none";
        document.querySelector(".name-input").style.display = "none";
        document.querySelector(".password-input").style.display = "none";

        // Show the user's vote confirmation
        showUserVote(option);

        // Start the heart animation and explosion effect
        animateHeart(option);

        // If admin entered the correct password, show full results
        if (password === "123") {
            showResults();
        }
    } else {
        alert("Invalid option.");
    }
}

function showUserVote(option) {
    const resultsDiv = document.getElementById("results");

    // Display confirmation of the user's vote
    resultsDiv.innerHTML = `
        <h2>Thank you for voting!</h2>
        <p>You voted: ${option}</p>
    `;
}

function animateHeart(option) {
    const heartDiv = document.createElement("div");
    heartDiv.classList.add("heart");
    heartDiv.innerHTML = "❤️";
    document.body.appendChild(heartDiv);

    // Animate heart to grow larger and explode into flowers
    heartDiv.style.animation = "heart-expand 2s ease-out forwards";

    setTimeout(() => {
        explodeIntoFlowers(option);
    }, 2000); // Explode after heart animation is complete
}

function explodeIntoFlowers(option) {
    const heartDiv = document.querySelector(".heart");
    heartDiv.remove();  // Remove the heart after the animation

    const numFlowers = 10; // Number of flowers to explode
    for (let i = 0; i < numFlowers; i++) {
        const flower = document.createElement("span");
        flower.classList.add("flower");
        flower.innerHTML = "🌸";
        flower.style.position = "absolute";
        flower.style.left = `${Math.random() * window.innerWidth}px`;
        flower.style.top = `${Math.random() * window.innerHeight}px`;
        flower.style.animation = `flower-explode 1s ease forwards ${i * 0.1}s`;
        document.body.appendChild(flower);
    }

    // Show the results after explosion
    setTimeout(() => {
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML += `
            <h3>Here are your flowers, ${names[names.length - 1]}! 🌸</h3>
        `;
    }, 1000); // Wait for flowers to explode before showing the name

    // Show "Happy Valentine's Day to All!" message
    setTimeout(() => {
        const valentineMessage = document.createElement("div");
        valentineMessage.classList.add("valentine-message");
        valentineMessage.innerHTML = "❤️ Happy Valentine's Day to all! ❤️";
        document.body.appendChild(valentineMessage);
    }, 2000); // Show the message after the explosion
}

function showResults() {
    const resultsDiv = document.getElementById("results");

    // Display full results only for the admin
    resultsDiv.innerHTML += `
        <h3>Admin Results:</h3>
        <p>Yes: ${votes.Yes}</p>
        <p>No: ${votes.No}</p>
        <p>Voters:</p>
        <div class="flowers">${generateFlowers()}</div>
    `;
}

function generateFlowers() {
    return names.map(name => {
        return `<span class="flower">🌸 ${name}</span>`;
    }).join('');
}
