import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

const FileInput = ({onFileSelect}) => {
    const handleFileInput = (e) => {
        onFileSelect(e.target.value);
    }

    return (
        <div className="file-uploader">
            <label htmlFor="file-input" style={{":hover": {cursor:"pointer"}}}>
                <FontAwesomeIcon icon={faPaperclip}></FontAwesomeIcon>
            </label>
            <input type="file" id='file-input' onChange={handleFileInput} style={{display: "none"}}/>
        </div>
    )
}

export default FileInput;