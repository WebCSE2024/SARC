import React, { useState } from "react";
import "./referral_card.css";
import { formatDate } from "../../utils/dateFormatter";
import { formatAmount } from "../../utils/numberFormatter";
import { formatDistanceToNow, parseISO } from "date-fns";
import defaultProfileImg from "../../../public/NoProfileImg.png";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaExternalLinkAlt,
  FaPhone,
  FaEnvelope,
  FaChevronDown,
  FaChevronUp,
  FaBuilding,
  FaBriefcase,
  FaCheckCircle,
} from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

const ReferralCard = ({ data, index = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const titleId = `ref-title-${data?.referralId || "item"}`;

  // Safe derived fields and fallbacks
  const personInfo = data?.addedBy?.[0];
  const createdAt = data?.createdAt;
  const jobProfile = data?.jobProfile || "";
  const companyName = data?.companyName || "";
  const description = data?.description || "";
  const requirements = data?.requirements || "";
  const locationCity = data?.location?.city;
  const locationCountry = data?.location?.country;
  const mode = data?.mode;
  const stipendAmount = data?.stipend?.amount;
  const stipendCurrency = data?.stipend?.currency;
  const deadline = data?.deadline;
  const website = data?.website || "#";
  const contact = data?.contact || "";
  const email = data?.email || "";

  const locationText =
    locationCity || locationCountry
      ? `${locationCity || ""}${locationCity && locationCountry ? ", " : ""}${
          locationCountry || ""
        }`
      : "Not specified";

  const getTimeAgo = (dateString) => {
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "";
    }
  };

  const isDeadlineSoon = () => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isDeadlinePassed = () => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const getWorkModeClass = () => {
    if (!mode) return "";
    const modeLC = mode.toLowerCase();
    if (modeLC.includes("remote")) return "mode-remote";
    if (modeLC.includes("hybrid")) return "mode-hybrid";
    return "mode-onsite";
  };

  return (
    <article
      className={`referral-card ${isExpanded ? "referral-card--expanded" : ""}`}
      role="article"
      aria-labelledby={titleId}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Card Header */}
      <header className="referral-card__header">
        <div className="referral-card__poster">
          <img
            src={personInfo?.profilePicture || defaultProfileImg}
            alt={personInfo?.name || "Profile"}
            className="referral-card__avatar"
          />
          <div className="referral-card__poster-info">
            <span className="referral-card__poster-name">
              {personInfo?.name || "Team CSES"}
            </span>
            <span className="referral-card__poster-time">
              {getTimeAgo(createdAt)}
            </span>
          </div>
        </div>
        {mode && (
          <span className={`referral-card__mode-badge ${getWorkModeClass()}`}>
            {mode}
          </span>
        )}
      </header>

      {/* Main Content */}
      <div className="referral-card__body">
        {/* Company & Role Section */}
        <div className="referral-card__role-section">
          <div className="referral-card__company-icon">
            <FaBuilding />
          </div>
          <div className="referral-card__role-details">
            <h3 className="referral-card__job-title" id={titleId}>
              {jobProfile || "Position Available"}
            </h3>
            <p className="referral-card__company-name">
              <FaBriefcase className="referral-card__inline-icon" />
              {companyName || "Company"}
            </p>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="referral-card__quick-info">
          <div className="referral-card__info-item">
            <div className="referral-card__info-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="referral-card__info-content">
              <span className="referral-card__info-label">Location</span>
              <span className="referral-card__info-value">{locationText}</span>
            </div>
          </div>

          <div className="referral-card__info-item">
            <div className="referral-card__info-icon referral-card__info-icon--money">
              <FaMoneyBillWave />
            </div>
            <div className="referral-card__info-content">
              <span className="referral-card__info-label">Stipend</span>
              <span className="referral-card__info-value">
                {stipendAmount != null
                  ? `${stipendCurrency || "₹"} ${formatAmount(stipendAmount)}`
                  : "Not disclosed"}
              </span>
            </div>
          </div>

          <div className="referral-card__info-item">
            <div
              className={`referral-card__info-icon ${
                isDeadlineSoon()
                  ? "referral-card__info-icon--urgent"
                  : isDeadlinePassed()
                  ? "referral-card__info-icon--expired"
                  : ""
              }`}
            >
              <FaClock />
            </div>
            <div className="referral-card__info-content">
              <span className="referral-card__info-label">Deadline</span>
              <span
                className={`referral-card__info-value ${
                  isDeadlineSoon() ? "referral-card__deadline--urgent" : ""
                } ${
                  isDeadlinePassed() ? "referral-card__deadline--expired" : ""
                }`}
              >
                {deadline ? formatDate(deadline) : "TBI"}
                {isDeadlineSoon() && (
                  <span className="referral-card__urgent-tag">Soon!</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Description Preview */}
        <div className="referral-card__description">
          <div
            className={`referral-card__description-content ${
              !isExpanded ? "referral-card__description-content--truncated" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        {/* Expandable Requirements Section */}
        {isExpanded && requirements && (
          <div className="referral-card__requirements">
            <h4 className="referral-card__section-title">
              <FaCheckCircle className="referral-card__section-icon" />
              Requirements
            </h4>
            <div
              className="referral-card__requirements-list"
              dangerouslySetInnerHTML={{ __html: requirements }}
            />
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          className="referral-card__expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              <FaChevronUp /> Show Less
            </>
          ) : (
            <>
              <FaChevronDown /> Show More Details
            </>
          )}
        </button>
      </div>

      {/* Footer with Actions */}
      <footer className="referral-card__footer">
        <div className="referral-card__contact-info">
          {contact && (
            <a href={`tel:${contact}`} className="referral-card__contact-link">
              <FaPhone />
              <span>{contact}</span>
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="referral-card__contact-link">
              <FaEnvelope />
              <span>{email}</span>
            </a>
          )}
        </div>

        <a
          href={website}
          target="_blank"
          rel="noreferrer noopener"
          className="referral-card__apply-btn"
        >
          <HiOutlineSparkles />
          Apply Now
          <FaExternalLinkAlt className="referral-card__external-icon" />
        </a>
      </footer>
    </article>
  );
};

export default ReferralCard;
