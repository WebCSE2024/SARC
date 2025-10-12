import React from "react";
import "./SIGPublicationCard.scss";

export default function SIGPublicationCard({ title, authors, description, dateofPublication, link, typeofPublication, preview }) {
  return (
    <article className="sig-pub">
      {preview && (
        <div className="sig-pub__preview">
          {preview.type === "image" && (
            <img
              src={preview.src}
              alt={`Preview: ${title}`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&auto=format&fit=crop&q=40";
              }}
            />
          )}
          {preview.type === "video" && (
            <video controls preload="metadata">
              <source src={preview.src} />
            </video>
          )}
          {preview.type === "iframe" && (
            <div className="sig-pub__iframe-wrap">
              <iframe src={preview.src} title={title} loading="lazy" />
            </div>
          )}
          {preview.type === "pdf" && (
            <div className="sig-pub__iframe-wrap">
              <iframe src={preview.src} title={title} loading="lazy" />
            </div>
          )}
        </div>
      )}
      <header className="sig-pub__header">
        <span className={`sig-pub__badge sig-pub__badge--${(typeofPublication || "other").replace(/\s+/g, "-")}`}>
          {typeofPublication}
        </span>
        <h3 className="sig-pub__title">{title}</h3>
        <p className="sig-pub__authors"><strong>{authors}</strong></p>
      </header>

      <p className="sig-pub__desc">{description}</p>

      <footer className="sig-pub__footer">
        <time className="sig-pub__date">{dateofPublication}</time>
        <a className="sig-pub__link" href={link} target="_blank" rel="noreferrer noopener">
          View publication
        </a>
      </footer>
    </article>
  );
}
