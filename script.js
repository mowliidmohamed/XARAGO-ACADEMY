document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LOAD STUDENT WORK ---
    async function loadStudentWork() {
        const gallery = document.getElementById('student-gallery');
        if (!gallery) return;

        try {
            const response = await fetch('./students.json');
            const studentWork = await response.json();

            gallery.innerHTML = ''; 
            studentWork.forEach(work => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `
                    <div class="gallery-img-container">
                        <img src="${work.image}" alt="${work.project}" onclick="openZoom('${work.image}')">
                    </div>
                    <div class="work-info">
                        <h4>${work.studentName}</h4>
                        <p>${work.project}</p>
                    </div>
                `;
                gallery.appendChild(item);
            });
        } catch (e) { console.error("Gallery Error:", e); }
    }

    // --- 2. LOAD COURSES ---
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
                    <div class="course-badge">${course.level}</div>
                    <div class="pillar-content">
                        <h3>${course.title}</h3>
                        <p>${course.description}</p>
                        <span class="price-tag">$${course.price}</span>
                    </div>
                </div>
            `).join('');
        } catch (e) { console.error("Course Error:", e); }
    }

    // --- 3. MODAL & ZOOM LOGIC ---
    window.openCourseModal = function(course) {
        const modal = document.getElementById('courseModal');
        document.getElementById('modalTitle').innerText = course.title;
        document.getElementById('modalLevel').innerText = course.level;
        document.getElementById('modalDuration').innerText = course.duration;
        document.getElementById('modalPrice').innerText = `$${course.price}`;
        document.getElementById('modalImage').style.backgroundImage = `url(${course.image})`;
        
        const syllabusList = document.getElementById('modalSyllabus');
        syllabusList.innerHTML = course.syllabus.map(item => `<li>${item}</li>`).join('');
        modal.style.display = 'flex';
    };

    window.openZoom = function(imageSrc) {
        const zoomOverlay = document.getElementById('imageZoom');
        const zoomedImg = document.getElementById('zoomedImg');
        if(zoomedImg) zoomedImg.src = imageSrc;
        if(zoomOverlay) zoomOverlay.style.display = 'flex';
    };

    window.closeZoom = function() {
        document.getElementById('imageZoom').style.display = 'none';
    };

    // --- 4. ENROLLMENT CALCULATOR ---
    const checkboxes = document.querySelectorAll('input[name="course"]');
    if (checkboxes.length > 0) {
        const updateSummary = () => {
            let total = 0;
            let listHTML = "";
            checkboxes.forEach(item => {
                if (item.checked) {
                    total += parseInt(item.value) || 0;
                    listHTML += `<div style="display:flex; justify-content:space-between;">
                                    <span>${item.getAttribute('data-name')}</span>
                                    <span>$${item.value}</span>
                                 </div>`;
                }
            });
            document.getElementById('totalPrice').innerText = `$${total.toFixed(2)}`;
            document.getElementById('selectedList').innerHTML = listHTML || '<p>Select a module.</p>';
        };
        checkboxes.forEach(box => box.addEventListener('change', updateSummary));
    }

    // Run everything
    loadStudentWork();
    loadCourses();

    // Modal Close
    const closeModBtn = document.querySelector('.close-modal');
    if (closeModBtn) closeModBtn.onclick = () => document.getElementById('courseModal').style.display = 'none';
});