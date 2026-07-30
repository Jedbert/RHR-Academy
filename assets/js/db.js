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

        if (!localStorage.getItem(this.storagePrefix + "users")) {
            const initialUsers = [
                {
                    id: "usr_admin_1",
                    email: "dexterdavid835@gmail.com",
                    passwordHash: "admin123", // Demo hash
                    fullName: "Admissions Admin",
                    role: "admin",
                    cohort: "All"
                },
                {
                    id: "usr_student_1",
                    email: "student@respectech.ng",
                    passwordHash: "student123",
                    fullName: "Ayebakuro Oruwori",
                    role: "student",
                    cohort: "Cohort 6"
                }
            ];
            localStorage.setItem(this.storagePrefix + "users", JSON.stringify(initialUsers));
        }
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
}

// Global Database Instance
window.RHRDB = new RHRDatabaseService();
