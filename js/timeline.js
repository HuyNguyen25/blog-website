function initTimeline() {
    currentUsername = document.getElementById("current-username");
    currentUsername.textContent = pb.authStore.model.username;
}

function toggleNewPostField() {
    document.getElementById("new-post").classList.toggle("invisible");
    document.getElementById("title").textContent = "";
    document.getElementById("content").textContent = "";
}

async function deleteLikes(postId) {
    const perPage = 100;
    let page = 1;

    try {
        while (true) {
            let resultList = await pb.collection("likes").getList(page, perPage, {
                filter: `post="${postId}"`
            });
            for (let i = 0; i < resultList.totalItems; i++)
                await pb.collection("likes").delete(resultList.items[i].id);
            if (page === resultList.totalPages)
                return;
            page++;
        }
    } catch (error) {
        console.log("Error: ", error);
    }
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
                author: author,
                likes: 0
            }
            const record = await pb.collection("posts").create(post);
            toggleNewPostField();
            location.reload();
        } else {
            alert("Title and Content cannot be empty!");
        }
    } catch (error) {
        console.error("Error: ", error);
    }
}

async function fetchNewPosts(page, perPage) {
    try {
        const resultList = await pb.collection("posts").getList(
            page,
            perPage, {
                expand: "author",
                filter: `author="${pb.authStore.model.id}"`,
                sort: "-created"
            }
        );
        return resultList;
    } catch (error) {
        console.error("Error: ", error);
    }
}

async function showPosts(posts) {
    const timeline = document.getElementById("timeline");
    const length = posts.length;
    for (let i = 0; i < length; i++) {
        timeline.insertAdjacentHTML("beforeend", `
            <article id="${posts[i].id}" class="flex flex-col bg-white gap-y-2 w-4/5 md:w-3/5 lg:w-3xl justify-center rounded-xl shadow-md shadow-gray-500 p-2">
                <div class="flex flex-row gap-x-3 justify-end items-center">
                    <button id="${posts[i].id}-edit" class="rounded-xl py-2 px-4 hover:bg-gray-200 active:bg-gray-300">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button id="${posts[i].id}-delete" class="rounded-xl py-2 px-4 hover:bg-gray-200 active:bg-gray-300">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
                <div class="flex flex-row gap-x-5 items-center text-2xl">
                    <i class="fa fa-user-circle-o"></i>
                    <p>${pb.authStore.model.username}</p>
                </div>
                <hr>
                <div class="flex flex-row items-center justify-center text-3xl flex-wrap font-bold">
                    <div id="${posts[i].id}-title">${posts[i].title}</div>
                </div>
                <hr>
                <div id="${posts[i].id}-content">${posts[i].content}</div>
                <div class="flex flex-row justify-between text-gray-500">
                    <p>${posts[i].likes} Likes</p>
                    <p>${posts[i].created}</p>
                </div>
                <div class="flex flex-row justify-center">
                    <button id="${posts[i].id}-repost" class="m-3 hidden shadow-md shadow-gray-600 rounded-2xl p-3 text-2xl hover:bg-gray-200 active:bg-gray-300">
                        Re-post
                    </button>
                </div>
            </article>
        `);
        //Adding behaviors to the post added recently
        const editButton = document.getElementById(`${posts[i].id}-edit`);
        const deleteButton = document.getElementById(`${posts[i].id}-delete`);
        const titleDiv = document.getElementById(`${posts[i].id}-title`);
        const contentDiv = document.getElementById(`${posts[i].id}-content`);
        const repostButton = document.getElementById(`${posts[i].id}-repost`);

        editButton.addEventListener("click", function() {
            titleDiv.contentEditable = "true";
            titleDiv.focus();
            contentDiv.contentEditable = "true";
            repostButton.classList.toggle("hidden");
        });
        deleteButton.addEventListener("click", async function() {
            document.getElementById(posts[i].id).remove();
            await deleteLikes(posts[i].id);
            await pb.collection('posts').delete(posts[i].id);
            alert("The post has been deleted successfully!");
            location.reload();
        });
        repostButton.addEventListener("click", async function() {
            titleDiv.contentEditable = "false";
            contentDiv.contentEditable = "false";
            repostButton.classList.toggle("hidden");
            try {
                const data = {
                    title: titleDiv.textContent,
                    content: contentDiv.textContent
                }
                const record = await pb.collection("posts").update(posts[i].id, data);
                alert("The post has been updated successfully!");
            } catch (error) {
                console.log("Error: ", error);
            }
        });
    }
}

const fetchAndShowNewPosts = (function() {
    let page = 1;
    const perPage = 6;
    let remaining = true;
    async function fetchAndShowNewPosts() {
        const resultList = await fetchNewPosts(page, perPage);
        if (resultList.totalPages === page)
            remaining = false;
        await showPosts(resultList.items);
    }

    window.addEventListener("scroll", async function() {
        if (this.scrollY + this.innerHeight >= this.document.body.scrollHeight && remaining) {
            page++;
            await fetchAndShowNewPosts();
        }
    });

    return fetchAndShowNewPosts;
})();