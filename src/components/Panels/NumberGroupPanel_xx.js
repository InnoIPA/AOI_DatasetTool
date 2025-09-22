import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { faCube, faSearch, faFolder } from '@fortawesome/free-solid-svg-icons';


const NumberGroupPanel = (props) => {
    const [show, setShow] = React.useState(false);
    const [hoverItem1, setHoverItem1] = React.useState('');
    const [hoverItem2, setHoverItem2] = React.useState('');

    const { number1, number2, title, name } = props;

    if (name === 'panel-1') {
        return (
             <div className='my-number-panel'>

                <div className='my-number-panel-title'>
                    <div className='my-number-panel-title-icon'>
                        <FontAwesomeIcon icon={faFolder} className='my-compose-icon-outside' />
                        <FontAwesomeIcon icon={faCube} className='my-compose-icon-inside' />
                        <div className='my-number-panel-title-text'>
                            {title}
                        </div>
                    </div>
                </div>
                <div className='my-number-box' data-meta="PASS">
                    <div className='my-number-title'>
                        PASS
                    </div>
                    <div className='my-number-value'>
                        {number1}
                    </div>
                </div>
                +
                <div className='my-number-box' data-meta="PASS">
                    <div className='my-number-title'>
                        NG
                    </div>
                    <div className='my-number-value'>
                        {number2}
                    </div>
                </div>
                =
                <div className='my-number-box' data-meta="PASS">
                    <div className='my-number-title'>
                        Total
                    </div>
                    <div className='my-number-value'>
                        {number1 + number2}
                    </div>
                </div>
            </div>
        );
    }else if (name === 'panel-2') {
        return (
            <div className='my-number-panel'>

                <div className='my-number-panel-title'>
                    <div className='my-number-panel-title-icon'>
                        <FontAwesomeIcon icon={faFolder} className='my-compose-icon-outside' />
                        <FontAwesomeIcon icon={faCube} className='my-compose-icon-inside' />
                        <div className='my-number-panel-title-text'>
                            {title}
                        </div>
                    </div>
                </div>
                <div className='my-number-box' data-meta="PASS">
                    <div className='my-number-title'>
                        PASS
                    </div>
                    <div className='my-number-value'>
                        {number1}
                    </div>
                </div>
                +
                <div className='my-number-box' data-meta="PASS">
                    <div className='my-number-title'>
                        NG
                    </div>
                    <div className='my-number-value'>
                        {number2}
                    </div>
                </div>
                =
                <div className='my-number-box' data-meta="PASS">
                    <div className='my-number-title'>
                        Total
                    </div>
                    <div className='my-number-value'>
                        {number1 + number2}
                    </div>
                </div>
            </div>
        );

    } else if (name === 'panel-2-xx') {
        return (
            <div className='my-number-panel'>

                <div className='my-number-panel-title'>
                    <div className='my-number-panel-title-icon'>
                        <FontAwesomeIcon icon={faFolder} className='my-compose-icon-outside' />
                        <FontAwesomeIcon icon={faSearch} className='my-compose-icon-inside' />
                        <div className='my-number-panel-title-text'>
                            {title}
                        </div>
                    </div>
                </div>
                <div className='my-number-box' data-meta="PASS">
                    <div className='my-number-title'>
                        PASS
                    </div>
                    <div className='my-number-value'>
                        {number1}
                    </div>
                </div>
                +
                <div className='my-number-box' data-meta="PASS">
                    <div className='my-number-title'>
                        NG
                    </div>
                    <div className='my-number-value'>
                        {number2}
                    </div>
                </div>
                =
                <div className='my-number-box' data-meta="PASS">
                    <div className='my-number-title'>
                        Total
                    </div>
                    <div className='my-number-value'>
                        {number1 + number2}
                    </div>
                </div>
            </div>
        );
    } else if (name === 'panel-aspect-1') {
        return (

            <div className='my-number-aspect-panel'>

                <div className='my-number-aspect-panel-title'>
                    <div className='my-number-panel-title-aspect'>
                        <div className='my-number-panel-title-icon'>
                            <FontAwesomeIcon icon={faFolder} className='my-compose-icon-outside-aspect' />
                            <FontAwesomeIcon icon={faSearch} className='my-compose-icon-inside-aspect' />
                            <div className='my-number-panel-title-text'>
                                {title}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='my-number-aspect-box' data-meta="PASS">
                    <div className='my-number-aspect-title'>
                        PASS
                    </div>
                    <div className='my-number-aspect-value'>
                        {number1}
                    </div>
                </div>
                +
                <div className='my-number-aspect-box' data-meta="PASS">
                    <div className='my-number-aspect-title'>
                        NG
                    </div>
                    <div className='my-number-aspect-value'>
                        {number2}
                    </div>
                </div>
                =
                <div className='my-number-aspect-box' data-meta="PASS">
                    <div className='my-number-aspect-title'>
                        Total
                    </div>
                    <div className='my-number-aspect-value'>
                        {number1 + number2}
                    </div>
                </div>
            </div>
        );
    } else if (name === 'panel-aspect-2') {
        return (

            <div className='my-number-aspect-panel'>

                <div className='my-number-aspect-panel-title'>
                    <div className='my-number-panel-title-aspect'>
                        <div className='my-number-panel-title-icon'>
                            <FontAwesomeIcon icon={faFolder} className='my-compose-icon-outside-aspect' />
                            <FontAwesomeIcon icon={faSearch} className='my-compose-icon-inside-aspect' />
                            <div className='my-number-panel-title-text'>
                                {title}
                            </div>
                        </div>
                    </div>
                </div>
                &nbsp;

                <div className='my-number-aspect-box' data-meta="PASS">
                    <div className='my-number-aspect-title'>
                        PASS
                    </div>
                    <div className='my-number-aspect-value'>
                        {number1}
                    </div>
                </div>
                +
                <div className='my-number-aspect-box' data-meta="PASS">
                    <div className='my-number-aspect-title'>
                        NG
                    </div>
                    <div className='my-number-aspect-value'>
                        {number2}
                    </div>
                </div>
                =
                <div className='my-number-aspect-box' data-meta="PASS">
                    <div className='my-number-aspect-title'>
                        Total
                    </div>
                    <div className='my-number-aspect-value'>
                        {number1 + number2}
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (

            <div className='my-number-panel'>

                <div className='my-number-panel-title'>
                    <div className='my-number-panel-title-icon'>
                        <FontAwesomeIcon icon={faFolder} style={{ width: 32, height: 32 }} />
                        <FontAwesomeIcon icon={(name === "panel1") ? faCube : faSearch} style={{ width: 14, height: 14, position: 'absolute', top: 14, left: 13 }} />
                    </div>
                    <div className='my-number-panel-title-text'>
                        {title}
                    </div>
                </div>
                &nbsp;

                <div className='my-number-box' data-meta="PASS">
                    <div className='my-number-title'>
                        PASS
                    </div>
                    <div className='my-number-value'>
                        {number1}
                    </div>
                </div>
                +
                <div className='my-number-box' data-meta="PASS">
                    <div className='my-number-title'>
                        NG
                    </div>
                    <div className='my-number-value'>
                        {number2}
                    </div>
                </div>
                =
                <div className='my-number-box' data-meta="PASS">
                    <div className='my-number-title'>
                        Total
                    </div>
                    <div className='my-number-value'>
                        {number1 + number2}
                    </div>
                </div>
            </div>
        );
    }

};


export default NumberGroupPanel;