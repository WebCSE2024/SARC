import React, { useState } from "react";
import "./EventsCard.scss";
import ProfileHeader from "../../components/ProfileHeader/profileHeader";
import { EventTypes } from "../../../../../shared/types/events.type.js";
import CommentsArea from "../../components/Comments/CommentsArea";
import PdfSvg from "../../../public/Rulebook.svg";

// export const EventTypes = {
//   HACKATHON: "hackathon",
//   CULTURAL: "cultural",
//   CONFERENCE: "conference",
//   OTHER: "other",
// };

import { formatDate } from "../../utils/dateFormatter.jsx";

const EventsCard = ({ data }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Check event type to determine display
  const isHackathon =
    data.type?.toLowerCase() === EventTypes.HACKATHON.toLowerCase();
  const isCultural =
    data.type?.toLowerCase() === EventTypes.CULTURAL.toLowerCase();
  const isConference =
    data.type?.toLowerCase() === EventTypes.CONFERENCE.toLowerCase();
  const isContests =
    data.type?.toLowerCase() === EventTypes.CONTESTS.toLowerCase();

  return (
    <div className="eventCardOuter">
      <div className="eventCard">
        <ProfileHeader createdAt={data && data.createdAt} eventData={data} />

        <div className="eventDesc">
          <p>{data && data.description}</p>
        </div>

        <div className="Talk-info">
          <div className="heading">
            <span className="eventTitle">
              <span className="eventType">
                {" "}
                <span className="color">{data.title}</span>{" "}
              </span>{" "}
            </span>
          </div>
          <ul className="talk-Desc">
            <li className="descPoints">
              Date: <b> {formatDate(data.date)}</b>
            </li>

            {/* Show venue only for CULTURAL or CONFERENCE events */}
            {!isHackathon && !isContests && (
              <li className="descPoints">
                Venue: <b>{data.venue} </b>
              </li>
            )}

            {/* Show prize pool for HACKATHON and CONTESTS events */}
            {(isHackathon || isContests) && data.prizePool && (
              <li className="descPoints">
                Prize Pool: <b>₹{data.prizePool} </b>
              </li>
            )}

            {/* Show speaker info if available */}
            {data && data.speaker && (
              <p>
                Speaker: <b>{data.speaker.name}</b>,{" "}
                {data.speaker.designation && data.speaker.designation},{" "}
                {data.speaker.organization}
              </p>
            )}

            {data && data.contacts && data.contacts.length > 0 && (
              <li className="descPoints contact-info">
                <p>
                  <b>Contacts:</b>
                </p>
                {data.contacts.map((contact, index) => (
                  <div key={index} className="contact-item">
                    {contact.name && (
                      <p>
                        Name: <b>{contact.name}</b>
                      </p>
                    )}
                    {contact.email && (
                      <p>
                        Email: <b>{contact.email}</b>
                      </p>
                    )}
                    {contact.phone && (
                      <p>
                        Phone: <b>{contact.phone}</b>
                      </p>
                    )}
                    {contact.role && (
                      <p>
                        Role: <b>{contact.role}</b>
                      </p>
                    )}
                  </div>
                ))}
              </li>
            )}
          </ul>
        </div>

        {/* Show rulebook link only for HACKATHON and CONTESTS events */}
        {(isHackathon || isContests) && data.ruleBookLink && (
          <a
            href={data.ruleBookLink}
            target="_blank"
            rel="noreferrer noopener"
            className="rulebook"
          >
            <img src={PdfSvg} alt="Rulebook icon" /> Rulebook
          </a>
        )}

        {/* Show registration link if available */}
        {data.reg_url && (
          <div className="register-link">
            <a
              href={data.reg_url}
              target="_blank"
              rel="noreferrer noopener"
              className="register-button"
            >
              Register Now
            </a>
          </div>
        )}
      </div>

      <div className="commentsCardWrapper">
        <CommentsArea postId={data._id} referenceModel="Event" />
      </div>
    </div>
  );
};

export default EventsCard;
