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

                <div className='my-number-panel-tab-container'>
                    <div className='my-number-panel-tab'>
                        {title}
                    </div>
                </div>
                <div className='my-number-box-container' data-meta="PASS">
                    <div className='my-number-box-title'>
                        PASS
                    </div>
                    <div className='my-number-box-value'>
                        {number1}
                    </div>
                </div>
                +
                <div className='my-number-box-container' data-meta="PASS">
                    <div className='my-number-box-title'>
                        NG
                    </div>
                    <div className='my-number-box-value'>
                        {number2}
                    </div>
                </div>
                =
                <div className='my-number-box-container' data-meta="PASS">
                    <div className='my-number-box-title'>
                        Total
                    </div>
                    <div className='my-number-box-value'>
                        {number1 + number2}
                    </div>
                </div>
            </div>
        );
    } else if (name === 'panel-2') {
        return (
            <div className='my-number-panel'>

                <div className='my-number-panel-tab-container'>
                    <div className='my-number-panel-tab'>
                        {title}
                    </div>
                </div>
                <div className='my-number-box-container' data-meta="PASS">
                    <div className='my-number-box-title'>
                        PASS
                    </div>
                    <div className='my-number-box-value'>
                        {number1}
                    </div>
                </div>
                +
                <div className='my-number-box-container' data-meta="PASS">
                    <div className='my-number-box-title'>
                        NG
                    </div>
                    <div className='my-number-box-value'>
                        {number2}
                    </div>
                </div>
                =<div className='my-number-box-container' data-meta="PASS">
                    <div className='my-number-box-title'>
                        Total
                    </div>
                    <div className='my-number-box-value'>
                        {number1 + number2}
                    </div>
                </div>
            </div>
        );


    } else if (name === 'panel-aspect-1') {
        return (

            <div className='my-number-panel-aspect'>
                <div className='my-number-aspect-panel-tab-container'>
                    <div className='my-number-aspect-panel-tab'>
                        {title}
                    </div>
                </div>
                <div className='my-number-box-container' data-meta="PASS">
                    <div className='my-number-box-title-aspect'>
                        PASS
                    </div>
                    <div className='my-number-box-value-aspect'>
                        {number1}
                    </div>
                </div>
                +
                <div className='my-number-box-container' data-meta="PASS">
                    <div className='my-number-box-title-aspect'>
                        NG
                    </div>
                    <div className='my-number-box-value-aspect'>
                        {number2}
                    </div>
                </div>
                =
                <div className='my-number-box-container' data-meta="PASS">
                    <div className='my-number-box-title-aspect'>
                        Total
                    </div>
                    <div className='my-number-box-value-aspect'>
                        {number1 + number2}
                    </div>
                </div>
            </div>
        );
    } else if (name === 'panel-aspect-2') {
        return (

            <div className='my-number-panel-aspect'>

                <div className='my-number-aspect-panel-tab-container'>
                    <div className='my-number-aspect-panel-tab'>
                        {title}
                    </div>
                </div>
                <div className='my-number-box-container-aspect' data-meta="PASS">
                    <div className='my-number-box-title-aspect'>
                        PASS
                    </div>
                    <div className='my-number-box-value-aspect'>
                        {number1}
                    </div>
                </div>
                +
                <div className='my-number-box-container-aspect' data-meta="PASS">
                    <div className='my-number-box-title-aspect'>
                        NG
                    </div>
                    <div className='my-number-box-value-aspect'>
                        {number2}
                    </div>
                </div>
                =
                <div className='my-number-box-container-aspect' data-meta="PASS">
                    <div className='my-number-box-title-aspect'>
                        Total
                    </div>
                    <div className='my-number-box-value-aspect'>
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