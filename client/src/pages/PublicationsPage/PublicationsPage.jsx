import { useEffect, useState, useMemo } from "react";
import {
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
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

  const paginatedData = useMemo(
    () => paginateEntries(publicationEntries, currentPage, itemsPerPage),
    [publicationEntries, currentPage, itemsPerPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProfessorId, searchQuery]);

  const handleProfessorSelect = (professorId) => {
    setSelectedProfessorId(professorId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="PublicationsPage loading-state">
        <div className="loading-content">
          <FaSpinner className="spinner" />
          <p>Loading publications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="PublicationsPage error-state">
        <div className="error-content">
          <FaExclamationTriangle className="error-icon" />
          <h3>Error Loading Publications</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchPublications}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (allPublications.length === 0) {
    return (
      <div className="PublicationsPage empty-state">
        <div className="empty-content">
          <h3>No Publications Available</h3>
          <p>There are currently no publications to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="PublicationsPage">
      <div className="page-header">
        <div className="header-content">
          <h1>Publications</h1>
          <p className="subtitle">
            Browse academic publications from our faculty members
          </p>
        </div>

        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, author, publisher, year..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="publications-content">
        <aside className="professors-sidebar">
          <ProfessorSelector
            professors={professors}
            selectedProfessorId={selectedProfessorId}
            onSelectProfessor={handleProfessorSelect}
          />
        </aside>

        <main className="publications-main">
          {selectedProfessorInfo && (
            <div className="selected-professor-header">
              <div className="professor-profile">
                {selectedProfessorInfo.profilePicture?.url ? (
                  <img
                    src={selectedProfessorInfo.profilePicture.url}
                    alt={
                      selectedProfessorInfo.name ||
                      selectedProfessorInfo.username
                    }
                    className="professor-avatar-large"
                  />
                ) : (
                  <div className="avatar-placeholder-large">
                    {(selectedProfessorInfo.name ||
                      selectedProfessorInfo.username ||
                      "?")[0].toUpperCase()}
                  </div>
                )}
                <div className="professor-details">
                  <h2>
                    {selectedProfessorInfo.name ||
                      selectedProfessorInfo.username}
                  </h2>
                  <p className="publication-count-text">
                    {paginatedData.totalCount}{" "}
                    {paginatedData.totalCount === 1
                      ? "Publication"
                      : "Publications"}
                    {searchQuery && ` (filtered)`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {paginatedData.totalCount === 0 ? (
            <div className="no-publications">
              <p>
                {searchQuery
                  ? `No publications found matching "${searchQuery}"`
                  : "No publications available for this professor"}
              </p>
            </div>
          ) : (
            <>
              <div className="publications-list">
                {paginatedData.entries.map((entry, idx) => (
                  <PublicationEntry
                    key={entry._id || idx}
                    entry={entry}
                    index={paginatedData.startIndex + idx}
                  />
                ))}
              </div>

              {paginatedData.totalPages > 1 && (
                <div className="pagination-controls">
                  <div className="pagination-info">
                    <span>
                      Showing {paginatedData.startIndex} -{" "}
                      {paginatedData.endIndex} of {paginatedData.totalCount}
                    </span>
                    <select
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

                  <div className="pagination-buttons">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!paginatedData.hasPrev}
                    >
                      <FaChevronLeft />
                      Previous
                    </button>

                    <div className="page-numbers">
                      {Array.from(
                        { length: Math.min(5, paginatedData.totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (paginatedData.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (
                            currentPage >=
                            paginatedData.totalPages - 2
                          ) {
                            pageNum = paginatedData.totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              className={`page-number-btn ${
                                currentPage === pageNum ? "active" : ""
                              }`}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!paginatedData.hasNext}
                    >
                      Next
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default PublicationsPage;
