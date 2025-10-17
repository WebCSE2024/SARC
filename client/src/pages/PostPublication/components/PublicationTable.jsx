import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaBook,
  FaUserEdit,
  FaBuilding,
} from "react-icons/fa";
import "./PublicationTable.scss";

const ALWAYS_VISIBLE_FIELDS = [
  {
    key: "year",
    label: "Year",
    placeholder: "YYYY",
    type: "number",
    min: 1900,
    max: 2100,
    step: 1,
  },
  { key: "volume", label: "Volume", placeholder: "Vol." },
  { key: "issue", label: "Issue", placeholder: "Issue #" },
  { key: "pages", label: "Pages", placeholder: "e.g., 1-10" },
  { key: "issn", label: "ISSN", placeholder: "ISSN Number" },
  { key: "isbn", label: "ISBN", placeholder: "ISBN Number" },
];

const COLLAPSIBLE_FIELDS = [
  {
    key: "publicationType",
    label: "Type",
    placeholder: "Journal / Conference / Patent",
  },
  { key: "publisherName", label: "Publisher", placeholder: "Publisher name" },
];

const PublicationTable = ({
  entries,
  onFieldChange,
  onRemoveRow,
  onAddRow,
  disabled,
}) => {
  const [expandedRows, setExpandedRows] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const toggleRow = (rowId) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  // Pagination calculations
  const totalEntries = entries.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);
  const paginatedEntries = useMemo(
    () => entries.slice(startIndex, endIndex),
    [entries, startIndex, endIndex]
  );

  // Reset to page 1 when entries change significantly
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleInputChange = (entryId, field, value) => {
    if (onFieldChange) {
      onFieldChange(entryId, field, value);
    }
  };

  const renderAuthors = (authorsString) => {
    if (!authorsString) return [];
    return authorsString
      .split(",")
      .map((author) => author.trim())
      .filter(Boolean);
  };

  return (
    <div className="publication-table-modern">
      {entries.length === 0 ? (
        <div className="empty-state">
          <FaBook className="empty-icon" />
          <h3>No publications yet</h3>
          <p>Upload a PDF or add entries manually to get started.</p>
        </div>
      ) : (
        <>
          <div className="publications-grid">
            {paginatedEntries.map((entry, index) => {
              const isExpanded = expandedRows.has(entry.id);
              const globalIndex = startIndex + index;
              const authors = renderAuthors(entry.authors);

              return (
                <div
                  key={entry.id}
                  className={`publication-card ${disabled ? "disabled" : ""}`}
                >
                  {/* Card Header */}
                  <div className="card-header">
                    <div className="card-number">#{globalIndex + 1}</div>
                    <div className="card-actions">
                      <button
                        type="button"
                        onClick={() => toggleRow(entry.id)}
                        className="action-btn toggle-btn"
                        disabled={disabled}
                        title={
                          isExpanded ? "Hide description" : "Show description"
                        }
                      >
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveRow(entry.id)}
                        className="action-btn remove-btn"
                        disabled={disabled}
                        title="Remove publication"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* Title Field */}
                  <div className="field-group title-field">
                    <label>
                      <span className="field-label">
                        <FaBook className="field-icon" />
                        Title <span className="required">*</span>
                      </span>
                      <input
                        type="text"
                        value={entry.title ?? ""}
                        placeholder="Enter publication title"
                        onChange={(e) =>
                          handleInputChange(entry.id, "title", e.target.value)
                        }
                        disabled={disabled}
                        className="title-input"
                      />
                    </label>
                  </div>

                  {/* Authors Field */}
                  <div className="field-group authors-field">
                    <label>
                      <span className="field-label">
                        <FaUserEdit className="field-icon" />
                        Authors
                      </span>
                      <input
                        type="text"
                        value={entry.authors ?? ""}
                        placeholder="Comma separated (e.g., John Doe, Jane Smith)"
                        onChange={(e) =>
                          handleInputChange(entry.id, "authors", e.target.value)
                        }
                        disabled={disabled}
                      />
                    </label>
                    {authors.length > 0 && (
                      <div className="authors-preview">
                        {authors.map((author, idx) => (
                          <span key={idx} className="author-tag">
                            {author}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Essential Fields - Always Visible */}
                  <div className="essential-fields">
                    <div className="essential-grid">
                      {ALWAYS_VISIBLE_FIELDS.map((field) => (
                        <div key={field.key} className="field-item">
                          <label>
                            <span className="field-label">{field.label}</span>
                            <input
                              type={field.type || "text"}
                              value={entry[field.key] ?? ""}
                              placeholder={field.placeholder}
                              min={field.min}
                              max={field.max}
                              step={field.step}
                              onChange={(e) =>
                                handleInputChange(
                                  entry.id,
                                  field.key,
                                  e.target.value
                                )
                              }
                              disabled={disabled}
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collapsible Section - Technical Details & Description */}
                  {isExpanded && (
                    <div className="collapsible-content">
                      {/* Technical Details */}
                      <div className="technical-details">
                        {COLLAPSIBLE_FIELDS.map((field) => (
                          <div key={field.key} className="field-item">
                            <label>
                              <span className="field-label">{field.label}</span>
                              <input
                                type="text"
                                value={entry[field.key] ?? ""}
                                placeholder={field.placeholder}
                                onChange={(e) =>
                                  handleInputChange(
                                    entry.id,
                                    field.key,
                                    e.target.value
                                  )
                                }
                                disabled={disabled}
                              />
                            </label>
                          </div>
                        ))}
                      </div>

                      {/* Description */}
                      <div className="description-field">
                        <textarea
                          value={entry.description ?? ""}
                          placeholder="Add your notes or description here (optional)..."
                          onChange={(e) =>
                            handleInputChange(
                              entry.id,
                              "description",
                              e.target.value
                            )
                          }
                          disabled={disabled}
                          rows={4}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {entries.length > 0 && (
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing {startIndex + 1}-{endIndex} of {totalEntries} entries
          </div>

          <div className="pagination-buttons">
            <button
              type="button"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1 || disabled}
              className="pagination-btn"
              title="First page"
            >
              «
            </button>
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || disabled}
              className="pagination-btn"
              title="Previous page"
            >
              ‹
            </button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  disabled={disabled}
                  className={`pagination-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || disabled}
              className="pagination-btn"
              title="Next page"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages || disabled}
              className="pagination-btn"
              title="Last page"
            >
              »
            </button>
          </div>

          <div className="items-per-page">
            <label>
              Items per page:
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                disabled={disabled}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={totalEntries}>All</option>
              </select>
            </label>
          </div>
        </div>
      )}

      <div className="table-actions">
        <button type="button" onClick={onAddRow} disabled={disabled}>
          Add publication
        </button>
      </div>
    </div>
  );
};

PublicationTable.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onRemoveRow: PropTypes.func.isRequired,
  onAddRow: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

PublicationTable.defaultProps = {
  disabled: false,
};

export default PublicationTable;
