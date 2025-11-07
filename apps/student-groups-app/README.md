# Student Groups App

A demonstration application that showcases the design system by displaying Canvas LMS student group information in a clean, organized table format.

## Features

- **Course ID Input**: Enter any Canvas course ID to load student groups for that specific course
- **Groups Overview**: Visual display of all groups in the course with student counts, organized by category
- **Student Group Table**: Displays student information including names, IDs, group assignments, and group categories
- **Design System Integration**: Uses the published design system components (@ahell/design-system@workspace:\*)
- **Responsive Design**: Built with modern web standards and responsive layout components
- **Fallback Data**: Includes sample data when API is unavailable

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Canvas LMS Access Token (required for API calls)
VITE_CANVAS_ACCESS_TOKEN=your_canvas_access_token_here

# Backend API Base URL (default: http://localhost:3001/api/canvas)
VITE_CANVAS_API_BASE=http://localhost:3001/api/canvas
```

### Backend Configuration

The backend server also has its own `.env` file in the `backend/` directory:

```env
# Canvas API URL (should match your Canvas instance)
CANVAS_API_URL=https://canvas.kth.se/api/v1

# Server port
PORT=3001
```

## Usage

1. **Enter Course ID**: Type a Canvas course ID in the input field (e.g., `12345`)
2. **Load Groups**: Click the "Load Groups" button or press Enter
3. **View Groups**: See all groups organized by category with student counts in the overview section
4. **View Students**: Browse the detailed student assignments table below

When you click "Load Groups", the app fetches:

- All groups for the specified course (including empty groups)
- All group memberships (student assignments)
- Student details for each assigned user

The groups overview shows each group's name and current student count, helping you see the complete group structure at a glance.

## Finding Course IDs

To find a Canvas course ID:

1. Navigate to the course in Canvas
2. Look at the URL: `https://canvas.instructure.com/courses/COURSE_ID`
3. The number after `/courses/` is the course ID

Example: If the URL is `https://canvas.instructure.com/courses/12345`, then `12345` is the course ID.

## Canvas LMS API Integration

The app attempts to load real data from Canvas LMS using the provided API token from the `.env` file. If the API is unavailable (due to CORS restrictions or network issues), it falls back to sample data.

### API Configuration

- **Base URL**: Configured via `CANVAS_API_URL` in backend `.env`
- **Authentication**: Bearer token from `VITE_CANVAS_ACCESS_TOKEN` in frontend `.env`
- **Endpoints Used**:
  - `/courses` - Fetch available courses
  - `/courses/{id}/groups` - Fetch groups for a course
  - `/courses/{id}/group_memberships` - Fetch group memberships
  - `/users/{id}` - Fetch user details

### CORS Considerations

Browser CORS restrictions may prevent direct API calls to Canvas LMS. For production use, consider:

1. **Backend Proxy**: Implement API calls on a backend server
2. **Canvas LTI**: Use Learning Tools Interoperability for embedded apps
3. **Different Canvas Instance**: Some institutions allow CORS for their Canvas instances

## Components Used

- `ds-container`: Page layout container
- `ds-hero`: Page header with title and subtitle
- `ds-card`: Content container with header and body sections
- `ds-card-header`: Card header with title and description
- `ds-card-content`: Card content area
- `ds-table`: Data table for displaying student information
- `ds-badge`: Status indicators for student activity status

## Data Structure

The app displays student data with the following fields:

- **Student Name**: Full name of the student
- **Student ID**: Unique identifier for the student
- **Group Name**: Name of the group the student belongs to
- **Group Category**: Type of group (Project Teams, Study Groups, Lab Partners)
- **Status**: Current enrollment status (Active/Inactive)

## Sample Groups

- **Project Teams**: Group Alpha, Group Beta, Group Gamma
- **Study Groups**: Group Beta
- **Lab Partners**: Group Delta

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

## Design System

This app uses the workspace design system package. The design system provides consistent styling, components, and theming for a professional user interface.
