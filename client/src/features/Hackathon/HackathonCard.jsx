import React, { useState } from 'react'
import HackathonPoster from './Hackathon Poster/HackathonPoster'
import './HackathonCard.scss'
import ProfileHeader from '../../components/ProfileHeader/profileHeader'
// import bkmark from '../assets/Bookmark.svg'
// import PdfSvg from '../../assets/RuleBook.svg'
import PdfSvg from '../../../public/Rulebook.svg'
// import CommentSection from './Comments/commentSection'
import CommentsArea from '../../components/Comments/CommentsArea'

const HackathonCard = ({data}) => {
    // const posterImg='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvGVNKFKB3h0ay5aBrx-YVN_FcDgH6uf_lpjiGNtTpg1DOaTmRxca2WVB07obEBgS-CRQ&usqp=CAU';
    const posterImg=data.img_url;
    const [isLiked, setIsLiked] = useState(false);

    // console.log(data);
    // console.log(typeof(data));

    const handleLikeClick = () => {
        setIsLiked(!isLiked);
    };

    const handleShareHackathon = () => {
        // console.log(`share clicked!`);
    }

    return (
        <div className="HackathonCardOuter">
            <div className='HackathonCard'>

                {/* ADD HACKATHON ID HERE */}
                <ProfileHeader createdAt={data && data.createdAt} eventId={`hackathonId-${data.id}`} />

                <div className='HackathonDesc'>
                    <p>
                        {data && data.description}
                        {/* HackX 2025 is a 36-hour hackathon designed for innovators and problem solvers. Compete with the best minds, build impactful solutions, and win exciting prizes! */}
                    </p>
                </div>

                {/* <HackathonPoster imageUrl={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvGVNKFKB3h0ay5aBrx-YVN_FcDgH6uf_lpjiGNtTpg1DOaTmRxca2WVB07obEBgS-CRQ&usqp=CAU`}/> */}
                {/* <HackathonPoster /> */}
                <HackathonPoster imageUrl={posterImg}  data={data} />

                <a href={data.ruleBookLink} target='_blank' rel='noreferrer noopener' className="rulebook" >
                    <img src={PdfSvg} alt="" srcset="" /> Rulebook
                </a>

                    {/*following can be added later for more functionality */}
                {/* <div className="HackathonEnd">
                    <p className='Volunteer'>Want to volunteer? <a href="">CLICK HERE</a> | REGISTRATION DEADLINE: <b>11:59 PM, 05-03-2025 </b></p>
                    
                    <hr />
                    <div className="LikeShare">
                        <div className="like" onClick={handleLikeClick}>
                            <svg
                                className={`like-icon ${isLiked ? 'liked' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                            </svg>
                            <span className="likeTxt">
                                Like
                            </span>
                        </div>


                        <div className="share" onClick={handleShareHackathon}>

                            <svg className='share-icon' version="1.0" xmlns="http://www.w3.org/2000/svg"
                                width="36px" height="36px" viewBox="0 0 675.000000 675.000000"
                                preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,675.000000) scale(0.100000,-0.100000)">
                                    <path d="M3949 5667 c-59 -50 -59 -46 -59 -525 l0 -439 -87 -17 c-49 -9 -122
-24 -163 -32 -120 -24 -283 -67 -338 -90 -18 -8 -39 -14 -47 -14 -8 0 -29 -6
-47 -14 -18 -8 -53 -22 -78 -32 -41 -16 -88 -36 -195 -84 -22 -10 -47 -20 -55
-24 -8 -3 -28 -15 -45 -26 -16 -11 -40 -24 -53 -30 -12 -5 -50 -28 -83 -50
-33 -22 -63 -40 -65 -40 -3 0 -51 -34 -107 -77 -199 -149 -412 -384 -533 -588
-28 -47 -144 -283 -144 -293 0 -5 -6 -23 -14 -39 -35 -71 -90 -278 -120 -448
-43 -248 -58 -598 -32 -770 13 -92 17 -101 48 -127 66 -55 136 -30 194 70 15
26 30 49 33 52 3 3 15 21 25 40 27 48 156 220 230 305 62 71 215 227 296 301
47 42 325 254 334 254 3 0 22 12 43 26 21 14 47 30 58 35 11 5 34 18 50 28 17
11 77 42 135 71 58 28 114 56 124 62 11 6 31 14 45 18 14 5 51 18 81 30 64 24
153 54 225 75 82 23 258 65 275 65 6 0 10 -137 10 -380 0 -331 2 -385 16 -413
30 -59 43 -67 102 -67 67 0 42 -18 382 273 83 71 112 96 155 132 27 22 55 47
64 56 9 8 45 39 81 69 36 29 92 77 125 105 33 29 128 110 210 180 153 129 170
144 240 205 23 19 63 53 89 75 27 22 55 45 61 52 7 7 55 48 106 91 52 43 108
90 124 104 17 15 66 57 110 95 124 106 120 100 120 165 0 64 2 60 -108 151
-34 28 -73 62 -87 75 -14 14 -54 48 -90 77 -36 29 -80 66 -98 83 -18 16 -54
47 -80 68 -47 40 -252 214 -307 261 -16 15 -72 62 -124 105 -51 43 -99 84
-105 91 -7 7 -34 30 -61 52 -43 36 -76 64 -155 132 -14 11 -95 80 -180 153
-85 72 -168 143 -185 157 -89 77 -203 171 -225 186 -34 24 -89 21 -121 -6z
m241 -399 c56 -50 96 -84 200 -172 52 -44 100 -85 106 -90 6 -6 32 -29 59 -51
44 -37 91 -76 155 -132 51 -44 537 -457 584 -497 27 -22 54 -46 61 -53 6 -6
41 -35 76 -64 35 -29 77 -65 93 -81 17 -15 33 -28 38 -28 37 0 -43 -79 -256
-255 -27 -22 -55 -45 -61 -52 -7 -7 -55 -48 -106 -91 -52 -43 -107 -90 -124
-105 -16 -14 -84 -71 -150 -127 -66 -56 -131 -112 -145 -124 -14 -12 -77 -66
-140 -120 -63 -54 -126 -108 -140 -120 -14 -11 -53 -44 -88 -73 -34 -29 -68
-58 -76 -65 -62 -60 -127 -108 -137 -102 -5 3 -9 151 -9 329 l0 324 -31 36
c-30 33 -34 35 -96 35 -67 0 -199 -21 -289 -46 -28 -8 -59 -14 -70 -14 -10 0
-36 -6 -59 -14 -22 -8 -67 -22 -100 -31 -64 -19 -82 -25 -215 -75 -87 -33
-184 -76 -255 -113 -22 -12 -66 -35 -98 -52 -67 -35 -78 -41 -134 -78 -24 -15
-47 -27 -52 -27 -5 0 -11 -3 -13 -7 -3 -8 -16 -18 -133 -97 -38 -27 -74 -54
-80 -61 -5 -6 -39 -34 -75 -60 -83 -61 -402 -383 -455 -458 -22 -31 -46 -57
-52 -57 -18 0 -16 69 6 240 25 186 47 290 83 395 5 17 14 44 18 60 11 38 37
110 49 133 5 9 25 51 45 92 119 242 238 398 446 585 66 60 126 105 139 105 6
0 11 4 11 9 0 9 187 124 260 160 25 12 52 26 60 30 30 17 125 58 198 85 102
39 120 45 177 61 33 9 74 21 90 27 29 10 53 15 165 39 30 6 83 17 117 25 34 8
77 14 95 14 18 1 69 7 113 15 70 12 84 18 108 47 l27 32 0 366 c0 202 3 370 7
373 10 11 13 9 53 -25z"/>
                                    <path d="M1700 5244 c-93 -14 -159 -30 -205 -50 -147 -63 -232 -116 -323 -199
-35 -31 -148 -165 -169 -200 -36 -59 -86 -172 -115 -260 l-33 -100 0 -1280 c0
-1216 1 -1283 19 -1345 18 -65 37 -120 62 -175 7 -16 15 -37 19 -45 18 -45 99
-162 156 -224 47 -51 162 -145 224 -183 42 -26 166 -83 180 -83 8 0 29 -6 47
-14 18 -8 71 -21 118 -30 75 -14 222 -16 1275 -16 1142 0 1194 1 1290 20 55
11 125 29 155 41 30 11 65 23 77 26 12 3 28 11 34 19 6 8 16 14 21 14 21 0
177 112 232 166 137 137 221 285 273 479 14 51 17 136 20 540 2 449 1 481 -15
501 -21 25 -74 54 -97 54 -28 0 -92 -47 -103 -77 -8 -19 -13 -178 -15 -478 -4
-428 -5 -453 -25 -513 -49 -143 -110 -242 -210 -340 -55 -54 -148 -122 -168
-122 -6 0 -17 -7 -24 -15 -7 -8 -21 -15 -30 -15 -10 0 -31 -6 -47 -14 -86 -42
-40 -41 -1343 -44 -1127 -3 -1251 -1 -1305 13 -70 19 -139 49 -241 103 -70 38
-243 231 -270 302 -3 8 -10 23 -15 32 -22 42 -48 140 -58 217 -15 116 -15
2286 0 2402 13 102 39 185 81 259 4 8 11 22 15 30 14 32 100 137 145 179 54
48 96 78 164 116 79 44 121 57 269 84 40 7 345 11 923 11 l863 0 29 31 c37 41
43 84 18 132 -35 70 11 67 -950 66 -645 -1 -884 -5 -948 -15z"/>
                                </g>
                            </svg>

                            <span className="shareTxt">
                                Share
                            </span>
                        </div>
                    </div>
                </div> */}

            </div>

            <div className="commentsCardWrapper">
                {/* <CommentSection /> */}
                <CommentsArea />
            </div>
        </div>
    )
}

export default HackathonCard