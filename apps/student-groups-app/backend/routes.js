const { makeCanvasRequest } = require("./canvas-api");

/**
 * Routes module for defining API endpoints
 */

/**
 * Sets up all API routes for the application
 * @param {Object} app - Express application instance
 * @param {Object} config - Configuration object
 */
function setupRoutes(app, config) {
  const {
    CANVAS_ACCESS_TOKEN,
    NODE_ENV,
    CANVAS_HOST,
    CANVAS_API_URL,
    PORT,
    LOG_LEVEL,
  } = config;

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      environment: NODE_ENV,
      canvas_host: CANVAS_HOST,
      canvas_api_url: CANVAS_API_URL,
      port: PORT,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.version,
    });
  });

  // Configuration endpoint (for debugging)
  app.get("/config", (req, res) => {
    res.json({
      environment: NODE_ENV,
      port: PORT,
      canvas_api_url: CANVAS_API_URL,
      canvas_host: CANVAS_HOST,
      log_level: LOG_LEVEL,
      node_version: process.version,
      platform: process.platform,
      // Don't expose sensitive information
    });
  });

  // Canvas API proxy endpoints

  // Get all courses for the authenticated user
  app.get("/api/canvas/courses", async (req, res) => {
    try {
      const result = await makeCanvasRequest(
        `/courses?enrollment_state=active&per_page=100`,
        CANVAS_ACCESS_TOKEN,
        config
      );
      res.status(result.statusCode).json(result.data);
    } catch (error) {
      res.status(error.statusCode || 500).json(error);
    }
  });

  // Get course details
  app.get("/api/canvas/courses/:courseId", async (req, res) => {
    try {
      const { courseId } = req.params;
      const result = await makeCanvasRequest(
        `/courses/${courseId}`,
        CANVAS_ACCESS_TOKEN,
        config
      );
      res.status(result.statusCode).json(result.data);
    } catch (error) {
      res.status(error.statusCode || 500).json(error);
    }
  });

  // Get course groups
  app.get("/api/canvas/courses/:courseId/groups", async (req, res) => {
    try {
      const { courseId } = req.params;
      const result = await makeCanvasRequest(
        `/courses/${courseId}/groups?include[]=group_category`,
        CANVAS_ACCESS_TOKEN,
        config
      );
      res.status(result.statusCode).json(result.data);
    } catch (error) {
      res.status(error.statusCode || 500).json(error);
    }
  });

  // Get group memberships
  app.get("/api/canvas/groups/:groupId/memberships", async (req, res) => {
    try {
      const { groupId } = req.params;
      const result = await makeCanvasRequest(
        `/groups/${groupId}/memberships?include[]=user`,
        CANVAS_ACCESS_TOKEN,
        config
      );
      res.status(result.statusCode).json(result.data);
    } catch (error) {
      res.status(error.statusCode || 500).json(error);
    }
  });

  // Get course users
  app.get("/api/canvas/courses/:courseId/users", async (req, res) => {
    try {
      const { courseId } = req.params;
      const enrollmentType = req.query.enrollment_type || "student";
      const result = await makeCanvasRequest(
        `/courses/${courseId}/users?enrollment_type=${enrollmentType}`,
        CANVAS_ACCESS_TOKEN,
        config
      );
      res.status(result.statusCode).json(result.data);
    } catch (error) {
      res.status(error.statusCode || 500).json(error);
    }
  });

  // Get group memberships for a course
  app.get(
    "/api/canvas/courses/:courseId/group_memberships",
    async (req, res) => {
      try {
        const { courseId } = req.params;
        const result = await makeCanvasRequest(
          `/courses/${courseId}/groups?include[]=group_category`,
          CANVAS_ACCESS_TOKEN,
          config
        );

        // For each group, fetch its members
        const groupsWithMembers = [];
        for (const group of result.data) {
          const membersResult = await makeCanvasRequest(
            `/groups/${group.id}/memberships`,
            CANVAS_ACCESS_TOKEN,
            config
          );
          groupsWithMembers.push({
            ...group,
            members: membersResult.data,
          });
        }

        res.status(200).json(groupsWithMembers);
      } catch (error) {
        res.status(error.statusCode || 500).json(error);
      }
    }
  );

  // Get group categories for a course
  app.get(
    "/api/canvas/courses/:courseId/group_categories",
    async (req, res) => {
      try {
        const { courseId } = req.params;
        const result = await makeCanvasRequest(
          `/courses/${courseId}/groups?include[]=group_category`,
          CANVAS_ACCESS_TOKEN,
          config
        );

        // Extract unique categories
        const categories = new Set();
        result.data.forEach((group) => {
          if (group.group_category && group.group_category.name) {
            categories.add(group.group_category.name);
          }
        });

        res.status(200).json(Array.from(categories).sort());
      } catch (error) {
        res.status(error.statusCode || 500).json(error);
      }
    }
  );
}

module.exports = {
  setupRoutes,
};
