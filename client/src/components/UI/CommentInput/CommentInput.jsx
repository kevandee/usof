import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import cl from './CommentInput.module.css'
import CommentService from '../../../API/CommentService';
import PostsService from '../../../API/PostsService';

const CommentInput = (props) => {
    const state = props.state
    const limit = 30000;
    const [inputValue, setInputValue] = useState('');

    const handleOnChanged = (event) => {
        const input = event.target;
        setInputValue(input.value);
    }

    const newComment = async () => {
        if (inputValue.length > limit) {
            return;
        }
        let comments = null;
        if(state.post_id) {
            await CommentService.newPostComment(state.post_id, inputValue);
            comments = (await PostsService.getPostComments(state.post_id)).data;
            let last = comments[comments.length - 1];
            last.likeData = {count:{likes: 0, dislikes: 0}, UserLike: -1};
            last.comments = [];
            console.log('bebra', [...state.comments, last]);
            state.setComments([...state.comments, last]);
        }
        else {
            await CommentService.newCommentComment(state.comment_id, inputValue);
            comments = (await CommentService.getCommentData(state.comment_id)).data;
            state.setComments([...comments]);
        }
        state.setShowCommentInput(false);
    }
    
    return (
        <div className={cl.input__container}>
            <textarea className={cl.input} onChange={handleOnChanged} />
            <div className={cl.input__footer}>
                <div className={cl.count__container}>
                    <span style={inputValue.length > limit ? {color: 'red'} : {}}>{inputValue.length > 25000 ? `${inputValue.length} / ${limit}` : ''}</span>
                </div>
                <div className={cl.icon__container}>
                    <a className={cl.check} onClick={newComment}>
                        <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                    </a>
                    <a onClick={()=>state.setShowCommentInput(false)} className={cl.xmark}>
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default CommentInput;