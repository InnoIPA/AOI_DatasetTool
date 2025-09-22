
import { useEffect, useState, useRef } from 'react';
import './page.scss';
import { Button, createTheme, Menu, MenuItem, ThemeProvider, Tooltip } from '@mui/material';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { extendTheme } from '@mui/joy/styles';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { AttributeType, PageKeyType, ProjectDataType } from './type';
import { SchedulerHeadContainer, SchedulerHeadWrapper, SchedulerBodyContainer, SchedulerBodyWrapper } from "./pageStyle";
import { taoWorkspaceAPI, taoQuickTrainAPI, taoStartTrainAPI, taoTrainStatusWS, taoEvaluateAPI, taoInferenceAPI, taoExportAPI, taoDownloadAPI } from '../APIPath';

import { postAspectTrainPassAPI, postAspectTrainNgAPI, panelDatasetAPI } from '../APIPath';
import { theme2 } from './ProjectPage';
import Hotkeys from 'react-hot-keys';

//postValPassAPI
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/js/dist/tab.js';
import log from '../utils/console';
import Utility from '../utils/Utility';

import CustomCounter from '../components/Counters/CustomCounter';
import CustomChart from '../components/Charts/CustomChart';
import StatusButton from '../components/Buttons/StatusButton';
import CustomButton from '../components/Buttons/CustomButton';
import ExtendButton from '../components/Buttons/ExtendButton';
import FilterFingerPanel from '../components/Panels/FilterFingerPanel';
import ProjectNamePanel from '../components/Panels/ProjectNamePanel';
import ConfirmDialog from '../dialog/ConfirmDialog';


import ResultCardListAspect from '../components/Lists/ResultCardListAspect';
import ResultTableListAspect from '../components/Lists/ResultTableListAspect';


import moment from 'moment';
import { filter, toArray, findIndex, isEqual, map, cloneDeep, sortBy, orderBy, take, slice, uniqBy, set, uniq, groupBy } from 'lodash-es';
//import { info } from 'console';



const InferenceResultPageAspect = (props) => {

    const { setPageKey, projectData, setCurrentProject } = props;

    const [resultList, setResultList] = useState([]);
    const [checkList, setCheckList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [imageList, setImageList] = useState([]);

    const [compNameList, setCompNameList] = useState([]);
    const [lightSourceList, setLightSourceList] = useState([]);

    const [resultTaoModelId, setResultTaoModelId] = useState('');
    const [resultExportId, setResultExportId] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [currentProjectAspect, setCurrentProjectAspect] = useState(false); // 'train' or 'inference'

    const pageNum = 1;


    const [remainingTime, setRemainingTime] = useState('');
    const [startTime, setStartTime] = useState('');

    const [resultView, setResultView] = useState('card');


    const utilityRef = useRef(null);
    const filterPanelRef = useRef(null);

    const [openConfirmLeaveDialog, setOpenConfirmLeaveDialog] = useState(false);
    const confirmLeaveAttribute = {
        title: 'Confirm leave',
        desc: 'You have unsaved changes.<br/>Are you sure to leave?',
    };

    const handleConfirmLeave = () => {
        setOpenConfirmLeaveDialog(false);
        setPageKey('TrainPage');
    }


    const handleToggleView = (evt) => {

        if (resultView === 'card') { setResultView('table') } else { setResultView('card') };

    }

    const handleDownload = async () => {
        log('handleDownload ' + resultTaoModelId)
        //setShowInferenceResultModal(false);

        log('--- start time ---')
        log(moment().format('YYYY-MM-DD HH:mm:ss'));

        try {
            log('try export model')

            utilityRef.current.setLoading(true);

            const res = await fetch(taoExportAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "tao_model_uuid": resultTaoModelId }),
            });

            const resJson = await res.json();

            utilityRef.current.setLoading(false);

            if (resJson.detail) {
                const msg = resJson.detail?.[0]?.msg || '';
                const loc = resJson.detail?.[0]?.loc || [];
                utilityRef.current.showMessage(`API error: ${msg} [${loc.join(', ')}]`);
                return;
            }

            window.location.href = `${taoDownloadAPI}?tao_model_uuid=${resultTaoModelId}`;



        } catch (err) {

            log(err)
            // const msg = err?.response?.detail?.[0]?.msg || '';
            // const loc = err?.response?.detail?.[0]?.loc || [];
            // console.log(`API error: ${msg} [${loc.join(', ')}]`);

            if (err instanceof Error) {
                utilityRef.current?.showMessage(err.message);
            }

            utilityRef.current.setLoading(false);

        }

        log('--- end time ---')
        log(moment().format('YYYY-MM-DD HH:mm:ss'));

    }

    const handleLabelToggle = (mySegmentUuid, myImageUuid, myEvent) => {
        log('(3) handle label toggle ===>', mySegmentUuid, myImageUuid, myEvent)
        let resultArr = cloneDeep(resultList);
        const myIndex = findIndex(resultArr, function (myItem) { return myItem.image_uuid == myImageUuid });

        log('my index--->', myIndex)

        if (myIndex >= 0) {

            log('before--->')
            log(resultArr[myIndex]);

            resultArr[myIndex].segment_list = resultArr[myIndex].segment_list.map((item) => {
                if (item.segment_uuid === mySegmentUuid) {
                    item.label = (myEvent) ? 'PASS' : 'NG';
                }
                return item;
            });

            log('after--->')
            log(resultArr[myIndex]);

            setResultList(resultArr);
        }
    };


    const handleSave = async () => {
        // log('handle save')
        // log('result list--->')
        // log(resultList)
        // log('result tao model id--->')
        // log(resultTaoModelId)

        try {

            const currentExportId = utilityRef.current.getCurrentExportId();

            log('current export id--->')
            log(currentExportId)

            let imageListPASS = [];
            let imageListNG = [];
            let segmentListPASS = [];
            let segmentListNG = [];

            resultList.forEach((item) => {

                item.segment_list.forEach((segment) => {
                    if (segment.label === 'NG') {
                        segmentListNG.push(segment.segment_uuid);
                        imageListNG.push(item.image_uuid);
                    }
                    if (segment.label === 'PASS') {
                        segmentListPASS.push(segment.segment_uuid);
                        imageListPASS.push(item.image_uuid);
                    }
                });

            });

            // log('image list PASS--->')
            // log(imageListPASS)
            // log('image list NG--->')
            // log(imageListNG)
            // log('segment list PASS--->')
            // log(segmentListPASS)
            // log('segment list NG--->')
            // log(segmentListNG)


            const myDataPass = {};
            myDataPass.export_uuid = currentExportId;
            myDataPass.image_uuid_list = imageListPASS;
            myDataPass.segment_uuid_list = segmentListPASS;

            const myDataNg = {};
            myDataNg.export_uuid = currentExportId;
            myDataNg.image_uuid_list = imageListNG;
            myDataNg.segment_uuid_list = segmentListNG;


            utilityRef.current.setLoading(true);

            if (imageListPASS.length > 0) {

                const resPass = await fetch(postAspectTrainPassAPI, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(myDataPass),
                });

                const resPassJson = await resPass.json();

                if (resPassJson.detail) {
                    const msg = resPassJson.detail?.[0]?.msg || '';
                    const loc = resPassJson.detail?.[0]?.loc || [];
                    utilityRef.current.showMessage(`API error: ${msg} [${loc.join(', ')}]`);
                }

            }

            if (imageListNG.length > 0) {

                const resNg = await fetch(postAspectTrainNgAPI, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(myDataNg),
                });

                const resNgJson = await resNg.json();

                if (resNgJson.detail) {
                    utilityRef.current.showErrorMessage(resNgJson.detail);
                }
            }

            utilityRef.current.setLoading(false);
            utilityRef.current.showMessage(`Save successfully.`);

            //setCheckList(resultList);



        } catch (err) {
            log(err)

            utilityRef.current.setLoading(false);

        }


    }


    const fetchDataset = ((exportUuid) => {

        console.log('exportId:', exportUuid);

        fetch(panelDatasetAPI(exportUuid))
            .then((res) => res.json())
            .then((data) => {
                console.log('dataset data ===>', data);
            })
            .catch((err) => {
                const msg = err?.response?.detail?.[0]?.msg || '';
                const loc = err?.response?.detail?.[0]?.loc || [];
                console.log(`API error: ${msg} [${loc.join(', ')}]`);
            })
        // .finally(() => setIsLoading(false));
    });


    const fetchCSV = async (myTaoModelId) => {

        try {

            const myUrl = `${taoInferenceAPI}/result?tao_model_uuid=${myTaoModelId}`;
            const response = await fetch(myUrl, {
                method: 'GET',
            });
            if (response.status === 404) {
                const msg = await response.json();
                utilityRef.current.showMessage('API error: ' + msg.detail[0].msg);
                return;
            }
            const data = await response.text();
            const dataArr = data.split('\n');
            let resultArr = [];

            let headers = [];
            //let imageUuidList = [];
            dataArr.map((item, index) => {
                if (index === 0) {
                    headers = item.split(',');
                    console.log('CSV Headers:', headers);
                } else {
                    if (item.length > 0) {
                        const values = item.split(',');
                        const row = {};
                        headers.forEach((header, i) => {
                            row[header] = (header === 'segment_index') ? parseInt(values[i]) : values[i];


                        });
                        //console.log('CSV Row:', row);
                        resultArr.push(row);
                    }
                }
            });

            console.log('CSV Result Arr:', groupBy(resultArr, "image_uuid"));

            const groupByData = groupBy(resultArr, 'image_uuid');


            let myData = [];
            Object.keys(groupByData).forEach((key) => {
                //console.log(`Key: ${key}`, groupByData[key]);
                let myItem = {};
                myItem.image_uuid = key;
                myItem.component_name = groupByData[key][0].component_name;
                myItem.light_source = groupByData[key][0].light_source;
                myItem.segment_count = parseInt(groupByData[key][0].segment_count);
                let mySegments = [];

                for (let i = 0; i < myItem.segment_count; i++) {
                    const mySegment = filter(groupByData[key], { segment_index: i });
                    if (mySegment.length > 0) {
                        mySegments.push(...mySegment);
                    } else {
                        mySegments.push({ segment_index: i, segment_uuid: null });
                    }
                }

                myItem.segment_list = mySegments;
                myData.push(myItem);
            });


            console.log('myData:', myData);


            setResultList(myData);
            setCheckList(myData);
            setFilterList(myData);
            setResultTaoModelId(myTaoModelId);

            const myCompNameList = uniqBy(myData, 'component_name');
            const myCompNameArr = map(myCompNameList, 'component_name');
            let myCompName = [];
            myCompNameArr.map((item) => {
                myCompName.push({ name: item, checked: true });
            });
            setCompNameList(myCompName);


            const myLightSourceList = uniqBy(myData, 'light_source');
            const myLightSourceArr = map(myLightSourceList, 'light_source');
            let myLightSource = [];
            myLightSourceArr.map((item) => {
                myLightSource.push({ name: item, checked: true });
            });
            setLightSourceList(myLightSource);

            fetchDataset(utilityRef.current.getCurrentExportId());

        } catch (error) {
            console.error('Error fetching CSV:', error);
        }
    }



    const handleKeyDown = (keyName, e) => {

        if (e.code === 'ArrowRight') {
            if (currentPage < Math.ceil(resultList.length / pageNum)) {
                setCurrentPage(currentPage + 1);
            }
        }

        if (e.code === 'ArrowLeft') {
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        }

    }

    const handleChange = (myCompNameList, myLightSourceList) => {

        //console.log('(1) handleChange', myCompNameList, myLightSourceList);
        const myCompNameArr = filter(myCompNameList, (item) => item.checked).map((item) => item.name);
        const myLightSourceArr = filter(myLightSourceList, (item) => item.checked).map((item) => item.name);

        //console.log('(2) handleChange', myCompNameArr, myLightSourceArr);

        if (myCompNameArr.length === 0 || myLightSourceArr.length === 0) {
            setFilterList([]);
            return;
        }

        let myFilterArr = cloneDeep(resultList);

        //console.log('(3) handleChange', myFilterArr);

        myFilterArr = filter(myFilterArr, (item) => {
            //return myCompNameArr.includes(item.component_name) && myLightSourceArr.includes(item.light_source) && myLabelArr.includes(item.infer_label);
            return myCompNameArr.includes(item.component_name) && myLightSourceArr.includes(item.light_source);

        });

        setFilterList(myFilterArr);

        setCurrentPage(1);

    }

    useEffect(() => {


        log('project data');
        log(projectData);

        if (utilityRef.current) {
            const taoModelId = utilityRef.current.getCurrentTaoModelId();
            const projectAspect = utilityRef.current.getCurrentProjectAspect();
            setCurrentProjectAspect(projectAspect);

            if (taoModelId) {
                fetchCSV(taoModelId);
            };

        }


    }, []);

    return (
        <>
            <Hotkeys
                keyName="Space,Right,Left"
                onKeyDown={handleKeyDown.bind(this)}
                disabled={false}
                allowRepeat={true}
            ></Hotkeys>
            <ThemeProvider theme={theme2}>
                <div className="container">
                    <div className="train-page-content">
                        <div className='container-fluid'>
                            <div className='row'>
                                <div className='col-12 p-0 my-dialog-title d-flex flex-row justify-content-between'>
                                    <ProjectNamePanel projectName={utilityRef.current?.getCurrentTaoModelName()} aspect={true} />
                                    <div className='d-flex flex-row gap-2 align-items-center'>
                                        <CustomButton name={(currentProjectAspect) ? "view-aspect" : "view"} text="Filter" onClick={() => filterPanelRef.current?.setToggle()} width={100} />
                                        {/* <CustomButton name={(currentProjectAspect) ? "view-aspect" : "view"} text={(resultView === 'card') ? "Table view" : "Card view"} onClick={(evt) => handleToggleView(evt)} width={100} /> */}
                                        <CustomButton name={(currentProjectAspect) ? "download-aspect" : "download"} onClick={handleDownload} width={100} />
                                    </div>

                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-12 p-0 my-dialog-title d-flex flex-row justify-content-between'>
                                    <div>
                                        <FilterFingerPanel compNameList={compNameList} lightSourceList={lightSourceList} onChange={handleChange} ref={filterPanelRef} />
                                    </div>

                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-12 p-0 my-dialog-content mt-3'>
                                    <ResultCardListAspect data={slice(filterList, (currentPage - 1) * pageNum, ((currentPage - 1) * pageNum) + pageNum)} onChange={handleLabelToggle} />
                                </div>
                            </div>



                            <div className='row'>
                                <div className='col-12 d-flex justify-content-between align-items-center' style={{ padding: 10 }}>
                                    <Stack spacing={2}>
                                        <Pagination count={Math.ceil(filterList.length / pageNum)} color="primary" variant="outlined" shape="rounded" page={currentPage} onChange={(e, v) => setCurrentPage(v)} />
                                    </Stack>

                                    <div className='d-flex gap-3'>
                                        <CustomButton name="close" onClick={() => {
                                            //setShowInferenceResultModal(false);
                                            if (isEqual(resultList, checkList)) {
                                                utilityRef.current.setCurrentTab('history');
                                                setPageKey('TrainPage');
                                            } else {
                                                log('not equal');
                                                setOpenConfirmLeaveDialog(true);
                                            }

                                        }} width={100} />

                                        <CustomButton name={(currentProjectAspect) ? "view-aspect" : "view"} text="Save" onClick={handleSave} width={100} />

                                    </div>
                                </div>
                            </div>


                        </div>


                    </div>
                </div>
            </ThemeProvider >
            <Utility ref={utilityRef} />

            <ConfirmDialog
                openConfirmDialog={openConfirmLeaveDialog}
                setOpenConfirmDialog={setOpenConfirmLeaveDialog}
                handleConfirm={handleConfirmLeave}
                confirmAttribute={confirmLeaveAttribute}
            />
        </>
    );
}

export default InferenceResultPageAspect;