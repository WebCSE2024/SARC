import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaBookOpen,
  FaTimes,
  FaFilter,
  FaSortAmountDown,
  FaGraduationCap,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { sarcAPI } from "../../../../../shared/axios/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import ProfessorSelector from "./ProfessorSelector";
import PublicationEntry from "./PublicationEntry";
import {
  searchAllPublications,
  getUniqueProfessors,
  filterByProfessor,
  paginateEntries,
} from "../../utils/publicationSearchUtils";
import "./PublicationsPage.scss";

const PublicationsPage = () => {
  const { user } = useAuth();

  const [allPublications, setAllPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfessorId, setSelectedProfessorId] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const searchInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchPublications = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await sarcAPI.get(
        "/sarc/v0/publication/publication-list"
      );

      if (response.data && response.data.success) {
        const publications = response.data.data || [];
        setAllPublications(publications);

        if (user && publications.length > 0) {
          const userPublication = publications.find(
            (pub) =>
              pub.ownerAuthId?.toString() === user.id?.toString() ||
              pub.ownerAuthId?.toString() === user.userId?.toString() ||
              pub.ownerAuthId?.toString() === user._id?.toString()
          );

          if (userPublication) {
            const userId =
              userPublication.ownerAuthId || userPublication.ownerProfileId;
            setSelectedProfessorId(userId?.toString());
          } else if (publications.length > 0) {
            const firstPub = publications[0];
            const firstId = firstPub.ownerAuthId || firstPub.ownerProfileId;
            setSelectedProfessorId(firstId?.toString());
          }
        } else if (publications.length > 0) {
          const firstPub = publications[0];
          const firstId = firstPub.ownerAuthId || firstPub.ownerProfileId;
          setSelectedProfessorId(firstId?.toString());
        }
      } else {
        setError("Failed to load publications");
      }
    } catch (err) {
      console.error("Error fetching publications:", err);
      setError(err.response?.data?.message || "Failed to load publications");
      toast.error("Failed to load publications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const professors = useMemo(
    () => getUniqueProfessors(allPublications),
    [allPublications]
  );

  const searchResults = useMemo(
    () => searchAllPublications(allPublications, searchQuery),
    [allPublications, searchQuery]
  );

  const selectedPublication = useMemo(() => {
    if (!selectedProfessorId) return null;

    const publications = searchQuery ? searchResults : allPublications;
    return filterByProfessor(publications, selectedProfessorId);
  }, [selectedProfessorId, allPublications, searchResults, searchQuery]);

  const selectedProfessorInfo = useMemo(
    () =>
      professors.find((prof) => prof.id?.toString() === selectedProfessorId),
    [professors, selectedProfessorId]
  );

  const publicationEntries = selectedPublication?.entries || [];

  // Sort entries based on sortOrder
  const sortedEntries = useMemo(() => {
    const entries = [...publicationEntries];
    if (sortOrder === "newest") {
      return entries.sort((a, b) => (b.year || 0) - (a.year || 0));
    } else if (sortOrder === "oldest") {
      return entries.sort((a, b) => (a.year || 0) - (b.year || 0));
    } else if (sortOrder === "citations") {
      return entries.sort((a, b) => (b.citations || 0) - (a.citations || 0));
    }
    return entries;
  }, [publicationEntries, sortOrder]);

  const paginatedData = useMemo(
    () => paginateEntries(sortedEntries, currentPage, itemsPerPage),
    [sortedEntries, currentPage, itemsPerPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProfessorId, searchQuery, sortOrder]);

  const handleProfessorSelect = useCallback((professorId) => {
    setSelectedProfessorId(professorId);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const pubsContainer = document.querySelector(".publications-container");
    if (pubsContainer) {
      pubsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const renderPaginationNumbers = () => {
    const { totalPages } = paginatedData;
    const maxVisible = 5;
    const pages = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="page-number-btn"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="page-ellipsis">
            …
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-number-btn ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="page-ellipsis">
            …
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          className="page-number-btn"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="PublicationsPage loading-state">
        <div className="loading-content">
          <div className="loader-wrapper">
            <div className="loader-ring"></div>
            <FaGraduationCap className="loader-icon" />
          </div>
          <h3>Loading Publications</h3>
          <p>Fetching research papers from our faculty...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="PublicationsPage error-state">
        <div className="error-content">
          <div className="error-icon-wrapper">
            <FaExclamationTriangle className="error-icon" />
          </div>
          <h3>Unable to Load Publications</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchPublications}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (allPublications.length === 0) {
    return (
      <div className="PublicationsPage empty-state">
        <div className="empty-content">
          <div className="empty-icon-wrapper">
            <FaBookOpen className="empty-icon" />
          </div>
          <h3>No Publications Yet</h3>
          <p>There are currently no publications to display.</p>
        </div>
      </div>
    );
  }

  const totalPublicationsCount = allPublications.reduce(
    (acc, pub) => acc + (pub.entries?.length || 0),
    0
  );

  return (
    <div className="PublicationsPage">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaGraduationCap />
            <span>Research Repository</span>
          </div>
          <h1 className="hero-title">Research Publications</h1>
          <p className="hero-subtitle">
            Explore {totalPublicationsCount}+ publications from{" "}
            {professors.length} faculty members in computer science research
          </p>

          {/* Search Box */}
          <div className={`search-wrapper ${isSearchFocused ? "focused" : ""}`}>
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search by title, author, keyword, or DOI..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                aria-label="Search publications"
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Professor Selector */}
      <section className="professor-tabs-section">
        <ProfessorSelector
          professors={professors}
          selectedProfessorId={selectedProfessorId}
          onSelectProfessor={handleProfessorSelect}
        />
      </section>

      {/* Main Content */}
      <main className="publications-container">
        {paginatedData.totalCount === 0 ? (
          <div className="no-publications">
            <div className="no-results-illustration">
              <FaSearch className="no-results-icon" />
            </div>
            <h4>No Results Found</h4>
            <p>
              {searchQuery
                ? `No publications match "${searchQuery}"`
                : "No publications available for this faculty member"}
            </p>
            {searchQuery && (
              <button className="clear-filters-btn" onClick={handleClearSearch}>
                <FaTimes />
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="results-header">
              <div className="results-info">
                <span className="results-count">
                  <strong>{paginatedData.totalCount}</strong>
                  {paginatedData.totalCount === 1
                    ? " publication"
                    : " publications"}
                  {selectedProfessorInfo && (
                    <span className="professor-indicator">
                      by{" "}
                      {selectedProfessorInfo.name ||
                        selectedProfessorInfo.username}
                    </span>
                  )}
                </span>
                {searchQuery && (
                  <span className="filter-badge">
                    <FaFilter className="filter-icon" />
                    Filtered: "{searchQuery}"
                    <button
                      className="remove-filter"
                      onClick={handleClearSearch}
                      aria-label="Remove filter"
                    >
                      <FaTimes />
                    </button>
                  </span>
                )}
              </div>

              <div className="view-controls">
                <div className="sort-control">
                  <FaSortAmountDown className="sort-icon" />
                  <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="sort-select"
                    aria-label="Sort publications"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="citations">Most Cited</option>
                  </select>
                </div>
                <div className="items-control">
                  <label htmlFor="items-per-page" className="sr-only">
                    Items per page
                  </label>
                  <select
                    id="items-per-page"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="items-per-page-select"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Publications List */}
            <div className="publications-list">
              {paginatedData.entries.map((entry, idx) => (
                <PublicationEntry
                  key={entry._id || idx}
                  entry={entry}
                  index={paginatedData.startIndex + idx}
                  professorInfo={selectedProfessorInfo}
                />
              ))}
            </div>

            {/* Pagination */}
            {paginatedData.totalPages > 1 && (
              <nav className="pagination-controls" aria-label="Pagination">
                <button
                  className="pagination-btn prev-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!paginatedData.hasPrev}
                  aria-label="Previous page"
                >
                  <FaChevronLeft />
                  <span className="btn-text">Previous</span>
                </button>

                <div className="page-numbers">{renderPaginationNumbers()}</div>

                <button
                  className="pagination-btn next-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!paginatedData.hasNext}
                  aria-label="Next page"
                >
                  <span className="btn-text">Next</span>
                  <FaChevronRight />
                </button>
              </nav>
            )}

            <div className="pagination-summary">
              Showing <strong>{paginatedData.startIndex}</strong> -{" "}
              <strong>{paginatedData.endIndex}</strong> of{" "}
              <strong>{paginatedData.totalCount}</strong> publications
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PublicationsPage;
