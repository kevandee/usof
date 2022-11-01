import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { MultiSelect } from "react-multi-select-component";
import cl from './PostInput.module.css'
import { useFetching } from '../../../hooks/useFetching';
import PostsService from '../../../API/PostsService';
import FileUploader from '../FileInput/FileInput';

const PostInput = ({state}) => {
    const limitTitle = 150;
    const limit = 30000;
    const [inputTitleValue, setInputTitleValue] = useState('');
    const [inputValue, setInputValue] = useState('');

    const handleOnChangedTitle = (event) => {
        const input = event.target;
        setInputTitleValue(input.value);
    }

    const handleOnChanged = (event) => {
        const input = event.target;
        setInputValue(input.value);
    }

    const newPost = async () => {
        if(inputTitleValue > limitTitle || inputValue > limit) {
            return;
        }
        console.log("a");
        let response = await PostsService.newPost({title: inputTitleValue, content: inputValue, categories: selectedCategories.map((category) => category.value.id)});
        let post =( await PostsService.getPost(response.data.post_id)).data;
        post.categories = (await PostsService.getPostCategories(post.id)).data;
        console.log(state.posts);
        state.setPosts([...state.posts, post]);
        state.closeModal();
    }

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);

    const [fetchCategories, isCategoriesLoading, categoryError] = useFetching(async () => {
        let response = await PostsService.getAllCategories();
        console.log(response.data);
        setCategories(response.data.list.map((category) => {return {label: category.title, value: category}}));
    })

    useEffect(() => {
        fetchCategories();
    }, [])
    
    return (
        <form>
        <div className={cl.post_input_container}>
                <h1>New Post</h1>
                <div className={cl.title__container}>
                    <span>Title:</span>
                    <input type="text" id="title" onChange={handleOnChangedTitle}/>
                    <div className={cl.count__container}>
                        <span style={inputTitleValue.length > limitTitle ? {color: 'red'} : {}}>{inputTitleValue.length > 100 ? `${inputTitleValue.length} / ${limitTitle}` : ''}</span>
                    </div>
                </div>
                <div className={cl.categories__container}>
                    <span>Categories:</span>
                    {!isCategoriesLoading ? <MultiSelect options={categories}
                                value={selectedCategories}
                                onChange={setSelectedCategories}
                                labelledBy={"Select"}
                                isCreatable={true}/> : <></>}
                </div>
                <div className={cl.body__container}>
                    <span>What are the details of your problem?</span>
                    <span>Introduce the problem and expand on what you put in the title. Minimum 20 characters.</span>
                    <textarea className={cl.input} id="content" onChange={handleOnChanged} />
                </div>
                <div className={cl.footer__container}>
                    <div className={cl.count__container}>
                        <span style={(inputValue.length > limit || inputValue.length < 20) ? {color: 'red'} : {}}>{inputValue.length > 0 ? `${inputValue.length} / ${limit}` : ''}</span>
                    </div>
                    <div className={cl.icon__container}>
                        <FileUploader onFileSelect={(files) => console.log(files)}/>
                        <a className={cl.check} onClick={newPost}>
                            <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                        </a>
                        <a onClick={()=>{state.closeModal()}} className={cl.xmark}>
                            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PostInput;
