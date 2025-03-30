import React from 'react'
import "./ExperienceItem.scss"
import experienceLogo from '../../../public/MainLogo.svg'

const ExperienceBox = ({ data }) => {
    return (
        <div className="experience-item">
            <div className="exp-header">
                <div className="company-logo">
                    {data.companyLogo && (<img src={data.comanyLogo || experienceLogo} alt="Company Logo" />)}
                </div>
                <div className="exp-details">
                    <h3>{data.position}</h3>
                    <p className="company-name">{data.companyName}</p>
                    <p className="duration">{data.timeline.start} to {data.timeline.end}</p>
                    <p className="location">{data.location}</p>
                </div>
            </div>
            <div className="exp-description">
                <ul>
                    <p>{data && data.highlights}</p>
                    {/* <li>Developed and maintained web applications</li>
                    <li>Collaborated with cross-functional teams</li>
                    <li>Improved application performance by 40%</li> */}
                </ul>
            </div>
        </div>
    )
}

export default ExperienceBox