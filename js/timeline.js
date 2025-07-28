function initTimeline() {
    currentUsername = document.getElementById("current-username");
    currentUsername.textContent = pb.authStore.model.username;
}

function toggleNewPostField() {
    document.getElementById("new-post").classList.toggle("invisible");
    document.getElementById("title").textContent = "";
    document.getElementById("content").textContent = "";
}

async function createNewPost() {
    const title = document.getElementById("title").textContent;
    const content = document.getElementById("content").textContent;
    const author = pb.authStore.model.id;
    try {
        if (title !== "" && content !== "") {
            const post = {
                title: title,
                content: content,
                author: author
            }
            const record = await pb.collection("posts").create(post);
            toggleNewPostField();
        } else {
            alert("Title and Content cannot be empty!");
        }
    } catch (error) {
        console.error("Error: ", error);
    }
}