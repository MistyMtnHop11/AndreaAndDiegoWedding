console.log("test... wedding site loaded");
// let = isScrolling = false;
// let scrollTimeout;

// // Add smooth scrolling to sections on mouse wheel
// document.querySelectorAll('section').forEach((section, index) => {
//     section.addEventListener('wheel', function(e) {
//         // no more default scroll behavior
//         e.preventDefault();

//         clearTimeout(scrollTimeout); // clear any existing timeout to prevent multiple scrolls

//         if(isScrolling) return; // if scrolling, wait
        
//         //set flag
//         isScrolling = true;

//         // get scroll direction
//         const delta = Math.sign(e.deltaY);
//         const nextSection = delta > 0 ? this.nextElementSibling : this.previousElementSibling;


//         //scroll to next section if it exists and is a section element
//         if (nextSection && nextSection.tagName === 'SECTION') {
//             nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         }

//         //Add a delay before next scroll
//         setTimeout(() => {
//             isScrolling = false;
//         }, 800); // Adjust the delay as needed 1000 -> 1 second
//     }, { passive: false });
// });

// document.addEventListener('scroll', function() {
//     clearTimeout(scrollTimeout); // Clear the timeout on scroll
//     scrollTimeout = setTimeout(() => {
//         isScrolling = false;
//     }, 150); // Adjust the delay as needed 1000 -> 1 second
// },{ passive: true });

// Fade in Animations when scrolling
const observerOptions = {
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px" // Adjust as needed to trigger earlier/later
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with the class 'fade-in'
document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale, .fade-in-scale-special, .fade-in-no-y').forEach(el => {observer.observe(el)});


/* ========================================================
   HAMBURGER MENU FUNCTIONALITY
========================================================= */

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const menuOverlay = document.querySelector('.menu-overlay');
// const menuClose = document.querySelector('.menu-close');

// Open menu
menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');

    if (isOpen) {
        closeMenu();
    } else {
        menuToggle.classList.add('active');
        navMenu.classList.add('open');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
});

// Close menu function
function closeMenu() {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('open');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

// Close menu when clicking X
// menuClose.addEventListener('click', closeMenu);

// Close menu when clicking overlay
menuOverlay.addEventListener('click', closeMenu);

// Close menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

