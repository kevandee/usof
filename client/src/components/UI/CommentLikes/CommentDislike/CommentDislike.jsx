import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faThumbsDown} from '@fortawesome/free-solid-svg-icons'
import LikesService from '../../../../API/LikesService'
import cl from './CommentDislike.module.css'

const CommentDislike = (props) => {
    const {isLiked, isDisliked, setIsLiked, setIsDisliked, setDislikes, dislikes, setLikes, likes} = props.state;
    let handleDislike = () => {
        if (isLiked) {
            setIsLiked(false);
            LikesService.deleteLike(props.url);
            setLikes(likes - 1);
        }
        if (isDisliked) {
            LikesService.deleteLike(props.url);
            setDislikes(dislikes - 1);
        }
        else {
            LikesService.newLike(props.url, false);
            setDislikes(dislikes + 1);
        }
        setIsDisliked(!isDisliked);
    }
    
    return (
        <div className={props.className ? props.className : ''}>
            <a className={isDisliked ? `${cl.like__btn} ${cl.red}` : cl.like__btn} onClick={handleDislike}>
                <FontAwesomeIcon icon={faThumbsDown} size="sm" aria-hidden="true"></FontAwesomeIcon>
                <span>{dislikes}</span>
            </a>
        </div>
    )
}

export default CommentDislike;