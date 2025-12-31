document.getElementById("addCourseForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Parsing the Quiz textarea into an Array of Objects
    const quizLines = document.getElementById("quizData").value.split('\n');
    const formattedQuiz = quizLines.map(line => {
        const [question, options, correct] = line.split('|');
        return question ? { 
            question: question.trim(), 
            options: options.split(',').map(o => o.trim()), 
            correct: correct.trim() 
        } : null;
    }).filter(q => q !== null);

    const courseData = {
        title: document.getElementById("courseTitle").value,
        price: Number(document.getElementById("coursePrice").value),
        resources: {
            video: document.getElementById("videoUrl").value,
            pdf: document.getElementById("pdfUrl").value
        },
        quiz: formattedQuiz,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        // We use the title as a unique ID (slugified) to make it easy to find
        const courseId = courseData.title.toLowerCase().replace(/ /g, "-");
        await db.collection("courses").doc(courseId).set(courseData);
        
        alert("Course Material Published!");
        e.target.reset();
    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    }
});