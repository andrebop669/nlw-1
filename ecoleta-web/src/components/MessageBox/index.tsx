import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiCheck } from 'react-icons/fi';

import './style.css';

interface MessageBoxParams {
    show: boolean;
    message: string;
    route: string;
}


const MessageBox: React.FC<MessageBoxParams> = (props) => {

    return (
        <div id="overlay" className={props.show ? 'shown' : 'hidden'}>
            <div className="text">
                <span>
                    <FiCheckCircle />
                </span> 
                <p>{props.message}</p>
                <Link to={props.route} className="button">
                    <span>
                        <FiCheck />
                    </span>
                    <strong>Ok</strong>
                </Link>
            </div>
        </div>
    );
}

export default MessageBox;