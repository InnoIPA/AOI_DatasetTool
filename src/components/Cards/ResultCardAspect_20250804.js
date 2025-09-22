import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import log from "../../utils/console";
import ReactDOM from "react-dom";
import { useCountUp } from "use-count-up";
import { datasetSegImgAPI } from '../../APIPath';
import ToggleButton from '../../components/Buttons/ToggleButton';
import InfoTag from '../../components/Tags/InfoTag';
import Image_default from '../../image/Image_Default.svg';
import CustomButton from "../Buttons/CustomButton";
import FingerDetailDialog from "../../dialog/FingerDetailDialog";

const ResultCardAspect = (props) => {

    const { currentStep, totalStep, data } = props;

    const toggleRef = useRef(null);

    const fingerDetailDialogRef = useRef(null);

    const handleLabelToggle = () => {

        props.onChange();
    };

    const handleDetailView = (myData, resultList) => {

        console.log(myData)
        //props.onDetailView(data);
        //
        fingerDetailDialogRef.current.GetData(myData.exportUuid, myData.segmentUuid, resultList);
        fingerDetailDialogRef.current.SetOpen();
    };


    // useImperativeHandle(ref, () => ({


    // }));

    const replaceImage = (error) => {
        //replacement of broken Image

        //error.target.height = "250px";
        //error.target.style="{{ height: 53, width: 36 }}"
        error.target.src = Image_default;
        error.target.width = 380;
        error.target.height = 280;
    }

    return (

        <>
            <div className="container-fluid my-result-card mt-2" style={{ paddingTop: 5 }}>

                <div className="row">
                    <div className="col d-flex flex-row gap-3">


                        <div className={(props.data.label === "PASS") ? "my-image-container-pass" : "my-image-container-ng"}>
                            <div className={(props.data.label === "PASS") ? "my-image-title-pass" : "my-image-title-ng"}>Image</div>
                            <div className="my-image-frame d-flex justify-content-center align-items-center">
                                <img src={datasetSegImgAPI(props.data.segment_uuid)} onError={replaceImage} style={{ maxWidth: 390, maxHeight: 290 }} />


                            </div>
                        </div>

                        <div className="my-image-container">
                            <div className="my-image-title">Golden</div>
                            <div className="my-image-frame d-flex justify-content-center align-items-center">
                                <img src={datasetSegImgAPI(props.data.golden_uuid)} onError={replaceImage} style={{ maxWidth: 390, maxHeight: 290 }} />
                            </div>

                        </div>
                        <div className="d-flex flex-column gap-2">


                            <InfoTag label="Order" value={props.data.sortIndex + 1} color="#FF0000" />
                            <InfoTag label="PartNo." value={props.data.compName} color="#FFA500" />
                            <InfoTag label="Light" value={props.data.lightSource} color="#008000" />
                            <InfoTag label="SegNo." value={props.data.segmentIndex} color="#0000FF" />
                            <InfoTag label="Score" value={props.data.score} color="#4B0082" />

                            <div className={(props.data.label === "PASS") ? "my-tag-pass" : "my-tag-ng"} >
                                <span>{props.data.label}</span>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: -30, top: 2 }}>
                                        <ToggleButton id={props.data.imageUuid} status={(props.data.label === "PASS") ? "run" : "stop"} onChange={handleLabelToggle} ref={toggleRef}></ToggleButton>
                                    </div>
                                </div>
                            </div>

                            <div style={{ flexGrow: 1 }}>

                            </div>

                            <div style={{ marginBottom: 'auto' }}>

                                <CustomButton name="view-aspect" text="Detail View" width={200}
                                    onClick={() => handleDetailView(props.data, props.resultList)}
                                />

                            </div>




                        </div>
                    </div>
                </div>
            </div>

            <FingerDetailDialog
                aspect={true}
                data={props.data}
                ref={fingerDetailDialogRef}
            />
        </>


    );
};

export default ResultCardAspect;

