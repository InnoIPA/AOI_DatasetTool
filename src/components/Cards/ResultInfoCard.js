import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import log from "../../utils/console";
import ReactDOM from "react-dom";
import { useCountUp } from "use-count-up";
import { datasetImgAPI } from '../../APIPath';
import ToggleButton from '../../components/Buttons/ToggleButton';
import InfoTag from '../../components/Tags/InfoTag';
import Image_default from '../../image/Image_Default.svg';

const ResultInfoCard = (props) => {

    const { data } = props;

    const toggleRef = useRef(null);

    const handleLabelToggle = () => {

        props.onChange();
    };





    return (

        <>
            <div className="container-fluid my-result-info-card" style={{ width:400,height:340 }}>

                <div className="row">
                    <div className="col d-flex flex-column gap-0">
                        <div style={{fontSize:18,marginBottom:10,borderBottom:'1px solid #e0e1e6',paddingBottom:5}}>
                        Information:
                        </div>
                        <ul className="d-flex flex-column gap-2" style={{color:'#aaaaaa',fontSize:16}}>
                            <li> No. : 1 </li>
                            <li> Comp Name : {data.compName} </li>
                            <li> Light Source : {data.lightSource} </li>
                            <li> Score : {data.score} </li>
                            <li> Threshold : {data.threshold} </li>
                            <li> Label : {data.label} </li>
                            <li> Result : {data.infer_label} </li>
                        </ul>                    
                    </div>
                    <div className="col d-flex flex-column gap-0">
                        <div style={{fontSize:18,marginBottom:10,borderBottom:'1px solid #e0e1e6',paddingBottom:5}}>
                        Information:
                        </div>
                        <ul className="d-flex flex-column gap-2" style={{color:'#aaaaaa',fontSize:16}}>
                            <li> No. : 1 </li>
                            <li> Comp Name : {data.compName} </li>
                            <li> Light Source : {data.lightSource} </li>
                            <li> Score : {data.score} </li>
                            <li> Threshold : {data.threshold} </li>
                            <li> Label : {data.label} </li>
                            <li> Result : {data.infer_label} </li>
                        </ul>                    
                    </div>
                    <div className="col d-flex flex-column gap-0">
                        <div style={{fontSize:18,marginBottom:10,borderBottom:'1px solid #e0e1e6',paddingBottom:5}}>
                        Information:
                        </div>
                        <ul className="d-flex flex-column gap-2" style={{color:'#aaaaaa',fontSize:16}}>
                            <li> No. : 1 </li>
                            <li> Comp Name : {data.compName} </li>
                            <li> Light Source : {data.lightSource} </li>
                            <li> Score : {data.score} </li>
                            <li> Threshold : {data.threshold} </li>
                            <li> Label : {data.label} </li>
                            <li> Result : {data.infer_label} </li>
                        </ul>                    
                    </div>
                </div>

            </div>
        </>

    );
};


export default ResultInfoCard;

