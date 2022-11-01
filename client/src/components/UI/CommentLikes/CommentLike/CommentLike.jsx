import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons'
import LikesService from '../../../../API/LikesService'
import cl from './CommentLike.module.css'

const CommentLike = (props) => {
    const {isLiked, isDisliked, setIsLiked, setIsDisliked, setDislikes, dislikes, setLikes, likes} = props.state;
    let handleLike = () => {
        if (isDisliked) {
            setIsDisliked(false);
            LikesService.deleteLike(props.url);
            setDislikes(dislikes - 1);
        }
        if (isLiked) {
            LikesService.deleteLike(props.url);
            setLikes(likes - 1);
        }
        else {
            LikesService.newLike(props.url);
            setLikes(likes + 1);
        }
        setIsLiked(!isLiked);
    }  

    return (
        <div className={props.className ? props.className : ''}>
            <a className={isLiked ? `${cl.like__btn} ${cl.green}` : cl.like__btn} onClick={handleLike}>
                <span>{likes}</span>
                <FontAwesomeIcon icon={faThumbsUp} size="sm" aria-hidden="true"></FontAwesomeIcon>
            </a>
        </div>
    )
}

export default CommentLike;