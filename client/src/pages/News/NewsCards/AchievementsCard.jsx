import React from 'react'
import './AchievementsCard.scss'
import LikeShareArea from '../../../utils/LikeShareArea'

// import pics from '../../../assets/TempImages'

const AchievementsCard = () => {

    const modules = import.meta.glob('../../../assets/TempImages/*.{png,jpg,jpeg}');
    const gallery = [];

    for (const path in modules) {
        const imagePath = new URL(path, import.meta.url).href;
        gallery.push(imagePath);
    }
    console.log("gallery:", gallery);

    return (
        <div className='AchievementsCard'>
            <h2 className="title">
                Some_achievement_title
            </h2>
            <hr className='titleSeperator' />
            <div className="desc">
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi at aspernatur atque sed commodi, obcaecati quod suscipit quibusdam et dolore doloremque. Dolorum voluptatibus nihil laudantium? Quisquam, eveniet illum? Eos, cupiditate.
                </p>

                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem facilis architecto molestiae. Corrupti, sit cupiditate recusandae accusamus odio ipsum dicta obcaecati eaque, quam aliquam ratione excepturi inventore eum velit omnis.
                </p>
            </div>

            <div className="slideShow">

                {gallery.map((image, index) => (
                    <div className="SlideShowImage">
                        <img key={index} src={image} alt={`Image ${index}`} />
                    </div>
                ))}

            </div>

            <div className="LikeShare-wrappper">
                <LikeShareArea />
            </div>

        </div>
    )
}

export default AchievementsCard