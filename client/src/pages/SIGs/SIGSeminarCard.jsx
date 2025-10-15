import React from "react";
import "./SIGPublicationCard.scss";

export default function SIGSeminarCard({ title, description, media, date, time }) {
  const hasVideo = media && media.type === "video" && media.src;
  const hasImage = media && media.type === "image" && media.src;

  return (
    <article className="sig-pub">
      <div className="sig-pub__preview">
        {hasVideo ? (
          <video controls preload="metadata" style={{ width: "100%", height: 180, background: "#000" }}>
            <source src={media.src} />
          </video>
        ) : (
          <img
            src={hasImage ? media.src : "https://images.unsplash.com/photo-1558980394-0f36c6f7c87d?w=1200&auto=format&fit=crop&q=60"}
            alt={title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1558980394-0f36c6f7c87d?w=1200&auto=format&fit=crop&q=60";
            }}
            style={{ objectFit: "cover", height: 180 }}
          />
        )}
      </div>

      <header className="sig-pub__header">
        <span className="sig-pub__badge">Seminar</span>
        <h3 className="sig-pub__title">{title}</h3>
      </header>

      <p className="sig-pub__desc">{description}</p>

      <footer className="sig-pub__footer">
        <time className="sig-pub__date">{date} • {time}</time>
        <span className="sig-pub__link" style={{ visibility: "hidden" }}>Details</span>
      </footer>
    </article>
  );
}
