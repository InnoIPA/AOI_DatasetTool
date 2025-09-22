import React from 'react';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconCheckedPartial = (props) => {

    return (
        <div className='my-icon-checked-partial-container'>
            <FontAwesomeIcon icon={faMinus} />
        </div>
    );
};

export default IconCheckedPartial;