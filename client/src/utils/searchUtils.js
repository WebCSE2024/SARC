/**
 * Checks if a value contains the search query
 * @param {any} value - The value to check
 * @param {string} query - The search query
 * @returns {boolean} - True if value contains query
 */
export const containsQuery = (value, query) => {
    if (typeof value === 'string') {
        return value.toLowerCase().includes(query);
    }
    if (typeof value === 'number') {
        return value.toString().includes(query);
    }
    return false;
};

/**
 * Recursively searches through all object properties
 * @param {Object} obj - The object to search in
 * @param {string} query - The search query
 * @returns {boolean} - True if query is found in any property
 */
export const searchInObject = (obj, query) => {
    if (!obj) return false;
    
    return Object.values(obj).some(value => {
        if (typeof value === 'object' && value !== null) {
            return searchInObject(value, query);
        }
        return containsQuery(value, query);
    });
};