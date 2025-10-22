import React from "react";
import PropTypes from "prop-types";
import "./SIGCards.scss";
import {
  isYouTubeUrl,
  getYouTubeEmbedUrl,
  getFallbackImage,
} from "../../utils/mediaUtils";

const PublicationCard = ({ publication }) => {
  const {
    title,
    authors,
    description,
    publishedDate,
    url,
    type,
    media,
    tags,
    citations,
  } = publication;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAuthors = (authorsList) => {
    if (!Array.isArray(authorsList)) return authorsList;
    if (authorsList.length === 0) return "";
    if (authorsList.length === 1) return authorsList[0];
    if (authorsList.length === 2) return authorsList.join(" and ");
    return `${authorsList[0]} et al.`;
  };

  return (
    <article className="sig-card">
      {media && (
        <div className="sig-card__media">
          {media.type === "image" && (
            <img
              src={media.url}
              alt={title}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getFallbackImage("publication");
              }}
            />
          )}
          {media.type === "video" && !isYouTubeUrl(media.url) && (
            <video controls preload="metadata">
              <source src={media.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {media.type === "video" && isYouTubeUrl(media.url) && (
            <iframe
              src={getYouTubeEmbedUrl(media.url)}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      )}

      <div className="sig-card__content">
        <header className="sig-card__header">
          <div className="sig-card__meta">
            <span className={`sig-card__badge sig-card__badge--${type}`}>
              {type}
            </span>
            {citations && (
              <span className="sig-card__citations" title="Citations">
                {citations.toLocaleString()} citations
              </span>
            )}
          </div>
          <h3 className="sig-card__title">{title}</h3>
          <p className="sig-card__authors">{formatAuthors(authors)}</p>
        </header>

        {description && <p className="sig-card__description">{description}</p>}

        {tags && tags.length > 0 && (
          <div className="sig-card__tags" aria-label="Topics">
            {tags.map((tag, idx) => (
              <span key={idx} className="sig-card__tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <footer className="sig-card__footer">
          <time className="sig-card__date" dateTime={publishedDate}>
            {formatDate(publishedDate)}
          </time>
          {url && (
            <a
              className="sig-card__link"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${title}`}
            >
              View Publication
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </footer>
      </div>
    </article>
  );
};

PublicationCard.propTypes = {
  publication: PropTypes.shape({
    title: PropTypes.string.isRequired,
    authors: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    description: PropTypes.string,
    publishedDate: PropTypes.string.isRequired,
    url: PropTypes.string,
    type: PropTypes.string.isRequired,
    media: PropTypes.shape({
      type: PropTypes.string,
      url: PropTypes.string,
    }),
    tags: PropTypes.arrayOf(PropTypes.string),
    citations: PropTypes.number,
  }).isRequired,
};

export default React.memo(PublicationCard);
