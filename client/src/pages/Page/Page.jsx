import React, {useEffect, useState} from 'react';
import PostsService from "../../API/PostsService";
import {useFetching} from "../../hooks/useFetching";
import Loader from '../../components/UI/Loader/Loader';
import { useParams } from 'react-router-dom';
import Like from '../../components/UI/Like/Like';
import Dislike from '../../components/UI/Dislike/Dislike';
import LikesService from '../../API/LikesService';
import { timeDifference } from '../../utils/timeDifference';
import PostAuthor from '../../components/UI/Author/Author'
import cl from "./Page.module.css"
import Category from '../../components/UI/Category/Category';
import Comment from '../../components/UI/Comment/Comment';
import CommentInput from '../../components/UI/CommentInput/CommentInput';

const PostPage = (props) => {
    const { id } = useParams();
    const [isLiked, setIsLiked] = useState(props.isLiked);
    const [isDisliked, setIsDisliked] = useState(props.isDisliked);
    const [likes, setLikes] = useState('');
    const [dislikes, setDislikes] = useState('');
    const state = {isLiked, isDisliked, likes, dislikes, setIsDisliked, setIsLiked, setLikes, setDislikes};
    const postURL = '/posts/' + id;
    const [post, setPost] = useState({});
    const [author, setAuthor] = useState({});

    const [fetchPost, isPostLoading, postError] = useFetching(async () => {
        const response = await PostsService.getPost(id);
        console.log(response);
        setAuthor(response.data.author);
        response.data.categories = (await PostsService.getPostCategories(id)).data;
        
        setPost({...post, ...response.data})
        const likeInfo = await LikesService.getLikesInfo(postURL);
        setLikes(likeInfo.data.count.likes);
        setDislikes(likeInfo.data.count.dislikes);
        if (likeInfo.data.UserLike != -1) {
            likeInfo.data.UserLike.type ? setIsLiked(true) : setIsDisliked(true);
        }
    })

    useEffect(() => {
        fetchPost()
    }, [])

    const [comments, setComments] = useState([]);
    const [fetchComments, isCommentsLoading, commentError] = useFetching(async () => {
        const response = await PostsService.getPostComments(id);
        console.log(response);
        
        response.data = await Promise.all(response.data.map(async (comment) => {
            const url = '/comments/' + comment.id;
            
            comment.likeData = (await LikesService.getLikesInfo(url)).data;
            comment.comments = (await PostsService.getCommentData(comment.id)).data;
            console.log("fetch comments", comment.comments);
            comment.url = url;

            return comment;
        }));
        console.log("data", response.data);
        // let response = await PostsService.getCommentData(comment.id);
        // let data = {comments: response.data};
        // console.log("aboba", (await LikesService.getLikesInfo(url)).data);


        setComments(response.data);
    });

    useEffect(() => {
        fetchComments();
    }, [])


    const [showCommentInput, setShowCommentInput] = useState(false);
    let inputState = {comments, setComments, setShowCommentInput, post_id: id};

    const addComment = () => {
        setShowCommentInput(true);
    }

    return (
        <div className="App">
            {isPostLoading ?
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
            :
            <div className={cl.post}>
                <div className={cl.title__container}>
                    <PostAuthor className={cl.author} author={author}/>
                    <span className={cl.title}>{post.content}</span>
                </div>
                <div className={cl.categories__container}>
                    {post.categories && post.categories.map((category) => <Category category={category}/>)}
                </div>
                <div className={cl.post__body}>
                    <p>{post.content}</p>
                </div>
                <div className={cl.post__footer}>
                    <div className={cl.timestamp}>
                        <span>{timeDifference(new Date().getTime(), post.publish_date)}</span>
                    </div>
                    <div className={cl.add__comment__container}>
                    <div className={cl.add__comment}>
                        <a onClick={addComment}>Add comment</a>
                    </div>
                    </div>
                    <div className={cl.likes}>
                        <Like className={cl.like__post} state={state} url={postURL} disabled={isPostLoading}></Like>
                        <Dislike className={cl.dislike__post} state={state} url={postURL} disabled={isPostLoading}></Dislike>
                    </div>
                </div>
                {showCommentInput ? 
                <div>
                    <CommentInput state={inputState}></CommentInput>
                </div> 
                : 
                <div></div>}
                <div className={cl.comments}>
                    {isCommentsLoading ? 
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
                    :
                    comments.map((comment) => <Comment comment={comment} />)}
                </div>
            </div>
            }
        </div>
    );
}

export default PostPage;