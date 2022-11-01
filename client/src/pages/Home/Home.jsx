import React, {useEffect, useState} from 'react';
import UserService from "../../API/UserService";
import {useFetching} from "../../hooks/useFetching";

import PostsList from '../../components/UI/Posts/Posts';
import Loader from '../../components/UI/Loader/Loader';
import { parseCookie } from '../../utils/parseCookie';
import PostsService from '../../API/PostsService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Modal from '../../components/UI/Modal/Modal';

import cl from './Home.module.css'

const Home = () => {
    const [avatar, setAvatar] = useState('');
    const userId = parseCookie(document.cookie).id;
    const [login, setLogin] = useState('');
    const [fullname, setFullname] = useState('loading...');
    const [role, setRole] = useState('loading...');
    const [rating, setRating] = useState('loading...');
    
    const [fetchUserInfo, isUserInfoLoading, userInfoError] = useFetching(async () => {
        const response = await UserService.getUserInfo(userId);
        const user = response.data;
        setAvatar(process.env.REACT_APP_API_URL + '/api/files/' + user.profilePicture);
        setLogin('@'+user.login);
        setFullname(user.fullName);
        setRole(user.role);
        setRating(user.rating);
    })

    useEffect(() => {
        fetchUserInfo()
    }, [])

    const [posts, setPosts] = useState([])
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [fetchUserPosts, isPostsLoading, postsError] = useFetching(async (limit, page) => {
        const response = await PostsService.getUserPosts(userId, page, limit);

        let postsWithCategories = await Promise.all( response.data.list.map(async (post) => {
            post.categories = (await PostsService.getPostCategories(post.id)).data;
            return post;
        }));
        setPosts(postsWithCategories)
        setTotalCount(response.data.total)
    });

    useEffect(() => {
        fetchUserPosts(limit, page)
    }, [page, limit])

    const [showModal, setShowModal] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const updateName = async () => {
        if (inputValue < 5 || inputValue > 60) {
            return;
        }
        await UserService.updateUserInfo({full_name: inputValue}, parseCookie(document.cookie).id);
        setFullname(inputValue);
        setShowModal(false);
    }

    const updateAvatar = async () => {
        let photo = document.querySelector('input[type=file]').files[0];
        let formData = new FormData();
            
        formData.append("image", photo);
        await UserService.uploadAvatar(formData);
        setAvatar(process.env.REACT_APP_API_URL + '/api/files/profile_pictures/' + login.slice(1) +'.png');
    }


    return (
        <div className="App">
            {
            isUserInfoLoading
            ?
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
            :
            <div className={cl.container} style={{textAlign:'center'}}>
                <div className={cl.user__conatiner}>
                    <div className={cl.avatar__container}>
                        <img className={cl.avatar} src={avatar}/>
                    </div>
                    <div className={cl.info__container}>
                        <div className={cl.name__container}>
                            <span className={cl.name}>{fullname}</span>
                            <a onClick={() => setShowModal(true)}>
                                <FontAwesomeIcon icon={faPen} className={cl.pen}/>
                            </a>
                        </div>
                        <div className={cl.login__container}>
                            <span className={cl.login}>{login}</span>
                        </div>
                        <div className={cl.role__container}>
                            <span className={cl.role}>Role: {role}</span>
                        </div>
                        <div className={cl.rating__container}>
                            <span className={cl.rating}>Rating: {rating}</span>
                        </div>
                        <div className={cl.upload__avatar__container}>
                            <form>
                                <label htmlFor="image" className={cl.update_avatar__label}>Update Avatar</label>
                                <input type="file" id="image" name="image" accept="image/*" className={cl.update_avatar__input} onChange={updateAvatar}/>
                            </form>
                        </div>
                    </div>
                </div>
                <div className={cl.post__header__container}>
                    <h1>Your Posts</h1>
                </div>
                {isPostsLoading
                ?
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
                :
                <PostsList  setPage={setPage} page={page} total={totalCount} posts={posts} title={"Recent Posts"}/>}
            </div>
            }
            <Modal show={showModal}>
                <div className={cl.edit__container}>
                    <div>
                        <label htmlFor='new_name'>New name:</label>
                        <input type="text" id='new_name' onChange={(event) => {setInputValue(event.target.value)}}></input>
                    </div>
                    <div className={cl.icon__container}>
                        <a className={cl.check} onClick={updateName}>
                            <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                        </a>
                        <a onClick={()=>{setShowModal(false)}} className={cl.xmark}>
                            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                        </a>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Home;