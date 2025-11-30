import React from "react";
import PropTypes from "prop-types";
import "./SIGCards.scss";
import { getFallbackImage } from "../../utils/mediaUtils";

const ProfessorCard = ({ professor }) => {
  const { name, position, profilePicture, interests, email, bio } = professor;

  return (
    <article className="sig-card sig-card--professor">
      <div className="sig-card__media">
        <img
          src={profilePicture?.url || getFallbackImage("professor")}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getFallbackImage("professor");
          }}
        />
      </div>

      <div className="sig-card__content">
        <header className="sig-card__header">
          <span className="sig-card__badge sig-card__badge--professor">
            {position}
          </span>
          <h3 className="sig-card__title">{name}</h3>
          {email && (
            <a
              href={`mailto:${email}`}
              className="sig-card__email"
              aria-label={`Email ${name}`}
            >
              {email}
            </a>
          )}
        </header>

        {bio && <p className="sig-card__description">{bio}</p>}

        {interests && interests.length > 0 && (
          <div className="sig-card__tags" aria-label="Research interests">
            {interests.map((interest, idx) => (
              <span key={idx} className="sig-card__tag">
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

ProfessorCard.propTypes = {
  professor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    profilePicture: PropTypes.objectOf(PropTypes.string),
    interests: PropTypes.arrayOf(PropTypes.string),
    email: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
};

export default React.memo(ProfessorCard);
