(function () {
    const navlinks = document.querySelectorAll('.nav-link');

    navlinks.forEach((link) => {
        if (path === link.dataset.path) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
})();
