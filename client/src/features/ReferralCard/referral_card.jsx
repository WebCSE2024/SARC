import React from "react";
import "./referral_card.css";
import { formatDate } from "../../utils/dateFormatter";
import { formatAmount } from "../../utils/numberFormatter";
// import profilePic from "../../assets/NoProfileImg.png";
import ProfileHeader from "../../components/ProfileHeader/profileHeader";

import ReferralEntry from "../../SampleData/ReferralEntry.json";

const ReferralCard = ({ data }) => {
  // console.log('props', props);

  // console.log("received referral data:")
  // console.log(data);

  if (data == undefined) data = ReferralEntry;

  const titleId = `ref-title-${data?.referralId || "item"}`;

  return (
    <div className="card-container" role="article" aria-labelledby={titleId}>
      <div className="top-block">
        {/* Header Section */}
        <ProfileHeader
          personInfo={data && data.addedBy[0]}
          createdAt={data && data.createdAt}
          eventId={data && data.referralId}
        />
      </div>

      {/* Job Description */}
      <div className="company">
        <div className="greet">
          <p>
            Greeting everyone! {data && data.companyName} has released a job
            opening.
          </p>
        </div>
        <div className="second-block">
          <div className="post">
            <div className="post-box">
              <div className="post-name">
                <p className="p">POST</p>
                <span className="post-title" id={titleId}>
                  {data && data.jobProfile} ({data && data.companyName})
                </span>
              </div>{" "}
              <div className="post-description">
                <div
                  dangerouslySetInnerHTML={{ __html: data && data.description }}
                />
              </div>
            </div>

            <div className="requirements">
              <h6 className="subtitle">Requirements:</h6>
              <div
                className="requirements-list"
                dangerouslySetInnerHTML={{ __html: data && data.requirements }}
              />
            </div>

            <div className="job-details">
              <div className="detail">
                <p className="job-heading">Location:</p>
                <span className="job-text">
                  {" "}
                  {data &&
                    `${data.location.city}, ${data.location.country} (${data.mode})`}
                </span>
              </div>
              <div className="detail">
                <p className="job-heading">Stipend:</p>
                <span className="job-text">
                  {data && formatAmount(data.stipend.amount)}{" "}
                  {data && data.stipend.currency}
                </span>
              </div>
              <div className="detail">
                <p className="job-heading">Deadline:</p>
                <span className="job-text">
                  {data && formatDate(data.deadline)}
                </span>
              </div>
              <div className="detail">
                <p className="job-heading">
                  <a
                    href={data && data.website}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Website Link
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="contact-details">
            <div className="phone-number">
              <div className="img-phone">
                <svg
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.9211 20C19.3398 20 19.7414 19.8336 20.0375 19.5375C20.3336 19.2414 20.5 18.8398 20.5 18.4211V14.7368C20.5 14.3181 20.3336 13.9165 20.0375 13.6204C19.7414 13.3242 19.3398 13.1579 18.9211 13.1579C17.6895 13.1579 16.4789 12.9684 15.3211 12.5789C15.0442 12.4916 14.7487 12.4817 14.4667 12.5503C14.1846 12.619 13.9268 12.7636 13.7211 12.9684L12.2053 14.4842C9.58657 13.0552 7.4343 10.9029 6.00526 8.28421L7.51053 6.77895C7.94211 6.36842 8.1 5.75789 7.91053 5.16842C7.53158 4.02105 7.34211 2.81053 7.34211 1.57895C7.34211 1.16018 7.17575 0.758573 6.87964 0.462463C6.58353 0.166353 6.18192 0 5.76316 0H2.07895C1.66018 0 1.25857 0.166353 0.962463 0.462463C0.666353 0.758573 0.5 1.16018 0.5 1.57895C0.5 11.7368 8.76316 20 18.9211 20ZM2.07895 1.05263H5.76316C5.90275 1.05263 6.03662 1.10808 6.13532 1.20679C6.23402 1.30549 6.28947 1.43936 6.28947 1.57895C6.28947 2.92632 6.5 4.24211 6.91053 5.49474C6.9631</svg>6 5.64211 6.95263 5.85263 6.78421 6.02105L4.71053 8.08421C6.44737 11.4842 8.99474 14.0316 12.4053 15.7895L14.4579 13.7158C14.6053 13.5684 14.8053 13.5263 14.9947 13.5789C16.2579 14 17.5737 14.2105 18.9211 14.2105C19.0606 14.2105 19.1945 14.266 19.2932 14.3647C19.3919 14.4634 19.4474 14.5973 19.4474 14.7368V18.4211C19.4474 18.5606 19.3919 18.6945 19.2932 18.7932C19.1945 18.8919 19.0606 18.9474 18.9211 18.9474C9.3421 18.9474 1.55263 11.1579 1.55263 1.57895C1.55263 1.43936 1.60808 1.30549 1.70679 1.20679C1.80549 1.10808 1.93936 1.05263 2.07895 1.05263Z"
                    fill="#8D91B0"
                  />
                </svg>
              </div>

              <div className="number">
                <p className="number-text">
                  {data && data.contact && data.contact}
                </p>
              </div>
            </div>
            <div className="email">
              <div className="emailpic">
                <svg
                  width="25"
                  height="13"
                  viewBox="0 0 25 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.13184 1.1001L12.5003 11.9001L23.8687 1.1001"
                    stroke="#8D91B0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="emailid">
                <p className="id">{data && data.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div>Hello</div>
  );
};

export default ReferralCard;
