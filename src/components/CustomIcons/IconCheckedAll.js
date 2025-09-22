import React from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconCheckedAll = (props) => {

    return (
        <div className='my-icon-checked-all-container'>
            <FontAwesomeIcon icon={faCheck} className="my-icon-checked-all" />
        </div>
    );
};

export default IconCheckedAll;
