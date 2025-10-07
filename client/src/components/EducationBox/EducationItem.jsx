import React from 'react'
import './EducationItem.scss'

const EducationItem = ({ data }) => {
    const eduData=data;
    return (

        <div className="education-item">
            <div className="edu-header">
                <div className="institute-logo">
                    {eduData && eduData.universityLogo && (<img src={eduLogo} alt="Institute Logo" />)}
                </div>
                <div className="edu-details">
                    <h3>{eduData.university}</h3>
                    <p className="degree">{eduData.degree}</p>
                    <p className="dateOfCompletion">{eduData.year}</p>
                    <p className="grade">{eduData.grade}</p>
                </div>
            </div>
        </div>
    )
}

export default EducationItem