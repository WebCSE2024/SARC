import React from "react";
import PropTypes from "prop-types";
import "./SIGCards.scss";

const ProfessorCard = ({ professor }) => {
  const { name, designation, image, interests, email, bio } = professor;

  return (
    <article className="sig-card sig-card--professor">
      <div className="sig-card__media">
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=50";
          }}
        />
      </div>

      <div className="sig-card__content">
        <header className="sig-card__header">
          <span className="sig-card__badge sig-card__badge--professor">
            {designation}
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
    designation: PropTypes.string.isRequired,
    image: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
    email: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
};

export default React.memo(ProfessorCard);
