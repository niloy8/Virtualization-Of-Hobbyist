import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faPaperPlane, faSmile } from "@fortawesome/free-solid-svg-icons";
import './Chat.css'
const Chat = () => {
    return (
        <div className="community-chat">
            <div className="community-user">
                <img
                    src="https://storage.googleapis.com/a1aa/image/qh7luJG88Wv1d0yB2Ty-_DlteUgSNHCEHJncXJGxHWQ.jpg"
                    alt="User"
                    className="community-user-img"
                />
                <div className="community-username">Name</div>
                <div className="community-description">Description</div>
            </div>

            {/* Chat Input */}
            <div className="community-chatbox">
                <input type="text" placeholder="Type.." className="community-input" />
                <FontAwesomeIcon icon={faMicrophone} className="community-chat-icon" />
                <FontAwesomeIcon icon={faPaperPlane} className="community-chat-icon" />
                <FontAwesomeIcon icon={faSmile} className="community-chat-icon" />
            </div>
        </div>
    );
};

export default Chat;
