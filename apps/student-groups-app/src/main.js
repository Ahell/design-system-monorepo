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
async function canvasApiRequest(endpoint) {
  const url = `${CANVAS_API_BASE}${endpoint}`;
  console.log("Making API request to:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

// Initialize the app when custom elements are defined
async function initializeApp() {
  // Wait for the ds-table custom element to be defined
  await customElements.whenDefined("ds-table");
  await customElements.whenDefined("ds-input");
  await customElements.whenDefined("ds-button");
  await customElements.whenDefined("ds-select");
  await customElements.whenDefined("ds-tabs");

  // Small delay to ensure the element is fully rendered
  await new Promise((resolve) => setTimeout(resolve, 100));

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
  loadButton.textContent = "Loading...";
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
    loadButton.textContent = "Load Groups";
    loadButton.disabled = false;
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
}

// Function to load course categories and display tabs
async function loadCourseCategories(courseId) {
  const courseCardHeader = document.getElementById("course-card-header");
  const categoryRadioGroup = document.getElementById("category-radio-group");
  const categoryContent = document.getElementById("category-content");
  const groupsOverview = document.getElementById("groups-overview");

  try {
    // Show loading state
    if (courseCardHeader) {
      courseCardHeader.title = "Group Categories";
      courseCardHeader.meta = "Loading course information...";
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
  } catch (error) {
    console.error("Error loading course categories:", error);

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
    radio.value = category;
    radio.label = category;
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
    loadCategoryContent(categories[0]);
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
        <p style="color: var(--color-text-secondary);">Loading groups...</p>
      </ds-stack>
    `;

    // Fetch groups for this category
    const groups = await fetchCourseGroupsByCategory(
      currentCourseId,
      categoryName
    );

    // Generate and display HTML content for groups
    const content = generateGroupsContent(groups, categoryName);
    categoryContent.innerHTML = content;

    // Wait for DOM to update, then attach event listeners
    setTimeout(() => {
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
    <ds-card variant="secondary">
      <ds-card-header
        title="${categoryName} Groups"
        meta="<span class='selected-count'>0</span>/${groups.length} selected"
      >
        <ds-inline slot="stats" gap="2">
          <ds-button size="sm" variant="ghost" class="select-all-btn" data-category="${categoryName}">
            Select All
          </ds-button>
          <ds-button size="sm" variant="ghost" class="deselect-all-btn" data-category="${categoryName}">
            Deselect All
          </ds-button>
        </ds-inline>
      </ds-card-header>
      <ds-card-content>
        <ds-grid 
          class="groups-grid" 
          style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
            gap: var(--space-4);
          "
        >`;

  groups.forEach((group) => {
    const memberCount = group.members_count || 0;
    const memberText =
      memberCount === 1 ? "1 member" : `${memberCount} members`;

    html += `
            <ds-card variant="default" class="group-card" data-group-id="${
              group.id
            }" interactive style="cursor: pointer; transition: var(--transition-all);">
              <ds-card-content>
                <ds-stack gap="3">
                  <ds-inline align="start" gap="3">
                    <ds-checkbox 
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
      </ds-card-content>
    </ds-card>

    <ds-card variant="info">
      <ds-card-content>
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
      </ds-card-content>
    </ds-card>
  `;

  return html;
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

    // Create table data with category columns
    const headers = ["Student Name", "Email", ...allCategories];
    const rows = students.map((student) => {
      const row = [student.name, student.email];
      // For each category, add the group name or empty string
      allCategories.forEach((category) => {
        row.push(student.groupsByCategory[category] || "");
      });
      return row;
    });

    // Generate table HTML
    let tableHTML = `
      <ds-card>
        <ds-card-header
          title="Group Memberships for Selected Groups"
          meta="Showing ${students.length} students across ${
      allCategories.length
    } group categories"
        >
          <ds-button slot="stats" size="sm" variant="ghost" id="export-table-btn">
            Export CSV
          </ds-button>
        </ds-card-header>
        <ds-card-content style="padding: 0;">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; background: var(--color-surface-primary);">
              <thead>
                <tr style="background: var(--color-primary-main);">
                  ${headers
                    .map(
                      (header) => `
                    <th style="padding: var(--space-4); text-align: left; font-weight: var(--weight-semibold); color: var(--color-text-inverse); border-bottom: 2px solid var(--color-border-secondary); white-space: nowrap;">
                      ${header}
                    </th>
                  `
                    )
                    .join("")}
                </tr>
              </thead>
              <tbody>
                ${rows
                  .map(
                    (row, rowIndex) => `
                  <tr style="background: ${
                    rowIndex % 2 === 0
                      ? "var(--color-surface-primary)"
                      : "var(--color-surface-secondary)"
                  }; transition: var(--transition-colors);" onmouseover="this.style.background='var(--color-neutral-100)'" onmouseout="this.style.background='${
                      rowIndex % 2 === 0
                        ? "var(--color-surface-primary)"
                        : "var(--color-surface-secondary)"
                    }'">
                    ${row
                      .map(
                        (cell, index) => `
                      <td style="padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--color-border-primary); ${
                        index === 0
                          ? "font-weight: var(--weight-medium);"
                          : index === 1
                          ? "color: var(--color-text-secondary);"
                          : "color: var(--color-text-primary);"
                      }">
                        ${cell || "-"}
                      </td>
                    `
                      )
                      .join("")}
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </ds-card-content>
      </ds-card>
    `;

    if (students.length === 0) {
      tableHTML = `<ds-alert variant="info" title="No Students Found">No students found in the selected groups.</ds-alert>`;
    }

    groupsOverview.innerHTML = tableHTML;
    groupsOverview.style.display = "block";

    // Add export CSV functionality
    const exportBtn = document.getElementById("export-table-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        // Convert table data to CSV
        const csv = [
          headers.join(","),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

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

// Setup event handlers for group selection
function setupGroupSelectionHandlers(categoryName) {
  const tabsElement = document.querySelector("ds-tabs");
  if (!tabsElement) {
    console.error("ds-tabs element not found");
    return;
  }

  // Get the shadow root
  const shadowRoot = tabsElement.shadowRoot;
  if (!shadowRoot) {
    console.error("Shadow root not found");
    return;
  }

  // Find the active tab content within the shadow DOM
  const tabContent = shadowRoot.querySelector(".tab-content.active");
  if (!tabContent) {
    console.error("Active tab content not found");
    return;
  }

  const checkboxes = tabContent.querySelectorAll(".group-checkbox");
  const groupCards = tabContent.querySelectorAll(".group-card");
  const selectAllBtn = tabContent.querySelector(".select-all-btn");
  const deselectAllBtn = tabContent.querySelector(".deselect-all-btn");
  const applyBtn = tabContent.querySelector(".apply-selection-btn");
  const selectedCountSpan = tabContent.querySelector(".selected-count");
  const selectedGroupsList = tabContent.querySelector(".selected-groups-list");

  console.log("Setup handlers for", categoryName, {
    checkboxes: checkboxes.length,
    groupCards: groupCards.length,
    hasSelectAllBtn: !!selectAllBtn,
    hasDeselectAllBtn: !!deselectAllBtn,
  });

  // Track selected groups
  const selectedGroups = new Set();

  // Update UI based on selection
  function updateSelectionUI() {
    selectedCountSpan.textContent = selectedGroups.size;

    if (selectedGroups.size === 0) {
      selectedGroupsList.innerHTML =
        '<span style="color: var(--color-text-secondary); font-size: var(--text-sm);">None</span>';
      applyBtn.disabled = true;
    } else {
      const groupNames = Array.from(selectedGroups)
        .map((id) => {
          const checkbox = tabContent.querySelector(
            `.group-checkbox[data-group-id="${id}"]`
          );
          return checkbox?.getAttribute("data-group-name");
        })
        .filter(Boolean);

      // Create badges for each selected group
      const badgesHTML = groupNames
        .map(
          (name) =>
            `<ds-badge label="${name}" variant="primary" size="sm"></ds-badge>`
        )
        .join("");

      selectedGroupsList.innerHTML = badgesHTML;
      applyBtn.disabled = false;
    }

    // Update card styling
    groupCards.forEach((card) => {
      const groupId = card.getAttribute("data-group-id");
      if (selectedGroups.has(groupId)) {
        card.style.borderColor = "var(--color-primary-main)";
        card.style.backgroundColor = "var(--color-card-primary-bg)";
        card.style.boxShadow = "var(--shadow-sm)";
      } else {
        card.style.borderColor = "var(--color-border-primary)";
        card.style.backgroundColor = "var(--color-surface-primary)";
        card.style.boxShadow = "none";
      }
    });
  }

  // Handle checkbox changes
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const groupId = checkbox.getAttribute("data-group-id");
      console.log("Checkbox changed:", groupId, e.detail.checked);
      if (e.detail.checked) {
        selectedGroups.add(groupId);
      } else {
        selectedGroups.delete(groupId);
      }
      updateSelectionUI();
    });
  });

  // Handle card clicks to toggle checkbox
  groupCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // Don't toggle if clicking on the checkbox itself
      if (
        e.target.tagName === "DS-CHECKBOX" ||
        e.target.closest("ds-checkbox")
      ) {
        return;
      }
      const groupId = card.getAttribute("data-group-id");
      const checkbox = card.querySelector(".group-checkbox");
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        // Manually trigger the change event
        if (checkbox.checked) {
          selectedGroups.add(groupId);
        } else {
          selectedGroups.delete(groupId);
        }
        updateSelectionUI();
      }
    });
  });

  // Select all button
  selectAllBtn?.addEventListener("click", () => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
      const groupId = checkbox.getAttribute("data-group-id");
      selectedGroups.add(groupId);
    });
    updateSelectionUI();
  });

  // Deselect all button
  deselectAllBtn?.addEventListener("click", () => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
      const groupId = checkbox.getAttribute("data-group-id");
      selectedGroups.delete(groupId);
    });
    updateSelectionUI();
  });

  // Apply selection button
  applyBtn?.addEventListener("click", async () => {
    const selectedGroupsList = Array.from(selectedGroups).map((id) => {
      const checkbox = tabContent.querySelector(
        `.group-checkbox[data-group-id="${id}"]`
      );
      return {
        id,
        name: checkbox?.getAttribute("data-group-name"),
      };
    });

    console.log("Selected groups for", categoryName, ":", selectedGroupsList);

    // Show loading feedback
    const originalText = applyBtn.textContent;
    applyBtn.textContent = "Loading...";
    applyBtn.disabled = true;

    try {
      // Fetch members for all selected groups
      await displayGroupMembersTable(selectedGroupsList, categoryName);

      // Show success feedback
      applyBtn.textContent = "✓ Applied";
      setTimeout(() => {
        applyBtn.textContent = originalText;
        applyBtn.disabled = false;
      }, 2000);
    } catch (error) {
      console.error("Error loading group members:", error);
      applyBtn.textContent = "Error";
      setTimeout(() => {
        applyBtn.textContent = originalText;
        applyBtn.disabled = false;
      }, 2000);
    }

    // Dispatch custom event with selection
    document.dispatchEvent(
      new CustomEvent("groups-selected", {
        detail: {
          category: categoryName,
          groups: selectedGroupsList,
          groupIds: Array.from(selectedGroups),
        },
      })
    );
  });
}

// Store current course ID for tab operations
let currentCourseId = null;

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});
