import React, { useState } from "react";
import "./PublicationsCard.scss";
import LikeShareArea from "../../components/LikeShareArea/LikeShareArea";
import defaultProfile from "../../../public/NoProfileImg.png";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";

const PublicationsCard = ({ data }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreviewClick = () => {
    if (data.previewUrl) {
      setIsPreviewOpen(true);
    } else {
      toast.error("Preview not available");
    }
  };

  const handleContactClick = () => {
    if (data.uploader?.email) {
      window.location.href = `mailto:${data.uploader.email}`;
    } else {
      toast.error("Contact information not available");
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <div className="PublicationsCard">
      <div className="title-save">
        <h3 className="title">{data.title}</h3>
      </div>

      <div className="preview-publisher-details">
        <div className="paper-preview">
          {data.previewUrl ? (
            <img
              src={data.previewUrl}
              alt="Publication Preview"
              className="previewImg"
            />
          ) : (
            <div className="no-preview">Preview not available</div>
          )}
          <button className="openPreviewBtn" onClick={handlePreviewClick}>
            View Preview
          </button>
        </div>

        <div className="about-publisher">
          <img
            src={data.uploader?.profilePicture || defaultProfile}
            alt="Publisher"
            className="publisher-pic"
          />
          <div className="publisher-details">
            <div className="name">
              {data.uploader?.fullName || "Unknown Author"}
              <p className="designation">
                {data.uploader?.designation || "Author"}
              </p>
            </div>
            <button className="contact-btn" onClick={handleContactClick}>
              <FaEnvelope /> Contact Author
            </button>
          </div>
        </div>
      </div>

      <p className="Note">
        Kindly contact the author for access to full publication.
      </p>
      <LikeShareArea />

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="preview-modal" onClick={handleClosePreview}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleClosePreview}>
              ×
            </button>
            <iframe
              src={data.previewUrl}
              title="Publication Preview"
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationsCard;
