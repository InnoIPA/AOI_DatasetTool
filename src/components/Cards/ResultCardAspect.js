import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef, useMemo } from "react";
import log from "../../utils/console";
import ReactDOM from "react-dom";
import Hotkeys from 'react-hot-keys';
import { useCountUp } from "use-count-up";
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { extendTheme } from '@mui/joy/styles';
import { ThemeProvider } from '@mui/joy/styles';
import { filter, toArray, findIndex, isEqual, map, cloneDeep, sortBy, orderBy, take, slice, uniqBy, set, uniq } from 'lodash-es';


import { datasetSegImgAPI, datasetImgAPI } from '../../APIPath';
import ToggleButton from '../../components/Buttons/ToggleButton';
import InfoTag from '../../components/Tags/InfoTag';
import Image_default from '../../image/Image_Default.svg';
import CustomButton from "../Buttons/CustomButton";
import FingerDetailDialog from "../../dialog/FingerDetailDialog";
import CustomTooltip from "../../components/Tooltips/CustomTooltip";

const ResultCardAspect = (props) => {

    const { data } = props;

    const toggleRef = useRef(null);

    const tableColumnWidth = [80, 150, 150, 150, 150, 150, 150, 150, 100];

    const [hoverItem1, setHoverItem1] = useState('');
    const [hoverItem2, setHoverItem2] = useState('');
    const [hoverItem3, setHoverItem3] = useState('');
    const [show, setShow] = useState(false);



    const handleLabelToggle = (mySegmentUuid, myEvent) => {

        console.log('(1) handle label toggle ===>', mySegmentUuid, data.image_uuid, myEvent);

        props.onChange(mySegmentUuid, data.image_uuid, myEvent);
    };

    const handleKeyDown = (keyName, e) => {

        e.preventDefault();
        e.stopPropagation();

        if (e.code === 'Space') {
            if ((hoverItem1 !== '') && (hoverItem2 !== '')) {
                if (show === false) setShow(true);
            }
            if ((hoverItem3 !== '')) {
                if (show === false) setShow(true);
            }
        }

    }

    const handleKeyUp = (keyName, e) => {

        if (e.code === 'Space') {
            setShow(false);
            //setHoverItem('');
        }
    }

    const handleDetailView = (myItem) => {

        console.log(myItem)
        setHoverItem1(myItem.segment_uuid);
        setHoverItem2(myItem.golden_uuid);
        setShow(true);


    };




    const replaceImage = (error) => {
        //replacement of broken Image

        //error.target.height = "250px";
        //error.target.style="{{ height: 53, width: 36 }}"
        error.target.src = Image_default;
        error.target.width = 380;
        error.target.height = 280;
    }

    const theme = extendTheme({
        components: {
            JoyModalDialog: {
                defaultProps: { layout: 'middle' },
                styleOverrides: {
                    root: ({ ownerState }) => ({
                        ...(ownerState.layout === 'middle' && {
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90vw',
                            height: '90vh',
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '0px',
                            borderRadius: '0px',
                        }),
                    }),
                },
            },
        },
    });


    return (
        <ThemeProvider theme={theme}>
            <Hotkeys
                keyName="Space"
                onKeyDown={handleKeyDown.bind(this)}
                onKeyUp={handleKeyUp.bind(this)}
                disabled={false}
                allowRepeat={true}
            ></Hotkeys>

            <Modal open={show}>
                <ModalDialog style={{ width: '90vw', height: '90vh' }} layout='middle'>
                    {
                        (hoverItem3 === '') ?

                            <div className='d-flex flex-row align-items-center gap-4'>
                                <div style={{ backgroundColor: 'transparent', width: '45vw', height: '80vh' }} className='d-flex justify-content-center align-items-center'>
                                    <img src={datasetSegImgAPI(hoverItem1)} style={{ maxWidth: '46vw', maxHeight: '82vh' }} />
                                </div>
                                <div style={{ backgroundColor: 'transparent', width: '45vw', height: '80vh' }} className='d-flex justify-content-center align-items-center'>
                                    <img src={datasetSegImgAPI(hoverItem2)} style={{ maxWidth: '46vw', maxHeight: '82vh' }} />
                                </div>
                            </div>
                            :
                            <div className='d-flex flex-row align-items-center gap-4'>
                                <div style={{ backgroundColor: 'transparent', width: '90vw', height: '90vh' }} className='d-flex justify-content-center align-items-center'>
                                    <img src={datasetImgAPI(hoverItem3)} style={{ maxWidth: '90vw', maxHeight: '90vh' }} />
                                </div>
                            </div>
                    }



                </ModalDialog>
            </Modal>

            <div className="container-fluid mt-0" style={{ paddingTop: 5 }}>
                <div className="row">
                    <div className="col d-flex flex-row justify-content-between align-items-center mb-2">
                        <div className='my-table'>
                            <div className='my-thead' style={{ backgroundColor: "#FAFAFD" }}>
                                <div className='my-thead-th' style={{ width: tableColumnWidth[0] }}>No.</div>
                                <div className='my-thead-th' style={{ width: tableColumnWidth[1] }}>Image</div>
                                <div className='my-thead-th' style={{ width: tableColumnWidth[2] }}>Segment</div>
                                <div className='my-thead-th' style={{ width: tableColumnWidth[3] }}>Golden</div>
                                <div className='my-thead-th' style={{ width: tableColumnWidth[4] }}>Score</div>
                                <div className='my-thead-th' style={{ width: tableColumnWidth[5] }}>Threshold</div>
                                <div className='my-thead-th' style={{ width: tableColumnWidth[6] }}>Label</div>
                                <div className='my-thead-th' style={{ width: tableColumnWidth[7] }}>Result</div>
                                <div className='my-thead-th' style={{ width: tableColumnWidth[8] }}></div>


                            </div>
                            <div className='my-finger-tbody' style={{ height: data.segment_count*40 , overflowY: 'hidden' }}>
                                {
                                    data.segment_list.map((item, index) => (
                                        <div className={`my-tbody-finger-row-${(index % 2 === 1) ? "1" : "2"}`} key={`${item.imageUuid}_${index}`} style={{ height: 40 }}>

                                            <div className='my-finger-tbody-td' style={{ width: tableColumnWidth[0] }} >{index + 1}</div>
                                            {
                                                (index === 0) ?
                                                    <div className='my-finger-tbody-td' style={{ width: tableColumnWidth[1] }}>

                                                        <div style={{ position: 'relative' }}>
                                                            <div style={{ position: 'absolute', top: -20, left: 5 }}>
                                                                <CustomTooltip title={`Light Source: ${data.light_source} | Comp Name: ${data.component_name}`}>
                                                                    <img src={datasetImgAPI(data.image_uuid)}
                                                                        onError={replaceImage}
                                                                        style={{ width: 42, height: data.segment_count*40-1 }}
                                                                        className="my-segment-image"
                                                                        onMouseEnter={() => { setHoverItem1(''); setHoverItem2(''); setHoverItem3(data.image_uuid) }}
                                                                    />
                                                                </CustomTooltip>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className='my-finger-tbody-td' style={{ width: tableColumnWidth[1] }} ></div>
                                            }



                                            <div className='my-finger-tbody-td' style={{ width: tableColumnWidth[2] }} >
                                                {

                                                    (item.segment_uuid === null) ?
                                                        <></>
                                                        :
                                                        <div onMouseEnter={() => {
                                                            // console.log('---  on mouse enter ---');
                                                            // console.log(item);
                                                            setHoverItem1(item.segment_uuid);
                                                            setHoverItem2(item.golden_uuid);
                                                            setHoverItem3('');
                                                        }} >
                                                            <img src={datasetSegImgAPI(item.segment_uuid)}
                                                                onError={replaceImage}
                                                                style={{ maxHeight: 42, maxWidth: 42 }}
                                                                className="my-segment-image"
                                                            />
                                                        </div>
                                                }
                                            </div>
                                            <div className='my-finger-tbody-td' style={{ width: tableColumnWidth[3] }} >
                                                {
                                                    (item.golden_uuid === undefined) ?
                                                        <></>
                                                        :
                                                        <div onMouseEnter={() => {
                                                            setHoverItem1(item.segment_uuid); setHoverItem2(item.golden_uuid); setHoverItem3('')
                                                        }} >
                                                            <img src={datasetSegImgAPI(item.golden_uuid)}
                                                                onError={replaceImage}
                                                                style={{ maxHeight: 42, maxWidth: 42 }}
                                                                className="my-segment-image"
                                                            />
                                                        </div>
                                                }
                                            </div>
                                            <div className='my-finger-tbody-td' style={{ width: tableColumnWidth[4] }} >
                                                {item.siamese_score}
                                            </div>
                                            <div className='my-finger-tbody-td' style={{ width: tableColumnWidth[5] }} >
                                                {item.threshold}
                                            </div>
                                            <div className='my-finger-tbody-td' style={{ width: tableColumnWidth[6] }} >
                                                {item.label}
                                            </div>
                                            <div className='my-finger-tbody-td' style={{ width: tableColumnWidth[7] }} >
                                                {item.infer_label}
                                            </div>
                                            <div className='my-finger-tbody-td' style={{ width: tableColumnWidth[8] }} >
                                                {

                                                    (item.segment_uuid === null) ?
                                                        <></>
                                                        :
                                                        <ToggleButton id={'toggle_' + item.segment_uuid} status={(item.label === "PASS") ? "run" : "stop"}
                                                            onChange={(event) => handleLabelToggle(item.segment_uuid, event)}
                                                            top={-6} left={0}
                                                        ></ToggleButton>
                                                }

                                            </div>

                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div >


        </ThemeProvider>


    );
};

export default ResultCardAspect;

