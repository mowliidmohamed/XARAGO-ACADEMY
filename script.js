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
const enrollForm = document.getElementById('enrollForm');
const successMessage = document.getElementById('successMessage');

if (enrollForm) {
  enrollForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(enrollForm);
    const response = await fetch(enrollForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      enrollForm.style.display = 'none'; // hide form
      successMessage.style.display = 'block'; // show success
    } else {
      alert("Oops! Something went wrong. Please try again.");
    }
  });
}
const enrollForm = document.getElementById('enrollForm');
const successMessage = document.getElementById('successMessage');

if (enrollForm) {
  enrollForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // stop browser redirect

    const formData = new FormData(enrollForm);
    try {
      const response = await fetch(enrollForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        enrollForm.style.display = 'none';   // hide form
        successMessage.style.display = 'block'; // show success overlay
      } else {
        alert("Oops! Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please try again later.");
    }
  });
}

// --- ENROLL POPUP LOGIC ---
const enrollPopup = document.getElementById('enrollPopup');
const enrollBtn = document.querySelector('.cta-mini'); // navbar Enroll Now button
const closeEnrollBtn = document.querySelector('.close-enroll');
const courseCheckboxes = document.querySelectorAll('#enrollForm input[name="course"]');
const selectedCoursesDiv = document.getElementById('selectedCourses');
const totalAmountSpan = document.getElementById('totalAmount');

// Open popup
if (enrollBtn && enrollPopup) {
  enrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    enrollPopup.classList.add('active');
    enrollPopup.classList.remove('fade-out');
  });
}

// Close popup with fade-out
function closeEnroll() {
  if (enrollPopup.classList.contains('active')) {
    enrollPopup.classList.add('fade-out');
    setTimeout(() => {
      enrollPopup.classList.remove('active');
      enrollPopup.classList.remove('fade-out');
    }, 500);
  }
}
if (closeEnrollBtn) closeEnrollBtn.addEventListener('click', closeEnroll);
if (enrollPopup) {
  enrollPopup.addEventListener('click', (e) => {
    if (e.target === enrollPopup) closeEnroll();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && enrollPopup) closeEnroll();
});

// Tuition calculator
function updateTuition() {
  let total = 0;
  let listHTML = "";
  courseCheckboxes.forEach(item => {
    if (item.checked) {
      total += parseInt(item.value) || 0;
      listHTML += `<div style="display:flex; justify-content:space-between;">
                     <span>${item.getAttribute('data-name')}</span>
                     <span>$${item.value}</span>
                   </div>`;
    }
  });
  selectedCoursesDiv.innerHTML = listHTML || '<p>Select a module.</p>';
  totalAmountSpan.innerText = `$${total.toFixed(2)}`;
}
courseCheckboxes.forEach(box => box.addEventListener('change', updateTuition));

document.addEventListener('DOMContentLoaded', () => {
    // --- POPUP LOGIC ---
    const popupOverlay = document.querySelector('.popup-overlay');
    const openPopupBtn = document.getElementById('openPopup'); // trigger button
    const closePopupBtn = document.querySelector('.close-popup');

    // Auto show popup after 5 seconds
    if (popupOverlay) {
        setTimeout(() => {
            popupOverlay.classList.add('active');
        }, 5000);
    }

    // Manual trigger via footer button
    if (openPopupBtn && popupOverlay) {
        openPopupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            popupOverlay.classList.add('active');
        });
    }

    // Close popup with fade-out 
    function closePopup() { 
    if (popupOverlay.classList.contains('active')) { 
    popupOverlay.classList.add('fade-out'); 
    // Wait for transition to finish before hiding 
    setTimeout(() => { 
    popupOverlay.classList.remove('active'); 
    popupOverlay.classList.remove('fade-out'); 
    }, 500); // matches CSS transition duration 
  } 
} if (closePopupBtn && popupOverlay) { 
    closePopupBtn.addEventListener('click', closePopup); 
} 
if (popupOverlay) { popupOverlay.addEventListener('click', (e) => { 
    if (e.target === popupOverlay) closePopup();
     }); 
} 
 document.addEventListener('keydown', (e) => { 
    if (e.key === 'Escape' && popupOverlay) closePopup(); 
});

    // --- Keep your other code (student work, courses, enrollment, etc.) ---
    // loadStudentWork();
    // loadCourses();
});

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
        modal.classList.add('active');
    };

    window.openZoom = function(imageSrc) {
        const zoomOverlay = document.getElementById('imageZoom');
        const zoomedImg = document.getElementById('zoomedImg');
        if (zoomedImg) zoomedImg.src = imageSrc;
        if (zoomOverlay) zoomOverlay.style.display = 'flex';
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

    // --- 5. POPUP LOGIC ---
    const popupOverlay = document.querySelector('.popup-overlay');
    const openPopupBtn = document.getElementById('openPopup'); // trigger button
    const closePopupBtn = document.querySelector('.close-popup');

    if (openPopupBtn && popupOverlay) {
        openPopupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            popupOverlay.classList.add('active');
        });
    }

    if (closePopupBtn && popupOverlay) {
        closePopupBtn.addEventListener('click', () => {
            popupOverlay.classList.remove('active');
        });
    }

    if (popupOverlay) {
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                popupOverlay.classList.remove('active');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popupOverlay) {
            popupOverlay.classList.remove('active');
        }
    });

    // --- Run everything ---
    loadStudentWork();
    loadCourses();

    // --- Modal Close ---
    const closeModBtn = document.querySelector('.close-modal');
    if (closeModBtn) {
        closeModBtn.onclick = () => document.getElementById('courseModal').classList.remove('active');
    }
});