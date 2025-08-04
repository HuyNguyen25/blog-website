function initNewsFeed() {
    currentUsername = document.getElementById("current-username");
    currentUsername.textContent = pb.authStore.model.username;
}

async function fetchNewPosts(page, perPage) {
    try {
        const resultList = await pb.collection("posts").getList(
            page,
            perPage, {
                expand: "author",
                filter: `author!="${pb.authStore.model.id}"`,
                sort: "-created"
            }
        );
        return resultList;
    } catch (error) {
        console.error("Error: ", error);
    }
}

async function showPosts(posts) {
    const timeline = document.getElementById("news-feed");
    const length = posts.length;
    for (let i = 0; i < length; i++) {
        timeline.insertAdjacentHTML("beforeend", `
        <article id="${posts[i].id}" class="flex flex-col bg-white gap-y-2 w-4/5 md:w-3/5 lg:w-3xl justify-center rounded-xl shadow-md shadow-gray-500 p-2">
            <div class="flex flex-row gap-x-5 items-center text-2xl">
                <i class="fa fa-user-circle-o"></i>
                <p>${posts[i].expand.author.username}</p>
            </div>
            <hr>
            <div class="flex flex-row items-center justify-center text-3xl flex-wrap font-bold">
                <div id="${posts[i].id}-title">${posts[i].title}</div>
            </div>
            <hr>
            <div id="${posts[i].id}-content">${posts[i].content}</div>
            <div class="flex flex-row justify-between text-gray-500">
                <p id="${posts[i].id}-likes">${posts[i].likes} Likes</p>
                <p>${posts[i].created}</p>
            </div>
            <hr>
            <div class="flex flex-row justify-start">
                <button id="${posts[i].id}-like" class="p-2 hover:bg-gray-200 rounded-md active:bg-gray-300">
                    <i class="fa fa-heart-o"></i>
                    Like
                </button>
            </div>
        </article>
        `);

        const likeButton = document.getElementById(`${posts[i].id}-like`);
        const likes = document.getElementById(`${posts[i].id}-likes`);
        try {
            let existingLike = await pb.collection("likes").getList(1, 1, {
                filter: `post="${posts[i].id}"&&user="${pb.authStore.model.id}"`
            });
            if (existingLike.items.length !== 0)
                likeButton.innerHTML = '<i class="fa fa-heart"></i> Liked';

            likeButton.addEventListener("click", async function() {
                let existingLike = await pb.collection("likes").getList(1, 1, {
                    filter: `post="${posts[i].id}"&&user="${pb.authStore.model.id}"`
                });
                if (existingLike.items.length === 0) {
                    posts[i].likes += 1;
                    await pb.collection("posts").update(posts[i].id, { likes: posts[i].likes });
                    await pb.collection("likes").create({
                        user: pb.authStore.model.id,
                        post: posts[i].id
                    });
                    this.innerHTML = '<i class="fa fa-heart"></i> Liked';
                    likes.textContent = `${posts[i].likes} Likes`;
                } else {
                    posts[i].likes -= 1;
                    await pb.collection("posts").update(posts[i].id, { likes: posts[i].likes });
                    await pb.collection("likes").delete(existingLike.items[0].id);
                    this.innerHTML = '<i class="fa fa-heart-o"></i> Like';
                    likes.textContent = `${posts[i].likes} Likes`;
                }
            });
        } catch (error) {
            console.log("Error: ", error);
        }
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