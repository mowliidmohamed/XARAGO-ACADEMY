document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LOAD CURRICULUM PILLARS (Courses) ---
    async function loadCourses() {
        const container = document.getElementById('course-container');
        if (!container) return;

        try {
            const response = await fetch('courses.json');
            if (!response.ok) throw new Error('Failed to fetch courses');
            const courses = await response.json();

            container.innerHTML = courses.map(course => {
                // We encode the object to safely pass it through an HTML attribute
                const safeCourse = encodeURIComponent(JSON.stringify(course));
                return `
                <div class="pillar-card" 
                     style="background-image: linear-gradient(to top, rgba(0,0,0,0.8), transparent), url('${course.image}');"
                     onclick="openCourseModal('${safeCourse}')">
                    <div class="course-badge" style="position:absolute; top:20px; right:20px; background:#d4af37; color:#fff; padding:5px 10px; font-size:0.7rem; border-radius:3px;">${course.level}</div>
                    <div class="pillar-content">
                        <h3>${course.title}</h3>
                        <p style="color: #ccc; font-size: 0.9rem; margin-bottom: 10px;">${course.description}</p>
                        <span class="price-tag" style="font-weight: bold; color: #fff;">$${course.price}</span>
                    </div>
                </div>
            `}).join('');
        } catch (e) { 
            console.error("Course Loading Error:", e);
            container.innerHTML = `<p style="color: grey; grid-column: 1/-1; text-align: center;">Curriculum updates in progress. Please check back shortly.</p>`;
        }
    }

    // --- 2. COURSE MODAL LOGIC ---
    window.openCourseModal = function(encodedCourse) {
        const modal = document.getElementById('courseModal');
        if (!modal) return;

        // Decode the data back into a JavaScript Object
        const course = JSON.parse(decodeURIComponent(encodedCourse));

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
            const response = await fetch('students.json'); 
            if (!response.ok) throw new Error('Failed to fetch students');
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
    const historyModal = document.getElementById('historyModal');

    function closeAll() {
        [enrollPopup, newsletterPopup, courseModal, historyModal].forEach(p => {
            if(p) {
                p.style.display = 'none';
                p.classList.remove('active');
            }
        });
    }

    document.querySelectorAll('.close-enroll, .close-popup, .close-modal, #closeHistoryBtn').forEach(btn => {
        btn.addEventListener('click', closeAll);
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('popup-overlay') || e.target.classList.contains('modal-overlay')) {
            closeAll();
        }
    });

    // --- 5. HISTORY MODAL TRIGGER ---
    const openHistoryBtn = document.getElementById('openHistoryBtn');
    if (openHistoryBtn) {
        openHistoryBtn.addEventListener('click', () => {
            historyModal.style.display = 'flex';
        });
    }

    // --- 6. ENROLLMENT & FIREBASE SAVE LOGIC ---
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
            
            const selectedList = document.getElementById('popupSelectedCourses');
            selectedList.innerHTML = chosen.map(c => `<li>${c.getAttribute('data-name')}</li>`).join('');
            
            const total = chosen.reduce((sum, c) => sum + Number(c.getAttribute('data-price')), 0);
            document.getElementById('popupTotalAmount').textContent = `$${total.toFixed(2)}`;
        });
    }

    const enrollForm = document.getElementById('enrollForm');
    if (enrollForm) {
        enrollForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const user = firebase.auth().currentUser;
            if (!user) {
                alert("Please log in to your student account first to register.");
                window.location.href = "login.html"; // Ensure this page exists
                return;
            }

            const checks = Array.from(popupCourseList.querySelectorAll('input[type="checkbox"]:checked'));
            const courseTitles = checks.map(c => c.getAttribute('data-name')); 

            if (courseTitles.length === 0) {
                alert("Please select at least one module.");
                return;
            }

            try {
                const db = firebase.firestore();
                await db.collection("enrollments").doc(user.uid).set({
                    courses: courseTitles,
                    studentEmail: user.email,
                    fullName: document.getElementById('enrollName').value,
                    enrolledAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });

                alert("Enrollment Successful!");
                window.location.href = "dashboard.html";
            } catch (error) {
                alert("Database Error: " + error.message);
            }
        });
    }

    // --- 7. PWA & NEWSLETTER ---
    if (newsletterPopup) {
        setTimeout(() => {
            if (!newsletterPopup.classList.contains('active')) {
                newsletterPopup.style.display = 'flex';
                newsletterPopup.classList.add('active');
            }
        }, 8000);
    }

    // Initialize the data loads
    loadCourses();
    loadStudentWork();
});

// --- 8. GLOBAL IMAGE ZOOM ---
function openZoom(src) {
    let zoom = document.getElementById('imageZoom');
    if (!zoom) {
        zoom = document.createElement('div');
        zoom.id = 'imageZoom';
        zoom.className = 'popup-overlay';
        zoom.innerHTML = `
            <div class="popup-content" style="background:none; text-align:center; box-shadow:none;">
                <span class="close-popup" onclick="this.parentElement.parentElement.style.display='none'" style="color:#fff; font-size:3rem; cursor:pointer;">×</span>
                <img src="${src}" style="max-width:90%; max-height:80vh; border:4px solid #fff; border-radius:2px;">
            </div>`;
        document.body.appendChild(zoom);
    } else {
        zoom.querySelector('img').src = src;
    }
    zoom.style.display = 'flex';
}