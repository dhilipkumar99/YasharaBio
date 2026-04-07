document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeBtn = document.querySelector('.close-mobile-nav');

    hamburger.addEventListener('click', () => {
        mobileNav.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
        mobileNav.classList.remove('open');
    });

    // Optional: close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
            mobileNav.classList.remove('open');
        }
    });
});
// Fade-up animation for .wwd-fade elements
document.addEventListener('DOMContentLoaded', function () {
    // ...existing code...

    const fadeEls = document.querySelectorAll('.wwd-fade');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Create a separate observer for text sections to animate them as a group
    const textSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find all fade elements within this text section and show them in sequence
                const fadeItems = entry.target.querySelectorAll('.wwd-fade');
                fadeItems.forEach(item => {
                    item.style.opacity = 1;
                    item.style.transform = 'translateY(0)';
                });
                textSectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '-50px 0px' });
    
    // Observe all text sections
    document.querySelectorAll('.wwd-text').forEach(section => {
        textSectionObserver.observe(section);
    });
    
    // Also observe individual fade elements outside of text sections
    fadeEls.forEach(el => observer.observe(el));
});