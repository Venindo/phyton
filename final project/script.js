document.addEventListener('DOMContentLoaded', function () {
    // Respect user motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Smooth scrolling for anchor links (fall back to 'auto' if reduced motion)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetSelector = this.getAttribute('href');
            const targetEl = document.querySelector(targetSelector);
            if (!targetEl) return; // nothing to scroll to
            e.preventDefault();
            targetEl.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
            // Update focus for accessibility
            targetEl.setAttribute('tabindex', '-1');
            targetEl.focus({ preventScroll: true });
        });
    });

    // IntersectionObserver to reveal cards (only once per card)
    try {
        const observerOptions = { threshold: 0.12 };
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    if (!prefersReducedMotion) {
                        el.classList.add('animate__animated', 'animate__fadeInUp');
                    } else {
                        el.style.opacity = 1;
                        el.style.transform = 'none';
                    }
                    obs.unobserve(el); // animate once
                }
            });
        }, observerOptions);

        document.querySelectorAll('.card').forEach(card => {
            // initialize for reduced-motion fallback
            if (prefersReducedMotion) {
                card.style.opacity = 1;
            }
            io.observe(card);
        });
    } catch (err) {
        // IntersectionObserver not supported: reveal all
        document.querySelectorAll('.card').forEach(card => card.style.opacity = 1);
    }

    // Form validation (Bootstrap-style) and centralized contact handler
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const alertPlaceholder = document.getElementById('alertPlaceholder');
            const form = this;

            if (!form.checkValidity()) {
                if (alertPlaceholder) {
                    alertPlaceholder.innerHTML = `\n                        <div class="alert alert-danger alert-dismissible fade show" role="alert">\n                            <strong>Error!</strong> Please fill in all required fields.\n                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\n                        </div>\n                    `;
                }
                form.classList.add('was-validated');
                return;
            }

            // Simulate success (replace with actual submit logic / AJAX here)
            if (alertPlaceholder) {
                alertPlaceholder.innerHTML = `\n                    <div class="alert alert-success alert-dismissible fade show" role="alert">\n                        <strong>Thank you!</strong> Your message has been submitted successfully.\n                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\n                    </div>\n                `;
            }
            form.reset();
            form.classList.remove('was-validated');
        });
    }

    // Make images lazy-loading where supported
    try {
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    } catch (e) {
        // ignore
    }

    // Back to top button (accessible and keyboard-friendly)
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.setAttribute('title', 'Back to top');
    backToTopButton.innerHTML = '↑';
    backToTopButton.type = 'button';
    backToTopButton.tabIndex = 0;
    document.body.appendChild(backToTopButton);

    function checkScroll() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }
    checkScroll();
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkScroll, 80);
    }, { passive: true });

    function scrollTop() {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }

    backToTopButton.addEventListener('click', scrollTop);
    backToTopButton.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollTop();
        }
    });

    // Simple lightbox for .card-img-top images
    function createLightbox(src, alt) {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.tabIndex = 0;
        overlay.innerHTML = '';
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt || '';
        overlay.appendChild(img);
        overlay.addEventListener('click', () => document.body.removeChild(overlay));
        overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (document.body.contains(overlay)) document.body.removeChild(overlay);
            }
        });
        document.body.appendChild(overlay);
        overlay.focus();
    }

    document.querySelectorAll('.card .card-img-top').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
            createLightbox(img.src, img.alt || 'Image preview');
        });
    });

    // Theme removed per user request — no theme toggle or dark-mode logic

});