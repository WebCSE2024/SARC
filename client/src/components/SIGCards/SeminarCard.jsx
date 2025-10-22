import React from "react";
import PropTypes from "prop-types";
import "./SIGCards.scss";

const SeminarCard = ({ seminar }) => {
  const { title, description, date, time, media, location, duration } = seminar;

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isYouTubeUrl = (url) => {
    return url && (url.includes("youtube.com") || url.includes("youtu.be"));
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  return (
    <article className="sig-card sig-card--seminar">
      {media && (
        <div className="sig-card__media">
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
          {media.type === "image" && (
            <img
              src={media.url}
              alt={title}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1558980394-0f36c6f7c87d?w=1200&auto=format&fit=crop&q=60";
              }}
            />
          )}
        </div>
      )}

      <div className="sig-card__content">
        <header className="sig-card__header">
          <span className="sig-card__badge sig-card__badge--seminar">
            Seminar
          </span>
          <h3 className="sig-card__title">{title}</h3>
        </header>

        {description && <p className="sig-card__description">{description}</p>}

        <footer className="sig-card__footer">
          <div className="sig-card__seminar-info">
            <time className="sig-card__date" dateTime={date}>
              {formatDate(date)} at {time}
            </time>
            {location && (
              <span className="sig-card__location">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    fill="currentColor"
                  />
                </svg>
                {location}
              </span>
            )}
            {duration && (
              <span className="sig-card__duration">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 6v6l4 2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {duration} mins
              </span>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
};

SeminarCard.propTypes = {
  seminar: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    media: PropTypes.shape({
      type: PropTypes.string,
      url: PropTypes.string,
    }),
    location: PropTypes.string,
    duration: PropTypes.number,
  }).isRequired,
};

export default React.memo(SeminarCard);
