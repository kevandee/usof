import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faThumbsDown} from '@fortawesome/free-solid-svg-icons'
import LikesService from '../../../API/LikesService'
import './Dislike.css'

const Dislike = (props) => {
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
            <a className={isDisliked ? 'dislike__btn red' : 'dislike__btn'} disabled={props.disabled} onClick={handleDislike}>
                <FontAwesomeIcon icon={faThumbsDown} size="lg" aria-hidden="true"></FontAwesomeIcon>
                <span>{dislikes}</span>
            </a>
        </div>
    )
}

export default Dislike;