import React, { useRef } from 'react'
import './AchievementsCard.scss'
import LikeShareArea from '../../components/LikeShareArea/LikeShareArea'
// import CommentSection from './Comments/commentSection'
import CommentsArea from '../../components/Comments/CommentsArea'
// import pics from '../../../assets/TempImages'

const AchievementsCard = ({data}) => {
    const imagesWrapperRef = useRef(null);

    // console.log("achivements:",data);

    const modules = import.meta.glob('../../../assets/TempImages/*.{png,jpg,jpeg}');
    const gallery = [];

    for (const path in modules) {
        const imagePath = new URL(path, import.meta.url).href;
        gallery.push(imagePath);
    }
    // console.log("gallery:", gallery);


    const handleLeftScroll = () => {
        if (imagesWrapperRef.current) {
            imagesWrapperRef.current.scrollLeft -= 671;
        }
    }

    const handleRightScroll = () => {
        if (imagesWrapperRef.current) {
            imagesWrapperRef.current.scrollLeft += 671;
        }
    }

    return (
        <div className="AchievementsCardOuter">
            
            <div className='AchievementsCard'>
                <h2 className="title">
                    {data.title}
                </h2>
                <hr className='titleSeperator' />
                <div className="desc">
                    <p>{data.description}</p>
                </div>


                <div className="slideShow">

                    <div className="scroll-btn scrollLeft" onClick={handleLeftScroll}>
                        <svg className='scrollSvg left' xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#5B729E"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
                    </div>

                    {/* This ref is helpful in differentiating images-wrappers of 
                    different achievementsCard renderings */}
                    {console.log(data.gallery)}
                    <div className="images-wrapper" ref={imagesWrapperRef}>
                        {data.gallery.map((image, index) => (
                            <div key={index} className={`SlideShowImage ${index}thImage`}>
                                <img src={(image.url)} alt={`Image ${index}`} />
                            </div>
                        ))}
                    </div>

                    <div className="scroll-btn scrollRight" onClick={handleRightScroll}>
                        <svg className='scrollSvg right' xmlns="http://www.w3.org/2000/svg" height="10.61px" viewBox="0 -960 960 960" width="6.14px" fill="#5B729E"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg>
                    </div>

                </div>

                {/* <div className="LikeShare-wrappper">
                    <LikeShareArea />
                </div> */}

            </div>
        
            <div className="commentsCardWrapper">
                {/* <CommentSection /> */}
                <CommentsArea />
            </div>
        </div>
    )
}

export default AchievementsCard