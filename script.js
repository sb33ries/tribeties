// Smooth scroll behavior (backup for browsers that don't support CSS scroll-behavior)
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Collapse sidebar after scrolling past first section
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');
const firstSection = document.querySelector('.section');

function handleSidebarCollapse() {
    if (window.scrollY > firstSection.offsetHeight * 0.5) {
        sidebar.classList.add('collapsed');
        content.classList.add('expanded');
    } else {
        sidebar.classList.remove('collapsed');
        content.classList.remove('expanded');
    }
}

window.addEventListener('scroll', handleSidebarCollapse);

// Optional: Highlight active section in navigation
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');

function highlightNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '#666';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = '#000';
            link.style.fontWeight = '400';
        } else {
            link.style.fontWeight = '300';
        }
    });
}

window.addEventListener('scroll', highlightNav);