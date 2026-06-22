// Global Application Logic
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initCanvasBackground();
    initMobileMenu();
    initSkillsDashboard();
    initCertModal();
    initScrollspy();
    initContactForm();
    initNavbarScroll();
});

/* Navbar Scrolled Class Trigger */
function initNavbarScroll() {
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
}

/* Light / Dark Mode Toggle */
let particleColors = { node: "#00f2fe", line: "rgba(0, 242, 254, 0.15)" };

function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    
    // Check local storage or system preference
    const storedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const defaultTheme = storedTheme || (systemPrefersDark ? "dark" : "light");
    
    setTheme(defaultTheme);
    
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    
    // Update canvas particle colors according to the theme
    if (theme === "dark") {
        particleColors.node = "#00f2fe";
        particleColors.line = "rgba(0, 242, 254, 0.12)";
    } else {
        particleColors.node = "#2563eb";
        particleColors.line = "rgba(37, 99, 235, 0.08)";
    }
}

/* Interactive Canvas Background (Node Data pipelines) */
function initCanvasBackground() {
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");
    let animationId;
    let particlesArray = [];
    
    // Resize handler
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Boundary bounce
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.fillStyle = particleColors.node;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Initialize Particles
    function init() {
        particlesArray = [];
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
        for (let i = 0; i < count; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Draw Connections between nodes
    function connect() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.strokeStyle = particleColors.line;
                    ctx.lineWidth = 1 - (distance / 120);
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connect();
        animationId = requestAnimationFrame(animate);
    }
    
    init();
    animate();
    
    // Re-initialize particles on resize to fit density
    window.addEventListener("resize", () => {
        cancelAnimationFrame(animationId);
        init();
        animate();
    });
}

/* Mobile Hamburger Menu */
function initMobileMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const links = document.querySelectorAll(".nav-link");
    
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        
        // Toggle icon state if needed (optional decoration)
        menuToggle.classList.toggle("open");
    });
    
    // Close nav drawer on link click
    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("open");
        });
    });
    
    // Close on outside click
    document.addEventListener("click", (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains("active")) {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("open");
        }
    });
}

/* Skills Workspace Dashboard Interaction */
const skillsData = {
    visualization: {
        title: "BI & Visualization",
        stack: "Power BI / Fabric",
        tool: "Power BI Desktop",
        level: "Expert",
        description: "Designing high-performance, interactive executive dashboards aligned with stakeholder KPIs. Configuring data gateways, scheduling refreshes, and publishing reports to workspaces.",
        skills: [
            { name: "Power BI Desktop & Service", pct: 95 },
            { name: "Microsoft Fabric Workspace", pct: 90 },
            { name: "Dashboard Design & Storytelling", pct: 95 },
            { name: "Paginated Reports (Report Builder)", pct: 85 }
        ]
    },
    languages: {
        title: "Languages & Query",
        stack: "T-SQL / DAX / PySpark",
        tool: "DAX Studio / SSMS",
        level: "Expert",
        description: "Authoring optimized database queries and expressions. Writing complex DAX formulas (time intelligence, dynamic metrics) and writing high-efficiency T-SQL queries and procedures.",
        skills: [
            { name: "SQL (T-SQL, PostgreSQL)", pct: 92 },
            { name: "DAX (Data Analysis Expressions)", pct: 95 },
            { name: "PySpark / Python", pct: 80 },
            { name: "M Formula Language (Power Query)", pct: 90 }
        ]
    },
    modelling: {
        title: "Data Modelling",
        stack: "Star / Snowflake",
        tool: "SSMS / Tabular Editor",
        level: "Expert",
        description: "Designing database structures for high report query performance. Building optimized Fact and Dimension tables, handling high-cardinality relationships, and designing semantic models.",
        skills: [
            { name: "Star Schema Design", pct: 95 },
            { name: "Snowflake Schema Design", pct: 90 },
            { name: "Fact & Dimension Tables", pct: 95 },
            { name: "Relational Database Design (RDBMS)", pct: 90 }
        ]
    },
    pipelines: {
        title: "ETL & Pipelines",
        stack: "Fabric DF / Synapse",
        tool: "Data Factory",
        level: "Advanced",
        description: "Orchestrating data ingestion workflows. Creating robust pipelines to cleanse, merge, and load heterogeneous source systems into Medallion (Bronze/Silver/Gold) schemas.",
        skills: [
            { name: "ETL / ELT Pipeline Design", pct: 90 },
            { name: "Microsoft Fabric Data Factory", pct: 90 },
            { name: "Lakehouse & Warehouse Schemas", pct: 88 },
            { name: "Data Lakehouse Orchestration", pct: 85 }
        ]
    },
    cloud: {
        title: "Cloud & Security",
        stack: "Azure / Dynamic RLS",
        tool: "Azure Portal",
        level: "Advanced",
        description: "Enforcing data governance and security. Configuring Dynamic Row-Level Security (RLS) based on AD groups or logins, and managing data lakes securely.",
        skills: [
            { name: "Dynamic Row-Level Security (RLS)", pct: 95 },
            { name: "Azure Synapse Analytics", pct: 85 },
            { name: "Azure Data Lake Gen2", pct: 88 },
            { name: "On-Premises Data Gateways", pct: 92 }
        ]
    }
};

function initSkillsDashboard() {
    const sidebarButtons = document.querySelectorAll(".sidebar-btn");
    
    // Elements to update
    const kpiStack = document.getElementById("kpi-stack");
    const kpiTool = document.getElementById("kpi-tool");
    const kpiLevel = document.getElementById("kpi-level");
    const categoryTitle = document.getElementById("category-title");
    const categoryDescription = document.getElementById("category-description");
    const skillsList = document.getElementById("skills-list");
    
    function loadCategory(categoryId) {
        const data = skillsData[categoryId];
        if (!data) return;
        
        // Update text content
        kpiStack.textContent = data.stack;
        kpiTool.textContent = data.tool;
        kpiLevel.textContent = data.level;
        categoryTitle.textContent = data.title;
        categoryDescription.textContent = data.description;
        
        // Render skill bars
        skillsList.innerHTML = "";
        data.skills.forEach(skill => {
            const skillItem = document.createElement("div");
            skillItem.className = "skill-item";
            skillItem.innerHTML = `
                <div class="skill-info">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-percentage">${skill.pct}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: 0%"></div>
                </div>
            `;
            skillsList.appendChild(skillItem);
            
            // Trigger animation on a short timeout so transition plays
            setTimeout(() => {
                const fill = skillItem.querySelector(".progress-bar-fill");
                if (fill) fill.style.width = `${skill.pct}%`;
            }, 50);
        });
    }
    
    sidebarButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active classes
            sidebarButtons.forEach(b => b.classList.remove("active"));
            
            // Add active to clicked button
            btn.classList.add("active");
            
            // Load category
            const category = btn.getAttribute("data-category");
            loadCategory(category);
        });
    });
    
    // Load initial category (BI & Visualization)
    loadCategory("visualization");
}

/* Lightbox Modal for Certificate Viewing */
function initCertModal() {
    const certCards = document.querySelectorAll(".cert-card");
    const modal = document.getElementById("cert-modal");
    const modalImg = document.getElementById("modal-img");
    const modalCaption = document.getElementById("modal-caption");
    const modalClose = document.getElementById("modal-close");
    
    certCards.forEach(card => {
        card.addEventListener("click", () => {
            const certId = card.getAttribute("data-cert");
            const thumb = card.querySelector(".cert-thumb");
            const name = card.querySelector(".cert-name").textContent;
            const code = card.querySelector(".cert-code").textContent;
            
            // Path mapping based on certificate ID
            let imgPath = "";
            if (certId === "dp_700") imgPath = "dp_700_certificate.jpeg";
            else if (certId === "dp_600") imgPath = "dp_600_certificate.jpeg";
            else if (certId === "pl_300") imgPath = "pl_300_certificate.jpeg";
            
            if (imgPath) {
                modalImg.src = imgPath;
                modalCaption.textContent = `${code}: ${name}`;
                modal.classList.add("active");
                modal.setAttribute("aria-hidden", "false");
                document.body.style.overflow = "hidden"; // Lock scroll
            }
        });
    });
    
    // Close modal function
    function closeModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // Unlock scroll
        setTimeout(() => {
            modalImg.src = "";
            modalCaption.textContent = "";
        }, 300);
    }
    
    modalClose.addEventListener("click", closeModal);
    
    // Close on backdrop click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });
}

/* Scrollspy for Navbar links */
function initScrollspy() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");
    
    window.addEventListener("scroll", () => {
        let current = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust threshold offset for top navbar height
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute("id");
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").substring(1) === current) {
                link.classList.add("active");
            }
        });
    });
}

/* Contact Form handling and mock validation */
function initContactForm() {
    const form = document.getElementById("contact-form");
    const feedback = document.getElementById("form-feedback");
    
    if (!form) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");
        const submitBtn = form.querySelector("button[type='submit']");
        const originalBtnText = submitBtn.innerHTML;
        
        // Simple client side checks
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            showFeedback("All fields are required.", "error");
            return;
        }
        
        // Submit UI lock
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <svg class="spinner" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
        `;
        feedback.className = "form-feedback";
        feedback.textContent = "";
        
        // Mock API call delay (1.5 seconds)
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            // Show Success Message
            showFeedback(`Thank you, ${nameInput.value.trim()}! Your message has been received.`, "success");
            
            // Reset fields
            form.reset();
        }, 1500);
    });
    
    function showFeedback(message, type) {
        feedback.textContent = message;
        feedback.className = `form-feedback ${type}`;
    }
}

// Add rotate animation for spinner dynamically in JS or rely on CSS
const style = document.createElement("style");
style.textContent = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
