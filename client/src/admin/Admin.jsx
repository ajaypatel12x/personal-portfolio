import { useEffect, useState } from "react";
import "./Admin.css";
import ProjectManager from "./ProjectManager";

const API_URL = "http://localhost:5000/api/admin";

const DEFAULT_APPEARANCE = {
    activeFrame: "frame01",
    backgroundType: "default",
    backgroundImage: "",
    backgroundEnabled: false,
    overlayOpacity: 0.35,
    backgroundBlur: 0,
    backgroundPosition: "center",
    backgroundSize: "cover",
    animationsEnabled: true,
};

const DEFAULT_PORTFOLIO = {
    personal: {
        name: "",
        role: "",
        tagline: "",
        description: "",
    },

    about: {
        title: "",
        description: ["", ""],
        focus: "",
        interests: "",
        approach: "",
    },

    projects: [],

    technologies: {
        programming: [],
        frontend: [],
        backend: [],
        database: [],
        ai_ml: [],
        tools: [],
    },

    contact: {
        email: "",
        linkedin: "",
        github: "",
        resume: "",
    },

    appearance: {
        ...DEFAULT_APPEARANCE,
    },
};

function normalizePortfolio(data) {
    const safe =
        data && typeof data === "object"
            ? data
            : {};

    const safePersonal = safe.personal || {};
    const safeAbout = safe.about || {};
    const safeTechnologies = safe.technologies || {};
    const safeContact = safe.contact || {};
    const safeAppearance = safe.appearance || {};

    return {
        ...DEFAULT_PORTFOLIO,
        ...safe,

        personal: {
            ...DEFAULT_PORTFOLIO.personal,
            ...safePersonal,
        },

        about: {
            ...DEFAULT_PORTFOLIO.about,
            ...safeAbout,

            description: Array.isArray(
                safeAbout.description
            )
                ? [
                    safeAbout.description[0] || "",
                    safeAbout.description[1] || "",
                ]
                : ["", ""],
        },

        projects: Array.isArray(safe.projects)
            ? safe.projects.map((project) => ({
                ...project,

                id: project.id,

                title: project.title || "",

                category:
                    project.category || "",

                description:
                    project.description || "",

                technologies:
                    Array.isArray(project.technologies)
                        ? project.technologies
                        : [],

                link: project.link || "",

                github: project.github || "",

                liveDemo:
                    project.liveDemo || "",

                coverImage:
                    project.coverImage || "",

                images:
                    Array.isArray(project.images)
                        ? project.images
                        : [],

                featured:
                    project.featured === true,

                published:
                    project.published !== false,

                order:
                    typeof project.order === "number"
                        ? project.order
                        : 0,

                year:
                    project.year || "",

                client:
                    project.client || "",

                role:
                    project.role || "",
            }))
            : [],

        technologies: {
            ...DEFAULT_PORTFOLIO.technologies,
            ...safeTechnologies,

            programming: Array.isArray(
                safeTechnologies.programming
            )
                ? safeTechnologies.programming
                : [],

            frontend: Array.isArray(
                safeTechnologies.frontend
            )
                ? safeTechnologies.frontend
                : [],

            backend: Array.isArray(
                safeTechnologies.backend
            )
                ? safeTechnologies.backend
                : [],

            database: Array.isArray(
                safeTechnologies.database
            )
                ? safeTechnologies.database
                : [],

            ai_ml: Array.isArray(
                safeTechnologies.ai_ml
            )
                ? safeTechnologies.ai_ml
                : [],

            tools: Array.isArray(
                safeTechnologies.tools
            )
                ? safeTechnologies.tools
                : [],
        },

        contact: {
            ...DEFAULT_PORTFOLIO.contact,
            ...safeContact,
        },

        appearance: {
            ...DEFAULT_APPEARANCE,
            ...safeAppearance,

            activeFrame:
                safeAppearance.activeFrame === "frame03"
                    ? "frame03"
                    : safeAppearance.activeFrame ===
                        "frame02"
                        ? "frame02"
                        : "frame01",

            backgroundType:
                safeAppearance.backgroundType === "image"
                    ? "image"
                    : "default",

            backgroundImage:
                typeof safeAppearance.backgroundImage ===
                    "string"
                    ? safeAppearance.backgroundImage
                    : "",

            backgroundEnabled:
                safeAppearance.backgroundEnabled === true,

            overlayOpacity:
                typeof safeAppearance.overlayOpacity ===
                    "number"
                    ? Math.min(
                        1,
                        Math.max(
                            0,
                            safeAppearance.overlayOpacity
                        )
                    )
                    : 0.35,

            backgroundBlur:
                typeof safeAppearance.backgroundBlur ===
                    "number"
                    ? Math.min(
                        30,
                        Math.max(
                            0,
                            safeAppearance.backgroundBlur
                        )
                    )
                    : 0,

            backgroundPosition:
                typeof safeAppearance.backgroundPosition ===
                    "string"
                    ? safeAppearance.backgroundPosition
                    : "center",

            backgroundSize:
                typeof safeAppearance.backgroundSize ===
                    "string"
                    ? safeAppearance.backgroundSize
                    : "cover",

            animationsEnabled:
                safeAppearance.animationsEnabled !== false,
        },
    };
}

function Admin({ onLogout }) {
    const [portfolio, setPortfolio] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");

    const [messageType, setMessageType] =
        useState("");

    const [loggingOut, setLoggingOut] =
        useState(false);

    const [activeSection, setActiveSection] =
        useState("personal");

    // ==================================================
    // LOAD ADMIN DATA
    // ==================================================

    useEffect(() => {
        let mounted = true;

        const loadPortfolio = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/portfolio`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                if (response.status === 401) {
                    window.location.href = "/admin";
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        "Failed to load admin portfolio."
                    );
                }

                const data =
                    await response.json();

                if (!mounted) {
                    return;
                }

                setPortfolio(
                    normalizePortfolio(data)
                );

                setLoading(false);
            } catch (error) {
                console.error(
                    "Admin loading error:",
                    error
                );

                if (!mounted) {
                    return;
                }

                setMessage(
                    error.message ||
                    "Failed to load admin data."
                );

                setMessageType("error");

                setLoading(false);
            }
        };

        loadPortfolio();

        return () => {
            mounted = false;
        };
    }, []);

    // ==================================================
    // NAVIGATION
    // ==================================================

    const navigationItems = [
        {
            id: "personal",
            number: "01",
            label: "Personal",
        },
        {
            id: "about",
            number: "02",
            label: "About",
        },
        {
            id: "projects",
            number: "03",
            label: "Projects",
        },
        {
            id: "technology",
            number: "04",
            label: "Technology",
        },
        {
            id: "contact",
            number: "05",
            label: "Contact",
        },
        {
            id: "appearance",
            number: "06",
            label: "Appearance",
        },
    ];

    useEffect(() => {
        if (!portfolio) {
            return;
        }

        const handleScroll = () => {
            const position =
                window.scrollY + 220;

            let current = "personal";

            navigationItems.forEach((item) => {
                const element =
                    document.getElementById(
                        `section-${item.id}`
                    );

                if (
                    element &&
                    position >= element.offsetTop
                ) {
                    current = item.id;
                }
            });

            setActiveSection(current);
        };

        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true,
            }
        );

        handleScroll();

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, [portfolio]);

    const scrollToSection = (id) => {
        const element =
            document.getElementById(
                `section-${id}`
            );

        if (!element) {
            return;
        }

        setActiveSection(id);

        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // ==================================================
    // FIELD CHANGES
    // ==================================================

    const handleChange = (
        section,
        field,
        value
    ) => {
        setPortfolio((previous) => ({
            ...previous,

            [section]: {
                ...previous[section],
                [field]: value,
            },
        }));
    };

    const handleDescriptionChange = (
        index,
        value
    ) => {
        setPortfolio((previous) => {
            const description = [
                ...(previous.about.description || []),
            ];

            description[index] = value;

            return {
                ...previous,

                about: {
                    ...previous.about,
                    description,
                },
            };
        });
    };

    const handleTechnologyChange = (
        group,
        value
    ) => {
        const items = value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        setPortfolio((previous) => ({
            ...previous,

            technologies: {
                ...previous.technologies,
                [group]: items,
            },
        }));
    };

    const handleAppearanceChange = (
        field,
        value
    ) => {
        setPortfolio((previous) => ({
            ...previous,

            appearance: {
                ...previous.appearance,
                [field]: value,
            },
        }));
    };

    // ==================================================
    // SAVE
    // ==================================================

    const saveChanges = async () => {
        if (!portfolio) {
            return;
        }

        setSaving(true);
        setMessage("");
        setMessageType("");

        try {
            const response = await fetch(
                `${API_URL}/portfolio`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        personal:
                            portfolio.personal,

                        about:
                            portfolio.about,

                        technologies:
                            portfolio.technologies,

                        contact:
                            portfolio.contact,

                        appearance:
                            portfolio.appearance,
                    }),
                }
            );

            if (response.status === 401) {
                window.location.href = "/admin";
                return;
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save changes."
                );
            }

            setPortfolio(
                normalizePortfolio(
                    data.portfolio
                )
            );

            setMessage(
                "Changes saved and published successfully."
            );

            setMessageType("success");

            window.setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 4000);
        } catch (error) {
            console.error(
                "Save error:",
                error
            );

            setMessage(
                error.message ||
                "Failed to save changes."
            );

            setMessageType("error");
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // LOGOUT
    // ==================================================

    const handleLogout = async () => {
        setLoggingOut(true);

        try {
            await fetch(
                `${API_URL}/logout`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );
        } catch (error) {
            console.error(
                "Logout error:",
                error
            );
        }

        if (onLogout) {
            onLogout();
        } else {
            window.location.href = "/admin";
        }
    };

    // ==================================================
    // OPEN PUBLIC SITE
    // ==================================================

    const openPortfolio = () => {
        window.open(
            "/",
            "_blank",
            "noopener,noreferrer"
        );
    };

    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>

                <p>
                    LOADING ADMIN PANEL...
                </p>
            </div>
        );
    }

    if (!portfolio) {
        return (
            <div className="admin-error">
                <div className="admin-error-card">
                    <span>
                        ADMIN SYSTEM
                    </span>

                    <h1>
                        Unable to load Admin Panel
                    </h1>

                    <p>
                        Your login session may
                        have expired.
                    </p>

                    <button
                        onClick={() => {
                            window.location.href =
                                "/admin";
                        }}
                    >
                        RETURN TO LOGIN
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">

            {/* ==========================================
                SIDEBAR
            ========================================== */}

            <aside className="admin-sidebar">

                <div className="admin-brand">

                    <div className="brand-mark">
                        A
                    </div>

                    <div>
                        <h2>
                            ADMIN
                        </h2>

                        <span>
                            PORTFOLIO CONTROL
                        </span>
                    </div>

                </div>

                <div className="sidebar-label">
                    MANAGEMENT
                </div>

                <nav className="admin-navigation">

                    {navigationItems.map(
                        (item) => (
                            <button
                                key={item.id}
                                className={`admin-nav-item ${
                                    activeSection ===
                                        item.id
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    scrollToSection(
                                        item.id
                                    )
                                }
                            >
                                <span className="nav-number">
                                    {item.number}
                                </span>

                                <span>
                                    {item.label}
                                </span>
                            </button>
                        )
                    )}

                </nav>

                <div className="sidebar-bottom">

                    <div className="system-status">

                        <div className="status-dot"></div>

                        <div>
                            <strong>
                                SYSTEM ONLINE
                            </strong>

                            <small>
                                DATABASE CONNECTED
                            </small>
                        </div>

                    </div>

                    <button
                        className="portfolio-button"
                        onClick={
                            openPortfolio
                        }
                    >
                        VIEW PUBLIC PORTFOLIO
                    </button>

                    <button
                        className="logout-button"
                        onClick={
                            handleLogout
                        }
                        disabled={loggingOut}
                    >
                        {loggingOut
                            ? "LOGGING OUT..."
                            : "LOGOUT"}
                    </button>

                </div>

            </aside>

            {/* ==========================================
                MAIN
            ========================================== */}

            <main className="admin-main">

                <header className="admin-header">

                    <div>

                        <p className="admin-eyebrow">
                            PORTFOLIO MANAGEMENT
                            SYSTEM
                        </p>

                        <h1>
                            Control Center
                        </h1>

                        <p className="admin-subtitle">
                            Manage your complete
                            public portfolio from
                            one place.
                        </p>

                    </div>

                    <button
                        className="save-button top-save"
                        onClick={
                            saveChanges
                        }
                        disabled={saving}
                    >
                        {saving
                            ? "SAVING..."
                            : "SAVE ALL CHANGES"}
                    </button>

                </header>

                {message && (
                    <div
                        className={`admin-message ${messageType}`}
                    >
                        {message}
                    </div>
                )}

                {/* ========================================
                    PERSONAL
                ======================================== */}

                <section
                    id="section-personal"
                    className="admin-section"
                >

                    <div className="section-heading">

                        <div>

                            <span>
                                01 / PERSONAL
                            </span>

                            <h2>
                                Personal Information
                            </h2>

                        </div>

                        <p>
                            Control the main identity
                            displayed on your public
                            portfolio.
                        </p>

                    </div>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                Name
                            </label>

                            <input
                                type="text"
                                value={
                                    portfolio.personal.name
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "personal",
                                        "name",
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Role
                            </label>

                            <input
                                type="text"
                                value={
                                    portfolio.personal.role
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "personal",
                                        "role",
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="form-group full-width">

                            <label>
                                Tagline
                            </label>

                            <input
                                type="text"
                                value={
                                    portfolio.personal.tagline
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "personal",
                                        "tagline",
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="form-group full-width">

                            <label>
                                Description
                            </label>

                            <textarea
                                rows="6"
                                value={
                                    portfolio.personal.description
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "personal",
                                        "description",
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                </section>

                {/* ========================================
                    ABOUT
                ======================================== */}

                <section
                    id="section-about"
                    className="admin-section"
                >

                    <div className="section-heading">

                        <div>

                            <span>
                                02 / ABOUT
                            </span>

                            <h2>
                                About Section
                            </h2>

                        </div>

                        <p>
                            Manage your professional
                            story and direction.
                        </p>

                    </div>

                    <div className="form-grid">

                        <div className="form-group full-width">

                            <label>
                                Section Title
                            </label>

                            <input
                                type="text"
                                value={
                                    portfolio.about.title
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "about",
                                        "title",
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="form-group full-width">

                            <label>
                                Description 01
                            </label>

                            <textarea
                                rows="6"
                                value={
                                    portfolio.about.description[0]
                                }
                                onChange={(event) =>
                                    handleDescriptionChange(
                                        0,
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="form-group full-width">

                            <label>
                                Description 02
                            </label>

                            <textarea
                                rows="6"
                                value={
                                    portfolio.about.description[1]
                                }
                                onChange={(event) =>
                                    handleDescriptionChange(
                                        1,
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Focus
                            </label>

                            <input
                                type="text"
                                value={
                                    portfolio.about.focus
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "about",
                                        "focus",
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Interests
                            </label>

                            <input
                                type="text"
                                value={
                                    portfolio.about.interests
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "about",
                                        "interests",
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="form-group full-width">

                            <label>
                                Approach
                            </label>

                            <input
                                type="text"
                                value={
                                    portfolio.about.approach
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "about",
                                        "approach",
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                </section>

                {/* ========================================
                    PROJECTS
                ======================================== */}

                <section
                    id="section-projects"
                    className="admin-section"
                >

                    <div className="section-heading">

                        <div>

                            <span>
                                03 / PROJECTS
                            </span>

                            <h2>
                                Project Management
                            </h2>

                        </div>

                        <p>
                            Add, edit and delete
                            projects without touching
                            the code.
                        </p>

                    </div>

                    <ProjectManager
                        projects={
                            portfolio.projects
                        }
                        onProjectsChange={(
                            projects
                        ) => {
                            setPortfolio(
                                (previous) => ({
                                    ...previous,
                                    projects,
                                })
                            );
                        }}
                    />

                </section>

                {/* ========================================
                    TECHNOLOGY
                ======================================== */}

                <section
                    id="section-technology"
                    className="admin-section"
                >

                    <div className="section-heading">

                        <div>

                            <span>
                                04 / TECHNOLOGY
                            </span>

                            <h2>
                                Technology Stack
                            </h2>

                        </div>

                        <p>
                            Maintain your technical
                            skills and tools.
                        </p>

                    </div>

                    <div className="technology-admin-grid">

                        {[
                            [
                                "01",
                                "Programming",
                                "programming",
                            ],
                            [
                                "02",
                                "Frontend",
                                "frontend",
                            ],
                            [
                                "03",
                                "Backend",
                                "backend",
                            ],
                            [
                                "04",
                                "Database",
                                "database",
                            ],
                            [
                                "05",
                                "AI / ML",
                                "ai_ml",
                            ],
                            [
                                "06",
                                "Tools",
                                "tools",
                            ],
                        ].map(
                            ([
                                number,
                                title,
                                group,
                            ]) => (
                                <div
                                    className="technology-admin-card"
                                    key={group}
                                >

                                    <div className="technology-card-number">
                                        {number}
                                    </div>

                                    <h3>
                                        {title}
                                    </h3>

                                    <label>
                                        Technologies
                                    </label>

                                    <textarea
                                        rows="4"
                                        value={
                                            portfolio
                                                .technologies[
                                                group
                                            ].join(", ")
                                        }
                                        onChange={(event) =>
                                            handleTechnologyChange(
                                                group,
                                                event.target.value
                                            )
                                        }
                                    />

                                    <small>
                                        Separate items
                                        with commas.
                                    </small>

                                </div>
                            )
                        )}

                    </div>

                </section>

                {/* ========================================
                    CONTACT
                ======================================== */}

                <section
                    id="section-contact"
                    className="admin-section"
                >

                    <div className="section-heading">

                        <div>

                            <span>
                                05 / CONTACT
                            </span>

                            <h2>
                                Contact Information
                            </h2>

                        </div>

                        <p>
                            Manage your professional
                            contact links.
                        </p>

                    </div>

                    <div className="form-grid">

                        {[
                            ["Email", "email"],
                            ["LinkedIn", "linkedin"],
                            ["GitHub", "github"],
                            ["Resume", "resume"],
                        ].map(
                            ([label, field]) => (
                                <div
                                    className="form-group full-width"
                                    key={field}
                                >

                                    <label>
                                        {label}
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            portfolio.contact[field]
                                        }
                                        onChange={(event) =>
                                            handleChange(
                                                "contact",
                                                field,
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>
                            )
                        )}

                    </div>

                </section>

                {/* ========================================
                    APPEARANCE
                ======================================== */}

                <section
                    id="section-appearance"
                    className="admin-section appearance-section"
                >

                    <div className="section-heading">

                        <div>

                            <span>
                                06 / APPEARANCE
                                STUDIO
                            </span>

                            <h2>
                                Public Experience
                            </h2>

                        </div>

                        <p>
                            Change the visual identity
                            of the public portfolio.
                        </p>

                    </div>

                    {/* FRAME */}

                    <div className="appearance-card">

                        <div className="appearance-card-header">

                            <div>

                                <span>
                                    VISUAL FRAME
                                </span>

                                <h3>
                                    Choose Public
                                    Experience
                                </h3>

                            </div>

                            <div className="appearance-live-indicator">

                                <span></span>

                                LIVE CONFIGURATION

                            </div>

                        </div>

                        <div className="frame-selector">

                            {/* FRAME 01 */}

                            <button
                                type="button"
                                className={`frame-option ${
                                    portfolio.appearance.activeFrame ===
                                        "frame01"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleAppearanceChange(
                                        "activeFrame",
                                        "frame01"
                                    )
                                }
                            >

                                <div className="frame-preview frame-preview-one">

                                    <div className="preview-navbar"></div>

                                    <div className="preview-content">

                                        <div className="preview-line large"></div>

                                        <div className="preview-line"></div>

                                        <div className="preview-line short"></div>

                                        <div className="preview-button"></div>

                                    </div>

                                </div>

                                <div className="frame-option-info">

                                    <div>

                                        <strong>
                                            FRAME 01
                                        </strong>

                                        <span>
                                            Digital /
                                            Minimal
                                        </span>

                                    </div>

                                    {portfolio.appearance.activeFrame ===
                                        "frame01" && (
                                            <span className="selected-badge">
                                                ACTIVE
                                            </span>
                                        )}

                                </div>

                            </button>

                            {/* FRAME 02 */}

                            <button
                                type="button"
                                className={`frame-option ${
                                    portfolio.appearance.activeFrame ===
                                        "frame02"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleAppearanceChange(
                                        "activeFrame",
                                        "frame02"
                                    )
                                }
                            >

                                <div className="frame-preview frame-preview-two">

                                    <div className="preview-orbit"></div>

                                    <div className="preview-grid"></div>

                                    <div className="preview-content">

                                        <div className="preview-line large"></div>

                                        <div className="preview-line"></div>

                                        <div className="preview-card-row">

                                            <div></div>

                                            <div></div>

                                            <div></div>

                                        </div>

                                    </div>

                                </div>

                                <div className="frame-option-info">

                                    <div>

                                        <strong>
                                            FRAME 02
                                        </strong>

                                        <span>
                                            Immersive /
                                            Studio
                                        </span>

                                    </div>

                                    {portfolio.appearance.activeFrame ===
                                        "frame02" && (
                                            <span className="selected-badge">
                                                ACTIVE
                                            </span>
                                        )}

                                </div>

                            </button>

                            {/* FRAME 03 */}

                            <button
                                type="button"
                                className={`frame-option ${
                                    portfolio.appearance.activeFrame ===
                                        "frame03"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleAppearanceChange(
                                        "activeFrame",
                                        "frame03"
                                    )
                                }
                            >

                                <div className="frame-preview frame-preview-three">

                                    <div className="frame03-preview-terminal">

                                        <span>
                                            $ portfolio
                                        </span>

                                        <span className="frame03-preview-green">
                                            &gt; hello_world
                                        </span>

                                        <span>
                                            building simple things.
                                        </span>

                                    </div>

                                    <div className="frame03-preview-blocks">

                                        <div></div>

                                        <div></div>

                                        <div></div>

                                    </div>

                                </div>

                                <div className="frame-option-info">

                                    <div>

                                        <strong>
                                            FRAME 03
                                        </strong>

                                        <span>
                                            Simple / Green
                                        </span>

                                    </div>

                                    {portfolio.appearance.activeFrame ===
                                        "frame03" && (
                                            <span className="selected-badge">
                                                ACTIVE
                                            </span>
                                        )}

                                </div>

                            </button>

                        </div>

                    </div>

                    {/* WALLPAPER */}

                    <div className="appearance-card">

                        <div className="appearance-card-header">

                            <div>

                                <span>
                                    BACKGROUND SYSTEM
                                </span>

                                <h3>
                                    Wallpaper
                                </h3>

                            </div>

                            <label className="switch-control">

                                <input
                                    type="checkbox"
                                    checked={
                                        portfolio
                                            .appearance
                                            .backgroundEnabled
                                    }
                                    onChange={(event) =>
                                        handleAppearanceChange(
                                            "backgroundEnabled",
                                            event.target.checked
                                        )
                                    }
                                />

                                <span className="switch-slider"></span>

                            </label>

                        </div>

                        <div className="form-grid">

                            <div className="form-group full-width">

                                <label>
                                    Wallpaper Image URL
                                </label>

                                <input
                                    type="text"
                                    value={
                                        portfolio
                                            .appearance
                                            .backgroundImage
                                    }
                                    placeholder="https://example.com/image.jpg"
                                    onChange={(event) =>
                                        handleAppearanceChange(
                                            "backgroundImage",
                                            event.target.value
                                        )
                                    }
                                />

                                <small className="field-help">
                                    Paste a direct image
                                    URL.
                                </small>

                            </div>

                            <div className="form-group">

                                <label>
                                    Background Mode
                                </label>

                                <select
                                    value={
                                        portfolio
                                            .appearance
                                            .backgroundType
                                    }
                                    onChange={(event) =>
                                        handleAppearanceChange(
                                            "backgroundType",
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="default">
                                        Default Background
                                    </option>

                                    <option value="image">
                                        Wallpaper Image
                                    </option>

                                </select>

                            </div>

                            <div className="form-group">

                                <label>
                                    Background Size
                                </label>

                                <select
                                    value={
                                        portfolio
                                            .appearance
                                            .backgroundSize
                                    }
                                    onChange={(event) =>
                                        handleAppearanceChange(
                                            "backgroundSize",
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="cover">
                                        Cover
                                    </option>

                                    <option value="contain">
                                        Contain
                                    </option>

                                    <option value="auto">
                                        Original
                                    </option>

                                </select>

                            </div>

                            <div className="form-group">

                                <label>
                                    Position
                                </label>

                                <select
                                    value={
                                        portfolio
                                            .appearance
                                            .backgroundPosition
                                    }
                                    onChange={(event) =>
                                        handleAppearanceChange(
                                            "backgroundPosition",
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="center">
                                        Center
                                    </option>

                                    <option value="center top">
                                        Top
                                    </option>

                                    <option value="center bottom">
                                        Bottom
                                    </option>

                                    <option value="left center">
                                        Left
                                    </option>

                                    <option value="right center">
                                        Right
                                    </option>

                                </select>

                            </div>

                            <div className="form-group">

                                <label>
                                    Wallpaper Blur{" "}
                                    <span>
                                        {
                                            portfolio
                                                .appearance
                                                .backgroundBlur
                                        }
                                        px
                                    </span>
                                </label>

                                <input
                                    className="range-input"
                                    type="range"
                                    min="0"
                                    max="30"
                                    step="1"
                                    value={
                                        portfolio
                                            .appearance
                                            .backgroundBlur
                                    }
                                    onChange={(event) =>
                                        handleAppearanceChange(
                                            "backgroundBlur",
                                            Number(
                                                event.target.value
                                            )
                                        )
                                    }
                                />

                            </div>

                            <div className="form-group full-width">

                                <label>
                                    Overlay Darkness{" "}
                                    <span>
                                        {Math.round(
                                            portfolio
                                                .appearance
                                                .overlayOpacity *
                                            100
                                        )}
                                        %
                                    </span>
                                </label>

                                <input
                                    className="range-input"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={
                                        portfolio
                                            .appearance
                                            .overlayOpacity
                                    }
                                    onChange={(event) =>
                                        handleAppearanceChange(
                                            "overlayOpacity",
                                            Number(
                                                event.target.value
                                            )
                                        )
                                    }
                                />

                            </div>

                        </div>

                    </div>

                    {/* ANIMATION */}

                    <div className="appearance-card">

                        <div className="appearance-card-header">

                            <div>

                                <span>
                                    MOTION SYSTEM
                                </span>

                                <h3>
                                    Public Animations
                                </h3>

                            </div>

                            <label className="switch-control">

                                <input
                                    type="checkbox"
                                    checked={
                                        portfolio
                                            .appearance
                                            .animationsEnabled
                                    }
                                    onChange={(event) =>
                                        handleAppearanceChange(
                                            "animationsEnabled",
                                            event.target.checked
                                        )
                                    }
                                />

                                <span className="switch-slider"></span>

                            </label>

                        </div>

                        <p className="appearance-description">
                            Enable or disable
                            animations and visual
                            effects across the public
                            portfolio.
                        </p>

                    </div>

                    {/* STATUS */}

                    <div className="appearance-status-panel">

                        <div>

                            <span>
                                CURRENT FRAME
                            </span>

                            <strong>
                                {portfolio.appearance.activeFrame ===
                                    "frame03"
                                    ? "FRAME 03 — SIMPLE GREEN"
                                    : portfolio.appearance.activeFrame ===
                                        "frame02"
                                        ? "FRAME 02 — IMMERSIVE STUDIO"
                                        : "FRAME 01 — DIGITAL MINIMAL"}
                            </strong>

                        </div>

                        <div>

                            <span>
                                WALLPAPER
                            </span>

                            <strong>
                                {portfolio.appearance.backgroundEnabled &&
                                    portfolio.appearance.backgroundType ===
                                    "image"
                                    ? "ENABLED"
                                    : "DISABLED"}
                            </strong>

                        </div>

                        <div>

                            <span>
                                ANIMATION
                            </span>

                            <strong>
                                {portfolio.appearance.animationsEnabled
                                    ? "ENABLED"
                                    : "DISABLED"}
                            </strong>

                        </div>

                    </div>

                </section>

                {/* ========================================
                    FINAL SAVE
                ======================================== */}

                <div className="admin-final-save">

                    <div>

                        <span>
                            ALL CHANGES
                        </span>

                        <h3>
                            Ready to publish?
                        </h3>

                        <p>
                            Save your changes to
                            update the public
                            portfolio.
                        </p>

                    </div>

                    <button
                        className="save-button"
                        onClick={saveChanges}
                        disabled={saving}
                    >
                        {saving
                            ? "SAVING..."
                            : "SAVE & PUBLISH"}
                    </button>

                </div>

                <footer className="admin-footer">

                    <span>
                        PORTFOLIO ADMIN
                    </span>

                    <span>
                        DATABASE CONNECTED
                    </span>

                    <span>
                        PRIVATE CONTROL PANEL
                    </span>

                </footer>

            </main>

        </div>
    );
}

export default Admin;