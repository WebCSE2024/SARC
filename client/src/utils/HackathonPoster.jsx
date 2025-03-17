import React from 'react'
import './HackathonPoster.scss'

const HackathonPoster = ({imageUrl}) => {
    console.log(imageUrl);
    return (
        <div className={`HackathonPoster ${imageUrl==undefined?`NoImg`:`posterPresent`}`}>
            <img className='PosterImg' src={imageUrl} alt="" srcset="" />
            <div className={`Hack-info ${imageUrl==undefined?`NoImg`:`posterPresent`}`}>
                <div className="heading">
                    <span className='HackathonTitle'><span className='HackathonType'> <span className="color">HackX 2025</span> :</span> National Level Hackathon</span>

                    <div className='Registeration'>
                        <a href="">Register Now</a>
                    </div>
                </div>
                <ul className={`Hack-Desc ${imageUrl==undefined?`NoImg`:`posterPresent`}`}>
                    <li>Date: <b> 10th-12th August 2025</b></li>
                    <li>Venue:  <b>ABC University, Kolkata.  </b></li>
                    <li>Starts at <b>6:00 PM.</b></li>
                    {/* <br /> */}
                    <div className='PIC-details'>
                        <p className='pic-name'>Person of Contact: <b>Mr. Ramesh Gupta</b></p>
                        <div className='pic-otherDetails'>
                            {/*  add email and phone number here */}
                            <p>{`emailId@iitism.ac.in`}</p>
                            <p>Ph: +91 {`98765 43211`}</p>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    )
}

export default HackathonPoster