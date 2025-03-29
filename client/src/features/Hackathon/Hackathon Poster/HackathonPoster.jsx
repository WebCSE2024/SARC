import React from 'react'
import './HackathonPoster.scss'
import EventBg from '../../../../public/EventBg.png'
import { formatDate } from '../../../utils/dateFormatter'

const HackathonPoster = ({ data, imageUrl }) => {

    // console.log(imageUrl.posterImg);
    // if(imageUrl!= undefined && imageUrl.length==undefined)  imageUrl=undefined;
    // if (imageUrl) console.log(imageUrl)
    // imageUrl = imageUrl.posterImg;

    // console.log(data.contacts)
    
    return (
        <div className={`HackathonPoster ${imageUrl == undefined ? 'NoImg' : 'posterPresent'}`}>
            <div className={`Hack-info ${imageUrl == undefined ? 'NoImg' : 'posterPresent'}`}>
                <div className="posterContainer">
                    {imageUrl && <img className='PosterImg' src={imageUrl} alt="Hackathon Poster" />}
                </div>
                <div className="detailsWrapper">
                    <div className="heading">
                        <span className='HackathonTitle'><span className='HackathonType'> <span className="color">{data.title}</span></span> {/*short desc here.*/}</span>

                        <div className='Registeration'>
                            <a href={data.reg_url} target='_blank' rel='noreferrer noopener'>Register Now</a>
                        </div>
                    </div>
                    <ul className={`Hack-Desc ${imageUrl == undefined ? `NoImg` : `posterPresent`}`} >
                        <li className='detailPoint'>Date: <b> {data && formatDate(data.eventDate)}</b></li>
                        <li className='detailPoint'>Venue:  <b>{data && data.venue}  </b></li>
                        {/* <li className='detailPoint'>Starts at <b>6:00 PM.</b></li> */}
                        {/* <br /> */}
                        <div className='PIC-details'>
                            <p className='pic-name'>Person of Contact: <b>{data && data.contacts.name}</b></p>
                            <div className='pic-otherDetails'>
                                <p>Email: {data && data.contacts.email}</p>
                                {data && data.contacts.phone && (
                                    <p>Phone: {data.contacts.phone}</p>
                                )}
                                <p className='prize-pool'>Prize: <b>₹{data && data.prizePool?.toLocaleString()}</b></p>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HackathonPoster