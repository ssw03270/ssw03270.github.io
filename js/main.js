// Highlight the section currently in view in the header navigation.
(function () {
    const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
    const sections = links
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    const header = document.querySelector('.site-header');
    let ticking = false;

    function update() {
        ticking = false;
        const offset = header.offsetHeight + 24;
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        let current = sections[0];
        if (atBottom) {
            current = sections[sections.length - 1];
        } else {
            sections.forEach(section => {
                if (section.getBoundingClientRect().top <= offset) current = section;
            });
        }
        links.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + current.id);
        });
    }

    // Keep anchor jumps clear of the header, whose height changes when the menu wraps.
    function syncHeaderOffset() {
        document.documentElement.style.setProperty('--header-offset', header.offsetHeight + 'px');
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });
    window.addEventListener('resize', syncHeaderOffset);
    document.fonts && document.fonts.ready.then(syncHeaderOffset);
    syncHeaderOffset();
    update();
})();

// Open publication figures in a simple preview instead of a new tab.
(function () {
    const dialog = document.getElementById('lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const image = dialog.querySelector('img');
    const caption = dialog.querySelector('figcaption');

    document.querySelectorAll('.pub-thumb').forEach(thumb => {
        thumb.addEventListener('click', event => {
            event.preventDefault();
            image.src = thumb.getAttribute('href');
            image.alt = thumb.querySelector('img').alt;
            caption.textContent = thumb.closest('.pub').querySelector('.pub-title').textContent;
            dialog.showModal();
        });
    });

    dialog.addEventListener('click', () => dialog.close());
})();
