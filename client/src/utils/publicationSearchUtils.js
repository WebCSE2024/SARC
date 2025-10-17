/**
 * Publication Search Utilities
 * Provides scalable search functionality for publications
 * Designed to be easily extended for RAG-based search in the future
 */

/**
 * Search configuration for future RAG integration
 */
export const SearchConfig = {
  // Fields to search in publication entries
  searchableFields: [
    "title",
    "authors",
    "publicationType",
    "publisherName",
    "description",
    "year",
    "volume",
    "issue",
    "pages",
    "issn",
    "isbn",
  ],

  // Weight for different fields (for future scoring)
  fieldWeights: {
    title: 3,
    authors: 2,
    description: 2,
    publicationType: 1,
    publisherName: 1,
    year: 1,
  },

  // Future: RAG endpoint configuration
  ragConfig: {
    enabled: false,
    endpoint: "/api/v1/publications/semantic-search",
    maxResults: 50,
  },
};

/**
 * Normalizes a value for search comparison
 * @param {any} value - Value to normalize
 * @returns {string} - Normalized string
 */
const normalizeValue = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return value.toString().toLowerCase();
  if (typeof value === "string") return value.toLowerCase().trim();
  if (Array.isArray(value)) return value.join(" ").toLowerCase().trim();
  return String(value).toLowerCase().trim();
};

/**
 * Checks if a value matches the search query
 * @param {any} value - Value to check
 * @param {string} query - Search query
 * @returns {boolean} - True if matches
 */
const matchesQuery = (value, query) => {
  const normalizedValue = normalizeValue(value);
  const normalizedQuery = query.toLowerCase().trim();
  return normalizedValue.includes(normalizedQuery);
};

/**
 * Searches within a single publication entry
 * @param {Object} entry - Publication entry object
 * @param {string} query - Search query
 * @returns {boolean} - True if entry matches query
 */
export const searchPublicationEntry = (entry, query) => {
  if (!query || !entry) return true;

  return SearchConfig.searchableFields.some((field) => {
    if (entry[field]) {
      return matchesQuery(entry[field], query);
    }
    return false;
  });
};

/**
 * Searches within a professor's publication document
 * Checks both the entries and professor metadata
 * @param {Object} publication - Publication document with entries array
 * @param {string} query - Search query
 * @returns {Object|null} - Filtered publication object or null
 */
export const searchProfessorPublications = (publication, query) => {
  if (!query || !publication) return publication;

  // Search in professor metadata
  const professorMatch =
    matchesQuery(publication.ownerUsername, query) ||
    matchesQuery(publication.ownerName, query);

  if (professorMatch) return publication;

  // Filter entries that match the query
  const matchingEntries = (publication.entries || []).filter((entry) =>
    searchPublicationEntry(entry, query)
  );

  if (matchingEntries.length > 0) {
    return {
      ...publication,
      entries: matchingEntries,
    };
  }

  return null;
};

/**
 * Searches across all publications from multiple professors
 * @param {Array} publications - Array of publication documents
 * @param {string} query - Search query
 * @returns {Array} - Filtered publications array
 */
export const searchAllPublications = (publications, query) => {
  if (!query || !Array.isArray(publications)) return publications;

  return publications
    .map((pub) => searchProfessorPublications(pub, query))
    .filter((pub) => pub !== null && pub.entries && pub.entries.length > 0);
};

/**
 * Groups publications by professor
 * @param {Array} publications - Array of publication documents
 * @returns {Map} - Map of professorId to publication data
 */
export const groupPublicationsByProfessor = (publications) => {
  const grouped = new Map();

  publications.forEach((pub) => {
    const key = pub.ownerAuthId || pub.ownerProfileId;
    if (key) {
      grouped.set(key.toString(), pub);
    }
  });

  return grouped;
};

/**
 * Gets unique professors who have publications
 * @param {Array} publications - Array of publication documents
 * @returns {Array} - Array of unique professor objects
 */
export const getUniqueProfessors = (publications) => {
  const professorsMap = new Map();

  publications.forEach((pub) => {
    const key = pub.ownerAuthId || pub.ownerProfileId;
    if (key && !professorsMap.has(key.toString())) {
      professorsMap.set(key.toString(), {
        id: key,
        username: pub.ownerUsername,
        name: pub.ownerName,
        profilePicture: pub.ownerProfilePicture,
        publicationCount: pub.entries ? pub.entries.length : 0,
        status: pub.status,
      });
    }
  });

  return Array.from(professorsMap.values()).sort((a, b) =>
    (a.name || a.username || "").localeCompare(b.name || b.username || "")
  );
};

/**
 * Filters publications by professor ID
 * @param {Array} publications - Array of publication documents
 * @param {string} professorId - Professor's auth ID or profile ID
 * @returns {Object|null} - Publication document for the professor
 */
export const filterByProfessor = (publications, professorId) => {
  if (!professorId || !Array.isArray(publications)) return null;

  return publications.find((pub) => {
    const authId = pub.ownerAuthId ? pub.ownerAuthId.toString() : null;
    const profileId = pub.ownerProfileId ? pub.ownerProfileId.toString() : null;
    return authId === professorId || profileId === professorId;
  });
};

/**
 * Paginates publication entries
 * @param {Array} entries - Array of publication entries
 * @param {number} page - Current page (1-indexed)
 * @param {number} pageSize - Number of items per page
 * @returns {Object} - Paginated data with metadata
 */
export const paginateEntries = (entries, page = 1, pageSize = 10) => {
  if (!Array.isArray(entries)) {
    return {
      entries: [],
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      hasNext: false,
      hasPrev: false,
    };
  }

  const totalCount = entries.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    entries: entries.slice(startIndex, endIndex),
    currentPage,
    totalPages,
    totalCount,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, totalCount),
  };
};

/**
 * Future: Placeholder for RAG-based semantic search
 * @param {Array} publications - Array of publication documents
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Search results
 */
export const ragSemanticSearch = async (publications, query) => {
  // TODO: Implement RAG-based search when backend is ready
  // This will call the semantic search API endpoint
  if (SearchConfig.ragConfig.enabled) {
    try {
      // const response = await fetch(SearchConfig.ragConfig.endpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ query, limit: SearchConfig.ragConfig.maxResults })
      // });
      // return await response.json();
      console.warn("RAG search not yet implemented");
    } catch (error) {
      console.error(
        "RAG search failed, falling back to standard search:",
        error
      );
    }
  }

  // Fallback to standard search
  return searchAllPublications(publications, query);
};
