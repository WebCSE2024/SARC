import { useRef, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight, FaUser } from "react-icons/fa";
import "./ProfessorSelector.scss";

/**
 * Professor Selector Component - Enhanced Horizontal Tab Style
 * Displays professors as elegant horizontal scrollable tabs with publication counts
 */
const ProfessorSelector = ({
  professors,
  selectedProfessorId,
  onSelectProfessor,
}) => {
  const scrollContainerRef = useRef(null);
  const selectedTabRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, [checkScrollButtons, professors]);

  // Scroll selected tab into view when it changes
  useEffect(() => {
    if (selectedTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tab = selectedTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      if (tabRect.left < containerRect.left + 50) {
        container.scrollBy({
          left: tabRect.left - containerRect.left - 50,
          behavior: "smooth",
        });
      } else if (tabRect.right > containerRect.right - 50) {
        container.scrollBy({
          left: tabRect.right - containerRect.right + 50,
          behavior: "smooth",
        });
      }
    }
  }, [selectedProfessorId]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === "left" ? -280 : 280;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleScroll = () => {
    checkScrollButtons();
  };

  if (!professors || professors.length === 0) {
    return (
      <div className="professor-selector empty">
        <div className="empty-state">
          <FaUser className="empty-icon" />
          <p className="empty-message">
            No faculty members with publications found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="professor-selector">
      <div className="selector-wrapper">
        {/* Left Scroll Button */}
        <button
          className={`scroll-btn scroll-btn-left ${showLeftArrow ? "visible" : ""}`}
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          tabIndex={showLeftArrow ? 0 : -1}
        >
          <FaChevronLeft />
        </button>

        {/* Tabs Container */}
        <div
          className="tabs-container"
          ref={scrollContainerRef}
          onScroll={handleScroll}
          role="tablist"
          aria-label="Select faculty member"
        >
          {professors.map((professor, index) => {
            const isSelected = professor.id?.toString() === selectedProfessorId;
            const displayName = professor.name || professor.username || "Unknown";

            return (
              <button
                key={professor.id}
                ref={isSelected ? selectedTabRef : null}
                className={`professor-tab ${isSelected ? "selected" : ""}`}
                onClick={() => onSelectProfessor(professor.id.toString())}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`panel-${professor.id}`}
                title={`View ${displayName}'s publications (${professor.publicationCount || 0})`}
                style={{ "--tab-index": index }}
              >
                <span className="tab-name">{displayName}</span>
                <span className="tab-count" aria-label={`${professor.publicationCount || 0} publications`}>
                  {professor.publicationCount || 0}
                </span>
                {isSelected && <span className="selection-indicator" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button
          className={`scroll-btn scroll-btn-right ${showRightArrow ? "visible" : ""}`}
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          tabIndex={showRightArrow ? 0 : -1}
        >
          <FaChevronRight />
        </button>

        {/* Gradient Overlays */}
        <div className={`gradient-overlay gradient-left ${showLeftArrow ? "visible" : ""}`} aria-hidden="true" />
        <div className={`gradient-overlay gradient-right ${showRightArrow ? "visible" : ""}`} aria-hidden="true" />
      </div>
    </div>
  );
};

ProfessorSelector.propTypes = {
  professors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
      username: PropTypes.string,
      name: PropTypes.string,
      profilePicture: PropTypes.shape({
        url: PropTypes.string,
      }),
      publicationCount: PropTypes.number,
    })
  ).isRequired,
  selectedProfessorId: PropTypes.string,
  onSelectProfessor: PropTypes.func.isRequired,
};

export default ProfessorSelector;
