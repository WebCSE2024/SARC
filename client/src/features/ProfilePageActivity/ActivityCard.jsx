import React from "react";
import { useRef } from "react";
import "./ActivityCard.scss";
import PublicationsCard from "../../pages/PublicationsPage/PublicationsCard";
import ReferralCard from "../ReferralCard/referral_card";

const ActivityCard = () => {
  const activitiesWrapperRef = useRef(null);

  const handleLeftScroll = () => {
    if (activitiesWrapperRef.current) {
      activitiesWrapperRef.current.scrollLeft -= 671;
    }
  };

  const handleRightScroll = () => {
    if (activitiesWrapperRef.current) {
      activitiesWrapperRef.current.scrollLeft += 671;
    }
  };

  return (
    <section className="activities">
      <h2>Activity</h2>

      <div
        className="activitySlideShow-wrapper"
        role="region"
        aria-label="Recent activity"
      >
        <div
          className="activity-scroll-btn scrollLeft"
          role="button"
          tabIndex={0}
          aria-label="Scroll left"
          onClick={handleLeftScroll}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleLeftScroll()
          }
        >
          <svg
            className="scrollSvg left"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="#5B729E"
          >
            <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
          </svg>
        </div>

        <div
          className="allActivityCards"
          ref={activitiesWrapperRef}
          aria-live="polite"
        >
          {/* <div className="ActivityCard">hello</div>
                            <div className="ActivityCard">hello</div>
                            <div className="ActivityCard">hello</div> */}
          <span className="ActivityCard">
            <PublicationsCard />
          </span>
          <span className="ActivityCard">
            <ReferralCard />
          </span>
          <span className="ActivityCard">
            <ReferralCard />
          </span>
          <span className="ActivityCard">
            <PublicationsCard />
          </span>
        </div>

        <div
          className="activity-scroll-btn scrollRight"
          role="button"
          tabIndex={0}
          aria-label="Scroll right"
          onClick={handleRightScroll}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleRightScroll()
          }
        >
          <svg
            className="scrollSvg right"
            xmlns="http://www.w3.org/2000/svg"
            height="10.61px"
            viewBox="0 -960 960 960"
            width="6.14px"
            fill="#5B729E"
          >
            <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default ActivityCard;
