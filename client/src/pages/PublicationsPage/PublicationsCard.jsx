import React, { useState } from "react";
import "./PublicationsCard.scss";
import LikeShareArea from "../../components/LikeShareArea/LikeShareArea";
import defaultProfile from "../../../public/NoProfileImg.png";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const PublicationsCard = ({ data }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { user } = useAuth();


  //Publication URL consists of the acual URL of the PDF File in Cloudinary
  //So we need to extract the PDF from the Cloudinary URL and show it in the preview
  //Remove the View Preview Button and show the PDF Preview Beatifully directly in theCard ITseself

  const handlePreviewClick = () => {
    if (data?.publicationURL) {
      setIsPreviewOpen(true);
    } else {
      toast.error("Preview not available");
    }
  };

  const handleContactClick = () => {
    if (user?.email) {
      window.location.href = `mailto:${user.email}`;
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
          {/* Remove this Button and Show the PDF in the Card Itself */}
          {data?.publicationURL ? (
            <img
              src={data?.publicationURL}
              alt="Publication Preview"
              className="previewImg"
            />
          ) : (
            <div className="no-preview">Preview not available</div>
          )}
          {/* Remove this Button and Show the PDF in the Card Itself */}
          <button className="openPreviewBtn" onClick={handlePreviewClick}>
            View Preview
          </button>
        </div>

        <div className="about-publisher">
          <img
            src={user?.profilePicture?.url || defaultProfile}
            alt="Publisher"
            className="publisher-pic"
          />
          <div className="publisher-details">
            <div className="name">
              {user?.name || "Unknown Author"}
              <p className="designation">
                {user?.userType || "Author"}
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
      {/* <LikeShareArea /> */}

      {/* Want to Remove this Preview Modal and Directly Show the PDF in the Card Itself */}
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
