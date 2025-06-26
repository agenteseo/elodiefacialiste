document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.style.transform = 'translateY(0)';
            return;
        }

        if (currentScroll > lastScroll && currentScroll > 50) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    const mainContainer = document.getElementById('main-container');
    const panels = document.querySelectorAll('.panel');
    const navLinks = document.querySelectorAll('header nav a');
    const body = document.body;
    const cursor = document.getElementById('custom-cursor');
    const cursorPlus = document.getElementById('custom-cursor-plus');
    const menuBtn = document.querySelector('.menu-btn');
    const nav = document.querySelector('header nav');

    let currentPanel = 0;
    let isScrolling = false;
    let isMobile = window.innerWidth <= 768;

    function updateActiveNav() {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (panels[currentPanel] && link.dataset.target === panels[currentPanel].id) {
                link.classList.add('active');
            }
        });
    }

    function scrollToPanel(panelIndex) {
        if (isScrolling || panelIndex < 0 || panelIndex >= panels.length) return;
        isScrolling = true;
        currentPanel = panelIndex;

        if (!isMobile) {
            mainContainer.style.transform = `translateX(-${currentPanel * 100}vw)`;
            const newColor = panels[currentPanel].dataset.color;
            body.style.backgroundColor = newColor;
            updateActiveNav();
        } else {
            panels[currentPanel].scrollIntoView({ behavior: 'smooth' });
        }

        setTimeout(() => {
            isScrolling = false;
        }, 1000); // Slightly faster transition
    }

    function handleWheel(e) {
        if (isMobile) return;
        e.preventDefault();
        if (isScrolling) return;

        if (e.deltaY > 30) { // More sensitive scroll
            scrollToPanel(Math.min(currentPanel + 1, panels.length - 1));
        } else if (e.deltaY < -30) {
            scrollToPanel(Math.max(currentPanel - 1, 0));
        }
    }

    // Custom Cursor
    function handleMouseMove(e) {
        if (isMobile) return;
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        cursorPlus.style.left = `${e.clientX}px`;
        cursorPlus.style.top = `${e.clientY}px`;
    }

    function handleMouseHover() {
        if (isMobile) return;
        cursor.classList.add('hover');
        cursorPlus.classList.add('hover');
    }
    
    function handleMouseOut() {
        if (isMobile) return;
        cursor.classList.remove('hover');
        cursorPlus.classList.remove('hover');
    }

    function setupEventListeners() {
        if (isMobile) {
            // Mobile setup
            mainContainer.style.transform = 'none';
            body.style.overflowY = 'auto';

            // Intersection Observer for mobile scrolling
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        const newColor = entry.target.dataset.color;
                        document.documentElement.style.setProperty('--bg-color', newColor);
                        
                        navLinks.forEach(link => {
                            link.classList.toggle('active', link.dataset.target === id);
                        });
                    }
                });
            }, { threshold: 0.5 });

            panels.forEach(panel => observer.observe(panel));
            
             menuBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
                menuBtn.textContent = nav.classList.contains('active') ? 'Close' : 'Menu';
            });

            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    nav.classList.remove('active');
                    menuBtn.textContent = 'Menu';
                    const targetPanel = document.getElementById(link.dataset.target);
                    if (targetPanel) {
                        targetPanel.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });


        } else {
            // Desktop setup
            body.style.overflow = 'hidden';
            window.addEventListener('wheel', handleWheel, { passive: false });
            window.addEventListener('mousemove', handleMouseMove);

            navLinks.forEach((link, index) => {
                // The first link corresponds to the second panel (index 1)
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetIndex = Array.from(panels).findIndex(p => p.id === targetId);
                    if(targetIndex !== -1) {
                         scrollToPanel(targetIndex);
                    }
                });
            });

            document.querySelectorAll('a, button').forEach(el => {
                el.addEventListener('mouseenter', handleMouseHover);
                el.addEventListener('mouseleave', handleMouseOut);
            });
        }
    }

    function handleResize() {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            window.location.reload(); // Simple way to re-initiate everything
        }
    }
    
    // Initial setup
    scrollToPanel(0);
    setupEventListeners();
    window.addEventListener('resize', handleResize);
});