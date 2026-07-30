/* ==========================================================================
   RESPECTECH-HR ACADEMY - DATABASE & AUTHENTICATION SERVICE (PHASE 2)
   Supports Supabase / REST Endpoint Integration + Storage Persistence Sync
   ========================================================================== */

class RHRDatabaseService {
    constructor() {
        // Supabase / Database Endpoint Configuration (Configurable via Environment)
        this.supabaseUrl = "https://your-supabase-project.supabase.co";
        this.supabaseKey = "your-supabase-anon-key";
        this.storagePrefix = "rhr_db_";

        this.init();
    }

    init() {
        // Initialize default database tables if not present in local storage
        if (!localStorage.getItem(this.storagePrefix + "applications")) {
            const initialApplications = [
                {
                    id: "RHR-APP-9482",
                    fullName: "Ayebakuro A. Oruwori",
                    email: "ayebakuro@example.com",
                    phone: "+2348012345678",
                    track: "Software Engineering",
                    cohort: "Cohort 7",
                    screeningScore: 90,
                    status: "approved",
                    date: "2026-07-29"
                },
                {
                    id: "RHR-APP-3104",
                    fullName: "Nathan Macaver",
                    email: "nathan@example.com",
                    phone: "+2348087654321",
                    track: "UI/UX Product Design",
                    cohort: "Cohort 7",
                    screeningScore: 85,
                    status: "pending_review",
                    date: "2026-07-30"
                }
            ];
            localStorage.setItem(this.storagePrefix + "applications", JSON.stringify(initialApplications));
        }

        // Always guarantee default demo accounts exist in database
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem(this.storagePrefix + "users") || "[]");
        } catch (e) {
            users = [];
        }

        const adminExists = users.some(u => u.email.toLowerCase() === "dexterdavid835@gmail.com");
        if (!adminExists) {
            users.push({
                id: "usr_admin_1",
                email: "dexterdavid835@gmail.com",
                passwordHash: "admin123",
                fullName: "Admissions Admin",
                role: "admin",
                cohort: "All"
            });
        }

        const studentExists = users.some(u => u.email.toLowerCase() === "student@respectech.ng");
        if (!studentExists) {
            users.push({
                id: "usr_student_1",
                email: "student@respectech.ng",
                passwordHash: "student123",
                fullName: "Ayebakuro Oruwori",
                role: "student",
                cohort: "Cohort 6",
                status: "active"
            });
            users.push({
                id: "usr_student_2",
                email: "nathan.mac@example.com",
                passwordHash: "student123",
                fullName: "Nathan Macaver",
                role: "student",
                cohort: "Cohort 5",
                status: "graduated"
            });
            users.push({
                id: "usr_student_3",
                email: "tabitha.j@example.com",
                passwordHash: "student123",
                fullName: "Tabitha Joledo",
                role: "student",
                cohort: "Cohort 4",
                status: "incomplete_needs_rollover"
            });
            users.push({
                id: "usr_student_4",
                email: "benedict.c@example.com",
                passwordHash: "student123",
                fullName: "Benedict Campus",
                role: "student",
                cohort: "Cohort 3",
                status: "graduated"
            });
        }

        localStorage.setItem(this.storagePrefix + "users", JSON.stringify(users));
    }

    // --- COHORT ROLLOVER & MANAGEMENT ---

    getStudents() {
        const users = JSON.parse(localStorage.getItem(this.storagePrefix + "users") || "[]");
        return users.filter(u => u.role === "student");
    }

    async rolloverStudent(userEmail, newCohort = "Cohort 7") {
        const users = JSON.parse(localStorage.getItem(this.storagePrefix + "users") || "[]");
        let rolledOver = null;

        const updatedUsers = users.map(u => {
            if (u.email.toLowerCase() === userEmail.toLowerCase()) {
                rolledOver = { ...u, cohort: newCohort, status: "active_rolled_over" };
                return rolledOver;
            }
            return u;
        });

        localStorage.setItem(this.storagePrefix + "users", JSON.stringify(updatedUsers));

        // Update active session if currently logged in
        const session = this.getCurrentSession();
        if (session && session.user.email.toLowerCase() === userEmail.toLowerCase()) {
            session.user.cohort = newCohort;
            localStorage.setItem(this.storagePrefix + "session", JSON.stringify(session));
        }

        return { success: true, user: rolledOver };
    }

    // --- APPLICATION TABLE METHODS ---

    async saveApplication(appData) {
        const applications = JSON.parse(localStorage.getItem(this.storagePrefix + "applications") || "[]");
        const newApp = {
            id: appData.id || "RHR-APP-" + Math.floor(1000 + Math.random() * 9000),
            fullName: appData.fullName,
            email: appData.email,
            phone: appData.phone || "",
            track: appData.track,
            cohort: appData.cohort || "Cohort 7",
            screeningScore: appData.screeningScore || null,
            status: appData.status || "pending_review",
            date: new Date().toISOString().split("T")[0]
        };

        // Remove duplicates if same ID
        const filtered = applications.filter(a => a.id !== newApp.id && a.email !== newApp.email);
        filtered.unshift(newApp);
        localStorage.setItem(this.storagePrefix + "applications", JSON.stringify(filtered));

        return { success: true, application: newApp };
    }

    async updateScreeningScore(appIdOrEmail, score, recommendation) {
        const applications = JSON.parse(localStorage.getItem(this.storagePrefix + "applications") || "[]");
        let updated = false;

        const updatedApps = applications.map(app => {
            if (app.id === appIdOrEmail || app.email === appIdOrEmail) {
                updated = true;
                return {
                    ...app,
                    screeningScore: score,
                    recommendation: recommendation,
                    status: score >= 60 ? "recommended" : "flagged"
                };
            }
            return app;
        });

        if (!updated) {
            // Create record if quiz taken before application
            updatedApps.unshift({
                id: "RHR-APP-" + Math.floor(1000 + Math.random() * 9000),
                fullName: "Candidate (" + appIdOrEmail + ")",
                email: appIdOrEmail,
                track: "General Tech",
                cohort: "Cohort 7",
                screeningScore: score,
                recommendation: recommendation,
                status: score >= 60 ? "recommended" : "flagged",
                date: new Date().toISOString().split("T")[0]
            });
        }

        localStorage.setItem(this.storagePrefix + "applications", JSON.stringify(updatedApps));
        return { success: true, score };
    }

    async getApplications(statusFilter = "all") {
        const applications = JSON.parse(localStorage.getItem(this.storagePrefix + "applications") || "[]");
        if (statusFilter === "all") return applications;
        return applications.filter(app => app.status === statusFilter);
    }

    async approveCandidate(appId) {
        const applications = JSON.parse(localStorage.getItem(this.storagePrefix + "applications") || "[]");
        let approvedApp = null;

        const updatedApps = applications.map(app => {
            if (app.id === appId) {
                approvedApp = { ...app, status: "approved" };
                return approvedApp;
            }
            return app;
        });

        localStorage.setItem(this.storagePrefix + "applications", JSON.stringify(updatedApps));
        return { success: true, application: approvedApp };
    }

    async rejectCandidate(appId) {
        const applications = JSON.parse(localStorage.getItem(this.storagePrefix + "applications") || "[]");
        const updatedApps = applications.map(app => {
            if (app.id === appId) {
                return { ...app, status: "rejected" };
            }
            return app;
        });

        localStorage.setItem(this.storagePrefix + "applications", JSON.stringify(updatedApps));
        return { success: true };
    }

    // --- AUTHENTICATION & USER MANAGEMENT ---

    async login(email, password) {
        const users = JSON.parse(localStorage.getItem(this.storagePrefix + "users") || "[]");
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            throw new Error("No account found with this email address.");
        }

        if (user.passwordHash !== password) {
            throw new Error("Invalid password credentials. Please try again.");
        }

        const session = {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                cohort: user.cohort
            },
            token: "jwt_token_" + Date.now(),
            expiresAt: Date.now() + 86400000 // 24 hours
        };

        localStorage.setItem(this.storagePrefix + "session", JSON.stringify(session));
        return session;
    }

    async register(fullName, email, password, role = "student") {
        const users = JSON.parse(localStorage.getItem(this.storagePrefix + "users") || "[]");
        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (existing) {
            throw new Error("An account with this email address already exists.");
        }

        const newUser = {
            id: "usr_" + Date.now(),
            email,
            passwordHash: password,
            fullName,
            role,
            cohort: "Cohort 7"
        };

        users.push(newUser);
        localStorage.setItem(this.storagePrefix + "users", JSON.stringify(users));

        return this.login(email, password);
    }

    getCurrentSession() {
        const sessionStr = localStorage.getItem(this.storagePrefix + "session");
        if (!sessionStr) return null;

        const session = JSON.parse(sessionStr);
        if (Date.now() > session.expiresAt) {
            this.logout();
            return null;
        }

        return session;
    }

    logout() {
        localStorage.removeItem(this.storagePrefix + "session");
    }

    // --- PHASE 3: LMS ASSIGNMENTS & CAPSTONE SUBMISSIONS ---

    async submitAssignment(submission) {
        const submissions = JSON.parse(localStorage.getItem(this.storagePrefix + "assignments") || "[]");
        const newSub = {
            id: "sub_" + Date.now(),
            userEmail: submission.userEmail,
            moduleTitle: submission.moduleTitle,
            githubUrl: submission.githubUrl,
            liveUrl: submission.liveUrl || "",
            notes: submission.notes || "",
            status: "submitted",
            submittedAt: new Date().toLocaleString()
        };
        submissions.unshift(newSub);
        localStorage.setItem(this.storagePrefix + "assignments", JSON.stringify(submissions));
        return { success: true, submission: newSub };
    }

    async submitCapstone(capstoneData) {
        const capstones = JSON.parse(localStorage.getItem(this.storagePrefix + "capstones") || "[]");
        const newCapstone = {
            id: "cap_" + Date.now(),
            title: capstoneData.title,
            tagline: capstoneData.tagline,
            track: capstoneData.track || "Software Engineering",
            cohort: capstoneData.cohort || "Cohort 6",
            demoVideoUrl: capstoneData.demoVideoUrl,
            liveAppUrl: capstoneData.liveAppUrl,
            githubRepoUrl: capstoneData.githubRepoUrl,
            teamMembers: capstoneData.teamMembers,
            submittedBy: capstoneData.userEmail,
            status: "pending_demo_day",
            submittedAt: new Date().toLocaleString()
        };
        capstones.unshift(newCapstone);
        localStorage.setItem(this.storagePrefix + "capstones", JSON.stringify(capstones));
        return { success: true, capstone: newCapstone };
    }

    getStudentAssignments(userEmail) {
        const submissions = JSON.parse(localStorage.getItem(this.storagePrefix + "assignments") || "[]");
        return submissions.filter(s => s.userEmail === userEmail);
    }

    getCapstones() {
        let capstones = JSON.parse(localStorage.getItem(this.storagePrefix + "capstones") || "[]");
        if (capstones.length === 0) {
            capstones = [
                {
                    id: "cap_demo_1",
                    title: "EduPay Africa - Automated Tuition Micro-Loans",
                    tagline: "Fintech SaaS platform enabling African students to finance tech education with split pay.",
                    track: "Software Engineering",
                    cohort: "Cohort 6",
                    demoVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    liveAppUrl: "https://github.com",
                    githubRepoUrl: "https://github.com",
                    teamMembers: "Ayebakuro Oruwori, Nathan Macaver",
                    submittedBy: "student@respectech.ng",
                    status: "approved_showcase",
                    submittedAt: "2026-07-28"
                },
                {
                    id: "cap_demo_2",
                    title: "AgriConnect Nigeria - Supply Chain Portal",
                    tagline: "Direct marketplace connecting rural farmers with Abuja corporate buyers.",
                    track: "UI/UX Product Design",
                    cohort: "Cohort 5",
                    demoVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    liveAppUrl: "https://github.com",
                    githubRepoUrl: "https://github.com",
                    teamMembers: "Tabitha Joledo, Benedict Campus",
                    submittedBy: "tabitha@example.com",
                    status: "approved_showcase",
                    submittedAt: "2026-05-15"
                },
                {
                    id: "cap_demo_3",
                    title: "ShieldGuard Threat Intelligence Engine",
                    tagline: "Cybersecurity SIEM log analyzer & breach prevention dashboard for SMEs.",
                    track: "Cyber Security",
                    cohort: "Cohort 6",
                    demoVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    liveAppUrl: "https://github.com",
                    githubRepoUrl: "https://github.com",
                    teamMembers: "Nathan Macaver",
                    submittedBy: "nathan.mac@example.com",
                    status: "approved_showcase",
                    submittedAt: "2026-07-29"
                }
            ];
            localStorage.setItem(this.storagePrefix + "capstones", JSON.stringify(capstones));
        }
        return capstones;
    }

    // --- PHASE 5: CERTIFICATE GENERATION & HR LINKAGE ---

    generateCertificate(fullName, track, cohort, certId = null) {
        const serial = certId || "RHR-C6-2026-" + Math.floor(1000 + Math.random() * 9000);
        const certRecord = {
            serial,
            fullName,
            track,
            cohort,
            issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            verified: true,
            issuer: "Respectech-HR Academy Board"
        };

        // Add to cert DB
        const certs = JSON.parse(localStorage.getItem(this.storagePrefix + "certificates") || "[]");
        certs.unshift(certRecord);
        localStorage.setItem(this.storagePrefix + "certificates", JSON.stringify(certs));

        return certRecord;
    }
}

// Global Database Instance
window.RHRDB = new RHRDatabaseService();
