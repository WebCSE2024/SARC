import PropTypes from "prop-types";
import { FaUser, FaCheck } from "react-icons/fa";
import "./ProfessorSelector.scss";

/**
 * Professor Selector Component
 * Displays list of professors with publications for easy navigation
 */
const ProfessorSelector = ({
  professors,
  selectedProfessorId,
  onSelectProfessor,
}) => {
  if (!professors || professors.length === 0) {
    return (
      <div className="professor-selector empty">
        <p className="empty-message">No professors with publications found</p>
      </div>
    );
  }

  return (
    <div className="professor-selector">
      <div className="selector-header">
        <h3>Professors</h3>
        <span className="count-badge">{professors.length}</span>
      </div>

      <div className="professors-list">
        {professors.map((professor) => {
          const isSelected = professor.id?.toString() === selectedProfessorId;
          const displayName = professor.name || professor.username || "Unknown";

          return (
            <button
              key={professor.id}
              className={`professor-item ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectProfessor(professor.id.toString())}
              title={`View ${displayName}'s publications`}
            >
              <div className="professor-avatar">
                {professor.profilePicture?.url ? (
                  <img src={professor.profilePicture.url} alt={displayName} />
                ) : (
                  <div className="avatar-placeholder">
                    <FaUser />
                  </div>
                )}
              </div>

              <div className="professor-info">
                <span className="professor-name">{displayName}</span>
                <span className="publication-count">
                  {professor.publicationCount}{" "}
                  {professor.publicationCount === 1
                    ? "publication"
                    : "publications"}
                </span>
              </div>

              {isSelected && (
                <div className="selected-indicator">
                  <FaCheck />
                </div>
              )}
            </button>
          );
        })}
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
