import React from "react";
import "./SIGPublicationCard.scss";

// Styled to match SIGPublicationCard visual language
export default function SIGProfessorCard({ name, designation, image, interests }) {
  return (
    <article className="sig-pub" role="article">
      <div className="sig-pub__preview" aria-hidden="true">
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=50";
          }}
          style={{ objectFit: "cover", height: 180 }}
        />
      </div>

      <header className="sig-pub__header">
        <span className="sig-pub__badge">{designation}</span>
        <h3 className="sig-pub__title">{name}</h3>
        {Array.isArray(interests) && interests.length > 0 && (
          <p className="sig-pub__authors"><strong>{interests.slice(0, 3).join(" • ")}</strong></p>
        )}
      </header>

      {Array.isArray(interests) && interests.length > 3 && (
        <p className="sig-pub__desc">{interests.slice(3).join(" • ")}</p>
      )}

      <footer className="sig-pub__footer" aria-hidden="true">
        <span className="sig-pub__date"></span>
        <span className="sig-pub__link" style={{visibility: "hidden"}}>Profile</span>
      </footer>
    </article>
  );
}
