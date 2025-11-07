const https = require("https");
const { URL } = require("url");

/**
 * Canvas API module for handling Canvas LMS API requests with pagination support
 */

/**
 * Parses Canvas API Link header to extract pagination URLs
 * @param {string} linkHeader - The Link header from Canvas API response
 * @returns {Object} Object with rel types as keys and URLs as values
 */
function parseLinkHeader(linkHeader) {
  const links = {};
  if (!linkHeader) return links;

  // Split by comma and parse each link
  linkHeader.split(",").forEach((part) => {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      links[match[2]] = match[1];
    }
  });

  return links;
}

/**
 * Makes a single HTTP request to Canvas API
 * @param {string} fullUrl - Complete URL to request
 * @param {string} authToken - Canvas access token
 * @param {Object} config - Configuration object
 * @returns {Promise} Promise that resolves with response data and headers
 */
function makeSingleRequest(fullUrl, authToken, config) {
  const { REQUEST_TIMEOUT, LOG_LEVEL } = config;

  return new Promise((resolve, reject) => {
    const url = new URL(fullUrl);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "GET",
      timeout: REQUEST_TIMEOUT,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        "User-Agent": "StudentGroupsApp/1.0",
      },
    };

    if (LOG_LEVEL === "debug") {
      console.log(`🔍 Making request to: ${fullUrl}`);
    }

    const request = https.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: response.statusCode,
            data: jsonData,
            headers: response.headers,
            url: fullUrl,
          });
        } catch (error) {
          console.error("❌ Error parsing Canvas response:", error);
          reject({
            statusCode: 500,
            error: "Failed to parse Canvas API response",
            details: error.message,
            url: fullUrl,
          });
        }
      });
    });

    request.on("timeout", () => {
      console.error(
        `⏰ Request timeout after ${REQUEST_TIMEOUT}ms for: ${fullUrl}`
      );
      request.destroy();
      reject({
        statusCode: 504,
        error: "Request timeout",
        timeout: REQUEST_TIMEOUT,
        url: fullUrl,
      });
    });

    request.on("error", (error) => {
      console.error(
        `❌ Canvas API request error for ${fullUrl}:`,
        error.message
      );
      reject({
        statusCode: 500,
        error: "Failed to connect to Canvas API",
        details: error.message,
        url: fullUrl,
      });
    });

    request.end();
  });
}

/**
 * Makes a request to the Canvas API with automatic pagination handling
 * @param {string} path - API endpoint path (without /api/v1 prefix)
 * @param {string} authToken - Canvas access token
 * @param {Object} config - Configuration object
 * @returns {Promise} Promise that resolves with complete paginated response
 */
async function makeCanvasRequest(path, authToken, config) {
  const { CANVAS_HOST, LOG_LEVEL } = config;
  const startTime = Date.now();
  const baseUrl = `https://${CANVAS_HOST}`;
  const fullUrl = `${baseUrl}/api/v1${path}`;

  let allData = [];
  let currentUrl = fullUrl;
  let pageCount = 0;
  let totalItems = 0;

  try {
    while (currentUrl) {
      pageCount++;

      // Rate limiting: small delay between requests to be respectful to Canvas API
      if (pageCount > 1) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
      }

      const response = await makeSingleRequest(currentUrl, authToken, config);

      if (response.statusCode !== 200) {
        throw {
          statusCode: response.statusCode,
          error: "Canvas API error",
          details: response.data,
          url: currentUrl,
        };
      }

      // Add this page's data to our collection
      const pageData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      allData = allData.concat(pageData);
      totalItems += pageData.length;

      if (LOG_LEVEL === "debug" || LOG_LEVEL === "info") {
        console.log(
          `📄 Page ${pageCount} (${pageData.length} items) - Total: ${totalItems} items`
        );
      }

      // Check for next page in Link header
      const links = parseLinkHeader(response.headers.link);
      currentUrl = links.next || null; // Stop if no next page
    }

    const totalDuration = Date.now() - startTime;

    if (LOG_LEVEL === "debug" || LOG_LEVEL === "info") {
      console.log(
        `✅ Completed in ${totalDuration}ms - Total: ${totalItems} items across ${pageCount} pages`
      );
    }

    return {
      statusCode: 200,
      data: allData,
      pagination: {
        totalPages: pageCount,
        totalItems: totalItems,
        duration: totalDuration,
      },
    };
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`❌ Pagination failed after ${totalDuration}ms:`, error);
    throw {
      ...error,
      pagination: {
        pagesFetched: pageCount,
        itemsFetched: totalItems,
        duration: totalDuration,
      },
    };
  }
}

module.exports = {
  makeCanvasRequest,
  parseLinkHeader, // Exported for testing
};
