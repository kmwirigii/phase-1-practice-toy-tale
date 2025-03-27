let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  let addToy = false;

  // Toggle form display
  addBtn.addEventListener("click", () => {
      addToy = !addToy;
      if (addToy) {
          toyFormContainer.style.display = "block";
      } else {
          toyFormContainer.style.display = "none";
      }
  });

  // Fetch and display all toys
  fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
          toys.forEach(toy => renderToyCard(toy));
      })
      .catch(error => console.error("Error fetching toys:", error));

  // Render a single toy card
  function renderToyCard(toy) {
      const toyCard = document.createElement("div");
      toyCard.className = "card";

      toyCard.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;

      // Add event listener to "Like" button
      const likeButton = toyCard.querySelector(".like-btn");
      likeButton.addEventListener("click", () => handleLikeButton(toy, toyCard));

      toyCollection.appendChild(toyCard);
  }

  // Add a new toy
  toyForm.addEventListener("submit", event => {
      event.preventDefault(); // Prevent default form submission behavior

      const toyData = {
          name: event.target.name.value,
          image: event.target.image.value,
          likes: 0,
      };

      fetch("http://localhost:3000/toys", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
          },
          body: JSON.stringify(toyData),
      })
          .then(response => response.json())
          .then(newToy => {
              renderToyCard(newToy); // Add the new toy to the DOM
              toyForm.reset(); // Clear the form
          })
          .catch(error => console.error("Error adding a new toy:", error));
  });

  // Handle "Like" button click
  function handleLikeButton(toy, toyCard) {
      const newLikes = toy.likes + 1;

      fetch(`http://localhost:3000/toys/${toy.id}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
          },
          body: JSON.stringify({ likes: newLikes }),
      })
          .then(response => response.json())
          .then(updatedToy => {
              const likesParagraph = toyCard.querySelector("p");
              likesParagraph.textContent = `${updatedToy.likes} Likes`;
              toy.likes = updatedToy.likes; // Update the local toy object
          })
          .catch(error => console.error("Error updating likes:", error));
  }
});