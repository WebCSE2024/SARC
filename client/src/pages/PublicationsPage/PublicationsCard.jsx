import React from 'react'
import './PublicationsCard.scss'
import LikeShareArea from '../../utils/LikeShareArea';
import { useState } from 'react';
import defaultProfile from '../../assets/noProfileImg.png'
import samplePdfPreview from '../../assets/samplePdfPreview.jpeg'

const PublicationsCard = () => {
    // const [isbooked, setIsbooked] = useState(false);

    // const handleBookmarkChange = (e) => {
    //     setIsbooked(e.target.checked);

    //     // Here we will add logic to save the bookmark state to backend/localStorage
    // };

    return (
        <div className='PublicationsCard'>

            <div className="title-save">
                <h3 className="title">AI-Driven Cybersecurity in Cloud Computing</h3>
                {/* <span className='BookmarkSpan'>
                    <input
                        type="checkbox"
                        id='bookmark-chkbox-publications'
                        className='bookmark-chkbox'
                        checked={isbooked}
                        onChange={handleBookmarkChange}
                    />

                    <label htmlFor='bookmark-chkbox-publications' className='label-bookmark-chkbox'>

                        <svg viewBox="0 0 48 48" height="24px" width="18px" version="1" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 48 48">
                            <path fill={isbooked ? "#8D91B0" : "none"} d="M37,43l-13-6l-13,6V9c0-2.2,1.8-4,4-4h18c2.2,0,4,1.8,4,4V43z"></path>
                        </svg>

                    </label>
                </span> */}
            </div>


            <div className="preview-publisher-details">
                <div className="paper-preview">
                    <img src={samplePdfPreview} alt="" className="previewImg" />
                    <button className="openPreviewBtn">Click to Preview</button>
                </div>

                <div className="about-publisher">
                    <img src={defaultProfile} alt="" className='publisher-pic' />
                    <div className="publisher-details">
                        <h3 className="name">
                            Prof. Sandeep Verma
                            <br />
                            <span className='designation'> (Dept. of Computer Science, ABC University)</span>
                        </h3>
                        <div className="contact">
                            <p className="phoneNum">
                                <span className='phoneNumIcon'>
                                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.2368 16.5C15.5719 16.5 15.8931 16.3669 16.13 16.13C16.3669 15.8931 16.5 15.5719 16.5 15.2368V12.2895C16.5 11.9545 16.3669 11.6332 16.13 11.3963C15.8931 11.1594 15.5719 11.0263 15.2368 11.0263C14.2516 11.0263 13.2832 10.8747 12.3568 10.5632C12.1354 10.4933 11.899 10.4853 11.6733 10.5403C11.4477 10.5952 11.2414 10.7109 11.0768 10.8747L9.86421 12.0874C7.76925 10.9441 6.04744 9.22233 4.90421 7.12737L6.10842 5.92316C6.45368 5.59474 6.58 5.10632 6.42842 4.63474C6.12526 3.71684 5.97368 2.74842 5.97368 1.76316C5.97368 1.42815 5.8406 1.10686 5.60371 0.86997C5.36683 0.633082 5.04554 0.5 4.71053 0.5H1.76316C1.42815 0.5 1.10686 0.633082 0.86997 0.86997C0.633082 1.10686 0.5 1.42815 0.5 1.76316C0.5 9.88947 7.11053 16.5 15.2368 16.5ZM1.76316 1.34211H4.71053C4.8222 1.34211 4.92929 1.38647 5.00826 1.46543C5.08722 1.54439 5.13158 1.65149 5.13158 1.76316C5.13158 2.84105 5.3 3.89368 5.62842 4.89579C5.67053 5.01368 5.66211 5.18211 5.52737 5.31684L3.86842 6.96737C5.25789 9.68737 7.29579 11.7253 10.0242 13.1316L11.6663 11.4726C11.7842 11.3547 11.9442 11.3211 12.0958 11.3632C13.1063 11.7 14.1589 11.8684 15.2368 11.8684C15.3485 11.8684 15.4556 11.9128 15.5346 11.9917C15.6135 12.0707 15.6579 12.1778 15.6579 12.2895V15.2368C15.6579 15.3485 15.6135 15.4556 15.5346 15.5346C15.4556 15.6135 15.3485 15.6579 15.2368 15.6579C7.57368 15.6579 1.34211 9.42632 1.34211 1.76316C1.34211 1.65149 1.38647 1.54439 1.46543 1.46543C1.54439 1.38647 1.65149 1.34211 1.76316 1.34211Z" fill="#8D91B0" />
                                    </svg>
                                </span> +91 98765 43210</p>
                            <p className="emailId">
                                <span className='emailIcon'>
                                    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.973684 0.533333V0C0.848055 0 0.727572 0.0561904 0.638739 0.15621C0.549906 0.256229 0.5 0.391885 0.5 0.533333H0.973684ZM18.0263 0.533333H18.5C18.5 0.391885 18.4501 0.256229 18.3613 0.15621C18.2724 0.0561904 18.1519 0 18.0263 0V0.533333ZM0.973684 1.06667H18.0263V0H0.973684V1.06667ZM17.5526 0.533333V13.3333H18.5V0.533333H17.5526ZM16.1316 14.9333H2.86842V16H16.1316V14.9333ZM1.44737 13.3333V0.533333H0.5V13.3333H1.44737ZM2.86842 14.9333C2.49153 14.9333 2.13008 14.7648 1.86359 14.4647C1.59709 14.1646 1.44737 13.7577 1.44737 13.3333H0.5C0.5 14.0406 0.749529 14.7189 1.19369 15.219C1.63786 15.719 2.24028 16 2.86842 16V14.9333ZM17.5526 13.3333C17.5526 13.7577 17.4029 14.1646 17.1364 14.4647C16.8699 14.7648 16.5085 14.9333 16.1316 14.9333V16C16.7597 16 17.3621 15.719 17.8063 15.219C18.2505 14.7189 18.5 14.0406 18.5 13.3333H17.5526Z" fill="#8D91B0" />
                                        <path d="M0.973633 0.533325L9.49995 10.1333L18.0263 0.533325" stroke="#8D91B0" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                </span> john.doe@xyztech.com</p>
                        </div>
                    </div>
                </div>
            </div>

            <p className='Note'>Kindly contact the author for access to full publication.</p>
            <LikeShareArea />
            
        </div>
    )
}

export default PublicationsCard


// <span className='BookmarkSpan'>
// <input
//     type="checkbox"
//     id='bookmark-chkbox-publications'
//     className='bookmark-chkbox'
//     checked={isbooked}
//     onChange={handleBookmarkChange}
// />

// <label htmlFor='bookmark-chkbox-publications' className='label-bookmark-chkbox'>
//     {/* <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={isbooked ? "#000000" : "#8D91B0"}>
// <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Z" />
// </svg> */}

//     <svg viewBox="0 0 40 40"  version="1" xmlns="http://www.w3.org/2000/svg" >
//         <path  fill={isbooked ? "#8D91B0" : "none"} d="M37,43l-13-6l-13,6V9c0-2.2,1.8-4,4-4h18c2.2,0,4,1.8,4,4V43z"></path>
//     </svg>

// </label>
// </span>