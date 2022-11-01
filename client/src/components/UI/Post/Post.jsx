import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Like from '../Like/Like';
import Dislike from '../Dislike/Dislike';
import cl from './Post.module.css';
import LikesService from '../../../API/LikesService'
import { useEffect } from 'react';
import { useFetching } from '../../../hooks/useFetching';
import { timeDifference } from '../../../utils/timeDifference';
import Category from '../Category/Category';

const Post = (props) => {
    const [isLiked, setIsLiked] = useState(props.isLiked);
    const [isDisliked, setIsDisliked] = useState(props.isDisliked);
    const [likes, setLikes] = useState('');
    const [dislikes, setDislikes] = useState('');
    const state = {isLiked, isDisliked, likes, dislikes, setIsDisliked, setIsLiked, setLikes, setDislikes};
    const postURL = '/posts/' + props.post.id;
    
    const [fetchMetadata, isMetadataLoading, metadataError] = useFetching(async () => {
        const likeInfo = await LikesService.getLikesInfo(postURL);
        setLikes(likeInfo.data.count.likes);
        setDislikes(likeInfo.data.count.dislikes);
        if (likeInfo.data.UserLike != -1) {
            likeInfo.data.UserLike.type ? setIsLiked(true) : setIsDisliked(true);
        }
    });
    
    useEffect(() => {
        fetchMetadata();
    }, [])

    return (
        <div className={cl.post}>
            <div className="post__content">
                <div className={cl.post__title}>
                    <Link to={postURL}>{props.post.title}</Link>
                </div>
                {/* <div className={cl.post__body}>
                    {props.post.content}
                </div> */}
                <div className={cl.post__metadata}>
                    <div className={cl.categories__container}>
                        {props.post.categories && props.post.categories.map((category) => 
                            <Category category={category}/>
                        )}
                    </div>
                    <div>
                        <div className={cl.likes}>
                            <Like state={state} url={postURL} disabled={isMetadataLoading}></Like>
                            <Dislike state={state} url={postURL} disabled={isMetadataLoading}></Dislike>
                        </div>
                        <div className={cl.timestamp}>
                            <span>{timeDifference(new Date().getTime(), props.post.publish_date)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;