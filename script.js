document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LOAD CURRICULUM PILLARS (Courses) ---
    async function loadCourses() {
        const container = document.getElementById('course-container');
        if (!container) return;

        try {
            const response = await fetch('./courses.json');
            const courses = await response.json();

            container.innerHTML = courses.map(course => `
                <div class="pillar-card" 
                     style="background-image: linear-gradient(to top, rgba(0,0,0,0.8), transparent), url('${course.image}');"
                     onclick="openCourseModal(${JSON.stringify(course).replace(/"/g, '&quot;')})">
                    <div class="course-badge" style="position:absolute; top:20px; right:20px; background:#d4af37; color:#fff; padding:5px 10px; font-size:0.7rem; border-radius:3px;">${course.level}</div>
                    <div class="pillar-content">
                        <h3>${course.title}</h3>
                        <p style="color: #ccc; font-size: 0.9rem; margin-bottom: 10px;">${course.description}</p>
                        <span class="price-tag" style="font-weight: bold; color: #fff;">$${course.price}</span>
                    </div>
                </div>
            `).join('');
        } catch (e) { 
            console.error("Course Loading Error:", e); 
        }
    }

    // --- 2. COURSE MODAL LOGIC ---
    // Opens when a pillar card is clicked
    window.openCourseModal = function(course) {
        const modal = document.getElementById('courseModal');
        if (!modal) return;

        document.getElementById('modalTitle').innerText = course.title;
        document.getElementById('modalLevel').innerText = course.level;
        document.getElementById('modalDuration').innerText = course.duration;
        document.getElementById('modalPrice').innerText = `$${course.price}.00`;
        document.getElementById('modalImage').style.backgroundImage = `url(${course.image})`;
        
        const syllabusList = document.getElementById('modalSyllabus');
        syllabusList.innerHTML = course.syllabus.map(item => `<li>${item}</li>`).join('');
        
        modal.style.display = 'flex';
        modal.classList.add('active');
    };

    // --- 3. LOAD STUDENT WORK (Gallery) ---
    async function loadStudentWork() {
        const gallery = document.getElementById('studentGallery');
        if (!gallery) return;

        try {
            const response = await fetch('./student.json'); 
            const studentWork = await response.json();

            gallery.innerHTML = studentWork.map(work => `
                <div class="gallery-item">
                    <div class="gallery-img-container">
                        <img src="${work.image}" alt="${work.project}" onclick="openZoom('${work.image}')">
                    </div>
                    <div class="work-info">
                        <h4>${work.studentName}</h4>
                        <p style="color: #d4af37; font-weight: bold;">${work.project}</p>
                        <small style="color: #666; display: block; margin-top: 5px;">${work.description}</small>
                    </div>
                </div>
            `).join('');
        } catch (e) { 
            console.error("Gallery Error:", e);
        }
    }

    // --- 4. POPUP & MODAL CONTROLS ---
    const enrollPopup = document.getElementById('enrollPopup');
    const newsletterPopup = document.getElementById('newsletterPopup');
    const courseModal = document.getElementById('courseModal');

    function closeAll() {
        [enrollPopup, newsletterPopup, courseModal].forEach(p => {
            if(p) {
                p.style.display = 'none';
                p.classList.remove('active');
            }
        });
    }

    // Close buttons (X)
    document.querySelectorAll('.close-enroll, .close-popup, .close-modal').forEach(btn => {
        btn.addEventListener('click', closeAll);
    });

    // Close on overlay click (background)
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('popup-overlay') || e.target.classList.contains('modal-overlay')) {
            closeAll();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });

    // --- 5. ENROLLMENT TRIGGER & CALCULATOR ---
    const openEnrollBtn = document.getElementById('openEnrollBtn');
    if (openEnrollBtn) {
        openEnrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            enrollPopup.style.display = 'flex';
        });
    }

    const popupCourseList = document.getElementById('popupCourseList');
    if (popupCourseList) {
        popupCourseList.addEventListener('change', () => {
            const checks = Array.from(popupCourseList.querySelectorAll('input[type="checkbox"]'));
            const chosen = checks.filter(c => c.checked);
            
            // Update the selected courses list UI
            const selectedList = document.getElementById('popupSelectedCourses');
            selectedList.innerHTML = chosen.map(c => `<li>${c.getAttribute('data-name')}</li>`).join('');
            
            // Calculate total
            const total = chosen.reduce((sum, c) => sum + Number(c.getAttribute('data-price')), 0);
            document.getElementById('popupTotalAmount').textContent = `$${total.toFixed(2)}`;
        });
    }

    // --- 6. NEWSLETTER AUTO-SHOW ---
    if (newsletterPopup) {
        setTimeout(() => {
            if (!newsletterPopup.classList.contains('active')) {
                newsletterPopup.style.display = 'flex';
                newsletterPopup.classList.add('active');
            }
        }, 5000);
    }

    // Newsletter Button Trigger (Footer)
    const openNewsletterBtn = document.getElementById('openNewsletterBtn');
    if (openNewsletterBtn) {
        openNewsletterBtn.addEventListener('click', () => {
            newsletterPopup.style.display = 'flex';
            newsletterPopup.classList.add('active');
        });
    }

    // --- 7. INITIALIZE DATA ---
    loadCourses();
    loadStudentWork();
});

// --- 8. IMAGE ZOOM (Outside DOMContentLoaded for global onclick access) ---
function openZoom(src) {
    let zoom = document.getElementById('imageZoom');
    if (!zoom) {
        zoom = document.createElement('div');
        zoom.id = 'imageZoom';
        zoom.className = 'popup-overlay';
        zoom.innerHTML = `
            <div class="popup-content" style="background:none; text-align:center; box-shadow:none;">
                <span class="close-popup" onclick="this.parentElement.parentElement.style.display='none'" style="color:#fff; font-size:3rem;">×</span>
                <img src="${src}" style="max-width:100%; max-height:80vh; border:5px solid #fff; border-radius:4px;">
            </div>`;
        document.body.appendChild(zoom);
    } else {
        zoom.querySelector('img').src = src;
    }
    zoom.style.display = 'flex';
}