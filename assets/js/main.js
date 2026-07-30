/* ==========================================================================
   RESPECTECH-HR ACADEMY - INTERACTIVE CORE SCRIPT
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
                if (navMenu.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });
    }

    // 2. Interactive Modal Manager
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

    // Close modal on background click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // 3. Application / Enrollment Form Handler
    const enrollForm = document.getElementById('enrollForm');
    if (enrollForm) {
        enrollForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formCard = enrollForm.closest('.modal-card');
            if (formCard) {
                formCard.innerHTML = `
                    <div style="text-align: center; padding: 2rem 1rem;">
                        <div style="width: 64px; height: 64px; background: #FEF2F2; color: #D92D20; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; font-size: 2rem;">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <h3 style="font-size: 1.5rem; margin-bottom: 0.75rem; color: #0F172A;">Application Submitted!</h3>
                        <p style="color: #64748B; margin-bottom: 1.5rem; line-height: 1.6;">Thank you for applying to Respectech-HR Academy. Our admissions team will review your application and contact you within 24 hours.</p>
                        <button onclick="closeModal('enrollModal')" class="btn btn-primary">Done</button>
                    </div>
                `;
            }
        });
    }

    // 4. Certificate Verification Demo Tool
    const verifyForm = document.getElementById('verifyForm');
    if (verifyForm) {
        verifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const certInput = document.getElementById('certId').value.trim();
            const resultBox = document.getElementById('verifyResult');

            if (resultBox) {
                resultBox.style.display = 'block';
                if (certInput.length > 3) {
                    resultBox.innerHTML = `
                        <div style="background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 12px; padding: 1rem; margin-top: 1rem; color: #7A1712;">
                            <h5 style="font-weight: 700; color: #D92D20; margin-bottom: 0.25rem;"><i class="fa-solid fa-certificate"></i> Verified Certificate</h5>
                            <p style="font-size: 0.875rem; margin-bottom: 0.25rem;"><strong>Student Name:</strong> Ayebakuro Oruwori</p>
                            <p style="font-size: 0.875rem; margin-bottom: 0.25rem;"><strong>Track:</strong> Software Engineering (Cohort 2)</p>
                            <p style="font-size: 0.875rem;"><strong>Status:</strong> <span style="color: #10B981; font-weight: 700;">Valid & Authenticated</span></p>
                        </div>
                    `;
                } else {
                    resultBox.innerHTML = `
                        <div style="background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 12px; padding: 1rem; margin-top: 1rem; color: #7A1712;">
                            <p style="font-size: 0.875rem; color: #D92D20;"><i class="fa-solid fa-triangle-exclamation"></i> Invalid Certificate ID. Please verify the ID number and try again.</p>
                        </div>
                    `;
                }
            }
        });
    }
});
