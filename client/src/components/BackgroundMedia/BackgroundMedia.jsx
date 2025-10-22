import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./BackgroundMedia.scss";

const BackgroundMedia = ({ media, className = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (!media || !media.url || hasError) {
    return null;
  }

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  const opacity = media.opacity ?? 0.3;

  if (prefersReducedMotion && media.type === "video") {
    return (
      <div
        className={`background-media ${className}`}
        style={{ "--media-opacity": opacity }}
      >
        <img
          src={media.poster}
          alt=""
          className="background-media__fallback"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    );
  }

  return (
    <div
      className={`background-media ${isLoaded ? "is-loaded" : ""} ${className}`}
      style={{ "--media-opacity": opacity }}
      aria-hidden="true"
    >
      {media.type === "video" && (
        <video
          className="background-media__video"
          autoPlay
          loop
          muted
          playsInline
          poster={media.poster}
          onLoadedData={handleLoad}
          onError={handleError}
        >
          <source src={media.url} type="video/mp4" />
        </video>
      )}

      {media.type === "gif" && (
        <img
          src={media.url}
          alt=""
          className="background-media__gif"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {media.type === "image" && (
        <img
          src={media.url}
          alt=""
          className="background-media__image"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

BackgroundMedia.propTypes = {
  media: PropTypes.shape({
    type: PropTypes.oneOf(["video", "gif", "image"]).isRequired,
    url: PropTypes.string.isRequired,
    poster: PropTypes.string,
    opacity: PropTypes.number,
  }),
  className: PropTypes.string,
};

export default React.memo(BackgroundMedia);
