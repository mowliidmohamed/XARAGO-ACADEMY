/**
 * THE ATELIER - Unified Website Logic
 * Includes: Gallery Filtering, Enrollment Calculator, and Scroll-to-Top
 */

document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

async function loadCourses() {
    const container = document.getElementById('course-container');
    const modal = document.getElementById('courseModal');

    try {
        const response = await fetch('courses.json');
        const courses = await response.json();

        container.innerHTML = courses.map(course => `
            <div class="pillar-card" onclick="openCourseModal(${JSON.stringify(course).replace(/"/g, '&quot;')})">
                <div class="pillar-content">
                    <h3>${course.title}</h3>
                    <p>Click for Details</p>
                </div>
            </div>
        `).join('');
    } catch (e) { console.log(e); }
}

window.openCourseModal = function(course) {
    const modal = document.getElementById('courseModal');
    document.getElementById('modalTitle').innerText = course.title;
    document.getElementById('modalLevel').innerText = course.level;
    document.getElementById('modalDuration').innerText = course.duration;
    document.getElementById('modalPrice').innerText = `$${course.price}`;
    document.getElementById('modalImage').style.backgroundImage = `url(${course.image})`;
    
    // Syllabus loop
    const syllabusList = document.getElementById('modalSyllabus');
    syllabusList.innerHTML = course.syllabus.map(item => `<li>${item}</li>`).join('');

    modal.style.display = 'flex';
};

// Close Modal Logic
document.querySelector('.close-modal').onclick = () => {
    document.getElementById('courseModal').style.display = 'none';
};

window.onclick = (event) => {
    const modal = document.getElementById('courseModal');
    if (event.target == modal) modal.style.display = 'none';
};
    async function loadCourses() {
    const container = document.getElementById('course-container');
    
    try {
        const response = await fetch('courses.json');
        const courses = await response.json();

        container.innerHTML = courses.map(course => `
            <div class="pillar-card" style="background-image: linear-gradient(to top, rgba(0,0,0,0.8), transparent), url('${course.image}');">
                <div class="course-badge">${course.level}</div>
                <div class="pillar-content">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <span class="price-tag">$${course.price}</span>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}

// Call this function inside your DOMContentLoaded block
loadCourses();
    // --- 5. FORM SUBMISSION & SUCCESS LOGIC ---
const newsletterForm = document.getElementById('newsletterForm');
const formContent = document.getElementById('popup-form-content');
const successContent = document.getElementById('popup-success-content');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Stop page refresh
        
        const data = new FormData(event.target);
        
        // Send data to Formspree
        const response = await fetch(event.target.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Hide form and show Success Message
            formContent.style.display = 'none';
            successContent.style.display = 'block';
        } else {
            alert("Oops! There was a problem submitting your form.");
        }
    });
}
    // --- 4. NEWSLETTER POPUP LOGIC ---
    const popup = document.getElementById('newsletterPopup');
    const closeBtn = document.querySelector('.close-popup');

    if (popup) {
        // Show popup after 5 seconds
        setTimeout(() => {
            popup.style.display = 'flex';
        }, 5000);

        closeBtn.onclick = () => {
            popup.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target == popup) {
                popup.style.display = 'none';
            }
        };
    }
    
    // --- 1. GALLERY FILTER LOGIC ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Toggle active class
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- 2. ENROLLMENT CALCULATOR LOGIC ---
    const checkboxes = document.querySelectorAll('input[name="course"]');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const selectedList = document.getElementById('selectedList');

    if (checkboxes.length > 0 && totalPriceDisplay && selectedList) {
        console.log("Enrollment System: Online");

        const updateSummary = () => {
            let total = 0;
            let listHTML = "";

            checkboxes.forEach(item => {
                if (item.checked) {
                    const price = parseInt(item.value) || 0;
                    const name = item.getAttribute('data-name') || "Course";
                    total += price;
                    listHTML += `
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.9rem;">
                            <span>${name}</span>
                            <span>$${price}</span>
                        </div>`;
                }
            });

            totalPriceDisplay.innerText = `$${total.toFixed(2)}`;
            selectedList.innerHTML = listHTML || '<p class="empty-msg">Select a module to calculate tuition.</p>';
        };

        checkboxes.forEach(box => {
            box.addEventListener('change', updateSummary);
        });
    }

    // --- 3. SCROLL TO TOP LOGIC ---
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (scrollTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollTopBtn.style.display = "block";
            } else {
                scrollTopBtn.style.display = "none";
            }
        };

        scrollTopBtn.onclick = function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    console.log("The Atelier: All systems loaded successfully.");
});

// Animation Keyframes for Gallery (Ensures smooth filtering)
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);