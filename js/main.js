/* =========================================================
   Yashara Biosciences — Main JS
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    // ----- Mobile navigation -----
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeBtn  = document.querySelector('.close-mobile-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
    }
    if (closeBtn && mobileNav) {
        closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
    }
    document.addEventListener('click', (e) => {
        if (mobileNav && mobileNav.classList.contains('open') &&
            !mobileNav.contains(e.target) &&
            hamburger && !hamburger.contains(e.target)) {
            mobileNav.classList.remove('open');
        }
    });

    // ----- Active nav link -----
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ----- Scroll-triggered fade-up -----
    const fadeEls = document.querySelectorAll('.fade-up');
    if ('IntersectionObserver' in window && fadeEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-up'));
                    const idx = siblings.indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, idx * 90);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        fadeEls.forEach(el => observer.observe(el));
    } else {
        fadeEls.forEach(el => el.classList.add('visible'));
    }

    // ----- Sticky TOC active section tracking -----
    const tocLinks = document.querySelectorAll('.toc-sidebar a[href^="#"]');
    if (tocLinks.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    tocLinks.forEach(l => l.classList.remove('active'));
                    const active = document.querySelector(`.toc-sidebar a[href="#${id}"]`);
                    if (active) active.classList.add('active');
                }
            });
        }, { rootMargin: '-20% 0px -70% 0px' });

        document.querySelectorAll('section[id], div[id]').forEach(s => sectionObserver.observe(s));
    }

    // ----- Contact forms (main + product pages) -----
    document.querySelectorAll('form[data-inquiry-form]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn  = form.querySelector('[type="submit"]');
            const statusDiv  = form.querySelector('.form-status');
            const thankYouId = form.getAttribute('data-thankyou') || 'ctaThankYou';
            const thankYou   = document.getElementById(thankYouId);

            submitBtn.textContent = 'Submitting\u2026';
            submitBtn.disabled    = true;

            const params = {
                from_name:    (form.from_name    || {}).value || '',
                reply_to:     (form.reply_to     || {}).value || '',
                organization: (form.organization || {}).value || '',
                title:        (form.title        || {}).value || '',
                interest:     (form.interest     || {}).value || '',
                message:      (form.message      || {}).value || '',
            };

            if (typeof emailjs !== 'undefined') {
                emailjs.send('service_id', 'template_id', params)
                    .then(() => {
                        form.style.display = 'none';
                        if (thankYou) { thankYou.style.display = 'block'; }
                    })
                    .catch(() => {
                        if (statusDiv) statusDiv.textContent = 'Submission failed. Please try again or email us directly.';
                        submitBtn.textContent = 'Submit Inquiry';
                        submitBtn.disabled    = false;
                    });
            } else {
                // Dev fallback
                form.style.display = 'none';
                if (thankYou) { thankYou.style.display = 'block'; }
            }
        });
    });
});
