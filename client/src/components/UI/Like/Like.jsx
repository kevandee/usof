import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons'
import LikesService from '../../../API/LikesService'
import './Like.css'

const Like = (props) => {
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
        // props.callback();
    } 

    return (
        <div className={props.className ? props.className : ''}>
            <a className={isLiked ? 'like__btn green' : 'like__btn'} disabled={props.disabled} onClick={handleLike}>
                <span>{likes}</span>
                <FontAwesomeIcon icon={faThumbsUp} size="lg" aria-hidden="true"></FontAwesomeIcon>
            </a>
        </div>
    )
}

export default Like;