document.addEventListener('DOMContentLoaded', () => {
    const { jsPDF } = window.jspdf;

    const resumeForm = document.getElementById('resume-form');
    const resumePreview = document.getElementById('resume-preview');
    const addExperienceBtn = document.getElementById('add-experience');
    const addEducationBtn = document.getElementById('add-education');
    const workExperienceEntries = document.getElementById('work-experience-entries');
    const educationEntries = document.getElementById('education-entries');
    const downloadPdfBtn = document.getElementById('download-pdf');

    let experienceCount = 0;
    let educationCount = 0;

    function updatePreview() {
        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const skills = document.getElementById('skills-input').value.split(',').map(s => s.trim());

        let experienceHTML = '<h3>Work Experience</h3>';
        document.querySelectorAll('.experience-entry').forEach(entry => {
            const title = entry.querySelector('input[id^="job-title"]').value;
            const company = entry.querySelector('input[id^="company"]').value;
            const years = entry.querySelector('input[id^="exp-years"]').value;
            const description = entry.querySelector('textarea[id^="exp-desc"]').value;
            experienceHTML += `
                <div>
                    <h4>${title} at ${company}</h4>
                    <p><em>${years}</em></p>
                    <p>${description}</p>
                </div>
            `;
        });

        let educationHTML = '<h3>Education</h3>';
        document.querySelectorAll('.education-entry').forEach(entry => {
            const degree = entry.querySelector('input[id^="degree"]').value;
            const institution = entry.querySelector('input[id^="institution"]').value;
            const years = entry.querySelector('input[id^="edu-years"]').value;
            educationHTML += `
                <div>
                    <h4>${degree}</h4>
                    <p><em>${institution} (${years})</em></p>
                </div>
            `;
        });

        let skillsHTML = '<h3>Skills</h3>';
        skillsHTML += `<ul>${skills.map(s => `<li>${s}</li>`).join('')}</ul>`;

        resumePreview.innerHTML = `
            <div class="resume-header">
                <h1>${fullName}</h1>
                <p>${email} | ${phone} | ${address}</p>
            </div>
            <div class="resume-section">${experienceHTML}</div>
            <div class="resume-section">${educationHTML}</div>
            <div class="resume-section">${skillsHTML}</div>
        `;
    }

    addExperienceBtn.addEventListener('click', () => {
        experienceCount++;
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('experience-entry');
        entryDiv.innerHTML = `
            <div class="form-group">
                <label for="job-title-${experienceCount}">Job Title</label>
                <input type="text" id="job-title-${experienceCount}" required>
            </div>
            <div class="form-group">
                <label for="company-${experienceCount}">Company</label>
                <input type="text" id="company-${experienceCount}" required>
            </div>
            <div class="form-group">
                <label for="exp-years-${experienceCount}">Years</label>
                <input type="text" id="exp-years-${experienceCount}">
            </div>
            <div class="form-group">
                <label for="exp-desc-${experienceCount}">Description</label>
                <textarea id="exp-desc-${experienceCount}" rows="3"></textarea>
            </div>
        `;
        workExperienceEntries.appendChild(entryDiv);
    });

    addEducationBtn.addEventListener('click', () => {
        educationCount++;
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('education-entry');
        entryDiv.innerHTML = `
            <div class="form-group">
                <label for="degree-${educationCount}">Degree</label>
                <input type="text" id="degree-${educationCount}" required>
            </div>
            <div class="form-group">
                <label for="institution-${educationCount}">Institution</label>
                <input type="text" id="institution-${educationCount}" required>
            </div>
            <div class="form-group">
                <label for="edu-years-${educationCount}">Years</label>
                <input type="text" id="edu-years-${educationCount}">
            </div>
        `;
        educationEntries.appendChild(entryDiv);
    });

    resumeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updatePreview();
    });

    resumeForm.addEventListener('input', updatePreview);

    downloadPdfBtn.addEventListener('click', () => {
        const doc = new jsPDF();
        html2canvas(resumePreview).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            doc.save('resume.pdf');
        });
    });

    // Add initial entries
    addExperienceBtn.click();
    addEducationBtn.click();
});
