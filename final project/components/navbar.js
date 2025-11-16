class CustomNavbar extends HTMLElement {
    connectedCallback() {
        // Render into light DOM so Bootstrap CSS/JS can operate normally
        this.innerHTML = `
            <style>
                .custom-navbar-host { display: block; width: 100%; }
                .navbar { box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .nav-link { padding: 0.5rem 1rem; font-weight: 500; transition: all 0.3s ease; }
                .nav-link:hover { opacity: 0.8; }
            </style>
            <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: var(--primary-color, #6c5ce7);">
                <div class="container">
                    <a class="navbar-brand fw-bold" href="index.html">Cosmic Canvas ✨</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="index.html">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="gallery.html">Gallery</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="about.html">About</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="contact.html">Contact</a>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                    Legal
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="privacy-policy.html">Privacy Policy</a></li>
                                    <li><a class="dropdown-item" href="terms-of-service.html">Terms of Service</a></li>
                                    <li><a class="dropdown-item" href="Copyright.html">Copyright</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;

        // Highlight active link based on current page
        // Use a small timeout to ensure links have been parsed into DOM
        setTimeout(() => {
            try {
                const currentFile = (window.location.pathname || '').split('/').pop() || 'index.html';
                const normalizedCurrent = currentFile.toLowerCase();

                // Clear existing active classes
                const navLinks = this.querySelectorAll('.nav-link');
                navLinks.forEach(n => n.classList.remove('active'));

                const dropdownItems = this.querySelectorAll('.dropdown-item');
                dropdownItems.forEach(d => d.classList.remove('active'));

                // Match top-level links
                let matched = false;
                this.querySelectorAll('.nav-link[href]').forEach(link => {
                    const hrefFile = (new URL(link.getAttribute('href'), window.location.href).pathname || '').split('/').pop().toLowerCase();
                    if (hrefFile === normalizedCurrent || (hrefFile === 'index.html' && normalizedCurrent === '')) {
                        link.classList.add('active');
                        matched = true;
                    }
                });

                // Match dropdown items; if matched, also mark parent toggle as active
                this.querySelectorAll('.dropdown-item[href]').forEach(item => {
                    const hrefFile = (new URL(item.getAttribute('href'), window.location.href).pathname || '').split('/').pop().toLowerCase();
                    if (hrefFile === normalizedCurrent) {
                        item.classList.add('active');
                        const parentToggle = item.closest('.dropdown').querySelector('.dropdown-toggle');
                        if (parentToggle) parentToggle.classList.add('active');
                        matched = true;
                    }
                });

                // If nothing matched and we're on root, mark home
                if (!matched && (normalizedCurrent === '' || normalizedCurrent === 'index.html')) {
                    const home = this.querySelector('.nav-link[href="index.html"]');
                    if (home) home.classList.add('active');
                }
            } catch (err) {
                // Fail silently - don't break pages if URL parsing fails
                console.warn('Navbar active-link init error:', err);
            }
        }, 0);
    }
}

customElements.define('custom-navbar', CustomNavbar);