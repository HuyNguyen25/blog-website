function initNewsFeed() {
    currentUsername = document.getElementById("current-username");
    currentUsername.textContent = pb.authStore.model.username;
}