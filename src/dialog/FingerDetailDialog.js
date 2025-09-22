
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { extendTheme } from '@mui/joy/styles';
import { ThemeProvider } from '@mui/joy/styles';
import { cloneDeep, filter, find, remove, keys, set, pick, groupBy } from 'lodash-es';



import CustomButton from '../components/Buttons/CustomButton';
import CustomInput from '../components/Inputs/CustomInput';
import IdTag from '../components/Tags/IdTag';
import { theme } from '../page/ProjectPage';

import { panelDatasetAPI, datasetImgAPI, datasetSegImgAPI } from '../APIPath';

const FingerDetailDialog = forwardRef((props, ref) => {

    const dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const [panelDataset, setPanelDataset] = useState(null);
    const [imageUuid, setImageUuid] = useState('');
    const [segmentList, setSegmentList] = useState([]);
    const [resultList, setResultList] = useState([]);

    const { aspect, data } = props;

    const fetchPanelDataset = ((data) => {

        console.log('exportId:', data.exportUuid);
        console.log('segmentId:', data.segmentUuid);

        fetch(panelDatasetAPI(data.exportUuid))
            .then((res) => res.json())
            .then((data) => {
                const sortData = pick(data.data, Object.keys(data.data).sort());
                setPanelDataset(sortData);
                findImageUuid();
            })
            .catch((err) => {
                const msg = err?.response?.detail?.[0]?.msg || '';
                const loc = err?.response?.detail?.[0]?.loc || [];
                console.log(`API error: ${msg} [${loc.join(', ')}]`);
            })
        // .finally(() => setIsLoading(false));
    });

    const refineJsonData = (data) => {

        // console.log('--- refine json data ---');
        // console.log(data);

        let myData = [];
        Object.keys(data).forEach((key) => {
            //console.log('key:', key);
            let compName = key;
            Object.keys(data[key]).forEach((subKey) => {
                //console.log('subKey:', subKey);
                let lightSource = subKey;
                Object.keys(data[key][subKey]).forEach((item) => {
                    //console.log('lightKey:', item);
                    let segmentIndex = item;
                    let myItem = data[key][subKey][item];
                    //console.log('myItem:', myItem);
                    if (myItem.train) {
                        let attr1 = 'train';
                        if (myItem.train.PASS) {
                            let attr2 = 'PASS';
                            myItem.train.PASS.forEach((seg) => {
                                const mySegment = seg;
                                mySegment.compName = compName;
                                mySegment.segmentIndex = segmentIndex;
                                mySegment.lightSource = lightSource;
                                mySegment.label1 = attr1;
                                mySegment.label2 = attr2;
                                myData.push(mySegment);

                            });
                        };
                        if (myItem.train.NG) {
                            let attr2 = 'NG';
                            myItem.train.NG.forEach((seg) => {
                                const mySegment = seg;
                                mySegment.compName = compName;
                                mySegment.segmentIndex = segmentIndex;
                                mySegment.lightSource = lightSource;
                                mySegment.label1 = attr1;
                                mySegment.label2 = attr2;
                                myData.push(mySegment);

                            });
                        };
                        if (myItem.train.GOLDEN) {
                            let attr2 = 'GOLDEN';
                            myItem.train.GOLDEN.forEach((seg) => {
                                const mySegment = seg;
                                mySegment.compName = compName;
                                mySegment.segmentIndex = segmentIndex;
                                mySegment.lightSource = lightSource;
                                mySegment.label1 = attr1;
                                mySegment.label2 = attr2;
                                myData.push(mySegment);

                            });
                        }
                    }
                    if (myItem.val) {
                        let attr1 = 'val';
                        if (myItem.val.PASS) {
                            let attr2 = 'PASS';
                            myItem.val.PASS.forEach((seg) => {
                                const mySegment = seg;
                                mySegment.compName = compName;
                                mySegment.segmentIndex = segmentIndex;
                                mySegment.lightSource = lightSource;
                                mySegment.label1 = attr1;
                                mySegment.label2 = attr2;
                                myData.push(mySegment);

                            });
                        };
                        if (myItem.val.NG) {
                            let attr2 = 'NG';
                            myItem.val.NG.forEach((seg) => {
                                const mySegment = seg;
                                mySegment.compName = compName;
                                mySegment.segmentIndex = segmentIndex;
                                mySegment.lightSource = lightSource;
                                mySegment.label1 = attr1;
                                mySegment.label2 = attr2;
                                myData.push(mySegment);

                            });
                        };

                    }
                });
            });
        });
        return myData;
    };

    const fetchDataset = ((exportUuid, segmentUuid) => {

        console.log('exportId:', exportUuid);
        console.log('segmentId:', segmentUuid);

        fetch(panelDatasetAPI(exportUuid))
            .then((res) => res.json())
            .then((data) => {
                //const sortData = pick(data.data, Object.keys(data.data).sort());
                const refineData = refineJsonData(data.data);
                setPanelDataset(refineData);
                findImageUuid(refineData);
            })
            .catch((err) => {
                const msg = err?.response?.detail?.[0]?.msg || '';
                const loc = err?.response?.detail?.[0]?.loc || [];
                console.log(`API error: ${msg} [${loc.join(', ')}]`);
            })
        // .finally(() => setIsLoading(false));
    });



    function findInNestedJson(obj, keyToFind, valueToFind) {
        if (typeof obj !== 'object' || obj === null) {
            return null; // Not an object or null, no match
        }

        // Check if current object has the key-value pair
        if (obj.hasOwnProperty(keyToFind) && obj[keyToFind] === valueToFind) {
            return obj;
        }

        // Iterate through properties/elements
        for (const k in obj) {
            if (obj.hasOwnProperty(k)) {
                const result = findInNestedJson(obj[k], keyToFind, valueToFind);
                if (result) {
                    return result; // Found in a nested level
                }
            }
        }
        return null; // Not found
    }

    function findInNestedJsonAll(obj, keyToFind, valueToFind) {

        //console.log('Searching for:', keyToFind, valueToFind);

        if (typeof obj !== 'object' || obj === null) {
            return []; // Not an object or null, no match
        }

        // Check if current object has the key-value pair
        if (obj.hasOwnProperty(keyToFind) && obj[keyToFind] === valueToFind) {
            return [obj];
        }

        // Iterate through properties/elements
        let ans = [];
        for (const k in obj) {
            if (obj.hasOwnProperty(k)) {
                const result = findInNestedJsonAll(obj[k], keyToFind, valueToFind);
                if (result) {
                    ans.push(...result);
                }
            }
        }
        return ans; // Not found
    }


    const findImageUuid = (myData) => {

        console.log('--- myData ---', myData);

        const segmentUuid = data.segmentUuid;

        const myObj = findInNestedJson(myData, 'segment_uuid', segmentUuid);

        if (myObj.image_uuid) {
            const myImageUuid = myObj.image_uuid;
            console.log('------------>', myImageUuid);
            setImageUuid(myImageUuid);

            const myObj2 = findInNestedJsonAll(myData, 'image_uuid', myImageUuid);
            console.log('myObj2===========>', myObj2);
            setSegmentList(myObj2);
        };

    };


    useImperativeHandle(ref, () => ({

        SetOpen: () => {
            setShow(true);
        },
        GetData: (exportUuid, segmentUuid,myResultList) => {
            fetchDataset(exportUuid, segmentUuid);
            setResultList(myResultList);


            console.log('--- result list ---');
            console.log(resultList);
        },



    }));

    return (
        <>

            <ThemeProvider theme={theme}>

                <Modal open={show}>
                    <ModalDialog style={{ width: '95%', height: '95%', borderRadius: 12 }} layout='center'>
                        <div className='d-flex align-items-start flex-column bd-highlight mb-0' style={{ height: 600 }}>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-12 mt-3 d-flex flex-row justify-content-between p-0'>
                                        <h4 style={{ margin: 0 }}>Finger Detail View</h4>

                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12 mt-3 d-flex flex-row justify-content-between p-0' >
                                        <div className='d-flex flex-row gap-1'>
                                            <IdTag label="Export UUID" value={data.exportUuid} />
                                            <IdTag label="Golden UUID" value={data.goldenUuid} />
                                            <IdTag label="Segment UUID" value={data.segmentUuid} />
                                            <IdTag label="Image UUID" value={imageUuid} />
                                        </div>
                                    </div>
                                </div>
                                <div className='row gap-2'>
                                    <div className='col-2 mt-3 p-0'>

                                        <div className='my-finger-container'>

                                            <div>
                                                <img src={datasetImgAPI(imageUuid)} className='my-finger-image' />
                                            </div>

                                        </div>

                                    </div>
                                    <div className='col-3 mt-3 p-0'>

                                        <div className='my-segment-container'>

                                            {
                                                segmentList.map((seg, index) => (
                                                    <div key={index} className={`d-flex flex-row gap-2 align-items-center ${(data.segmentUuid === seg.segment_uuid) ? 'my-segment-row-selected' : ''}`}>
                                                        <div className="my-segment-index-tag">{index}</div>
                                                        <img src={datasetSegImgAPI(seg.segment_uuid)} className='my-segment-image' />
                                                        <div className={`my-segment-label1-tag-${seg.label1}`}>{seg.label1}</div>
                                                        <div className={`my-segment-label2-tag-${seg.label2}`}>{seg.label2}</div>
                                                    </div>
                                                ))
                                            }


                                        </div>

                                    </div>
                                    <div className='col-3 mt-3 p-0'>
                                        <div className='my-finger-container'>


                                        </div>

                                    </div>
                                </div>
                            </div>




                        </div>

                        <div className='container-fluid mt-auto'>
                            <div className='row'>
                                <div className='col-md-12 d-flex flex-row gap-3 justify-content-end p-0'>
                                    <div><CustomButton name="close" width={100} height={32} onClick={() => setShow(false)} /></div>
                                </div>
                            </div>
                        </div>





                    </ModalDialog>
                </Modal>

            </ThemeProvider >
        </>
    );
});

export default FingerDetailDialog;

