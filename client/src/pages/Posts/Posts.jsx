import React, {useEffect, useState} from 'react';
import {AuthContext} from "../../context";
import PostsService from "../../API/PostsService";
import {useFetching} from "../../hooks/useFetching";

import PostsList from '../../components/UI/Posts/Posts';
import Loader from '../../components/UI/Loader/Loader';
import Modal from '../../components/UI/Modal/Modal';
import PostInput from '../../components/UI/PostInput/PostInput';
import Pagination from '../../components/UI/Pagination/Pagination';

import cl from './Posts.module.css'

const Posts = () => {
    const [posts, setPosts] = useState([])
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [fetchPosts, isPostsLoading, postError] = useFetching(async (limit, page) => {
        const response = await PostsService.getPosts(page, limit);
        let postsWithCategories = await Promise.all( response.data.list.map(async (post) => {
            post.categories = (await PostsService.getPostCategories(post.id)).data;
            return post;
        }));
        setTotalCount(response.data.total);
        setPosts(postsWithCategories);
    })

    useEffect(() => {
        fetchPosts(limit, page)
    }, [page, limit])

    const closeModal = () => {
        setShowModal(false);
    }

    const [showModal, setShowModal] = useState(false);

    return (
        <div className="App">
            <div className={cl.posts__header}>
                <div>
                    <h1>Posts</h1>
                </div>
                <div className={cl.create_post_container}><a onClick={() => setShowModal(true)}>Create Post</a></div>
            </div>
            {isPostsLoading ? 
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
            :
            <PostsList setPage={setPage} page={page} total={totalCount} posts={posts}/>
            }
            <Modal show={showModal} handleClose={closeModal}>
                <PostInput state={{posts, setPosts, closeModal}}/>
            </Modal>
        </div>
    );
}

export default Posts;