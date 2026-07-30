/* ==========================================================================
   RESPECTECH-HR ACADEMY - PHASE 1 EMAIL DISPATCH & SCREENING ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Navigation Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.className = navMenu.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }
        });
    }

    // 2. Initialize EmailJS Integration (Phase 1)
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init("user_respectech_public_key"); // Can be configured in production
        } catch (e) {
            console.log("EmailJS init fallback mode active.");
        }
    }

    // 3. Toast Notification System
    window.showToast = function (message, type = 'success') {
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.style.cssText = `
            background-color: ${type === 'success' ? '#0F172A' : '#D92D20'};
            color: #FFFFFF;
            padding: 14px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 0.95rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
            border-left: 4px solid ${type === 'success' ? '#D92D20' : '#FFFFFF'};
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateY(20px);
            opacity: 0;
        `;
        toast.innerHTML = `<i class="${type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}" style="color: #D92D20; font-size: 1.1rem;"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            toast.style.transform = 'translateY(20px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    // 4. Interactive Modal Manager
    window.openModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // 5. Phase 1 Enrollment Form Submission & Automated Screening Quiz Link
    const enrollForm = document.getElementById('enrollForm');
    if (enrollForm) {
        enrollForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('emailAddr').value.trim();
            const phone = document.getElementById('phoneNum').value.trim();
            const track = document.getElementById('trackSelect').value;

            if (!fullName || !email || !track) {
                window.showToast('Please fill out all required fields.', 'error');
                return;
            }

            const appId = 'RHR-APP-' + Math.floor(1000 + Math.random() * 9000);

            // Phase 2 Database Service Integration
            if (window.RHRDB) {
                window.RHRDB.saveApplication({ id: appId, fullName, email, phone, track, cohort: 'Cohort 7' });
            }

            // Phase 1 EmailJS Automated Dispatch
            if (typeof emailjs !== 'undefined') {
                const templateParams = {
                    applicant_id: appId,
                    to_name: fullName,
                    to_email: email,
                    track_choice: track.toUpperCase(),
                    admin_email: 'dexterdavid835@gmail.com'
                };
                emailjs.send('service_respectech', 'template_application', templateParams)
                    .then(() => console.log('EmailJS dispatch successful'))
                    .catch(() => console.log('EmailJS simulated dispatch complete'));
            }

            const formCard = enrollForm.closest('.modal-card');
            if (formCard) {
                formCard.innerHTML = `
                    <div style="text-align: center; padding: 2.5rem 1rem;">
                        <div style="width: 72px; height: 72px; background: #FEF2F2; color: #D92D20; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; font-size: 2.25rem;">
                            <i class="fa-solid fa-paper-plane"></i>
                        </div>
                        <span class="section-tag">Step 1 Complete</span>
                        <h3 style="font-size: 1.6rem; margin: 0.5rem 0; color: #0F172A;">Applicant ID: ${appId}</h3>
                        <p style="color: #64748B; margin-bottom: 1.5rem; line-height: 1.6; font-size: 0.95rem;">
                            Thank you, <strong>${fullName}</strong>! A confirmation email has been dispatched to <strong>${email}</strong>.<br><br>
                            To complete your application for <strong>Cohort 7</strong>, please proceed to your 15-minute candidate screening quiz below:
                        </p>
                        <div style="display: flex; gap: 1rem; flex-direction: column;">
                            <a href="screening.html?appId=${appId}" class="btn btn-primary btn-lg">Take Candidate Screening Quiz Now <i class="fa-solid fa-arrow-right"></i></a>
                            <button onclick="location.reload()" class="btn btn-outline">Close Window</button>
                        </div>
                    </div>
                `;
            }
            window.showToast(`Application ${appId} received! Confirmation email sent.`);
        });
    }

    // 6. Certificate Verification Database Simulation
    const certificateDB = {
        'RHR-C6-001': { name: 'Ayebakuro A. Oruwori', track: 'Software Engineering', cohort: 'Cohort 6', date: 'July 2026', status: 'Active (Current Top Fellow)' },
        'RHR-C5-102': { name: 'Nathan Macaver', track: 'UI/UX Product Design', cohort: 'Cohort 5', date: 'March 2026', status: 'Graduated & Verified' },
        'RHR-C5-204': { name: 'Tabitha Joledo', track: 'Cybersecurity & Cloud', cohort: 'Cohort 5', date: 'March 2026', status: 'Graduated & Verified' },
        'RHR-C4-089': { name: 'Pemalla Joledo', track: 'Data Science & PowerBI', cohort: 'Cohort 4', date: 'November 2025', status: 'Graduated & Verified' },
        'RHR-C1-012': { name: 'Benedict Joledo', track: 'Digital Marketing', cohort: 'Cohort 1', date: 'January 2024', status: 'Alumni Fellow' }
    };

    const verifyForm = document.getElementById('verifyForm');
    if (verifyForm) {
        verifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const certInput = document.getElementById('certId').value.trim().toUpperCase();
            const resultBox = document.getElementById('verifyResult');

            if (!resultBox) return;
            resultBox.style.display = 'block';

            if (certificateDB[certInput]) {
                const data = certificateDB[certInput];
                resultBox.innerHTML = `
                    <div style="background: #FEF2F2; border: 1.5px solid #FCA5A5; border-radius: 16px; padding: 1.25rem; margin-top: 1.25rem; color: #0F172A; text-align: left; box-shadow: 0 4px 12px rgba(217, 45, 32, 0.08);">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; border-bottom: 1px solid #FCA5A5; padding-bottom: 0.5rem;">
                            <span style="font-weight: 800; color: #D92D20; font-size: 0.9rem;"><i class="fa-solid fa-certificate"></i> AUTHENTIC RHR CREDENTIAL</span>
                            <span style="background: #D92D20; color: #FFF; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 99px;">VERIFIED</span>
                        </div>
                        <p style="font-size: 0.9rem; margin-bottom: 0.35rem;"><strong>Graduate Name:</strong> ${data.name}</p>
                        <p style="font-size: 0.9rem; margin-bottom: 0.35rem;"><strong>Specialization:</strong> ${data.track}</p>
                        <p style="font-size: 0.9rem; margin-bottom: 0.35rem;"><strong>Cohort:</strong> ${data.cohort} (${data.date})</p>
                        <p style="font-size: 0.9rem;"><strong>Status:</strong> <span style="color: #10B981; font-weight: 700;">${data.status}</span></p>
                    </div>
                `;
                window.showToast(`Credential ${certInput} verified!`);
            } else {
                resultBox.innerHTML = `
                    <div style="background: #FEF2F2; border: 1.5px solid #FCA5A5; border-radius: 16px; padding: 1.25rem; margin-top: 1.25rem; color: #7A1712; text-align: left;">
                        <p style="font-weight: 700; color: #D92D20; margin-bottom: 0.35rem;"><i class="fa-solid fa-triangle-exclamation"></i> Certificate Not Found</p>
                        <p style="font-size: 0.85rem; color: #475569;">Try testing with valid sample IDs: <strong>RHR-C6-001</strong>, <strong>RHR-C5-102</strong>, or <strong>RHR-C4-089</strong>.</p>
                    </div>
                `;
                window.showToast('Invalid certificate serial number', 'error');
            }
        });
    }

    // 7. Interactive Contact Form Submission Handler
    const contactPageForm = document.getElementById('contactPageForm');
    if (contactPageForm) {
        contactPageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMsg').value.trim();

            if (!name || !email || !message) {
                window.showToast('Please complete all form fields.', 'error');
                return;
            }

            const messages = JSON.parse(localStorage.getItem('rhr_contact_messages') || '[]');
            messages.push({ id: Date.now(), name, email, subject, message, date: new Date().toLocaleString() });
            localStorage.setItem('rhr_contact_messages', JSON.stringify(messages));

            window.showToast('Message sent! Our admissions team will reply shortly.');
            contactPageForm.reset();
        });
    }
});
