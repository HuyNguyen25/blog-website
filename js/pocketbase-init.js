if (!window.pb) {
    window.pb = new PocketBase('http://127.0.0.1:8090');
    window.pb.autoCancellation(false);
}