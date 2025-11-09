import "@ahell/design-system";
import { html } from "lit";

// Canvas LMS API Configuration
// Note: You may need to change this URL based on your Canvas instance
// Common formats:
// - https://canvas.instructure.com/api/v1 (for canvas.instructure.com)
// - https://yourinstitution.instructure.com/api/v1 (for institution-specific instances)
// - https://yourinstitution.beta.instructure.com/api/v1 (for beta environments)
//
// IMPORTANT: Using backend proxy to avoid CORS restrictions.
const CANVAS_API_BASE = "http://localhost:3001/api/canvas";

// API helper function (now calling our backend proxy)
async function canvasApiRequest(endpoint, options = {}) {
  const url = `${CANVAS_API_BASE}${endpoint}`;
  console.log("Making API request to:", url, options.method || "GET");

  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("API response:", data);
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Fetch all available courses for the user
async function fetchCourses() {
  try {
    const courses = await canvasApiRequest(`/courses`);
    // Check if response contains errors
    if (courses.errors) {
      console.warn("Canvas API returned errors for courses:", courses.errors);
      return [];
    }
    return Array.isArray(courses) ? courses : [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

// Fetch groups for a specific course and category
async function fetchCourseGroupsByCategory(courseId, categoryName) {
  try {
    const groups = await canvasApiRequest(`/courses/${courseId}/groups`);
    // Check if response contains errors
    if (groups.errors) {
      console.warn("Canvas API returned errors for groups:", groups.errors);
      return [];
    }

    console.log("All groups received:", groups);
    console.log("Filtering by category:", categoryName);

    // Filter groups by category
    const filteredGroups = groups.filter((group) => {
      const categoryMatch = group.group_category?.name === categoryName;
      if (!categoryMatch) {
        console.log(
          `Group "${group.name}" has category "${group.group_category?.name}", not matching "${categoryName}"`
        );
      }
      return categoryMatch;
    });

    console.log("Filtered groups:", filteredGroups);

    return Array.isArray(filteredGroups) ? filteredGroups : [];
  } catch (error) {
    console.error("Error fetching groups by category:", error);
    return [];
  }
}

// Fetch group categories for a specific course
async function fetchCourseGroupCategories(courseId) {
  try {
    const categories = await canvasApiRequest(
      `/courses/${courseId}/group_categories`
    );
    // Check if response contains errors
    if (categories.errors) {
      console.warn(
        "Canvas API returned errors for group categories:",
        categories.errors
      );
      return [];
    }
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error("Error fetching group categories:", error);
    return [];
  }
}

// Fetch students for a specific course
async function fetchCourseStudents(courseId) {
  try {
    const students = await canvasApiRequest(`/courses/${courseId}/users`);
    // Check if response contains errors
    if (students.errors) {
      console.warn("Canvas API returned errors for students:", students.errors);
      return [];
    }
    return Array.isArray(students) ? students : [];
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}

// Initialize sidebar menu with items
async function initializeSidebarMenu() {
  const sidebarMenu = document.getElementById("sidebar-menu");
  const fallback = document.getElementById("sidebar-fallback");

  if (!sidebarMenu) {
    console.warn("Sidebar menu element not found");
    return;
  }

  console.log("Initializing sidebar menu...");

  // Fetch Canvas courses
  const courses = await fetchCourses();
  console.log("Fetched courses:", courses);

  // Sort courses: first by term (HT/VT + year), then by course code
  courses.sort((a, b) => {
    const fullTextA = (a.course_code || "") + " " + (a.name || "");
    const fullTextB = (b.course_code || "") + " " + (b.name || "");

    // Extract term info - supports both 2-digit (HT25) and 4-digit years (HT2025)
    const termRegex = /\b(HT|VT)(\d{2}|\d{4})\b/i;

    const matchA = fullTextA.match(termRegex);
    const matchB = fullTextB.match(termRegex);

    // If both have term info, compare terms
    if (matchA && matchB) {
      const [, semesterA, yearA] = matchA;
      const [, semesterB, yearB] = matchB;

      // Normalize years to 2-digit format (2016 -> 16, 25 -> 25)
      const normalizedYearA = yearA.length === 4 ? yearA.slice(-2) : yearA;
      const normalizedYearB = yearB.length === 4 ? yearB.slice(-2) : yearB;

      // Compare years (descending - newest first)
      if (normalizedYearA !== normalizedYearB) {
        return normalizedYearB.localeCompare(normalizedYearA);
      }

      // Same year - HT comes after VT (HT is fall, VT is spring)
      // HT25 > VT25 because HT25 is later in the year
      if (semesterA.toUpperCase() !== semesterB.toUpperCase()) {
        return semesterA.toUpperCase() === "HT" ? -1 : 1;
      }
    }

    // If only one has term info, prioritize it
    if (matchA && !matchB) return -1;
    if (!matchA && matchB) return 1;

    // Extract first course code (handles cases like "AI1525/AI1531")
    // Matches patterns like AI1108, DD1234, etc.
    const codeRegex = /\b([A-Z]{2}\d{4})\b/;

    const codeMatchA = fullTextA.match(codeRegex);
    const codeMatchB = fullTextB.match(codeRegex);

    const codeA = codeMatchA ? codeMatchA[1] : fullTextA;
    const codeB = codeMatchB ? codeMatchB[1] : fullTextB;

    // Sort by course code alphabetically (e.g., AI1108 before AI1147)
    return codeA.localeCompare(codeB);
  });

  // Group courses: Examinations (TEN1), Courses (with year), Other (no year)
  const examinationCourses = [];
  const regularCourses = [];
  const otherCourses = [];

  // Regex to detect year in course text
  const termRegex = /\b(HT|VT)(\d{2}|\d{4})\b/i;

  courses.forEach((course) => {
    const fullText = (course.course_code || "") + " " + (course.name || "");
    const submenuItem = {
      id: `course-${course.id}`,
      label: course.name || course.course_code || `Course ${course.id}`,
    };

    if (fullText.includes("TEN1")) {
      examinationCourses.push(submenuItem);
    } else if (termRegex.test(fullText)) {
      // Has a year (HT/VT + year)
      regularCourses.push(submenuItem);
    } else {
      // No year found
      otherCourses.push(submenuItem);
    }
  });

  // Define menu items with sections - using SVG icons as HTML strings
  const menuItems = [
    {
      id: "courses",
      label: "Courses",
      icon: "◧",
      submenu:
        regularCourses.length > 0
          ? regularCourses
          : [{ id: "courses-empty", label: "No courses found" }],
    },
    {
      id: "examinations",
      label: "Examinations",
      icon: "◪",
      submenu:
        examinationCourses.length > 0
          ? examinationCourses
          : [{ id: "exam-empty", label: "No examinations found" }],
    },
    {
      id: "other",
      label: "Other",
      icon: "◯",
      submenu:
        otherCourses.length > 0
          ? otherCourses
          : [{ id: "other-empty", label: "No other courses found" }],
    },
    {
      id: "teachers",
      label: "Teachers",
      icon: "👤",
      submenu: [{ id: "teachers-empty", label: "Select a course first" }],
    },
  ];

  console.log("Setting menu items:", menuItems);

  // Set the items and active item
  sidebarMenu.items = menuItems;
  sidebarMenu.activeItem = "courses";
  sidebarMenu.logoText = "Student Groups Management";
  // Optionally add a logo image:
  // sidebarMenu.logo = '/path/to/logo.png';

  console.log("Sidebar menu initialized with", menuItems.length, "items");

  // Hide fallback if component is working
  if (fallback) {
    setTimeout(() => {
      if (
        sidebarMenu.shadowRoot &&
        sidebarMenu.shadowRoot.children.length > 0
      ) {
        fallback.style.display = "none";
        console.log("Component rendered successfully, hiding fallback");
      } else {
        console.warn("Component may not have rendered properly");
      }
    }, 1000);
  }
}

// Initialize the app when custom elements are defined
async function initializeApp() {
  // Wait for the ds-table custom element to be defined
  await customElements.whenDefined("ds-table");
  await customElements.whenDefined("ds-input");
  await customElements.whenDefined("ds-button");
  await customElements.whenDefined("ds-select");
  await customElements.whenDefined("ds-tabs");
  await customElements.whenDefined("ds-sidebar-menu");

  // Small delay to ensure the element is fully rendered
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Initialize sidebar menu (now async to fetch courses)
  await initializeSidebarMenu();

  // Set up event listeners
  setupEventListeners();

  // Load available courses
  await loadAvailableCourses();

  // Show initial state
  showInitialState();
}

// Set up event listeners for the UI
function setupEventListeners() {
  const loadButton = document.getElementById("load-course-btn");
  const courseSelect = document.getElementById("course-select");
  const addCategoryBtn = document.getElementById("add-category-btn");

  if (loadButton) {
    loadButton.addEventListener("click", handleLoadCourse);
  }

  if (courseSelect) {
    // Store selected course ID when dropdown changes
    courseSelect.addEventListener("change", (event) => {
      // ds-select dispatches a CustomEvent with detail.value
      const selectedCourseId = event.detail?.value || event.target.value;
      // Store the selected value for later use
      courseSelect.setAttribute("data-selected-id", selectedCourseId);
    });
  }

  if (addCategoryBtn) {
    addCategoryBtn.addEventListener("click", handleAddCategory);
  }

  // Add sidebar menu event listener
  const sidebarMenu = document.getElementById("sidebar-menu");
  if (sidebarMenu) {
    sidebarMenu.addEventListener("menu-item-click", handleSidebarMenuClick);
  }
}

// Load available courses and populate the select dropdown
async function loadAvailableCourses() {
  const courseSelect = document.getElementById("course-select");

  if (!courseSelect) {
    console.warn("Course select element not found");
    return;
  }

  try {
    // Show loading state
    courseSelect.placeholder = "Loading courses...";
    courseSelect.disabled = true;
    courseSelect.options = [];

    const courses = await fetchCourses();

    if (courses.length === 0) {
      courseSelect.placeholder = "No courses found";
      courseSelect.disabled = true;
      return;
    }

    // Sort courses: first by term (HT/VT + year), then by course code
    courses.sort((a, b) => {
      const fullTextA = (a.course_code || "") + " " + (a.name || "");
      const fullTextB = (b.course_code || "") + " " + (b.name || "");

      // Extract term info - supports both 2-digit (HT25) and 4-digit years (HT2025)
      const termRegex = /\b(HT|VT)(\d{2}|\d{4})\b/i;

      const matchA = fullTextA.match(termRegex);
      const matchB = fullTextB.match(termRegex);

      // If both have term info, compare terms
      if (matchA && matchB) {
        const [, semesterA, yearA] = matchA;
        const [, semesterB, yearB] = matchB;

        // Normalize years to 2-digit format (2016 -> 16, 25 -> 25)
        const normalizedYearA = yearA.length === 4 ? yearA.slice(-2) : yearA;
        const normalizedYearB = yearB.length === 4 ? yearB.slice(-2) : yearB;

        // Compare years (descending - newest first)
        if (normalizedYearA !== normalizedYearB) {
          return normalizedYearB.localeCompare(normalizedYearA);
        }

        // Same year - HT comes after VT (HT is fall, VT is spring)
        // HT25 > VT25 because HT25 is later in the year
        if (semesterA.toUpperCase() !== semesterB.toUpperCase()) {
          return semesterA.toUpperCase() === "HT" ? -1 : 1;
        }
      }

      // If only one has term info, prioritize it
      if (matchA && !matchB) return -1;
      if (!matchA && matchB) return 1;

      // Extract first course code (handles cases like "AI1525/AI1531")
      // Matches patterns like AI1108, DD1234, etc.
      const codeRegex = /\b([A-Z]{2}\d{4})\b/;

      const codeMatchA = fullTextA.match(codeRegex);
      const codeMatchB = fullTextB.match(codeRegex);

      const codeA = codeMatchA ? codeMatchA[1] : fullTextA;
      const codeB = codeMatchB ? codeMatchB[1] : fullTextB;

      // Sort by course code alphabetically (e.g., AI1108 before AI1147)
      return codeA.localeCompare(codeB);
    });

    // Convert courses to options format for ds-select
    // Group courses: Examinations (TEN1), Courses (with year), Other (no year)
    const examinationCourses = [];
    const regularCourses = [];
    const otherCourses = [];

    // Regex to detect year in course text
    const termRegex = /\b(HT|VT)(\d{2}|\d{4})\b/i;

    courses.forEach((course) => {
      const fullText = (course.course_code || "") + " " + (course.name || "");
      const option = {
        value: course.id.toString(),
        label: course.name || course.course_code || `Course ${course.id}`,
      };

      if (fullText.includes("TEN1")) {
        examinationCourses.push(option);
      } else if (termRegex.test(fullText)) {
        // Has a year (HT/VT + year)
        regularCourses.push(option);
      } else {
        // No year found
        otherCourses.push(option);
      }
    });

    // Build options array with groups
    const options = [];

    // Add Courses group first (regular courses with years)
    if (regularCourses.length > 0) {
      options.push({
        group: "Courses",
        options: regularCourses,
      });
    }

    // Add Examinations group second
    if (examinationCourses.length > 0) {
      options.push({
        group: "Examinations",
        options: examinationCourses,
      });
    }

    // Add Other group last (courses without years)
    if (otherCourses.length > 0) {
      options.push({
        group: "Other",
        options: otherCourses,
      });
    }

    courseSelect.options = options;
    courseSelect.placeholder = "Select a course...";
    courseSelect.disabled = false;
  } catch (error) {
    console.error("Error loading courses:", error);
    courseSelect.placeholder = "Error loading courses";
    courseSelect.disabled = true;
    courseSelect.options = [];
  }
}

// Handle the load course button click
async function handleLoadCourse() {
  const courseSelect = document.getElementById("course-select");
  const loadButton = document.getElementById("load-course-btn");

  if (!courseSelect || !loadButton) return;

  const courseId =
    courseSelect.value || courseSelect.getAttribute("data-selected-id");

  if (!courseId) {
    alert("Please select a course from the dropdown");
    return;
  }

  // Show loading state
  loadButton.disabled = true;

  try {
    await loadCourseCategories(parseInt(courseId));
  } catch (error) {
    console.error("Error loading course categories:", error);
    alert(
      "Error loading course categories. Please check the course and try again."
    );
  } finally {
    // Reset button state
    loadButton.disabled = false;
  }
}

// Handle adding a new group category
async function handleAddCategory() {
  if (!currentCourseId) {
    alert("No course selected");
    return;
  }

  const categoryName = prompt("Enter the name for the new group category:");

  if (!categoryName || categoryName.trim() === "") {
    return; // User cancelled or entered empty name
  }

  const categoryDescription = prompt("Enter a description (optional):", "");

  const addCategoryBtn = document.getElementById("add-category-btn");

  try {
    // Disable button during creation
    if (addCategoryBtn) {
      addCategoryBtn.disabled = true;
      addCategoryBtn.textContent = "Creating...";
    }

    const response = await fetch(
      `http://localhost:3001/api/canvas/courses/${currentCourseId}/group_categories`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: categoryName.trim(),
          description: categoryDescription?.trim() || "",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create group category");
    }

    const newCategory = await response.json();

    alert(`Group category "${categoryName}" created successfully!`);

    // Reload the course categories to show the new one
    await loadCourseCategories(currentCourseId);
  } catch (error) {
    console.error("Error creating group category:", error);
    alert(`Error creating group category: ${error.message}`);
  } finally {
    // Reset button state
    if (addCategoryBtn) {
      addCategoryBtn.disabled = false;
      addCategoryBtn.textContent = "+ Add Category";
    }
  }
}

// Handle sidebar menu item clicks
async function handleSidebarMenuClick(event) {
  const { id, item } = event.detail;
  console.log("Sidebar menu clicked:", id, item);

  // If a course submenu item is clicked, load its group categories
  if (id && id.startsWith("course-")) {
    const courseId = parseInt(id.replace("course-", ""), 10);
    if (!isNaN(courseId)) {
      await loadCourseCategories(courseId);

      // Also fetch and update teachers for this course
      await updateTeachersSubmenu(courseId);
    }
  }

  // If a teacher submenu item is clicked, display teacher contact card
  if (id && id.startsWith("teacher-")) {
    const teacherId = parseInt(id.replace("teacher-", ""), 10);
    if (!isNaN(teacherId)) {
      displayTeacherCard(teacherId);
    }
  }

  // You could implement additional navigation logic here, for example:
  // - Dashboard: show overview/stats
  // - Admin/Settings: show settings
  // - Admin/Users: show user management
}

// Store current teachers data for access when teacher is clicked
let currentTeachers = [];

// Update the Teachers submenu with teachers from the selected course
async function updateTeachersSubmenu(courseId) {
  const sidebarMenu = document.getElementById("sidebar-menu");
  if (!sidebarMenu) return;

  try {
    // Fetch teachers for the selected course
    const teachers = await canvasApiRequest(
      `/courses/${courseId}/users?enrollment_type=teacher`
    );

    // Store teachers data globally
    currentTeachers = Array.isArray(teachers) ? teachers : [];

    const teacherItems =
      currentTeachers.length > 0
        ? currentTeachers
            .map((teacher) => ({
              id: `teacher-${teacher.id}`,
              label:
                teacher.name ||
                teacher.sortable_name ||
                `Teacher ${teacher.id}`,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        : [{ id: "teachers-empty", label: "No teachers found" }];

    // Update the Teachers submenu
    const currentItems = sidebarMenu.items;
    const updatedItems = currentItems.map((item) => {
      if (item.id === "teachers") {
        return {
          ...item,
          submenu: teacherItems,
        };
      }
      return item;
    });

    sidebarMenu.items = updatedItems;
    console.log("Updated teachers submenu for course", courseId);
  } catch (error) {
    console.error("Error fetching teachers for course:", error);
  }
}

// Display teacher contact card
function displayTeacherCard(teacherId) {
  const teacher = currentTeachers.find((t) => t.id === teacherId);

  if (!teacher) {
    console.error("Teacher not found:", teacherId);
    return;
  }

  const groupsOverview = document.getElementById("groups-overview");
  if (!groupsOverview) return;

  const teacherName =
    teacher.name || teacher.sortable_name || `Teacher ${teacher.id}`;
  const teacherEmail =
    teacher.email || teacher.login_id || "No email available";
  const avatarUrl = teacher.avatar_url || "";

  const cardHTML = `
    <ds-card variant="default">
      <ds-card-header
        title="Send Email to Teacher"
        meta="${teacherName}"
      ></ds-card-header>
      <ds-card-content>
        <ds-stack gap="4">
          ${
            avatarUrl
              ? `
            <div style="text-align: center;">
              <img 
                src="${avatarUrl}" 
                alt="${teacherName}" 
                style="
                  width: 80px; 
                  height: 80px; 
                  border-radius: 50%; 
                  object-fit: cover;
                  border: 3px solid var(--color-border);
                "
              />
            </div>
          `
              : ""
          }
          
          <div style="
            padding: var(--space-3);
            background: var(--color-surface-secondary);
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
          ">
            <div style="
              font-size: var(--text-sm);
              color: var(--color-text-secondary);
              margin-bottom: var(--space-1);
            ">
              To:
            </div>
            <div style="
              font-size: var(--text-base);
              font-weight: var(--weight-medium);
              color: var(--color-text-primary);
              word-break: break-word;
            ">
              ${teacherEmail}
            </div>
          </div>

          <form id="teacher-email-form" style="display: contents;">
            <ds-stack gap="3">
              <div>
                <label style="
                  display: block;
                  font-size: var(--text-sm);
                  font-weight: var(--weight-medium);
                  color: var(--color-text-primary);
                  margin-bottom: var(--space-2);
                ">
                  Subject
                </label>
                <ds-input
                  id="email-subject"
                  type="text"
                  placeholder="Enter email subject"
                  required
                  style="width: 100%;"
                ></ds-input>
              </div>

              <div>
                <label style="
                  display: block;
                  font-size: var(--text-sm);
                  font-weight: var(--weight-medium);
                  color: var(--color-text-primary);
                  margin-bottom: var(--space-2);
                ">
                  Message
                </label>
                <ds-textarea
                  id="email-message"
                  placeholder="Type your message here..."
                  rows="8"
                  required
                  style="width: 100%;"
                ></ds-textarea>
              </div>

              <div id="email-status" style="display: none;"></div>

              <ds-flex gap="2">
                <ds-button 
                  id="send-email-btn"
                  variant="primary" 
                  size="md"
                  style="flex: 1;"
                >
                  📧 Send Email
                </ds-button>
                <ds-button 
                  id="clear-email-form"
                  variant="outline" 
                  size="md"
                  style="flex: 1;"
                >
                  �️ Clear
                </ds-button>
              </ds-flex>
            </ds-stack>
          </form>

          ${
            teacher.bio
              ? `
            <div style="
              padding: var(--space-3);
              border-left: 3px solid var(--color-primary-main);
              background: var(--color-surface-secondary);
              border-radius: var(--radius-sm);
              margin-top: var(--space-2);
            ">
              <div style="
                font-size: var(--text-sm);
                font-weight: var(--weight-semibold);
                color: var(--color-text-secondary);
                margin-bottom: var(--space-2);
              ">
                About
              </div>
              <div style="
                font-size: var(--text-sm);
                color: var(--color-text-primary);
                line-height: 1.6;
              ">
                ${teacher.bio}
              </div>
            </div>
          `
              : ""
          }
        </ds-stack>
      </ds-card-content>
    </ds-card>
  `;

  groupsOverview.innerHTML = cardHTML;
  groupsOverview.style.display = "block";

  // Setup form handlers
  const form = document.getElementById("teacher-email-form");
  const sendBtn = document.getElementById("send-email-btn");
  const clearBtn = document.getElementById("clear-email-form");
  const subjectInput = document.getElementById("email-subject");
  const messageInput = document.getElementById("email-message");
  const statusDiv = document.getElementById("email-status");

  // Send email handler
  async function handleSendEmail() {
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!subject || !message) {
      showEmailStatus("error", "Please fill in both subject and message");
      return;
    }

    // Show sending status
    showEmailStatus("info", "Sending email...");

    try {
      // Send message via Canvas Conversations API
      const response = await fetch(`${CANVAS_API_BASE}/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: [String(teacher.id)], // Canvas expects user IDs as strings
          subject: subject,
          body: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to send email: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Email sent successfully:", result);

      // Success
      showEmailStatus("success", `Email sent to ${teacherName}!`);

      // Clear form after successful send
      setTimeout(() => {
        subjectInput.value = "";
        messageInput.value = "";
        statusDiv.style.display = "none";
      }, 3000);
    } catch (error) {
      console.error("Error sending email:", error);
      showEmailStatus("error", `Failed to send email: ${error.message}`);
    }
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", handleSendEmail);
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await handleSendEmail();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      subjectInput.value = "";
      messageInput.value = "";
      statusDiv.style.display = "none";
    });
  }

  function showEmailStatus(type, message) {
    const variants = {
      success: "success",
      error: "error",
      info: "info",
    };

    statusDiv.innerHTML = `
      <ds-alert variant="${
        variants[type] || "info"
      }" title="${message}"></ds-alert>
    `;
    statusDiv.style.display = "block";
  }

  console.log("Displayed teacher card for:", teacherName);
}

// Handle adding a new group to a category
async function handleAddGroup(categoryName) {
  if (!currentCourseId) {
    alert("No course selected");
    return;
  }

  // First, we need to get the category ID from the category name
  try {
    const categories = await canvasApiRequest(
      `/courses/${currentCourseId}/group_categories`
    );
    const category = categories.find(
      (cat) => cat.name === categoryName || cat.id === categoryName
    );

    if (!category) {
      alert(`Could not find category: ${categoryName}`);
      return;
    }

    const groupName = prompt("Enter the name for the new group:");

    if (!groupName || groupName.trim() === "") {
      return; // User cancelled or entered empty name
    }

    const groupDescription = prompt("Enter a description (optional):", "");

    // Show loading state
    const addGroupBtn = document.querySelector("#add-group-btn");
    if (addGroupBtn) {
      addGroupBtn.disabled = true;
      addGroupBtn.textContent = "Creating...";
    }

    const response = await fetch(
      `http://localhost:3001/api/canvas/group_categories/${category.id}/groups`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName.trim(),
          description: groupDescription?.trim() || "",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create group");
    }

    const newGroup = await response.json();

    alert(`Group "${groupName}" created successfully!`);

    // Reload the category content to show the new group
    await loadCategoryContent(categoryName);
  } catch (error) {
    console.error("Error creating group:", error);
    alert(`Error creating group: ${error.message}`);

    // Reset button state
    const addGroupBtn = document.querySelector("#add-group-btn");
    if (addGroupBtn) {
      addGroupBtn.disabled = false;
      addGroupBtn.textContent = "+ Add Group";
    }
  }
}

// Show initial empty state
function showInitialState() {
  const courseCardHeader = document.getElementById("course-card-header");
  const table = document.getElementById("students-table");
  const groupsOverview = document.getElementById("groups-overview");
  const filterSection = document.getElementById("filter-section");
  const categoryRadioGroup = document.getElementById("category-radio-group");
  const categoryContent = document.getElementById("category-content");
  const groupCategoriesCard = document.getElementById("group-categories-card");

  if (courseCardHeader) {
    courseCardHeader.title = "Group Categories";
    courseCardHeader.meta =
      "Select a course above to load student group assignments";
  }

  if (table) {
    table.data = [];
  }

  if (groupsOverview) {
    groupsOverview.innerHTML = "";
    groupsOverview.style.display = "none";
  }

  if (filterSection) {
    filterSection.style.display = "none";
  }

  if (categoryRadioGroup) {
    categoryRadioGroup.style.display = "none";
  }

  if (categoryContent) {
    categoryContent.style.display = "none";
  }

  if (groupCategoriesCard) {
    groupCategoriesCard.style.display = "none";
  }
}

// Function to load course categories and display tabs
async function loadCourseCategories(courseId) {
  const courseCardHeader = document.getElementById("course-card-header");
  const categoryRadioGroup = document.getElementById("category-radio-group");
  const categoryContent = document.getElementById("category-content");
  const groupsOverview = document.getElementById("groups-overview");
  const groupCategoriesCard = document.getElementById("group-categories-card");

  try {
    // Show card with loading spinner
    if (groupCategoriesCard) {
      groupCategoriesCard.style.display = "block";
    }

    // Show loading state with spinner
    if (courseCardHeader) {
      courseCardHeader.title = "Group Categories";
      courseCardHeader.meta = "Loading course information...";
    }
    if (categoryRadioGroup) {
      categoryRadioGroup.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; padding: var(--space-8);">
          <div style="display: inline-block; width: 48px; height: 48px; border: 4px solid var(--color-border-primary); border-top: 4px solid var(--color-primary-main); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
      `;
      categoryRadioGroup.style.display = "block";
    }
    if (categoryContent) {
      categoryContent.style.display = "none";
    }
    if (groupsOverview) {
      groupsOverview.innerHTML = "";
      groupsOverview.style.display = "none";
    }

    // Fetch categories for the course
    const categories = await fetchCourseGroupCategories(courseId);

    // Get course name
    let courseName = `Course ID: ${courseId}`;
    try {
      const courseDetails = await canvasApiRequest(`/courses/${courseId}`);
      if (!courseDetails.errors) {
        courseName =
          courseDetails.name ||
          courseDetails.course_code ||
          `Course ID: ${courseId}`;
      }
    } catch (courseError) {
      console.warn("Could not fetch course details:", courseError);
    }

    // Update course title
    if (courseCardHeader) {
      courseCardHeader.title = "Group Categories";
      courseCardHeader.meta = courseName;
    }

    // Store current course ID for tab clicks
    currentCourseId = courseId;

    // Display category tabs
    displayCategoryTabs(categories);

    // Show the Add Category button
    const addCategoryBtn = document.getElementById("add-category-btn");
    if (addCategoryBtn) {
      addCategoryBtn.style.display = "block";
    }

    // Show the card now that data is loaded
    if (groupCategoriesCard) {
      groupCategoriesCard.style.display = "block";
    }
  } catch (error) {
    console.error("Error loading course categories:", error);

    // Keep card hidden on error
    if (groupCategoriesCard) {
      groupCategoriesCard.style.display = "none";
    }

    // Show error state
    if (courseCardHeader) {
      courseCardHeader.title = "Group Categories";
      courseCardHeader.meta = "Error loading categories - please try again";
    }
    if (categoryRadioGroup) {
      categoryRadioGroup.style.display = "none";
    }
    if (categoryContent) {
      categoryContent.style.display = "none";
    }
    if (groupsOverview) {
      groupsOverview.innerHTML = "";
      groupsOverview.style.display = "none";
    }
  }
}

// Function to display category tabs
function displayCategoryTabs(categories) {
  const categoryRadioGroup = document.getElementById("category-radio-group");
  const categoryContent = document.getElementById("category-content");
  const groupsOverview = document.getElementById("groups-overview");

  if (!categoryRadioGroup || !categoryContent) return;

  if (categories.length === 0) {
    categoryContent.innerHTML = `
      <ds-alert variant="info" title="No Categories">
        No group categories found for this course.
      </ds-alert>
    `;
    categoryContent.style.display = "block";
    categoryRadioGroup.style.display = "none";
    if (groupsOverview) {
      groupsOverview.innerHTML = "";
      groupsOverview.style.display = "none";
    }
    return;
  }

  // Create radio buttons for each category
  categoryRadioGroup.innerHTML = "";
  categoryRadioGroup.label = "Select a group category";
  categoryRadioGroup.orientation = "horizontal";

  categories.forEach((category, index) => {
    const radio = document.createElement("ds-radio");
    // Handle both string categories (legacy) and object categories
    const categoryName =
      typeof category === "string" ? category : category.name;
    const categoryId = typeof category === "string" ? category : category.id;
    radio.value = categoryName;
    radio.label = categoryName;
    radio.size = "sm";
    radio.setAttribute("data-category-id", categoryId);
    if (index === 0) {
      radio.checked = true;
    }
    categoryRadioGroup.appendChild(radio);
  });

  // Show radio group
  categoryRadioGroup.style.display = "block";
  categoryContent.style.display = "block";

  // Hide groups overview initially
  if (groupsOverview) {
    groupsOverview.innerHTML = "";
    groupsOverview.style.display = "none";
  }

  // Add event listener for category changes
  categoryRadioGroup.removeEventListener("change", handleCategoryChange);
  categoryRadioGroup.addEventListener("change", handleCategoryChange);

  // Store current course ID for category clicks
  currentCourseId = currentCourseId;

  // Load first category by default
  if (categories.length > 0) {
    const firstCategory =
      typeof categories[0] === "string" ? categories[0] : categories[0].name;
    loadCategoryContent(firstCategory);
  }
}

// Handle category change events from radio group
function handleCategoryChange(event) {
  const categoryName = event.target.value;
  loadCategoryContent(categoryName);
}

// Load content for a specific category
async function loadCategoryContent(categoryName) {
  const categoryContent = document.getElementById("category-content");

  if (!categoryContent) return;

  try {
    // Show loading state
    categoryContent.innerHTML = `
      <ds-stack gap="4" align="center" style="padding: var(--space-8); text-align: center;">
        <div style="display: inline-block; width: 48px; height: 48px; border: 4px solid var(--color-border-primary); border-top: 4px solid var(--color-primary-main); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="color: var(--color-text-secondary);">Loading groups and students...</p>
      </ds-stack>
    `;

    // Fetch groups for this category
    const groups = await fetchCourseGroupsByCategory(
      currentCourseId,
      categoryName
    );

    // Fetch all students in the course
    const allStudents = await fetchCourseStudents(currentCourseId);

    // Fetch members for each group
    const groupsWithMembers = await Promise.all(
      groups.map(async (group) => {
        const members = await fetchGroupMembers(group.id);
        return {
          ...group,
          members: members.map((m) => ({
            id: m.user_id,
            membershipId: m.id, // Canvas membership ID needed for deletion
            name:
              allStudents.find((s) => s.id === m.user_id)?.name ||
              `User ${m.user_id}`,
            sortable_name:
              allStudents.find((s) => s.id === m.user_id)?.sortable_name || "",
          })),
        };
      })
    );

    // Find unassigned students
    const assignedStudentIds = new Set();
    groupsWithMembers.forEach((group) => {
      group.members.forEach((member) => assignedStudentIds.add(member.id));
    });

    const unassignedStudents = allStudents
      .filter((student) => !assignedStudentIds.has(student.id))
      .map((student) => ({
        id: student.id,
        name: student.name,
        sortable_name: student.sortable_name || student.name,
      }))
      .sort((a, b) => a.sortable_name.localeCompare(b.sortable_name));

    // Generate and display drag-and-drop interface
    const content = generateDragDropGroupsInterface(
      groupsWithMembers,
      unassignedStudents,
      categoryName
    );
    categoryContent.innerHTML = content;

    // Wait for DOM to update, then attach event listeners
    setTimeout(() => {
      setupDragDropHandlers(categoryName);
      setupGroupSelectionHandlers(categoryName);
    }, 100);
  } catch (error) {
    console.error("Error loading groups for category:", error);

    // Show error state
    categoryContent.innerHTML = `
      <ds-alert variant="error" title="Error Loading Groups">
        Failed to load groups for this category. Please try again.
      </ds-alert>
    `;
  }
}

// Function to generate groups display with selection controls
function generateGroupsContent(groups, categoryName) {
  if (groups.length === 0) {
    return `<ds-alert variant="info" title="No Groups Found">No groups found in the "${categoryName}" category.</ds-alert>`;
  }

  // Create groups display with filter controls
  let html = `
    <ds-card>
      <ds-card-header
        title="${categoryName} Groups"
        meta="${groups.length} group${groups.length === 1 ? "" : "s"}"
      >
        <ds-inline slot="stats" gap="2">
          <ds-button size="sm" variant="warning" class="select-all-btn" data-category="${categoryName}">
            Select All
          </ds-button>
          <ds-button size="sm" variant="warning" class="deselect-all-btn" data-category="${categoryName}">
            Deselect All
          </ds-button>
        </ds-inline>
      </ds-card-header>
      <ds-card-content>
        <ds-grid auto-fit min-width="280px" gap="lg" class="groups-grid">`;

  groups.forEach((group) => {
    const memberCount = group.members_count || 0;
    const memberText =
      memberCount === 1 ? "1 member" : `${memberCount} members`;

    html += `
            <ds-card variant="secondary" class="group-card" data-group-id="${
              group.id
            }" interactive style="cursor: pointer; transition: var(--transition-all);">
              <ds-card-content>
                <ds-stack gap="3">
                  <ds-inline align="start" gap="3">
                    <ds-checkbox 
                      size="sm"
                      class="group-checkbox" 
                      data-group-id="${group.id}" 
                      data-group-name="${group.name}"
                    ></ds-checkbox>
                    <ds-stack gap="1" style="flex: 1;">
                      <div style="font-weight: var(--weight-semibold); font-size: var(--text-base); color: var(--color-text-primary);">
                        ${group.name}
                      </div>
                      <div style="font-size: var(--text-sm); color: var(--color-text-secondary);">
                        ${memberText}
                      </div>
                    </ds-stack>
                  </ds-inline>
                  ${
                    group.description
                      ? `
                  <div style="font-size: var(--text-sm); color: var(--color-text-secondary); padding-top: var(--space-2); border-top: 1px solid var(--color-border);">
                    ${group.description}
                  </div>
                  `
                      : ""
                  }
                </ds-stack>
              </ds-card-content>
            </ds-card>`;
  });

  html += `
        </ds-grid>
        
        <div style="
          margin-top: var(--space-6);
          padding-top: var(--space-6);
          border-top: 1px solid var(--color-border-primary);
        ">
          <ds-flex justify="space-between" align="start" gap="4">
            <ds-stack gap="2" style="flex: 1; min-width: 0;">
              <div style="font-weight: var(--weight-semibold); color: var(--color-text-primary);">
                Selected Groups
              </div>
              <ds-inline class="selected-groups-list" gap="2" wrap="true">
                <span style="color: var(--color-text-secondary); font-size: var(--text-sm);">
                  None selected
                </span>
              </ds-inline>
            </ds-stack>
            <ds-button 
              size="sm" 
              variant="primary" 
              class="apply-selection-btn" 
              data-category="${categoryName}" 
              disabled 
              style="flex-shrink: 0;"
            >
              Apply Selection
            </ds-button>
          </ds-flex>
        </div>
      </ds-card-content>
    </ds-card>
  `;

  return html;
}

// Generate drag-and-drop interface for managing group memberships
function generateDragDropGroupsInterface(
  groups,
  unassignedStudents,
  categoryName
) {
  return `
    <ds-card>
      <ds-card-header
        title="Övningsgrupper - ${categoryName}"
        meta="Drag students between groups and unassigned list"
      >
        <ds-button
          slot="stats"
          id="add-group-btn"
          size="sm"
          variant="primary"
          data-category="${categoryName}"
        >
          + Add Group
        </ds-button>
      </ds-card-header>
      <ds-card-content>
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: var(--space-6); align-items: stretch;">
          <!-- First Column: Unassigned Students -->
          <div>
            <!-- Unassigned Students Card -->
            <ds-card 
              variant="secondary" 
              class="drop-zone unassigned-card" 
              data-zone-type="unassigned"
              style="display: flex; flex-direction: column; overflow: visible;"
            >
              <ds-card-content style="display: flex; flex-direction: column; gap: var(--space-3); overflow: visible; flex: 1; min-height: 0;">
                <ds-stack gap="3" style="flex-shrink: 0; overflow: visible;">
                  <div style="font-weight: var(--weight-semibold); font-size: var(--text-sm); color: var(--color-text-secondary);">
                    Unassigned Students (${unassignedStudents.length})
                  </div>
                  <ds-input
                    id="unassigned-search"
                    type="text"
                    size="sm"
                    placeholder="Search students..."
                    style="width: 100%;"
                  ></ds-input>
                </ds-stack>
                <ds-stack 
                  gap="2" 
                  class="unassigned-zone" 
                  style="
                    flex: 1;
                    min-height: 0;
                    align-content: flex-start;
                    padding: var(--space-2) 0;
                    overflow-y: auto;
                    transition: all 0.2s ease;
                  "
                >
                  ${
                    unassignedStudents.length === 0
                      ? '<div style="color: var(--color-text-secondary); font-size: var(--text-sm); text-align: center; padding: var(--space-4);">All students are assigned to groups</div>'
                      : unassignedStudents
                          .map(
                            (student) => `
                        <div
                          draggable="true"
                          class="student-badge draggable-student"
                          data-student-id="${student.id}"
                          data-student-name="${student.name}"
                          data-student-sortable-name="${student.sortable_name}"
                          data-current-group="unassigned"
                          style="
                            cursor: move;
                            transition: all 0.2s ease;
                          "
                        >
                          <ds-badge variant="default" size="md">
                            ${student.name}
                          </ds-badge>
                        </div>
                      `
                          )
                          .join("")
                  }
                </ds-stack>
              </ds-card-content>
            </ds-card>
          </div>
          
          <!-- Second Column: Groups -->
          <div style="display: flex; flex-direction: column; min-width: 0;">
            <!-- Group Selection Controls -->
            <ds-card variant="secondary" style="margin-bottom: var(--space-3);">
              <ds-card-content>
                <ds-stack gap="3">
                  <div style="font-weight: var(--weight-semibold); font-size: var(--text-sm); color: var(--color-text-secondary);">
                    Select Groups
                  </div>
                  <ds-flex gap="2" wrap>
                    <ds-button size="sm" variant="outline" class="select-all-btn">
                      Select All
                    </ds-button>
                    <ds-button size="sm" variant="outline" class="deselect-all-btn">
                      Deselect All
                    </ds-button>
                    <ds-button size="sm" variant="primary" class="apply-selection-btn" disabled>
                      View Members
                    </ds-button>
                  </ds-flex>
                  <div>
                    <div style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: var(--space-2);">
                      Selected Groups:
                    </div>
                    <div class="selected-groups-list" style="min-height: 24px; display: flex; flex-wrap: wrap; gap: var(--space-1); align-items: center;">
                      <span style="color: var(--color-text-secondary); font-size: var(--text-sm);">None</span>
                    </div>
                  </div>
                </ds-stack>
              </ds-card-content>
            </ds-card>
            
            <ds-grid cols="2" gap="sm" style="overflow-y: auto;">
              ${
                groups.length === 0
                  ? '<ds-alert variant="info" title="No Groups">No groups found in this category.</ds-alert>'
                  : groups
                      .map(
                        (group) => `
                <ds-card variant="secondary" class="group-container group-card drop-zone" data-group-id="${
                  group.id
                }" data-zone-type="group" data-group-name="${
                          group.name
                        }" style="min-width: 0; max-width: 100%; box-sizing: border-box; overflow: hidden;">
                  <ds-card-content>
                    <ds-flex justify="space-between" align="center" data-role="group-header" style="margin-bottom: var(--space-4);">
                      <ds-flex align="center" gap="2">
                        <ds-checkbox 
                          size="sm"
                          class="group-checkbox" 
                          data-group-id="${group.id}" 
                          data-group-name="${group.name}"
                        ></ds-checkbox>
                        <div 
                          class="group-name-display"
                          style="
                            font-weight: var(--weight-semibold);
                            font-size: var(--text-sm);
                            color: var(--color-text-secondary);
                            cursor: pointer;
                          "
                          data-group-id="${group.id}"
                        >
                          ${group.name} (${group.members.length})
                        </div>
                      </ds-flex>
                      <ds-flex gap="1" style="margin-left: var(--space-3);">
                        <ds-button 
                          size="sm" 
                          variant="ghost"
                          class="edit-group-btn"
                          data-group-id="${group.id}"
                        >
                          Edit
                        </ds-button>
                        <ds-button 
                          size="sm" 
                          variant="ghost"
                          class="toggle-group-btn"
                          data-group-id="${group.id}"
                        >
                          <span class="toggle-text">Expand</span>
                        </ds-button>
                      </ds-flex>
                    </ds-flex>
                    
                    <ds-inline 
                      gap="2"
                      wrap
                      class="group-members drop-zone"
                      data-group-id="${group.id}"
                      data-zone-type="group"
                      style="
                        display: none;
                        min-height: 40px;
                        padding: var(--space-3);
                        background: var(--color-surface);
                        border-radius: var(--radius-sm);
                        border: 2px dashed var(--color-border);
                        transition: all 0.2s ease;
                        margin-top: var(--space-3);
                      "
                    >
                      ${
                        group.members.length === 0
                          ? ""
                          : group.members
                              .map(
                                (member) => `
                          <div
                            draggable="true"
                            class="student-badge draggable-student"
                            data-student-id="${member.id}"
                            data-membership-id="${member.membershipId}"
                            data-student-name="${member.name}"
                            data-student-sortable-name="${member.sortable_name}"
                            data-current-group="${group.id}"
                            data-group-id="${group.id}"
                            style="
                              cursor: move;
                              transition: all 0.2s ease;
                            "
                          >
                            <ds-badge variant="primary" size="md" removable>
                              ${member.name}
                            </ds-badge>
                          </div>
                        `
                              )
                              .join("")
                      }
                    </ds-inline>
                  </ds-card-content>
                </ds-card>
              `
                      )
                      .join("")
              }
            </ds-grid>
          </div>
        </div>
      </ds-card-content>
    </ds-card>
  `;
}

// Fetch members for a specific group
async function fetchGroupMembers(groupId) {
  try {
    const members = await canvasApiRequest(`/groups/${groupId}/memberships`);
    if (members.errors) {
      console.warn(
        "Canvas API returned errors for group members:",
        members.errors
      );
      return [];
    }
    return Array.isArray(members) ? members : [];
  } catch (error) {
    console.error("Error fetching group members:", error);
    return [];
  }
}

// Display group members in a many-to-many table
async function displayGroupMembersTable(selectedGroups, categoryName) {
  const groupsOverview = document.getElementById("groups-overview");
  if (!groupsOverview) return;

  // Show loading state
  groupsOverview.innerHTML = `
    <ds-card>
      <ds-card-content style="text-align: center;">
        <ds-stack gap="4" align="center">
          <div style="display: inline-block; width: 48px; height: 48px; border: 4px solid var(--color-border-primary); border-top: 4px solid var(--color-primary-main); border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="color: var(--color-text-secondary);">Loading group members...</p>
        </ds-stack>
      </ds-card-content>
    </ds-card>
  `;
  groupsOverview.style.display = "block";

  try {
    // First, fetch all course users to get email addresses
    const courseUsers = await canvasApiRequest(
      `/courses/${currentCourseId}/users?enrollment_type=student&per_page=100`
    );
    const userMap = new Map();
    courseUsers.forEach((user) => {
      userMap.set(user.id, {
        name: user.name || user.sortable_name || `User ${user.id}`,
        email: user.email || user.login_id || "",
      });
    });

    console.log("Course users loaded:", userMap.size, "users");

    // Fetch ALL groups for the course (not just selected groups)
    const allGroups = await canvasApiRequest(
      `/courses/${currentCourseId}/groups?include[]=group_category`
    );

    // Get all unique categories
    const categoriesSet = new Set();
    allGroups.forEach((group) => {
      if (group.group_category?.name) {
        categoriesSet.add(group.group_category.name);
      }
    });
    const allCategories = Array.from(categoriesSet).sort();

    console.log("All categories:", allCategories);

    // Fetch members for all selected groups
    const groupsWithMembers = await Promise.all(
      selectedGroups.map(async (group) => {
        const members = await fetchGroupMembers(group.id);
        return {
          ...group,
          members: members,
        };
      })
    );

    console.log("Selected groups with members:", groupsWithMembers);

    // Create a map of student -> groups
    const studentGroupMap = new Map();

    groupsWithMembers.forEach((group) => {
      group.members.forEach((membership) => {
        const userId = membership.user_id;

        // Get user info from the course users map
        const userInfo = userMap.get(userId);
        const userName = userInfo?.name || `User ${userId}`;
        const userEmail = userInfo?.email || "";

        if (!studentGroupMap.has(userId)) {
          studentGroupMap.set(userId, {
            id: userId,
            name: userName,
            email: userEmail,
            groupsByCategory: {}, // Object to store group name by category
          });
        }

        // Store the group name under its category
        const categoryName = group.group_category?.name || "Uncategorized";
        studentGroupMap.get(userId).groupsByCategory[categoryName] = group.name;
      });
    });

    // Now fetch ALL group memberships for these students to populate other categories
    const studentIds = Array.from(studentGroupMap.keys());

    // Fetch all groups with members for all categories
    const allGroupsWithMembers = await Promise.all(
      allGroups.map(async (group) => {
        const members = await fetchGroupMembers(group.id);
        return {
          ...group,
          members: members,
        };
      })
    );

    console.log("All groups with members loaded");

    // Populate all category memberships for each student
    allGroupsWithMembers.forEach((group) => {
      const categoryName = group.group_category?.name || "Uncategorized";
      group.members.forEach((membership) => {
        const userId = membership.user_id;
        if (studentGroupMap.has(userId)) {
          // Add this group to the student's category mapping
          studentGroupMap.get(userId).groupsByCategory[categoryName] =
            group.name;
        }
      });
    });

    // Convert to array and sort by name
    const students = Array.from(studentGroupMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    console.log("Student-group mapping:", students);

    // Create columns for ds-table
    const columns = [
      { key: "name", label: "Student Name" },
      { key: "email", label: "Email" },
      ...allCategories.map((category) => ({
        key: category,
        label: category,
      })),
    ];

    // Create data for ds-table (array of objects)
    const tableData = students.map((student) => {
      const row = {
        name: student.name,
        email: student.email,
      };
      // Add each category as a property
      allCategories.forEach((category) => {
        row[category] = student.groupsByCategory[category] || "-";
      });
      return row;
    });

    // Generate table HTML
    let tableHTML = `
      <ds-card>
        <ds-card-header
          title="Group Memberships for Selected Groups"
          meta="Showing ${students.length} students across ${allCategories.length} group categories"
        >
          <ds-button slot="stats" size="sm" variant="ghost" id="export-table-btn">
            Export CSV
          </ds-button>
        </ds-card-header>
        <ds-card-content>
          <div style="overflow-x: auto;">
            <ds-table id="group-memberships-table" sortable></ds-table>
          </div>
        </ds-card-content>
      </ds-card>
    `;

    if (students.length === 0) {
      tableHTML = `<ds-alert variant="info" title="No Students Found">No students found in the selected groups.</ds-alert>`;
      groupsOverview.innerHTML = tableHTML;
    } else {
      groupsOverview.innerHTML = tableHTML;

      // Wait for the ds-table element to be defined and then set its data
      customElements.whenDefined("ds-table").then(() => {
        setTimeout(() => {
          const table = document.getElementById("group-memberships-table");
          if (table) {
            console.log("Setting table data:", { columns, data: tableData });
            table.columns = columns;
            table.data = tableData;
          }
        }, 0);
      });
    }

    groupsOverview.style.display = "block";

    // Add export CSV functionality
    const exportBtn = document.getElementById("export-table-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        // Convert table data to CSV
        const csvHeaders = columns.map((col) => col.label).join(",");
        const csvRows = tableData
          .map((row) =>
            columns.map((col) => `"${row[col.key] || ""}"`).join(",")
          )
          .join("\n");
        const csv = `${csvHeaders}\n${csvRows}`;

        // Create download link
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `group-memberships-${
          new Date().toISOString().split("T")[0]
        }.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    }
  } catch (error) {
    console.error("Error displaying group members table:", error);
    groupsOverview.innerHTML = `
      <ds-alert variant="error" title="Error Loading Data">
        Failed to load group members. Please try again.
      </ds-alert>
    `;
  }
}

// Setup drag-and-drop event handlers for student management
function setupDragDropHandlers(categoryName) {
  const categoryContent = document.getElementById("category-content");
  if (!categoryContent) {
    console.error("category-content element not found");
    return;
  }

  let draggedStudent = null;

  // Store original unassigned students data
  const unassignedZone = categoryContent.querySelector(".unassigned-zone");
  if (unassignedZone) {
    const students = unassignedZone.querySelectorAll(".draggable-student");
    originalUnassignedStudents = Array.from(students).map((student) => ({
      element: student,
      id: student.getAttribute("data-student-id"),
      name: student.getAttribute("data-student-name"),
      sortable_name: student.getAttribute("data-student-sortable-name"),
    }));
  }

  // Setup "+ Add Group" button handler
  const addGroupBtn = categoryContent.querySelector("#add-group-btn");
  if (addGroupBtn) {
    addGroupBtn.addEventListener("click", async (e) => {
      await handleAddGroup(categoryName);
    });
  }

  // Setup search/filter functionality for unassigned students
  const searchInput = categoryContent.querySelector("#unassigned-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      filterUnassignedStudents(searchTerm);
    });
  }

  // Function to filter unassigned students
  function filterUnassignedStudents(searchTerm) {
    if (!searchTerm) {
      // Show all students when search is empty
      originalUnassignedStudents.forEach((student) => {
        student.element.style.display = "block";
      });
      return;
    }

    // Filter students based on search term
    const filteredStudents = originalUnassignedStudents.filter((student) => {
      const studentName = student.name.toLowerCase();
      return studentName.includes(searchTerm);
    });

    // Sort filtered students alphabetically
    filteredStudents.sort((a, b) => {
      return a.sortable_name.localeCompare(b.sortable_name);
    });

    // Hide all students first
    originalUnassignedStudents.forEach((student) => {
      student.element.style.display = "none";
    });

    // Show only filtered and sorted students
    filteredStudents.forEach((student) => {
      student.element.style.display = "block";
    });
  }

  // Setup group name editing using event delegation
  categoryContent.addEventListener("click", (e) => {
    // Check if toggle button was clicked
    const toggleBtn = e.target.closest(".toggle-group-btn");
    if (toggleBtn) {
      const groupId = toggleBtn.getAttribute("data-group-id");
      const membersContainer = categoryContent.querySelector(
        `.group-members[data-group-id="${groupId}"]`
      );
      const groupCard = categoryContent.querySelector(
        `.group-card[data-group-id="${groupId}"]`
      );
      const toggleText = toggleBtn.querySelector(".toggle-text");

      if (
        membersContainer.style.display === "none" ||
        !membersContainer.style.display
      ) {
        // Expanding: show members, remove drop-zone from card
        membersContainer.style.display = "flex";
        toggleText.textContent = "Collapse";
        if (groupCard) {
          groupCard.classList.remove("drop-zone");
        }
      } else {
        // Collapsing: hide members, add drop-zone back to card
        membersContainer.style.display = "none";
        toggleText.textContent = "Expand";
        if (groupCard) {
          groupCard.classList.add("drop-zone");
        }
      }
      return;
    }

    // Check if edit button was clicked
    const editBtn = e.target.closest(".edit-group-btn");
    if (editBtn) {
      const groupId = editBtn.getAttribute("data-group-id");
      startEditingGroupName(groupId);
      return;
    }

    // Check if save button was clicked
    const saveBtn = e.target.closest(".save-group-name-btn");
    if (saveBtn) {
      const groupId = saveBtn.getAttribute("data-group-id");
      saveGroupName(groupId);
      return;
    }

    // Check if cancel button was clicked
    const cancelBtn = e.target.closest(".cancel-edit-btn");
    if (cancelBtn) {
      const groupId = cancelBtn.getAttribute("data-group-id");
      cancelGroupNameEdit(groupId);
      return;
    }

    // Also allow clicking on group name to edit
    const groupNameDisplay = e.target.closest(".group-name-display");
    if (groupNameDisplay) {
      const groupId = groupNameDisplay.getAttribute("data-group-id");
      startEditingGroupName(groupId);
      return;
    }
  });

  // Function to start editing a group name
  function startEditingGroupName(groupId) {
    const groupContainer = categoryContent.querySelector(
      `.group-container[data-group-id="${groupId}"]`
    );
    if (!groupContainer) return;

    const groupNameDisplay = groupContainer.querySelector(
      ".group-name-display"
    );
    if (!groupNameDisplay) return;

    // Get current name (without member count)
    const currentFullText = groupNameDisplay.textContent;
    const currentName = currentFullText.replace(/\s*\(\d+\)\s*$/, "").trim();

    // Check if checkbox is currently checked
    const checkbox = groupContainer.querySelector(".group-checkbox");
    const isChecked = checkbox ? checkbox.checked : false;

    // Re-render the group header in edit mode
    const groupHeader = groupContainer.querySelector(
      '[data-role="group-header"]'
    );
    if (!groupHeader) return;

    groupHeader.innerHTML = `
      <ds-flex align="center" gap="2">
        <ds-checkbox 
          size="sm"
          class="group-checkbox" 
          data-group-id="${groupId}"
          ${isChecked ? "checked" : ""}
        ></ds-checkbox>
        <ds-input
          type="text"
          size="sm"
          value="${currentName}"
          class="group-name-input"
          data-group-id="${groupId}"
        ></ds-input>
      </ds-flex>
      <ds-flex gap="1" style="margin-left: var(--space-3);">
        <ds-button 
          size="sm" 
          variant="primary"
          class="save-group-name-btn"
          data-group-id="${groupId}"
        >
          Save
        </ds-button>
        <ds-button 
          size="sm" 
          variant="ghost"
          class="cancel-edit-btn"
          data-group-id="${groupId}"
        >
          Cancel
        </ds-button>
      </ds-flex>
    `;

    // Focus the input
    setTimeout(() => {
      const input = groupContainer.querySelector(".group-name-input");
      if (input) {
        input.focus();
      }
    }, 100);

    // Setup keyboard handlers (Enter/Escape)
    setTimeout(() => {
      const input = groupContainer.querySelector(".group-name-input");
      if (input) {
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            saveGroupName(groupId);
          } else if (e.key === "Escape") {
            cancelGroupNameEdit(groupId);
          }
        });
      }
    }, 100);
  }

  // Function to save group name changes
  async function saveGroupName(groupId) {
    const groupContainer = categoryContent.querySelector(
      `.group-container[data-group-id="${groupId}"]`
    );
    if (!groupContainer) return;

    const input = groupContainer.querySelector(".group-name-input");
    if (!input) return;

    const newName = input.value.trim();
    if (!newName) {
      alert("Group name cannot be empty");
      return;
    }

    // Get current name from container data attribute
    const currentName = groupContainer.getAttribute("data-group-name") || "";

    if (newName === currentName) {
      // No change, just cancel edit
      cancelGroupNameEdit(groupId);
      return;
    }

    try {
      // Show loading state
      const saveBtn = groupContainer.querySelector(".save-group-name-btn");
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";
      }

      // Make API call to update group
      const response = await fetch(
        `http://localhost:3001/api/canvas/groups/${groupId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newName,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to update group name";
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (jsonError) {
          // If response is not JSON, try to get text
          try {
            const errorText = await response.text();
            errorMessage =
              errorText || `HTTP ${response.status}: ${response.statusText}`;
          } catch (textError) {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        }
        throw new Error(errorMessage);
      }

      let updatedGroup;
      try {
        updatedGroup = await response.json();
      } catch (jsonError) {
        // If response is empty or not JSON, assume success and use the new name
        console.warn("Canvas API returned non-JSON response, assuming success");
        updatedGroup = { name: newName };
      }

      // Update all references to the group name in the UI
      updateGroupNameInUI(groupId, updatedGroup.name);

      // Notify selection handlers of the name change
      document.dispatchEvent(
        new CustomEvent("group-name-changed", {
          detail: { groupId, newName: updatedGroup.name },
        })
      );

      // Exit edit mode
      cancelGroupNameEdit(groupId);

      console.log("Successfully updated group name to:", updatedGroup.name);
    } catch (error) {
      console.error("Error updating group name:", error);
      alert(`Failed to update group name: ${error.message}`);

      // Reset save button
      const saveBtn = groupContainer.querySelector(".save-group-name-btn");
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save";
      }
    }
  }

  // Function to cancel group name editing
  function cancelGroupNameEdit(groupId) {
    const groupContainer = categoryContent.querySelector(
      `.group-container[data-group-id="${groupId}"]`
    );
    if (!groupContainer) return;

    // Get the group name from the container data attribute
    const groupName = groupContainer.getAttribute("data-group-name") || "Group";

    // Get member count by counting the members
    const membersContainer = groupContainer.querySelector(".group-members");
    const memberCount = membersContainer
      ? membersContainer.querySelectorAll(".draggable-student").length
      : 0;

    // Check if checkbox is currently checked
    const checkbox = groupContainer.querySelector(".group-checkbox");
    const isChecked = checkbox ? checkbox.checked : false;

    // Re-render the group header in normal mode
    const groupHeader = groupContainer.querySelector(
      '[data-role="group-header"]'
    );
    if (!groupHeader) return;

    groupHeader.innerHTML = `
      <ds-flex align="center" gap="2">
        <ds-checkbox 
          size="sm"
          class="group-checkbox" 
          data-group-id="${groupId}" 
          data-group-name="${groupName}"
          ${isChecked ? "checked" : ""}
        ></ds-checkbox>
        <div 
          class="group-name-display"
          style="
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
            color: var(--color-text-secondary);
            cursor: pointer;
          "
          data-group-id="${groupId}"
        >
          ${groupName} (${memberCount})
        </div>
      </ds-flex>
      <ds-flex gap="1" style="margin-left: var(--space-3);">
        <ds-button 
          size="sm" 
          variant="ghost"
          class="edit-group-btn"
          data-group-id="${groupId}"
        >
          Edit
        </ds-button>
        <ds-button 
          size="sm" 
          variant="ghost"
          class="toggle-group-btn"
          data-group-id="${groupId}"
        >
          <span class="toggle-text">Expand</span>
        </ds-button>
      </ds-flex>
    `;
  }

  // Function to update group name throughout the UI
  function updateGroupNameInUI(groupId, newName) {
    // Update group name display
    const groupNameDisplay = categoryContent.querySelector(
      `.group-name-display[data-group-id="${groupId}"]`
    );
    if (groupNameDisplay) {
      const memberCount =
        groupNameDisplay.textContent.match(/\((\d+)\)/)?.[1] || "0";
      groupNameDisplay.textContent = `${newName} (${memberCount})`;
    }

    // Update checkbox data attribute
    const checkbox = categoryContent.querySelector(
      `.group-checkbox[data-group-id="${groupId}"]`
    );
    if (checkbox) {
      checkbox.setAttribute("data-group-name", newName);
    }

    // Update group container data attribute
    const groupContainer = categoryContent.querySelector(
      `.group-container[data-group-id="${groupId}"]`
    );
    if (groupContainer) {
      groupContainer.setAttribute("data-group-name", newName);
    }

    // Update selected groups list if this group is selected
    // This will be handled by the selection handlers when they update
  }

  // Setup drag events for all student badges
  function setupDraggableStudents() {
    const students = categoryContent.querySelectorAll(".draggable-student");

    students.forEach((student) => {
      student.addEventListener("dragstart", (e) => {
        draggedStudent = {
          id: student.getAttribute("data-student-id"),
          name: student.getAttribute("data-student-name"),
          sortable_name:
            student.getAttribute("data-student-sortable-name") ||
            student.getAttribute("data-student-name"),
          currentGroup: student.getAttribute("data-current-group"),
          element: student,
        };

        student.style.opacity = "0.5";
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", student.innerHTML);
      });

      student.addEventListener("dragend", (e) => {
        student.style.opacity = "1";

        // Remove all drop zone highlights
        categoryContent.querySelectorAll(".drop-zone").forEach((zone) => {
          zone.style.borderColor = "var(--color-border)";
          zone.style.background = "var(--color-surface)";
        });
      });
    });
  }

  // Setup drop zones
  const dropZones = categoryContent.querySelectorAll(".drop-zone");

  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      // Highlight drop zone - handle both div and ds-card elements
      if (zone.tagName === "DS-CARD") {
        // Only apply dragOver effect if card still has drop-zone class (collapsed state)
        if (zone.classList.contains("drop-zone")) {
          zone.dragOver = true;
        }
      } else {
        // For regular div elements (stop propagation to prevent parent cards from reacting)
        e.stopPropagation();
        zone.style.borderColor = "var(--color-primary-main)";
        zone.style.background = "var(--color-primary-surface)";
      }
    });

    zone.addEventListener("dragleave", (e) => {
      // Only reset if we're actually leaving the zone (not entering a child)
      if (e.target === zone) {
        // Reset drop zone styling - handle both div and ds-card elements
        if (zone.tagName === "DS-CARD") {
          zone.dragOver = false;
        } else {
          // For regular div elements
          e.stopPropagation();
          zone.style.borderColor = "var(--color-border)";
          zone.style.background = "var(--color-surface)";
        }
      }
    });

    zone.addEventListener("drop", async (e) => {
      e.preventDefault();

      // Stop propagation to prevent bubbling to parent cards
      e.stopPropagation();

      if (!draggedStudent) return;

      // If this is a card without drop-zone class (expanded), ignore the drop
      if (zone.tagName === "DS-CARD" && !zone.classList.contains("drop-zone")) {
        return;
      }

      const zoneType = zone.getAttribute("data-zone-type");
      const targetGroupId = zone.getAttribute("data-group-id");
      const targetGroupName = zone.getAttribute("data-group-name");

      // Reset zone styling
      if (zone.tagName === "DS-CARD") {
        zone.dragOver = false;
      } else {
        zone.style.borderColor = "var(--color-border)";
        zone.style.background = "var(--color-surface)";
      }

      // Determine if this is a valid move
      const sourceGroup = draggedStudent.currentGroup;
      const targetGroup =
        zoneType === "unassigned" ? "unassigned" : targetGroupId;

      if (sourceGroup === targetGroup) {
        console.log("Dropped in same location, no action needed");
        return;
      }

      console.log(
        `Moving student ${draggedStudent.name} from ${sourceGroup} to ${targetGroup}`
      );

      // Update the UI immediately for responsiveness
      const studentElement = draggedStudent.element;

      // Remove from current location
      studentElement.remove();

      // Add to new location
      const newBadgeHTML = `
        <div
          draggable="true"
          class="student-badge draggable-student"
          data-student-id="${draggedStudent.id}"
          data-student-name="${draggedStudent.name}"
          data-student-sortable-name="${draggedStudent.sortable_name}"
          data-current-group="${targetGroup}"
          ${zoneType !== "unassigned" ? `data-group-id="${targetGroup}"` : ""}
          style="cursor: move; transition: all 0.2s ease;"
        >
          <ds-badge variant="${
            zoneType === "unassigned" ? "default" : "primary"
          }" size="md"${zoneType !== "unassigned" ? " removable" : ""}>
            ${draggedStudent.name}
          </ds-badge>
        </div>
      `;

      // Remove "no members" message if it exists
      const noMembersMsg = zone.querySelector('div[style*="No members"]');
      if (noMembersMsg) {
        noMembersMsg.remove();
      }

      // If dropping into unassigned zone, insert in alphabetical order by sortable_name
      if (zoneType === "unassigned") {
        // If zone is the card, find the inner stack element
        const targetZone = zone.classList.contains("unassigned-card")
          ? zone.querySelector(".unassigned-zone")
          : zone;

        const existingStudents = Array.from(
          targetZone.querySelectorAll(".draggable-student")
        );
        let inserted = false;

        for (const existingStudent of existingStudents) {
          const existingSortableName =
            existingStudent.getAttribute("data-student-sortable-name") ||
            existingStudent.getAttribute("data-student-name");
          if (
            draggedStudent.sortable_name.localeCompare(existingSortableName) < 0
          ) {
            existingStudent.insertAdjacentHTML("beforebegin", newBadgeHTML);
            inserted = true;
            break;
          }
        }

        // If not inserted yet, add at the end
        if (!inserted) {
          targetZone.insertAdjacentHTML("beforeend", newBadgeHTML);
        }

        // Update originalUnassignedStudents array
        originalUnassignedStudents.push({
          element: targetZone.lastElementChild,
          id: draggedStudent.id,
          name: draggedStudent.name,
          sortable_name: draggedStudent.sortable_name,
        });
      } else {
        // For groups, find the members container (might be collapsed)
        let membersContainer;
        let wasCollapsed = false;

        if (zone.classList.contains("group-container")) {
          // Dropped into the group container itself (collapsed group)
          membersContainer = zone.querySelector(".group-members");
          wasCollapsed =
            membersContainer.style.display === "none" ||
            !membersContainer.style.display;
        } else {
          // Dropped directly into the members area (expanded group)
          membersContainer = zone;
        }

        if (membersContainer) {
          membersContainer.insertAdjacentHTML("beforeend", newBadgeHTML);

          // Don't auto-expand - keep the group collapsed if it was collapsed
        } else {
          console.error("Could not find members container for group");
        }

        // Remove from originalUnassignedStudents array if moving from unassigned
        if (sourceGroup === "unassigned") {
          originalUnassignedStudents = originalUnassignedStudents.filter(
            (student) => student.id !== draggedStudent.id
          );
        }
      }

      // Check if source group is now empty and collapse it
      if (sourceGroup !== "unassigned") {
        const sourceGroupContainer = categoryContent.querySelector(
          `.group-container[data-group-id="${sourceGroup}"]`
        );
        if (sourceGroupContainer) {
          const sourceMembersContainer =
            sourceGroupContainer.querySelector(".group-members");
          const remainingMembers =
            sourceMembersContainer.querySelectorAll(".draggable-student");

          if (remainingMembers.length === 0) {
            // Collapse the empty group
            sourceMembersContainer.style.display = "none";
            const toggleBtn =
              sourceGroupContainer.querySelector(".toggle-group-btn");
            if (toggleBtn) {
              const toggleText = toggleBtn.querySelector(".toggle-text");
              if (toggleText) {
                toggleText.textContent = "Expand";
              }
            }
          }
        }
      }

      // Re-setup drag handlers for the newly added element
      setupDraggableStudents();

      // Update member counts
      updateGroupMemberCounts();

      // Clear search filter to show all students
      const searchInput = categoryContent.querySelector("#unassigned-search");
      if (searchInput) {
        searchInput.value = "";
        filterUnassignedStudents("");
      }

      // Make API call to update Canvas
      try {
        if (sourceGroup !== "unassigned") {
          // Remove from old group
          await removeStudentFromGroup(sourceGroup, draggedStudent.id);
        }

        if (targetGroup !== "unassigned") {
          // Add to new group
          const membershipResponse = await addStudentToGroup(
            targetGroup,
            draggedStudent.id
          );

          console.log("Membership response:", membershipResponse);

          // Update the newly added badge with the membership ID
          const newBadgeElement = categoryContent.querySelector(
            `.student-badge[data-student-id="${draggedStudent.id}"][data-current-group="${targetGroup}"]`
          );
          console.log("Found new badge element:", newBadgeElement);

          if (newBadgeElement && membershipResponse.id) {
            newBadgeElement.setAttribute(
              "data-membership-id",
              membershipResponse.id
            );
            console.log("Set membership ID:", membershipResponse.id);
          } else {
            console.warn(
              "Could not set membership ID - element or ID missing",
              {
                element: !!newBadgeElement,
                membershipId: membershipResponse?.id,
              }
            );
          }
        }

        console.log("Successfully updated group membership in Canvas");
      } catch (error) {
        console.error("Error updating group membership:", error);

        // Show error alert
        const alertHTML = `
          <ds-alert variant="error" title="Error" style="margin-bottom: var(--space-4);">
            Failed to update group membership: ${error.message}
          </ds-alert>
        `;
        categoryContent.insertAdjacentHTML("afterbegin", alertHTML);

        // Reload the category to get correct state
        setTimeout(() => {
          loadCategoryContent(categoryName);
        }, 3000);
      }

      draggedStudent = null;
    });
  });

  // Initial setup of draggable students
  setupDraggableStudents();

  // Handle badge remove events for students (delete button in badges)
  categoryContent.addEventListener("remove", async (e) => {
    const badge = e.target;
    if (badge.tagName === "DS-BADGE") {
      const studentBadge = badge.closest(".student-badge");
      if (studentBadge) {
        const membershipId = studentBadge.getAttribute("data-membership-id");
        const studentId = studentBadge.getAttribute("data-student-id");
        const studentName = studentBadge.getAttribute("data-student-name");
        const studentSortableName = studentBadge.getAttribute(
          "data-student-sortable-name"
        );
        const groupId = studentBadge.getAttribute("data-group-id");

        const unassignedZone =
          categoryContent.querySelector(".unassigned-zone");
        if (!unassignedZone) return;

        console.log(
          "Remove clicked - membershipId:",
          membershipId,
          "groupId:",
          groupId,
          "studentId:",
          studentId
        );

        // Check if membershipId exists
        if (!membershipId) {
          console.error("Missing membership ID for student removal");
          alert("Failed to remove student from group. Missing membership ID.");
          return;
        }

        try {
          // Remove from Canvas API
          await canvasApiRequest(
            `/groups/${groupId}/memberships/${membershipId}`,
            {
              method: "DELETE",
            }
          );

          // Update UI immediately (same as drag-and-drop)
          // Remove student from group
          studentBadge.remove();

          // Add to unassigned zone in alphabetical order
          const newBadgeHTML = `
            <div
              draggable="true"
              class="student-badge draggable-student"
              data-student-id="${studentId}"
              data-student-name="${studentName}"
              data-student-sortable-name="${studentSortableName}"
              data-current-group="unassigned"
              style="cursor: move; transition: all 0.2s ease;"
            >
              <ds-badge variant="default" size="md">
                ${studentName}
              </ds-badge>
            </div>
          `;

          // Insert in alphabetical order
          const existingStudents = Array.from(
            unassignedZone.querySelectorAll(".draggable-student")
          );
          let inserted = false;

          for (const existingStudent of existingStudents) {
            const existingSortableName =
              existingStudent.getAttribute("data-student-sortable-name") ||
              existingStudent.getAttribute("data-student-name");
            if (studentSortableName.localeCompare(existingSortableName) < 0) {
              existingStudent.insertAdjacentHTML("beforebegin", newBadgeHTML);
              inserted = true;
              break;
            }
          }

          // If not inserted yet, add at the end
          if (!inserted) {
            unassignedZone.insertAdjacentHTML("beforeend", newBadgeHTML);
          }

          // Remove "All students are assigned" message if it exists
          const noStudentsMsg = unassignedZone.querySelector(
            'div[style*="All students are assigned"]'
          );
          if (noStudentsMsg) {
            noStudentsMsg.remove();
          }

          // Check if source group is now empty
          const sourceGroupContainer = categoryContent.querySelector(
            `.group-container[data-group-id="${groupId}"]`
          );
          if (sourceGroupContainer) {
            const sourceMembersContainer =
              sourceGroupContainer.querySelector(".group-members");
            const remainingMembers =
              sourceMembersContainer.querySelectorAll(".draggable-student");

            if (remainingMembers.length === 0) {
              // Collapse the empty group
              sourceMembersContainer.style.display = "none";
              const toggleBtn =
                sourceGroupContainer.querySelector(".toggle-group-btn");
              if (toggleBtn) {
                const toggleText = toggleBtn.querySelector(".toggle-text");
                if (toggleText) {
                  toggleText.textContent = "Expand";
                }
              }
            }
          }

          // Re-setup drag handlers for the newly added element
          setupDraggableStudents();

          // Update member counts
          updateGroupMemberCounts();

          // Update originalUnassignedStudents array
          const newElement = unassignedZone.querySelector(
            `.draggable-student[data-student-id="${studentId}"]`
          );
          if (newElement) {
            originalUnassignedStudents.push({
              element: newElement,
              id: studentId,
              name: studentName,
              sortable_name: studentSortableName,
            });
          }

          // Clear search filter to show all students
          const searchInput =
            categoryContent.querySelector("#unassigned-search");
          if (searchInput) {
            searchInput.value = "";
            filterUnassignedStudents("");
          }

          console.log(
            `Successfully removed ${studentName} from group ${groupId}`
          );
        } catch (error) {
          console.error("Error removing student from group:", error);
          alert("Failed to remove student from group. Please try again.");
        }
      }
    }
  });

  // Helper function to update member counts in group headers
  function updateGroupMemberCounts() {
    const groupContainers =
      categoryContent.querySelectorAll(".group-container");
    groupContainers.forEach((container) => {
      const groupId = container.getAttribute("data-group-id");
      const membersZone = container.querySelector(
        `.group-members[data-group-id="${groupId}"]`
      );
      const memberCount =
        membersZone.querySelectorAll(".draggable-student").length;
      const headerText = container.querySelector(
        "div[style*='font-weight: var(--weight-semibold)']"
      );

      if (headerText) {
        const groupName = headerText.textContent.replace(/\s*\(\d+\)\s*$/, "");
        headerText.textContent = `${groupName} (${memberCount})`;
      }
    });
  }
}

// Add student to group via Canvas API
async function addStudentToGroup(groupId, studentId) {
  try {
    const response = await fetch(
      `${CANVAS_API_BASE}/groups/${groupId}/memberships`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: studentId,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to add student to group: ${response.status} ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding student to group:", error);
    throw error;
  }
}

// Remove student from group via Canvas API
async function removeStudentFromGroup(groupId, studentId) {
  try {
    // First, get the membership ID
    const memberships = await canvasApiRequest(
      `/groups/${groupId}/memberships`
    );
    const membership = memberships.find(
      (m) => m.user_id === parseInt(studentId)
    );

    if (!membership) {
      console.warn("Membership not found, may already be removed");
      return;
    }

    const response = await fetch(
      `${CANVAS_API_BASE}/groups/${groupId}/memberships/${membership.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to remove student from group: ${response.status} ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing student from group:", error);
    throw error;
  }
}

// Setup event handlers for group selection
function setupGroupSelectionHandlers(categoryName) {
  // Find the category content container
  const categoryContent = document.getElementById("category-content");
  if (!categoryContent) {
    console.error("category-content element not found");
    return;
  }

  const checkboxes = categoryContent.querySelectorAll(".group-checkbox");
  const groupCards = categoryContent.querySelectorAll(".group-card");
  const selectAllBtn = categoryContent.querySelector(".select-all-btn");
  const deselectAllBtn = categoryContent.querySelector(".deselect-all-btn");
  const applyBtn = categoryContent.querySelector(".apply-selection-btn");
  const selectedGroupsList = categoryContent.querySelector(
    ".selected-groups-list"
  );

  console.log("Found elements:", {
    checkboxes: checkboxes.length,
    checkboxesArray: Array.from(checkboxes).map((cb) => ({
      id: cb.getAttribute("data-group-id"),
      name: cb.getAttribute("data-group-name"),
    })),
    groupCards: groupCards.length,
    selectedGroupsList: !!selectedGroupsList,
  });

  // Track selected groups
  const selectedGroups = new Set();

  // Update UI based on selection
  function updateSelectionUI() {
    console.log(
      "updateSelectionUI called, selectedGroups:",
      Array.from(selectedGroups)
    );
    console.log("selectedGroupsList element:", selectedGroupsList);

    if (selectedGroups.size === 0) {
      selectedGroupsList.innerHTML =
        '<span style="color: var(--color-text-secondary); font-size: var(--text-sm);">None</span>';
      applyBtn.disabled = true;
    } else {
      const groupNames = Array.from(selectedGroups)
        .map((id) => {
          const checkbox = categoryContent.querySelector(
            `.group-checkbox[data-group-id="${id}"]`
          );
          const name = checkbox?.getAttribute("data-group-name");
          console.log("Group", id, "name:", name);
          return name;
        })
        .filter(Boolean);

      console.log("Group names:", groupNames);

      // Create badges for each selected group
      const badgesHTML = groupNames
        .map(
          (name) =>
            `<ds-badge label="${name}" variant="primary" size="sm"></ds-badge>`
        )
        .join("");

      console.log("Badges HTML:", badgesHTML);
      selectedGroupsList.innerHTML = badgesHTML;
      applyBtn.disabled = false;
    }

    // Update card styling
    groupCards.forEach((card) => {
      const groupId = card.getAttribute("data-group-id");
      if (selectedGroups.has(groupId)) {
        card.style.borderColor = "var(--color-primary-main)";
      } else {
        card.style.borderColor = "var(--color-border-primary)";
      }
    });
  }

  // Handle checkbox changes using event delegation on document
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("group-checkbox")) {
      const checkbox = e.target;
      const groupId = checkbox.getAttribute("data-group-id");
      const isChecked = e.detail ? e.detail.checked : checkbox.checked;
      console.log("Checkbox changed (document):", groupId, isChecked, e.detail);
      if (isChecked) {
        selectedGroups.add(groupId);
      } else {
        selectedGroups.delete(groupId);
      }
      updateSelectionUI();
    }
  });

  // Also listen for clicks on checkbox wrappers as fallback
  document.addEventListener("click", (e) => {
    const checkboxWrapper = e.target.closest(".checkbox-wrapper");
    if (checkboxWrapper) {
      const checkbox = checkboxWrapper.closest("ds-checkbox");
      if (checkbox && checkbox.classList.contains("group-checkbox")) {
        // Wait a bit for the checkbox state to update
        setTimeout(() => {
          const groupId = checkbox.getAttribute("data-group-id");
          const isChecked = checkbox.checked;
          console.log("Checkbox wrapper clicked:", groupId, isChecked);
          if (isChecked) {
            selectedGroups.add(groupId);
          } else {
            selectedGroups.delete(groupId);
          }
          updateSelectionUI();
        }, 10);
      }
    }
  });

  // Select all button
  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", () => {
      console.log("Select All clicked");
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
        const groupId = checkbox.getAttribute("data-group-id");
        selectedGroups.add(groupId);
      });
      updateSelectionUI();
    });
  } else {
    console.warn("Select All button not found for", categoryName);
  }

  // Deselect all button
  if (deselectAllBtn) {
    deselectAllBtn.addEventListener("click", () => {
      console.log("Deselect All clicked");
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
        const groupId = checkbox.getAttribute("data-group-id");
        selectedGroups.delete(groupId);
      });
      updateSelectionUI();
    });
  } else {
    console.warn("Deselect All button not found for", categoryName);
  }

  // Apply selection (View Members) button
  if (applyBtn) {
    applyBtn.addEventListener("click", async () => {
      console.log("View Members clicked");
      const selectedGroupsArray = Array.from(selectedGroups).map((groupId) => {
        const checkbox = categoryContent.querySelector(
          `.group-checkbox[data-group-id="${groupId}"]`
        );
        return {
          id: groupId,
          name: checkbox?.getAttribute("data-group-name") || `Group ${groupId}`,
        };
      });
      console.log("Selected groups for table:", selectedGroupsArray);
      await displayGroupMembersTable(selectedGroupsArray, categoryName);
    });
  } else {
    console.warn("Apply Selection button not found for", categoryName);
  }

  // Listen for group name changes
  document.addEventListener("group-name-changed", (e) => {
    const { groupId, newName } = e.detail;
    updateSelectionUI();
  });
}

// Store current course ID for tab operations
let currentCourseId = null;
let originalUnassignedStudents = [];

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});
