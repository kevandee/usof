import React, {useState} from 'react';
import cl from './CommentLikes.module.css'
import CommentLike from './CommentLike/CommentLike';
import CommentDislike from './CommentDislike/CommentDislike';
import { useEffect } from 'react';

const CommentLikes = (props) => {
    //const {isLiked, isDisliked, setIsLiked, setIsDisliked, setDislikes, dislikes, setLikes, likes} = props.state;
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [likes, setLikes] = useState(props.comment.likeData.count.likes);
    const [dislikes, setDislikes] = useState(props.comment.likeData.count.dislikes);

    const state = {isLiked, isDisliked, likes, dislikes, setIsDisliked, setIsLiked, setLikes, setDislikes};
    const url = `/comments/${props.comment.id}`;
    useEffect(() => {
        if (props.comment.likeData.UserLike && props.comment.likeData.UserLike != -1) {
            props.comment.likeData.UserLike.type ? setIsLiked(true) : setIsDisliked(true);
        }
    }, [])

    return (
        <div className={cl.likes__container}>
            <CommentLike state={state} url={url}/>
            <CommentDislike state={state} url={url}/>
        </div>
    )
}

export default CommentLikes;