import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHouse, faImage, faBolt, faPercent, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faCheckToSlot, faEllipsis, faFileCircleCheck, faFolderPlus, faScissors } from '@fortawesome/free-solid-svg-icons';
import CustomTooltip from '../../components/Tooltips/CustomTooltip';

import { ReactComponent as ImageRunning } from '../../image/Running.svg';
import { ReactComponent as ImageTrain } from '../../image/Train.svg';
import { ReactComponent as ImageDisk } from '../../image/Disk.svg';
import { ReactComponent as ImageAdd } from '../../image/Add.svg';


const CustomButton = (props) => {

    // const {name}=props;

    if (props.name === "edit") {
        return (
            <button onClick={props.onClick} className="my-button-edit" style={{ width: parseInt(props.width) }} >
                Edit
            </button>
        )
    }




    if (props.name === "confirm") {
        return (
            <button onClick={props.onClick} className="my-button-submit" style={{ width: props.width, height: props.height }}>
                OK
            </button>
        )
    }

    if (props.name === "view") {
        return (
            <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-disable" : "my-button-submit"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                {props.text}
            </button>
        )
    }

        if (props.name === "view-inno") {
        return (
            <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-disable" : "my-button-submit-inno"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                {props.text}
            </button>
        )
    }

    if (props.name === "add-project") {
        return (
            <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-disable d-flex flex-row justify-content-between" : "my-button-submit  d-flex flex-row justify-content-start align-items-center gap-1"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                <div className='my-project-type-icon-1'>
                    <FontAwesomeIcon icon={faImage} style={{ width: 38, height: 38 }} />
                </div>
                {props.text}
            </button>
        )
    }


    if (props.name === "add-project-aspect") {
        return (
            <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-disable-aspect d-flex flex-row justify-content-between" : "my-button-submit-aspect  d-flex flex-row justify-content-start align-items-center gap-1"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                <div className='my-project-type-icon-1-aspect'>
                    <FontAwesomeIcon icon={faScissors} style={{ width: 25, height: 25 }} />
                </div>
                {props.text}
            </button>
        )
    }

    if (props.name === "add-project-xx") {
        return (
            <CustomTooltip title={"Add new normal project"}>
                <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-disable d-flex flex-row justify-content-between" : "my-button-submit  d-flex flex-row justify-content-start align-items-center gap-1"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                    <div className='my-project-type-icon-1'>
                        <FontAwesomeIcon icon={faImage} style={{ width: 38, height: 38 }} />
                    </div>
                    {props.text}
                </button>
            </CustomTooltip>
        )
    }


    if (props.name === "add-project-aspect-xx") {
        return (
            <CustomTooltip title={"Add new finger project"}>
                <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-disable-aspect d-flex flex-row justify-content-between" : "my-button-submit-aspect  d-flex flex-row justify-content-start align-items-center gap-1"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                    <div className='my-project-type-icon-1-aspect'>
                        <FontAwesomeIcon icon={faScissors} style={{ width: 25, height: 25 }} />
                    </div>
                    {props.text}
                </button>
            </CustomTooltip>
        )
    }

    if (props.name === "view-aspect") {
        return (

            <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-disable-aspect" : "my-button-submit-aspect"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                {props.text}
            </button>

        )
    }

    if (props.name === "view-convert") {
        return (

            <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-disable d-flex flex-row justify-content-start align-items-center gap-2" : "my-button-submit d-flex flex-row justify-content-start align-items-center gap-2"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                <div className='my-function-icon d-flex flex-row align-items-center justify-content-center'>
                    <ImageRunning style={{ width: 24, height: 24 }} />
                </div>
                {props.text}
            </button>

        )
    }

    if (props.name === "view-add") {
        return (

            <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-disable d-flex flex-row justify-content-between" : "my-button-submit d-flex flex-row justify-content-start align-items-center gap-2"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                {/* <FontAwesomeIcon icon={faImage} style={{ width: 38, height: 38 }} /> */}
                <div className='my-function-icon d-flex flex-row align-items-center justify-content-center'>
                    <ImageAdd style={{ width: 24, height: 24 }} />
                </div>
                {props.text}
            </button>

        )
    }


    if (props.name === "view-train") {
        return (

            <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-disable d-flex flex-row align-items-center justify-content-start gap-2" : "my-button-submit d-flex flex-row justify-content-start align-items-center gap-2"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                <div className='my-function-icon d-flex flex-row align-items-center justify-content-center'>
                    <ImageTrain style={{ width: 24, height: 24 }} />
                </div>
                {props.text}
            </button>

        )
    }

    if (props.name === "view-save") {
        return (

            <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-disable d-flex flex-row justify-content-between" : "my-button-submit d-flex flex-row justify-content-start align-items-center gap-2"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                <div className='my-function-icon d-flex flex-row align-items-center justify-content-center'>
                    <ImageDisk style={{ width: 24, height: 24 }} />
                </div>
                {props.text}
            </button>

        )
    }

    if (props.name === "view-convert-aspect") {
        return (

            <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-aspect-disable d-flex flex-row justify-content-start align-items-center gap-2" : "my-button-submit-aspect  d-flex flex-row justify-content-start align-items-center gap-2"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                <div className='my-function-icon-aspect d-flex flex-row align-items-center justify-content-center'>
                    <ImageRunning style={{ width: 24, height: 24 }} />
                </div>
                {props.text}
            </button>

        )
    }

    if (props.name === "view-train-aspect") {
        return (

            <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-aspect-disable d-flex flex-row justify-content-start align-items-center gap-2" : "my-button-submit-aspect  d-flex flex-row justify-content-start align-items-center gap-2"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                <div className='my-function-icon-aspect d-flex flex-row align-items-center justify-content-center'>
                    <ImageTrain style={{ width: 24, height: 24 }} />
                </div>
                {props.text}
            </button>

        )
    }

    if (props.name === "view-save-aspect") {
        return (

            <button onClick={(e) => props.onClick(e)} className={(props.disabled) ? "my-button-disable-aspect d-flex flex-row justify-content-between" : "my-button-submit-aspect  d-flex flex-row justify-content-start align-items-center gap-2"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                <div className='my-function-icon-aspect d-flex flex-row align-items-center justify-content-center'>
                    <ImageDisk style={{ width: 24, height: 24 }} />
                </div>
                {props.text}
            </button>

        )
    }

    if (props.name === "button-type-1") {
        return (
            <div onClick={props.onClick} className={(props.disabled) ? "my-button-disable" : "my-button-type-1"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                {props.text}
            </div>
        )
    }

    if (props.name === "button-type-2") {
        return (
            <div onClick={props.onClick} className={(props.disabled) ? "my-button-disable" : "my-button-type-2"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                {props.text}
            </div>
        )
    }

    if (props.name === "button-type-aspect-1") {
        return (
            <div onClick={props.onClick} className={(props.disabled) ? "my-button-disable" : "my-button-type-aspect-1"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>

                {props.text}
            </div>
        )
    }

    if (props.name === "button-type-aspect-2") {
        return (
            <div onClick={props.onClick} className={(props.disabled) ? "my-button-disable" : "my-button-type-aspect-2 d-flex flex-row align-items-center gap-1 justify-content-start"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                <div style={{ backgroundColor: '#0e86d4', width: 22, height: 22, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon icon={faBolt} color="white" style={{ width: 12, height: 12 }} size="2x" />
                </div>
                {props.text}
            </div>
        )
    }

    if (props.name === "hint-button-1-aspect") {
        return (
            <div onClick={props.onClick} className={(props.disabled) ? "my-button-disable" : "my-hint-button-aspect d-flex flex-row align-items-center gap-1 justify-content-start"} style={{ width: props.width, height: props.height, fontSize: 14 }} disabled={props.disabled}>
                <div className="my-hint-icon-aspect">
                    <FontAwesomeIcon icon={faBolt} color="white" style={{ width: 12, height: 12 }} size="2x" />
                </div>
                {props.text}
            </div>
        )
    }

    if (props.name === "hint-button-2-aspect") {
        return (
            <div onClick={props.onClick} className={(props.disabled) ? "my-button-disable" : "my-hint-button-aspect d-flex flex-row align-items-center gap-1 justify-content-start"} style={{ width: props.width, height: props.height, fontSize: 14 }} disabled={props.disabled}>
                <div className="my-hint-icon-aspect">
                    <FontAwesomeIcon icon={faPercent} color="white" style={{ width: 12, height: 12 }} size="2x" />
                </div>
                {props.text}
            </div>
        )
    }

    if (props.name === "hint-button-1") {
        return (
            <div onClick={props.onClick} className={(props.disabled) ? "my-button-disable" : "my-hint-button d-flex flex-row align-items-center gap-1 justify-content-start"} style={{ width: props.width, height: props.height, fontSize: 14 }} disabled={props.disabled}>
                <div className='my-hint-icon'>
                    <FontAwesomeIcon icon={faBolt} color="white" style={{ width: 12, height: 12 }} size="2x" />
                </div>
                {props.text}
            </div>
        )
    }


    if (props.name === "hint-button-2") {
        return (
            <div onClick={props.onClick} className={(props.disabled) ? "my-button-disable" : "my-hint-button d-flex flex-row align-items-center gap-1 justify-content-start"} style={{ width: props.width, height: props.height, fontSize: 14 }} disabled={props.disabled}>
                <div className='my-hint-icon'>
                    <FontAwesomeIcon icon={faPercent} color="white" style={{ width: 12, height: 12 }} size="2x" />
                </div>
                {props.text}
            </div>
        )
    }


    if (props.name === "submit") {
        return (
            <button type="submit" onClick={props.onClick} className={(props.disabled) ? "my-button-disable" : "my-button-submit"} style={{ width: props.width, height: props.height }} disabled={props.disabled}>
                {props.text}
            </button>
        )
    }

    if (props.name === "function") {
        return (
            <div onClick={props.onClick} className={(props.focus) ? "my-button-function-focus" : "my-button-function"} style={{ width: props.width, height: props.height }}>
                {props.text}
            </div>
        )
    }

    if (props.name === "outline") {
        return (
            <div onClick={props.onClick} className="my-button-outline" style={{ width: props.width, height: props.height }}>
                {props.text}
            </div>
        )
    }

    if (props.name === "general") {
        return (
            <div onClick={props.onClick} className="my-button-general" style={{ width: props.width, height: props.height }}>
                {props.text}
            </div>
        )
    }

    if (props.name === "train") {
        return (
            <button onClick={() => props.onClick('train')} className={(props.active) ? "my-button-small-active" : "my-button-small-inactive"} style={{ width: props.width, height: props.height }}>
                train
            </button>
        )
    }

    if (props.name === "val") {
        return (
            <button onClick={() => props.onClick('val')} className={(props.active) ? "my-button-small-active" : "my-button-small-inactive"} style={{ width: props.width, height: props.height }}>
                val
            </button>
        )
    }



    if (props.name === "cancel") {
        return (
            <button onClick={(e) => props.onClick(e)} className="my-button-cancel" style={{ width: props.width, height: props.height }}>
                Cancel
            </button>
        )
    }

    if (props.name === "stop") {
        return (
            <button onClick={props.onClick} className="my-button-cancel" style={{ width: props.width, height: props.height }}>
                Stop
            </button>
        )
    }

    if (props.name === "stop-dialog") {
        return (
            <button onClick={props.onClick} className="my-button-submit" style={{ width: props.width, height: props.height }}>
                Stop
            </button>
        )
    }

    if (props.name === "close") {
        return (
            <button onClick={props.onClick} className="my-button-cancel" style={{ width: props.width, height: props.height }}>
                Close
            </button>
        )
    }

    if (props.name === "submit") {

        if (props.disabled) {
            return (
                <button className="my-button-disable">
                    Add
                </button>
            )
        } else {
            return (
                <button onClick={props.onClick} className="my-button-submit">
                    Add
                </button>
            )
        }

    }

    if (props.name === "save") {
        if (props.disabled) {
            return (
                <button className="my-button-disable">
                    Save
                </button>
            )
        } else {
            return (
                <button onClick={props.onClick} className="my-button-submit">
                    Save
                </button>
            )
        }
    }

    if (props.name === "delete") {
        return (
            <button onClick={props.onClick} className="my-button-submit">
                Delete
            </button>
        )
    }

    if (props.name === "download") {
        return (
            <button onClick={props.onClick} className="my-button-submit" style={{ width: props.width, height: props.height }}>
                Download
            </button>
        )
    }

    if (props.name === "download-aspect") {
        return (
            <button onClick={props.onClick} className="my-button-submit-aspect" style={{ width: props.width, height: props.height }}>
                Download
            </button>
        )
    }

    if (props.name === "download-button-with-icon") {
        return (
            <button onClick={props.onClick} className="my-button-submit d-flex flex-column justify-content-center align-items-center gap-1 p-3" style={{ width: props.width, height: props.height }}>
                <div style={{ width: 50, height: 50, borderRadius: 5, backgroundColor: 'white' }} className='d-flex flex-row align-items-center justify-content-center'>
                    <FontAwesomeIcon icon={faDownload} style={{ width: 25, height: 25, color: '#ed1b23' }} />
                </div>
                <div style={{ fontSize: 20 }}>
                    {props.text}
                </div>

            </button>
        )
    }

    if (props.name === "download-button-with-icon-aspect") {
        return (
            <button onClick={props.onClick} className="my-button-submit-aspect d-flex flex-column justify-content-center align-items-center gap-1 p-3" style={{ width: props.width, height: props.height }}>
                <div style={{ width: 50, height: 50, borderRadius: 5, backgroundColor: 'white' }} className='d-flex flex-row align-items-center justify-content-center'>
                    <FontAwesomeIcon icon={faDownload} style={{ width: 25, height: 25, color: '#0e86d4' }} />
                </div>
                <div style={{ fontSize: 20 }}>
                    {props.text}
                </div>

            </button>
        )
    }

    if (props.name === "more") {
        return (
            <button onClick={props.onClick} className="my-button-more" style={{ width: props.width, height: props.height }}>
                <FontAwesomeIcon icon={faEllipsis} />
            </button>
        )
    }

    if (props.name === "more-aspect") {
        return (
            <button onClick={props.onClick} className="my-button-more-aspect" style={{ width: props.width, height: props.height }}>
                <FontAwesomeIcon icon={faEllipsis} />
            </button>
        )
    }


    return (
        <button onClick={props.onClick} className={props.className}>
            {props.name}
        </button>
    );



};

CustomButton.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    text: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
}

export default CustomButton;