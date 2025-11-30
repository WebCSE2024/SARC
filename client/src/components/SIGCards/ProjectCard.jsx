import React from "react";
import PropTypes from "prop-types";
import "./SIGCards.scss";
import {
  isYouTubeUrl,
  getYouTubeEmbedUrl,
  getFallbackImage,
} from "../../utils/mediaUtils";

const ProjectCard = ({ project }) => {
  const { title, description, date, year, media } = project;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderMedia = () => {
    if (!media || !media.url) return null;

    if (media.type === "video" && isYouTubeUrl(media.url)) {
      return (
        <iframe
          src={getYouTubeEmbedUrl(media.url)}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (media.type === "video") {
      return (
        <video controls preload="metadata">
          <source src={media.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <img
        src={media.url}
        alt={title}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = getFallbackImage("project");
        }}
      />
    );
  };

  return (
    <article className="sig-card sig-card--project">
      {media && media.url && (
        <div className="sig-card__media">{renderMedia()}</div>
      )}

      <div className="sig-card__content">
        <header className="sig-card__header">
          {year && (
            <span className="sig-card__badge sig-card__badge--project">
              Batch {year}
            </span>
          )}
          <h3 className="sig-card__title">{title}</h3>
          {date && (
            <time className="sig-card__date" dateTime={date}>
              {formatDate(date)}
            </time>
          )}
        </header>

        {description && <p className="sig-card__description">{description}</p>}
      </div>
    </article>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    date: PropTypes.string,
    year: PropTypes.string,
    media: PropTypes.shape({
      type: PropTypes.string,
      url: PropTypes.string,
    }),
  }).isRequired,
};

export default React.memo(ProjectCard);
