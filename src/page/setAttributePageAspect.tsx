import { Dispatch, FormEventHandler, MouseEventHandler, SetStateAction, useCallback, useEffect, useState, useRef, MouseEvent } from 'react';
import { faCircle, faCircleMinus, faCircleXmark, faCircleCheck, faCircleInfo, faChevronUp, faChevronDown, faBolt, faPercent, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ThemeProvider } from '@mui/material';
import { cloneDeep, filter, find, remove, keys, set, pick, groupBy } from 'lodash-es';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import moment from "moment";
import Hotkeys from 'react-hot-keys';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
//import Badge from '@mui/joy/Badge';
import Badge from '@mui/material/Badge';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import ProjectNamePanel from '../components/Panels/ProjectNamePanel';
import Utility, { UtilityRef } from '../utils/Utility';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { selectCurrentList, setToggleArea, setClearList, setSelectedList, setSomethingChange, setToggleItem } from '../redux/store/slice/currentSelected';
import { selectCurrentDataset, setPanelDatasetThird } from '../redux/store/slice/currentDataset';

import {
    deleteAspectImgAPI,
    panelDatasetAPI,
    panelDatasetZipAPI,
    postAspectGoldenAPI,
    postAspectTrainNgAPI,
    postAspectTrainPassAPI,
    postAspectValNgAPI,
    postAspectValPassAPI,

} from '../APIPath';
import DivEllipsisWithTooltip from '../components/DivEllipsisWithTooltip';
import DraggableAspectCard from '../components/DraggableAspectCard';
import LoadingOverlay from '../components/LoadingOverlay';
import CustomTab from '../components/Tabs/CustomTab';
import CustomButton from '../components/Buttons/CustomButton';
import CustomSearchBar from '../components/SearchBars/CustomSearchBar';

import ConfirmAspectDialog from '../dialog/ConfirmAspectDialog';
import RatioAspectDialog from '../dialog/RatioAspectDialog';
import TrainingDialog, { TrainingDialogRef } from '../dialog/TrainingDialog';
import HintDialog, { HintDialogRef } from '../dialog/HintDialog';
import AddPicDialog, { AddPicDialogRef } from '../dialog/AddPicDialog';
import NumberGroupPanel from '../components/Panels/NumberGroupPanel';
import WarningDialog from '../dialog/WarningDialog';
import { theme2 } from './ProjectPage';
import { datasetSegImgAPI } from '../APIPath';

import {
    AttributeType,
    PageKeyType,
    PanelDatasetAspectPromiseType,
    PanelDatasetType,
    PanelDatasetAspectType,
    PanelDatasetListType,
    PanelInfoType,
    FolderType,
    PassNgType,
    ProjectDataType,
    TrainValType,
} from './type';
import IconCheckedAll from '../components/CustomIcons/IconCheckedAll';
import IconCheckedEmpty from '../components/CustomIcons/IconCheckedEmpty';
import IconCheckedPartial from '../components/CustomIcons/IconCheckedPartial';



const getCheckStatus = (data: Record<string, PanelDatasetType>) => {

    return Object.keys(data)
        .map((item) => data[item].check)
        .reduce((a, b) => a && b);
};

const getCheckStatusNum_xx = (data: Record<string, PanelDatasetType>) => {

    console.log('---------------------------------------')
    console.log('getCheckStatusNum', data)



    // 1: all checked, 2: all unchekced, 3: mix
    const checkArr = Object.keys(data).map((item) => data[item].check);
    const total = checkArr.length;
    const checkNum = checkArr.filter((item) => item === true).length;
    const uncheckNum = checkArr.filter((item) => item === false).length;

    if (total == checkNum) return 1;
    if (total == uncheckNum) return 2;
    return 3;
};

const getCheckStatusNum = (myCompName: string, myIndex: number, myDataset: any) => {

    const myCompData = myDataset[myCompName];

    // console.log('---------------------------------------')
    // console.log('myCompName', myCompName)
    // console.log('myIndex ---> ', myIndex)
    // console.log(`myCompData[${myCompName}]`, myCompData)


    let checkArr: boolean[] = [];
    Object.keys(myCompData).forEach((key) => {
        // console.log('key', key)
        // console.log(`myCompData[${myCompName}][${key}][${myIndex}].check`, myCompData[key][myIndex].check);
        checkArr.push(myCompData[key][myIndex].check);
    });

    let allFalse = checkArr.every(val => val === false);
    let allTrue = checkArr.every(val => val === true);

    // 1: all checked, 2: all unchekced, 3: mixset
    if (allTrue) return 1;
    if (allFalse) return 2;
    return 3;


};

type SetAttributePagePageProps = {
    currentProject: ProjectDataType;
    setPageKey: Dispatch<SetStateAction<PageKeyType>>;
    fetchProject: (projectId: string) => void;
};

const SetAttributePageAspect = (props: SetAttributePagePageProps) => {
    const { currentProject, setPageKey, fetchProject } = props;
    //const [somethingChange, setSomethingChange] = useState(false);
    const [tempComp, setTempComp] = useState('');
    const [tempLight, setTempLight] = useState('');
    const [tempIndex, setTempIndex] = useState(-1);
    const [openConfirmLeaveDialog, setOpenConfirmLeaveDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openRatioDialog, setOpenRatioDialog] = useState(false);
    const [openTrainingDialog, setOpenTrainingDialog] = useState(false);
    const [openWarningDialog, setOpenWarningDialog] = useState(false);
    const [panelInfo, setPanelInfo] = useState<PanelInfoType>();
    const [panelDataset, setPanelDataset] = useState<Record<string, Record<string, PanelDatasetAspectType>>>();
    const [panelDatasetSecond, setPanelDatasetSecond] = useState<PanelDatasetListType[]>();
    //const [panelDatasetThird, setPanelDatasetThird] = useState<PanelDatasetType>();

    const [selectComp, setSelectComp] = useState('');
    const [selectLight, setSelectLight] = useState('');
    const [selectIndex, setSelectIndex] = useState(0);

    const [trainPass, setTrainPass] = useState(0);
    const [trainNg, setTrainNg] = useState(0);
    const [valPass, setValPass] = useState(0);
    const [valNg, setValNg] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [hoverItem, sethoverItem] = useState('');
    const [show, setShow] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showAddPic, setShowAddPic] = useState(false);

    const [folderList, setFolderList] = useState<FolderType[]>([]);
    const [folderOpen, setFolderOpen] = useState(true);

    const [subFolderList, setSubFolderList] = useState<FolderType[]>([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const dispatch = useDispatch();

    //const utilityRef<UtilityRef></UtilityRef> = useRef(null);

    const utilityRef = useRef<UtilityRef>(null);

    const panelDatasetThird = useSelector(selectCurrentDataset).dataset;
    const selectedList = useSelector(selectCurrentList).list;
    const selectedArea = useSelector(selectCurrentList).area;
    const somethingChange = useSelector(selectCurrentList).somethingChange;

    const trainNum = panelDatasetThird ? panelDatasetThird.train.PASS.length + panelDatasetThird.train.NG.length : 0;
    const valNum = panelDatasetThird ? panelDatasetThird.val.PASS.length + panelDatasetThird.val.NG.length : 0;
    const goldenNum = panelDatasetThird?.train?.GOLDEN ? panelDatasetThird.train.GOLDEN.length : 0;

    // const trainNum = 0;
    // const valNum = 0;
    // const goldenNum = 0;

    const NumPerPage = 100;
    const [trainPassPage, setTrainPassPage] = useState(1);
    const [trainNgPage, setTrainNgPage] = useState(1);
    const [valPassPage, setValPassPage] = useState(1);
    const [valNgPage, setValNgPage] = useState(1);
    const [trainDeletePage, setTrainDeletePage] = useState(1);


    const passPanelRef = useRef<HTMLInputElement>(null);
    const trainingDialogRef = useRef<TrainingDialogRef>(null);
    const hintDialogRef = useRef<HintDialogRef>(null);
    const addPicDialogRef = useRef<AddPicDialogRef>(null);

    const resetAllPage = () => {
        setTrainPassPage(1);
        setTrainNgPage(1);
        setValPassPage(1);
        setValNgPage(1);
    }

    const confirmAttribute: AttributeType = {
        title: 'Save changes',
        desc: `Deleted items <b>can't be restored</b>.<br/>Are you sure to save changes?`,
    };

    const confirmLeaveAttribute: AttributeType = {
        title: 'Confirm leave',
        desc: 'You have unsaved changes.<br/>Are you sure to leave?',
    };

    let warningGoldenCheckAttribute: AttributeType = {
        title: 'Warning',
        desc: 'Golden can be just one. <br/>Please adjust to one.',
    };

    const findPanelDatasetSecond = (data: any, comp: string, light: string, index: number) => {

        let myAnswer: any = null;

        Object.keys(data).forEach((key) => {
            if (key !== comp) return;

            let myLightList: { name: string; data?: any; }[] = [];
            Object.keys(data[key]).forEach((subKey) => {

                let myLightItems: { name: string; data?: any } = { name: subKey };
                let myLightItemList: any[] = [];
                Object.keys(data[key][subKey]).forEach((item, subIndex) => {

                    myLightItemList.push(data[key][subKey][item]);
                });
                myLightItems.data = myLightItemList;
                myLightList.push(myLightItems);
            });

            myAnswer = myLightList;

        });
        return myAnswer;
    };

    const findPanelDatasetThird = (data: any, comp: string, light: string, index: number) => {

        let myAnswer: any = null;

        Object.keys(data).forEach((key) => {
            if (key !== comp) return;
            Object.keys(data[key]).forEach((subKey) => {
                if (subKey !== light) return;
                Object.keys(data[key][subKey]).forEach((item, subIndex) => {
                    if (subIndex === index) {
                        myAnswer = data[key][subKey][item];
                    }
                });
            });
        });

        return myAnswer;
    };

    const findCheckStatus = (comp: string, light: string, index: number) => {

        let myAnswer: boolean = false;


        //const data=panelDataset;

        if (panelDataset) {
            Object.keys(panelDataset).forEach((key) => {
                if (key !== comp) return;
                Object.keys(panelDataset[key]).forEach((subKey) => {
                    if (subKey !== light) return;
                    Object.keys(panelDataset[key][subKey]).forEach((item, subIndex) => {
                        if (subIndex === index) {
                            //const aaa = panelDataset[key][subKey][item];
                            const aspectItems = Object.values(panelDataset[key][subKey]);
                            const aspectItem = aspectItems[subIndex];
                            myAnswer = typeof aspectItem === 'object' && aspectItem !== null && 'check' in aspectItem
                                ? (aspectItem as { check?: boolean }).check || false
                                : false;
                        }
                    });
                });
            });
        }



        return myAnswer;
    };

    const fetchPanelDataset = useCallback((exportId: string) => {

        setIsLoading(true);
        fetch(panelDatasetAPI(exportId))
            .then((res) => res.json())
            .then((data) => {

                const sortData = pick(data.data, Object.keys(data.data).sort());
                let myFolderList: FolderType[] = [];

                Object.keys(sortData).forEach((key, myIndex) => {

                    let myData: { name: string; show: boolean; data: any; }[] = [];
                    if (sortData[key]) {
                        myData = Object.keys(sortData[key]).map((subKey) => {
                            let myDataList: any[] = [];
                            if (sortData[key][subKey]) {
                                Object.keys(sortData[key][subKey]).forEach((item) => {
                                    const myItem = sortData[key][subKey][item];
                                    myDataList.push(myItem);
                                });
                            }
                            return { name: subKey, show: folderOpen, data: myDataList };
                        });
                    }

                    const folderItem = { name: key, show: folderOpen, data: myData };
                    myFolderList.push(folderItem);


                    if (myIndex === 0) {
                        setSelectComp(key);
                        Object.keys(sortData[key]).forEach((subKey, subIndex) => {
                            if (subIndex === 0) {
                                setSelectLight(subKey);
                                setPanelDatasetSecond(findPanelDatasetSecond(sortData, key, subKey, selectIndex));
                                const myPanelDatasetThird = findPanelDatasetThird(sortData, key, subKey, selectIndex);
                                dispatch(setPanelDatasetThird(myPanelDatasetThird)); // Set the initial dataset for the first component and light
                            }
                        });
                    }
                });

                setFolderList(myFolderList);
                setPanelInfo(data.info);
                setPanelDataset(sortData);

            })
            .catch((err) => {
                const msg = err?.response?.detail?.[0]?.msg || '';
                const loc = err?.response?.detail?.[0]?.loc || [];
                console.log(`API error: ${msg} [${loc.join(', ')}]`);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const fetchPanelDatasetAsync = async (exportId: string) => {

        console.log('--- fetch Panel Dataset Async---')

        setIsLoading(true);
        const res = await fetch(panelDatasetAPI(exportId));
        const resJson = await res.json();
        if (resJson.detail) {
            //utilityRef.current.showErrorMessage(resJson.detail);
            setIsLoading(false);
            console.log('fetchPanelDatasetAsync error', resJson.detail);
            return null;
        }

        setPanelInfo(resJson.info);
        setPanelDataset(resJson.data);

        setIsLoading(false);
        return resJson.data;

    };

    const SaveFetchPanelDataset = useCallback(
        (exportId: string) => {
            fetch(panelDatasetAPI(exportId))
                .then((res) => res.json())
                .then((data) => {


                    console.log('----------------------------save-----')
                    console.log('--- data ---')
                    console.log(data);
                    setPanelInfo(data.info);
                    setPanelDataset(data.data);
                    console.log('--- selectComp ---', selectComp);
                    console.log('--- selectLight ---', selectLight);
                    console.log('--- selectIndex ---', selectIndex);

                    if (data.data[selectComp]) {

                        console.log('(1)')

                        if (selectComp) {
                            setPanelDatasetSecond(findPanelDatasetSecond(data.data, selectComp, selectLight, selectIndex));
                        }
                        if (selectComp && selectLight) {
                            dispatch(setPanelDatasetThird(findPanelDatasetThird(data.data, selectComp, selectLight, selectIndex)));
                        }

                    } else {

                        console.log('(2)')


                        const mySelectComp = Object.keys(data.data)[0]
                        setSelectComp(mySelectComp);
                        const mySelectLight = Object.keys(data.data[mySelectComp])[0];
                        setSelectLight(mySelectLight);
                        setPanelDatasetSecond(findPanelDatasetSecond(data.data, mySelectComp, mySelectLight, 0));
                        dispatch(setPanelDatasetThird(findPanelDatasetThird(data.data, mySelectComp, mySelectLight, 0)));
                        dispatch(setClearList());

                    }

                })
                .catch((err) => {

                    console.log(err)
                    const msg = err?.response?.detail?.[0]?.msg || '';
                    const loc = err?.response?.detail?.[0]?.loc || [];
                    console.log(`API error: ${msg} [${loc.join(', ')}]`);
                });
        },
        [selectComp, selectLight, selectIndex],
    );

    const onDragEnd = (event: any) => {

        if (!panelDatasetThird) return;

        const { source, destination } = event;
        if (!destination) return;

        if (source.droppableId === destination.droppableId) return;

        const sourceTrainVal: TrainValType = source.droppableId.split('_')[0];
        const sourceType: PassNgType = source.droppableId.split('_')[1];
        const destTrainVal: TrainValType = destination.droppableId.split('_')[0];
        const destType: PassNgType = destination.droppableId.split('_')[1];



        // 當golden貼上第二項時觸發
        if ((destType === 'GOLDEN' && panelDatasetThird.train.GOLDEN?.length) || 0 > 1) {
            setOpenWarningDialog(true);
            return;
        }
        //return alert('Golden can be just one. Please remove the original one.');

        let newPanelDataset = cloneDeep(panelDatasetThird);

        // 從source剪下被拖曳的元素
        const sourceList = newPanelDataset[sourceTrainVal]?.[sourceType] || [];

        const removeItem = sourceList[source.index];

        console.log('destType', destType);

        if ((removeItem.segment_uuid && selectedList.includes(removeItem.segment_uuid)) && (destType === 'GOLDEN')) {
            if (selectedList.length > 1) {
                setOpenWarningDialog(true);
                return;
            }
        }


        if (removeItem.segment_uuid && selectedList.includes(removeItem.segment_uuid)) {
            selectedList.forEach(function (myItem, myIndex) {


                let moveItem = null;
                const item1 = find(newPanelDataset['train']?.['PASS'] || [], { segment_uuid: myItem });
                if (item1) remove(newPanelDataset['train']?.['PASS'] || [], { segment_uuid: myItem });
                const item2 = find(newPanelDataset['train']?.['NG'] || [], { segment_uuid: myItem });
                if (item2) remove(newPanelDataset['train']?.['NG'] || [], { segment_uuid: myItem });
                const item3 = find(newPanelDataset['train']?.['GOLDEN'] || [], { segment_uuid: myItem });


                if (item3) remove(newPanelDataset['train']?.['GOLDEN'] || [], { segment_uuid: myItem });
                const item4 = find(newPanelDataset['train']?.['DELETE'] || [], { segment_uuid: myItem });
                if (item4) remove(newPanelDataset['train']?.['DELETE'] || [], { segment_uuid: myItem });
                const item5 = find(newPanelDataset['val']?.['PASS'] || [], { segment_uuid: myItem });
                if (item5) remove(newPanelDataset['val']?.['PASS'] || [], { segment_uuid: myItem });
                const item6 = find(newPanelDataset['val']?.['NG'] || [], { segment_uuid: myItem });
                if (item6) remove(newPanelDataset['val']?.['NG'] || [], { segment_uuid: myItem });
                moveItem = (item1) ? item1 : (item2) ? item2 : (item3) ? item3 : (item4) ? item4 : (item5) ? item5 : (item6) ? item6 : null;

                console.log('moveItem', moveItem);


                if (moveItem) {
                    const pasteList = newPanelDataset[destTrainVal]?.[destType] || [];
                    pasteList.splice(0, 0, moveItem);
                    newPanelDataset[destTrainVal][destType] = pasteList;



                }

            });

            console.log('----------------------------------')
            console.log('newPanelDataset', newPanelDataset);

            dispatch(setPanelDatasetThird(newPanelDataset));
            dispatch(setSomethingChange(true));

        } else {
            // 按之前的方式
            const [removeItem] = sourceList.splice(source.index, 1);
            // 在destination位置貼上被拖曳的元素
            const pasteList = newPanelDataset[destTrainVal]?.[destType] || [];
            pasteList.splice(destination.index, 0, removeItem);
            newPanelDataset[destTrainVal][destType] = pasteList;
            dispatch(setPanelDatasetThird(newPanelDataset));
            dispatch(setSomethingChange(true));
        };
    };

    const moveSelectedListToArea = (AreaNum: number) => {


        if (!panelDatasetThird) return;
        let newPanelDataset = cloneDeep(panelDatasetThird);
        selectedList.forEach(function (myItem, myIndex) {

            let moveItem = null;
            const item1 = find(newPanelDataset['train']?.['PASS'] || [], { segment_uuid: myItem });
            if (item1) remove(newPanelDataset['train']?.['PASS'] || [], { segment_uuid: myItem });
            const item2 = find(newPanelDataset['train']?.['NG'] || [], { segment_uuid: myItem });
            if (item2) remove(newPanelDataset['train']?.['NG'] || [], { segment_uuid: myItem });
            const item3 = find(newPanelDataset['train']?.['GOLDEN'] || [], { segment_uuid: myItem });
            if (item3) remove(newPanelDataset['train']?.['GOLDEN'] || [], { segment_uuid: myItem });
            const item4 = find(newPanelDataset['train']?.['DELETE'] || [], { segment_uuid: myItem });
            if (item4) remove(newPanelDataset['train']?.['DELETE'] || [], { segment_uuid: myItem });
            const item5 = find(newPanelDataset['val']?.['PASS'] || [], { segment_uuid: myItem });
            if (item5) remove(newPanelDataset['val']?.['PASS'] || [], { segment_uuid: myItem });
            const item6 = find(newPanelDataset['val']?.['NG'] || [], { segment_uuid: myItem });
            if (item6) remove(newPanelDataset['val']?.['NG'] || [], { segment_uuid: myItem });
            moveItem = (item1) ? item1 : (item2) ? item2 : (item3) ? item3 : (item4) ? item4 : (item5) ? item5 : (item6) ? item6 : null;

            if (moveItem) {
                let pasteList: any = [];

                if (AreaNum === 1) {
                    pasteList = newPanelDataset['train']?.['PASS'] || [];
                    pasteList.splice(0, 0, moveItem);
                    newPanelDataset['train']['PASS'] = pasteList;
                    setTrainPassPage(1);
                }

                if (AreaNum === 2) {
                    pasteList = newPanelDataset['train']?.['NG'] || [];
                    pasteList.splice(0, 0, moveItem);
                    newPanelDataset['train']['NG'] = pasteList;
                    setTrainNgPage(1);
                }

                if (AreaNum === 3) {
                    pasteList = newPanelDataset['val']?.['PASS'] || [];
                    pasteList.splice(0, 0, moveItem);
                    newPanelDataset['val']['PASS'] = pasteList;
                    setValPassPage(1);
                }

                if (AreaNum === 4) {
                    pasteList = newPanelDataset['val']?.['NG'] || [];
                    pasteList.splice(0, 0, moveItem);
                    newPanelDataset['val']['NG'] = pasteList;
                    setValNgPage(1);
                }

                if (AreaNum === 5) {
                    pasteList = newPanelDataset['train']?.['GOLDEN'] || [];
                    pasteList.splice(0, 0, moveItem);
                    newPanelDataset['train']['GOLDEN'] = pasteList;
                }

                if (AreaNum === 6) {
                    pasteList = newPanelDataset['train']?.['DELETE'] || [];
                    pasteList.splice(0, 0, moveItem);
                    newPanelDataset['train']['DELETE'] = pasteList;
                    setTrainDeletePage(1);
                }
            }

        });

        dispatch(setPanelDatasetThird(newPanelDataset));
        dispatch(setSomethingChange(true));




    }

    const handleShiftSelect = (myIndex: number, myStr1: string, myStr2: string) => {

        if (!panelDatasetThird) return;

        let newPanelDataset = cloneDeep(panelDatasetThird);
        const source1Type: TrainValType = (myStr1 === 'train') ? 'train' : 'val';
        const source2Type: PassNgType = (myStr2 === 'PASS') ? 'PASS' : (myStr2 === 'NG') ? 'NG' : (myStr2 === 'DELETE') ? 'DELETE' : 'GOLDEN';

        const targetList = newPanelDataset[source1Type]?.[source2Type] || [];


        console.log('source1Type', source1Type);
        console.log('source2Type', source2Type);
        console.log('targetList', targetList);
        console.log('selectedList', selectedList)


        let maxIndex = -1;
        if (targetList.length > 0) {
            selectedList.forEach(function (myItem, myIndex) {

                console.log('myItem', myItem);
                console.log('myIndex', myIndex);

                const indexItems = targetList.map((item, index) => item.segment_uuid === myItem ? index : null).filter((item) => item !== null);
                const index = targetList.findIndex(a => a.segment_uuid === myItem)
                if (index > maxIndex) maxIndex = index;

            });
        }
        console.log('maxIndex', maxIndex);
        if (maxIndex >= 0) {
            const selectList = targetList.slice(Math.min(maxIndex, myIndex), Math.max(maxIndex, myIndex) + 1)
            const allImageUuid = selectList.flatMap((selectList) => {
                return selectList.segment_uuid;
            });
            dispatch(setSelectedList(allImageUuid));
        }

    }

    const handleKeyDown = (keyName: any, e: any) => {

        //console.log('e.code', e.code);

        if (e.code === 'PageUp') {
            if (((selectedArea > 0) && (selectedArea < 5)) || (selectedArea === 6)) {

                if (selectedArea === 1) {
                    if (trainPassPage > 1) setTrainPassPage(trainPassPage - 1)
                }
                if (selectedArea === 2) {
                    if (trainNgPage > 1) setTrainNgPage(trainNgPage - 1)
                }
                if (selectedArea === 3) {
                    if (valPassPage > 1) setValPassPage(valPassPage - 1)
                }
                if (selectedArea === 4) {
                    if (valNgPage > 1) setValNgPage(valNgPage - 1)
                }
                if (selectedArea === 6) {
                    if (trainDeletePage > 1) setTrainDeletePage(trainDeletePage - 1)
                }


            }
        }

        if (e.code === 'PageDown') {
            if (((selectedArea > 0) && (selectedArea < 5)) || (selectedArea === 6)) {
                console.log('do page down')

                if (selectedArea === 1) {
                    const totalPage = Math.ceil(panelDatasetThird.train.PASS.length / NumPerPage);
                    if (trainPassPage < totalPage) setTrainPassPage(trainPassPage + 1)
                }
                if (selectedArea === 2) {
                    const totalPage = Math.ceil(panelDatasetThird.train.NG.length / NumPerPage);
                    if (trainNgPage < totalPage) setTrainNgPage(trainNgPage + 1)
                }
                if (selectedArea === 3) {
                    const totalPage = Math.ceil(panelDatasetThird.val.PASS.length / NumPerPage);
                    if (valPassPage < totalPage) setValPassPage(valPassPage + 1)
                }
                if (selectedArea === 4) {
                    const totalPage = Math.ceil(panelDatasetThird.val.NG.length / NumPerPage);
                    if (valNgPage < totalPage) setValNgPage(valNgPage + 1)
                }
                if (selectedArea === 6) {
                    const totalPage = Math.ceil((panelDatasetThird.train.DELETE ? panelDatasetThird.train.DELETE.length : 0) / NumPerPage);
                    if (trainDeletePage < totalPage) setTrainDeletePage(trainDeletePage + 1)
                }

            }
        }

        if (e.code === 'Space') {
            if (hoverItem !== '') {
                if (show === false) setShow(true);
            }
        }

        if (e.code === 'Escape') {
            dispatch(setToggleArea(0));
            dispatch(setSelectedList([]));
        }

        if (e.code === 'ArrowUp') {
            if (selectedArea === 4) {
                dispatch(setToggleArea(2));
                moveSelectedListToArea(2);
            }
            if (selectedArea === 3) {
                dispatch(setToggleArea(1));
                moveSelectedListToArea(1);
            }
            if (selectedArea === 6) {
                if (goldenNum > 0) {
                    setOpenWarningDialog(true);
                    return;
                }
                if (selectedList.length > 1) {
                    setOpenWarningDialog(true);
                    return;
                }
                dispatch(setToggleArea(5));
                moveSelectedListToArea(5);
            }

        }
        if (e.code === 'ArrowDown') {
            if (selectedArea === 1) {
                dispatch(setToggleArea(3))
                moveSelectedListToArea(3);
            }
            if (selectedArea === 2) {
                dispatch(setToggleArea(4))
                moveSelectedListToArea(4);
            }
            if (selectedArea === 5) {
                dispatch(setToggleArea(6));
                moveSelectedListToArea(6);
            }

        }
        if (e.code === 'ArrowLeft') {
            if (selectedArea === 2) {
                dispatch(setToggleArea(1));
                moveSelectedListToArea(1);
            }
            if (selectedArea === 4) {
                dispatch(setToggleArea(3));
                moveSelectedListToArea(3);
            }
            if (selectedArea === 6) {
                dispatch(setToggleArea(4));
                moveSelectedListToArea(4);
            }
            if (selectedArea === 5) {
                dispatch(setToggleArea(2));
                moveSelectedListToArea(2);
            }

        }
        if (e.code === 'ArrowRight') {
            if (selectedArea === 1) {
                dispatch(setToggleArea(2));
                moveSelectedListToArea(2);
            }
            if (selectedArea === 2) {

                if (goldenNum > 0) {
                    setOpenWarningDialog(true);
                    return;
                }
                if (selectedList.length > 1) {
                    setOpenWarningDialog(true);
                    return;
                }
                dispatch(setToggleArea(5));
                moveSelectedListToArea(5);
            }
            if (selectedArea === 3) {
                dispatch(setToggleArea(4));
                moveSelectedListToArea(4);
            }
            if (selectedArea === 4) {
                dispatch(setToggleArea(6));
                moveSelectedListToArea(6);
            }

        }

    }

    const handleKeyUp = (keyName: any, e: any) => {

        if (e.code === 'Space') {
            setShow(false);
            sethoverItem('');
        }
    }

    const putResource = async (exportId: string, url: string, method: 'PUT' | 'DELETE', putList: string[], putSegList: string[]): Promise<any> => {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                export_uuid: exportId,
                image_uuid_list: putList,
                segment_uuid_list: putSegList, // Assuming segment_uuid_list is the same as image_uuid_list
            }),
        });

        if (!response.ok) {
            throw new Error(`PUT request for resource ${url} failed`);
        }

        return response.json();
    };

    const adjustRatio: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        if (!panelDatasetThird) return;
        const passArray = [...panelDatasetThird.train.PASS, ...panelDatasetThird.val.PASS];
        const ngArray = [...panelDatasetThird.train.NG, ...panelDatasetThird.val.NG];

        let newPanelDataset = cloneDeep(panelDatasetThird);
        newPanelDataset.train.PASS = passArray.slice(0, Math.ceil((passArray.length * trainPass) / 100));
        newPanelDataset.val.PASS = passArray.slice(Math.ceil((passArray.length * trainPass) / 100), passArray.length);
        newPanelDataset.train.NG = ngArray.slice(0, Math.ceil((ngArray.length * trainNg) / 100));
        newPanelDataset.val.NG = ngArray.slice(Math.ceil((ngArray.length * trainNg) / 100), ngArray.length);

        dispatch(setPanelDatasetThird(newPanelDataset));
        dispatch(setSomethingChange(true));
    };

    const saveData = (exportId: string | null, data?: PanelDatasetType) => {
        if (!exportId) return;
        if (!data) return;


        console.log('--- exportId ---', exportId);

        console.log('--- data ---', data);

        setIsLoading(true);

        const APIList: PanelDatasetAspectPromiseType = [
            { path: postAspectTrainPassAPI, method: 'PUT', data: (data?.train.PASS.map((item) => item.image_uuid).filter((uuid): uuid is string => uuid !== null && uuid !== undefined)) || [], data2: (data?.train.PASS.map((item) => item.segment_uuid).filter((uuid): uuid is string => uuid !== null && uuid !== undefined)) || [] },
            { path: postAspectTrainNgAPI, method: 'PUT', data: (data?.train.NG.map((item) => item.image_uuid).filter((uuid): uuid is string => uuid !== null && uuid !== undefined)) || [], data2: (data?.train.NG.map((item) => item.segment_uuid).filter((uuid): uuid is string => uuid !== null && uuid !== undefined)) || [] },
            { path: postAspectValPassAPI, method: 'PUT', data: (data?.val.PASS.map((item) => item.image_uuid).filter((uuid): uuid is string => uuid !== null && uuid !== undefined)) || [], data2: (data?.val.PASS.map((item) => item.segment_uuid).filter((uuid): uuid is string => uuid !== null && uuid !== undefined)) || [] },
            { path: postAspectValNgAPI, method: 'PUT', data: (data?.val.NG.map((item) => item.image_uuid).filter((uuid): uuid is string => uuid !== null && uuid !== undefined)) || [], data2: (data?.val.NG.map((item) => item.segment_uuid).filter((uuid): uuid is string => uuid !== null && uuid !== undefined)) || [] },
            { path: postAspectGoldenAPI, method: 'PUT', data: (data?.train.GOLDEN?.map((item) => item.image_uuid).filter((uuid): uuid is string => uuid !== null && uuid !== undefined)) || [], data2: (data?.train.GOLDEN?.map((item) => item.segment_uuid).filter((uuid): uuid is string => uuid !== null && uuid !== undefined)) || [] },
            { path: deleteAspectImgAPI, method: 'DELETE', data: (data?.train.DELETE?.map((item) => item.image_uuid).filter((uuid): uuid is string => uuid !== null && uuid !== undefined)) || [], data2: (data?.train.DELETE?.map((item) => item.segment_uuid).filter((uuid): uuid is string => uuid !== null && uuid !== undefined)) || [] },
        ];

        const putPromises = APIList.filter((item) => item.data.length > 0).map((resource) => {
            return putResource(exportId, resource.path, resource.method, resource.data, resource.data2);
        });

        Promise.all(putPromises)
            .then(() => {
                SaveFetchPanelDataset(exportId);
            })
            .catch((err) => {
                const msg = err?.response?.detail?.[0]?.msg || '';
                const loc = err?.response?.detail?.[0]?.loc || [];
                console.log(`API error: ${msg} [${loc.join(', ')}]`);
            })
            .finally(() => setIsLoading(false));
    };

    const handleConfirm: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        saveData(currentProject.export_uuid, panelDatasetThird);
        setOpenConfirmDialog(false);
        dispatch(setClearList());
        dispatch(setSomethingChange(false));
        setTempComp('');
        setTempLight('');
    };

    const handleSelect = (comp: string) => {
        console.log('--- handleSelect ---', comp)
        setSelectComp(comp);
        if (panelDataset) {

            console.log('--- 2nd --------------------------')
            console.log(panelDataset[comp])

            const currentLight = Object.keys(panelDataset[comp])[0];


            //setPanelDatasetSecond(panelDataset[comp]);
            const myPanelDatasetThird = panelDataset[comp][currentLight];

            console.log('--- myPanelDatasetThird ---')
            console.log(myPanelDatasetThird)

            dispatch(setPanelDatasetThird(myPanelDatasetThird));
            setSelectLight(currentLight);
        }

    }


    const handleAreaSelectAll = (areaNum: number) => {

        if (!panelDatasetThird) return;

        if (selectedList.length > 0) {
            dispatch(setSelectedList([]))

        } else {
            if (areaNum === 1) {
                let newPanelDataset = cloneDeep(panelDatasetThird);
                const train_PASS = newPanelDataset['train']?.['PASS'] || [];
                const allImageUuid = train_PASS.flatMap((train_PASS) => {
                    return train_PASS.segment_uuid;
                });
                dispatch(setSelectedList(allImageUuid))
            }
            if (areaNum === 2) {
                let newPanelDataset = cloneDeep(panelDatasetThird);
                const train_NG = newPanelDataset['train']?.['NG'] || [];
                const allImageUuid = train_NG.flatMap((train_NG) => {
                    return train_NG.segment_uuid;
                });
                dispatch(setSelectedList(allImageUuid))
            }
            if (areaNum === 3) {
                let newPanelDataset = cloneDeep(panelDatasetThird);
                const val_PASS = newPanelDataset['val']?.['PASS'] || [];
                const allImageUuid = val_PASS.flatMap((val_PASS) => {
                    return val_PASS.segment_uuid;
                });
                dispatch(setSelectedList(allImageUuid))
            }
            if (areaNum === 4) {
                let newPanelDataset = cloneDeep(panelDatasetThird);
                const val_NG = newPanelDataset['val']?.['NG'] || [];
                const allImageUuid = val_NG.flatMap((val_NG) => {
                    return val_NG.segment_uuid;
                });
                dispatch(setSelectedList(allImageUuid))
            }
            if (areaNum === 5) {
                let newPanelDataset = cloneDeep(panelDatasetThird);
                const train_GOLDEN = newPanelDataset['train']?.['GOLDEN'] || [];
                const allImageUuid = train_GOLDEN.flatMap((train_GOLDEN) => {
                    return train_GOLDEN.segment_uuid;
                });
                dispatch(setSelectedList(allImageUuid))
            }
            if (areaNum === 6) {
                let newPanelDataset = cloneDeep(panelDatasetThird);
                const train_DELETE = newPanelDataset['train']?.['DELETE'] || [];
                const allImageUuid = train_DELETE.flatMap((train_DELETE) => {
                    return train_DELETE.segment_uuid;
                });
                dispatch(setSelectedList(allImageUuid))
            }

        }

    }

    const handleBodyDoubleClick = (actionName: string) => {

        if (actionName === 'body') {
            dispatch(setToggleArea(0));
            dispatch(setSelectedList([]));
        }

    }

    const handleConfirmLeave: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        console.log('--- handleConfirmLeave ---');
        console.log('panelDataset', panelDataset);
        console.log('folderList', folderList);

        if (panelDataset && tempComp && (tempIndex >= 0)) {
            setSelectComp(tempComp);
            setSelectIndex(tempIndex);
            setPanelDatasetSecond(findPanelDatasetSecond(panelDataset, tempComp, tempLight, tempIndex));
            dispatch(setPanelDatasetThird(findPanelDatasetThird(panelDataset, tempComp, tempLight, tempIndex)));
            setSelectLight('');
            setTempLight('');
        }

        if (panelDatasetSecond && tempLight) {
            setSelectLight(tempLight);
            //dispatch(setPanelDatasetThird(panelDatasetSecond[tempLight]));
        }

        setOpenConfirmLeaveDialog(false);
        dispatch(setSomethingChange(false));
        setTempComp('');
        setTempLight('');
        setTempIndex(-1);

        dispatch(setClearList());
    };

    const handleFolderToggle = (comp: string) => {
        let myFolderList = cloneDeep(folderList);
        const myIndex = myFolderList.findIndex((item) => item.name === comp);
        myFolderList[myIndex].show = !myFolderList[myIndex].show;
        setFolderList(myFolderList);
    }

    const handleFolderToggleAll = () => {
        setFolderOpen(!folderOpen);
        const myFolderList = folderList.map((item) => {
            return {
                ...item,
                show: !folderOpen,
            };
        });
        setFolderList(myFolderList);
    }

    const ConvertPanelDataset = (projectId: string, exportId: string | null) => {
        if (!exportId) return;
        const postData = {
            project_uuid: projectId,
            export_uuid: exportId,
        };

        fetch(panelDatasetZipAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
        .then(() => {
            setPageKey('LoadingPanelDatasetZipPage');
        })
        .catch((err) => {
            const msg = err?.response?.detail?.[0]?.msg || '';
            const loc = err?.response?.detail?.[0]?.loc || [];
            console.log(`API error: ${msg} [${loc.join(',')}]`);
        });
    };

    const OpenTrainingDialog = (projectId: string, exportId: string | null) => {
        if (!exportId) return;
        const postData = {
            project_uuid: projectId,
            export_uuid: exportId,
        };
        setOpenTrainingDialog(true);
        trainingDialogRef.current?.SetOpen();
    };

    // useEffect(() => {

    //     if (panelDatasetThird) {

    //         const totalPage1 = Math.ceil(panelDatasetThird.train.PASS.length / NumPerPage);
    //         if ((totalPage1 > 0) && (trainPassPage > totalPage1)) setTrainPassPage(totalPage1)

    //         const totalPage2 = Math.ceil(panelDatasetThird.train.NG.length / NumPerPage);
    //         if ((totalPage2 > 0) && (trainNgPage > totalPage2)) setTrainNgPage(totalPage2)

    //         const totalPage3 = Math.ceil(panelDatasetThird.val.PASS.length / NumPerPage);
    //         if ((totalPage3 > 0) && (valPassPage > totalPage3)) setValPassPage(totalPage3)

    //         const totalPage4 = Math.ceil(panelDatasetThird.val.NG.length / NumPerPage);
    //         if ((totalPage4 > 0) && (valNgPage > totalPage4)) setValNgPage(totalPage4)

    //         const totalPage6 = Math.ceil((panelDatasetThird.train.DELETE ? panelDatasetThird.train.DELETE.length : 0) / NumPerPage);
    //         if ((totalPage6 > 0) && (trainDeletePage > totalPage6)) setTrainDeletePage(totalPage6)
    //     }

    // }, [panelDatasetThird]);


    useEffect(() => {
        if (currentProject.export_uuid) fetchPanelDataset(currentProject.export_uuid);
    }, [currentProject.export_uuid, fetchPanelDataset]);


    useEffect(() => {
        if (passPanelRef.current) passPanelRef.current.focus();
    }, []);


    useEffect(() => {
        document.body.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            handleBodyDoubleClick('body');
        });

        return function cleanup() {
            document.body.removeEventListener('dblclick', (e) => {
                e.stopPropagation();
                handleBodyDoubleClick('body');
            });

        }
    }, []);

    // useEffect(() => {
    //     if (folderList.length > 0) {
    //         const myFolderList = folderList.map((item) => {
    //             return {
    //                 name: item.name,
    //                 show: folderOpen,
    //                 data: null
    //             }
    //         });
    //         setFolderList(myFolderList);
    //     }
    // }
    //     , [folderOpen]);

    return (
        <>
            <Hotkeys
                keyName="Space,Up,Down,Right,Left,Shift,PageUp,PageDown,Esc"
                onKeyDown={handleKeyDown.bind(this)}
                onKeyUp={handleKeyUp.bind(this)}
                disabled={false}
                allowRepeat={true}
            ></Hotkeys>

            <Modal show={show} onHide={handleClose} animation={false} contentClassName="my-dialog" centered>
                <img src={datasetSegImgAPI(hoverItem)} alt="img" className="my-screen-image" />
            </Modal>

            <ThemeProvider theme={theme2}>

                <div className="attribute-page-container" >
                    <div className="title-container">
                        {/* <span className="title-style">
                            <div className="title-name">
                                <DivEllipsisWithTooltip>{currentProject.project_name}</DivEllipsisWithTooltip>
                            </div>
                        </span> */}

                        <ProjectNamePanel projectName={currentProject.project_name} aspect={true} />

                        <div className='d-flex flex-row gap-2 align-items-center justify-content-center'>
                            <NumberGroupPanel name="panel-aspect-1" number1={panelInfo?.train.PASS || 0} number2={panelInfo?.train.NG || 0} title="Train" />
                            <NumberGroupPanel name="panel-aspect-2" number1={panelInfo?.val.PASS || 0} number2={panelInfo?.val.NG || 0} title="Val" />
                        </div>

                        {/* <div className='my-number-panel'>
                            <div className='my-number-box' data-meta="PASS">{panelInfo?.train.PASS || 0}</div>
                            +
                            <div className='my-number-box' data-meta="NG">{panelInfo?.train.NG || 0}</div>
                            =
                            <div className='my-number-box' data-meta="Total">{(panelInfo?.train.PASS || 0) + (panelInfo?.train.NG || 0)} </div>
                        </div> */}


                        {/* <div className="title-count-container d-flex flex-row gap-1 align-items-center">
                            <div className={`title-count${((panelInfo?.train.PASS || 0) + (panelInfo?.train.NG || 0) < 2) ? '-warnning' : ''} d-flex flex-row gap-3 align-items-center`}>
                                <Badge showZero badgeContent={panelInfo?.train.PASS || 0} color="success" max={99999}>
                                    <span style={{ padding: '6px 0px 2px 0px' }}>
                                        Train_PASS
                                    </span>
                                </Badge>
                                +
                                <Badge showZero badgeContent={panelInfo?.train.NG || 0} color="success" max={99999}>
                                    <span style={{ padding: '6px 0px 2px 0px' }}>
                                        Train_NG
                                    </span>
                                </Badge>
                                =
                                <Badge showZero badgeContent={(panelInfo?.train.PASS || 0) + (panelInfo?.train.NG || 0)} color={(((panelInfo?.train.PASS || 0) + (panelInfo?.train.NG || 0)) < 2) ? 'error' : 'success'} max={99999}>
                                    <span style={{ padding: '6px 0px 2px 0px' }}>
                                        Train_Total
                                    </span>
                                </Badge>

                                {
                                    (panelInfo?.train.PASS || 0) + (panelInfo?.train.NG || 0) < 2 &&
                                    <span className="my-warnning-info">
                                        <FontAwesomeIcon icon={faCircleInfo} color="orange" style={{ width: 16 }} size="4x" />
                                        <span>
                                            Train PASS+NG need at least two.
                                        </span>
                                    </span>
                                }
                            </div>
                            <div className={`title-count${((panelInfo?.val.PASS || 0) + (panelInfo?.val.NG || 0) === 0) ? '-warnning' : ''} d-flex flex-row gap-3 align-items-center`}>
                                <Badge showZero badgeContent={panelInfo?.val.PASS || 0} color="success" max={99999}>
                                    <span style={{ padding: '6px 0px 2px 0px' }}>
                                        Val_PASS
                                    </span>
                                </Badge>
                                +
                                <Badge showZero badgeContent={panelInfo?.val.NG || 0} color="success" max={99999} >
                                    <span style={{ padding: '6px 0px 2px 0px' }}>
                                        Val_NG
                                    </span>
                                </Badge>
                                =
                                <Badge showZero badgeContent={(panelInfo?.val.PASS || 0) + (panelInfo?.val.NG || 0)} color={(((panelInfo?.val.PASS || 0) + (panelInfo?.val.NG || 0)) < 1) ? 'error' : 'success'} max={99999}>
                                    <span style={{ padding: '6px 0px 2px 0px' }}>
                                        Val_Total
                                    </span>
                                </Badge>

                                {
                                    (panelInfo?.val.PASS || 0) + (panelInfo?.val.NG || 0) === 0 &&
                                    <span className="my-warnning-info">
                                        <FontAwesomeIcon icon={faCircleInfo} color="orange" style={{ width: 16, height: 16 }} size="4x" />
                                        <span>
                                            Val PASS+NG need at least one.
                                        </span>
                                    </span>
                                }

                            </div>
                        </div> */}

                        <div className="lower-right-button-container">

                            <CustomButton name='view-convert-aspect' text='Convert' width={120} height={38} disabled={((panelInfo?.val.PASS || 0) + (panelInfo?.val.NG || 0) === 0) || ((panelInfo?.train.PASS || 0) + (panelInfo?.train.NG || 0) < 2)} onClick={() => ConvertPanelDataset(currentProject.project_uuid, currentProject.export_uuid)} />
                            <CustomButton name='view-train-aspect' text='Train' width={120} height={38} disabled={((panelInfo?.val.PASS || 0) + (panelInfo?.val.NG || 0) === 0) || ((panelInfo?.train.PASS || 0) + (panelInfo?.train.NG || 0) < 2)} onClick={() => OpenTrainingDialog(currentProject.project_uuid, currentProject.export_uuid)} />
                            <CustomButton name='view-save-aspect' text='Save' width={120} height={38} onClick={() => setOpenConfirmDialog(true)} />

                        </div>
                    </div>
                    <div className="attribute-page-content" style={{ userSelect: 'none' }}>



                        <div className="my-component-container">
                            <div className="my-component-title" onClick={handleFolderToggleAll}>
                                Component

                                {(folderOpen) ?
                                    <FontAwesomeIcon icon={faChevronDown} style={{ width: 16 }} />
                                    :
                                    <FontAwesomeIcon icon={faChevronUp} style={{ width: 16 }} />
                                }

                            </div>
                            <div className="my-component-content">
                                {panelDataset &&
                                    folderList.map((comp, idx0) => (
                                        <div key={`folder_${idx0}`}>
                                            <div key={`item_${idx0}`} className={`my-component-folder-aspect${(comp.name === selectComp) ? '-selected' : ''}`} onClick={() => handleFolderToggle(comp.name)}>

                                                <div>{comp.name}</div>
                                                {
                                                    (comp.show) ?
                                                        <FontAwesomeIcon icon={faChevronDown} style={{ width: 16 }} size="4x" />
                                                        :
                                                        <FontAwesomeIcon icon={faChevronUp} style={{ width: 16 }} size="4x" />
                                                }

                                            </div>
                                            {
                                                (comp.show) &&
                                                <>
                                                    {
                                                        comp.data?.map((subItem: { name: string; show: boolean; data: any; }) => (


                                                            <div key={`subItem_${idx0}_${subItem.name}`}>
                                                                {
                                                                    (subItem.name === selectLight) &&
                                                                    <>
                                                                        {
                                                                            subItem.data &&
                                                                            Object.keys(subItem.data).map((seg, idx) => (
                                                                                <div key={`seg_${idx0}_${idx}`}
                                                                                    className={(idx === selectIndex) ? `my-component-item-selected-aspect` : `my-component-item-aspect-${(idx % 2 === 1) ? "1" : "2"}`}
                                                                                    onClick={() => {

                                                                                        //dispatch(setPanelDatasetThird(subItem.data[seg]));
                                                                                        console.log('idx=', idx);
                                                                                        console.log('subItem=', subItem);
                                                                                        console.log('comp.name=', comp.name);
                                                                                        console.log('somethingChange=', somethingChange);
                                                                                        console.log('idx=', idx);
                                                                                        console.log('selectIndex=', selectIndex);
                                                                                        console.log('seg', seg)

                                                                                        if ((comp.name !== selectComp) || (idx !== selectIndex)) {
                                                                                            if (somethingChange) {
                                                                                                setOpenConfirmLeaveDialog(true);
                                                                                                setTempComp(comp.name);
                                                                                                setTempLight(selectLight);
                                                                                                setTempIndex(idx);
                                                                                            } else {
                                                                                                setSelectComp(comp.name);
                                                                                                setSelectIndex(idx);
                                                                                                dispatch(setClearList());
                                                                                                setPanelDatasetSecond(findPanelDatasetSecond(panelDataset, comp.name, subItem.name, idx));
                                                                                                dispatch(setPanelDatasetThird(findPanelDatasetThird(panelDataset, comp.name, subItem.name, idx)));
                                                                                            }

                                                                                        }

                                                                                        //setSelectIndex(idx);
                                                                                        // if (item !== selectComp) {
                                                                                        //     resetAllPage();
                                                                                        //     if (somethingChange) {
                                                                                        //         setOpenConfirmLeaveDialog(true);
                                                                                        //         setTempComp(item);
                                                                                        //     } else {
                                                                                        //         setSelectComp(item);
                                                                                        //         setSelectLight('');
                                                                                        //         setPanelDatasetSecond(panelDataset[item]);
                                                                                        //         //dispatch(setPanelDatasetThird(undefined));
                                                                                        //         dispatch(setClearList());

                                                                                        //         setTempComp(item);

                                                                                        //         // for default select first item    
                                                                                        //         if (keys(panelDataset[item])[0]) {
                                                                                        //             const defaultLight = keys(panelDataset[item])[0];
                                                                                        //             setSelectLight(defaultLight);
                                                                                        //             dispatch(setPanelDatasetThird(panelDataset[item][defaultLight]));
                                                                                        //         }

                                                                                        //     }
                                                                                        // }



                                                                                    }
                                                                                    }
                                                                                >
                                                                                    {`Seg. ${('0' + (idx + 1).toString()).slice(-2)}`}


                                                                                  

                                                                                    {

                                                                                        (getCheckStatusNum(comp.name, idx, panelDataset) === 1) ?
                                                                                            <IconCheckedAll />
                                                                                            : (getCheckStatusNum(comp.name, idx, panelDataset) === 2) ?
                                                                                                <IconCheckedEmpty />
                                                                                                : <IconCheckedPartial />


                                                                                    }

                                                                                </div>
                                                                            ))

                                                                        }
                                                                    </>

                                                                }


                                                            </div>



                                                            // <div>{Object.keys(subItem)[0]}</div>


                                                            // <div className="my-component-sub-item">
                                                            //     <DivEllipsisWithTooltip>{Object.keys(subItem)[0]}</DivEllipsisWithTooltip>
                                                            // </div>



                                                        ))
                                                    }


                                                </>
                                            }
                                        </div>
                                    ))}
                            </div>
                        </div>


                        <div className="my-attribute-container">
                            <div className="my-attribute-title">
                                <div className="d-flex flex-row gap-2 align-items-center justify-content-start">
                                    Light Source
                                    <div className='d-flex flex-row gap-2 align-items-center justify-content-between' style={{ backgroundColor: 'transparent', padding: '0px 10px', height: 30 }}>
                                        {panelDatasetSecond &&
                                            panelDatasetSecond.map((lightSource, idx) => (

                                                <div key={`light_${idx}`} className={(lightSource.name === selectLight) ? 'my-light-selector-selected-aspect' : 'my-light-selector-aspect'}
                                                    onClick={() => {

                                                        if (lightSource.name !== selectLight) {
                                                            resetAllPage();
                                                            if (somethingChange) {
                                                                console.log('something change')
                                                                setOpenConfirmLeaveDialog(true);
                                                                setTempLight(lightSource.name);
                                                            } else {
                                                                console.log('nothing change')
                                                                setSelectLight(lightSource.name);
                                                                //dispatch(setPanelDatasetThird(panelDatasetSecond[lightSource]));
                                                                dispatch(setPanelDatasetThird(findPanelDatasetThird(panelDataset, selectComp, lightSource.name, selectIndex)));
                                                                dispatch(setClearList());
                                                            }
                                                        }
                                                    }}

                                                >
                                                    {
                                                        ((findCheckStatus(selectComp, lightSource.name, selectIndex))) ? (
                                                            <IconCheckedAll />
                                                        ) : (
                                                            <IconCheckedEmpty />
                                                        )
                                                    }
                                                    {lightSource.name}
                                                </div>


                                            ))}
                                    </div>
                                </div>
                                {panelDatasetThird && (
                                    <div className='d-flex flex-row gap-2'>
                                        <CustomButton name='hint-button-1-aspect' text='Shortcut key hint' width={150} height={28} onClick={() => { hintDialogRef.current?.SetOpen() }} />
                                        <CustomButton name='hint-button-2-aspect' text='Ratio distribution' width={150} height={28} onClick={() => {
                                            const trainPass = panelDatasetThird.train.PASS.length;
                                            const valPass = panelDatasetThird.val.PASS.length;
                                            const trainNg = panelDatasetThird.train.NG.length;
                                            const valNg = panelDatasetThird.val.NG.length;
                                            setTrainPass(Math.floor((trainPass / (trainPass + valPass)) * 100) || 0);
                                            setValPass(100 - Math.floor((trainPass / (trainPass + valPass)) * 100) || 0);
                                            setTrainNg(Math.floor((trainNg / (trainNg + valNg)) * 100) || 0);
                                            setValNg(100 - Math.floor((trainNg / (trainNg + valNg)) * 100) || 0);
                                            setOpenRatioDialog(true);
                                        }} />

                                    </div>
                                )}
                            </div>
                            <DragDropContext onDragEnd={onDragEnd}>
                                {panelDatasetThird && (
                                    <div className="my-attribute-content">
                                        <div className="my-train-val-container">
                                            <div className="my-train-val-wrapper">
                                                <div className="my-train-val-title" >
                                                    <div style={{ position: 'relative' }}>
                                                        Train
                                                        {
                                                            trainNum < 1 &&
                                                            <div className="my-warnning-tag" style={{ position: 'absolute', top: -18, left: -90, width: 230 }}>
                                                                <FontAwesomeIcon icon={faCircleInfo} color="white" style={{ width: 16 }} size="4x" />
                                                                PASS + NG need at least one.
                                                            </div>

                                                        }

                                                    </div>


                                                </div>
                                                <div className="my-pass-ng-container">
                                                    <div style={{ width: '50%', position: 'relative' }}>
                                                        <div className={trainNum < 1 ? 'my-pass-ng-wrapper-warn' : 'my-pass-ng-wrapper'} onClick={(e) => dispatch(setToggleArea(1))} onDoubleClick={(e) => { e.stopPropagation(); handleAreaSelectAll(1) }} style={{ backgroundColor: (selectedArea === 1) ? '#D9FFFF' : '#FAFAFD' }}>

                                                            <CustomTab label="PASS" value={panelDatasetThird.train.PASS.length} warn={(trainNum < 1) ? true : false} focus={(selectedArea === 1) ? true : false}></CustomTab>


                                                            <Droppable droppableId={"train_PASS"}>
                                                                {(provided) => (
                                                                    <div ref={provided.innerRef} {...provided.droppableProps} className="img-container" >
                                                                        {panelDatasetThird?.train?.PASS &&
                                                                            panelDatasetThird.train.PASS.map((img, index) => (

                                                                                ((index >= (trainPassPage - 1) * NumPerPage) && (index < (trainPassPage * NumPerPage))) &&
                                                                                <DraggableAspectCard key={img.segment_uuid} index={index} item={img}
                                                                                    onHover={(img: string): void => sethoverItem(img)}
                                                                                    onShiftSelect={handleShiftSelect}
                                                                                />

                                                                            ))}
                                                                        {provided.placeholder}
                                                                    </div>
                                                                )}
                                                            </Droppable>

                                                            <div className='my-page-row'>
                                                                <Stack spacing={2}>
                                                                    <Pagination count={Math.ceil(panelDatasetThird.train.PASS.length / NumPerPage)} color="primary" variant="outlined" shape="rounded" onChange={(e, v) => setTrainPassPage(v)} page={trainPassPage} />
                                                                </Stack>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div style={{ width: '50%', position: 'relative' }}>
                                                        <div className={trainNum < 1 ? 'my-pass-ng-wrapper-warn' : 'my-pass-ng-wrapper'} onClick={(e) => dispatch(setToggleArea(2))} onDoubleClick={(e) => { e.stopPropagation(); handleAreaSelectAll(2) }} style={{ backgroundColor: (selectedArea === 2) ? '#D9FFFF' : '#FAFAFD' }}>

                                                            <CustomTab label="NG" value={panelDatasetThird.train.NG.length} warn={(trainNum < 1) ? true : false} focus={(selectedArea === 2) ? true : false}></CustomTab>

                                                            <Droppable droppableId="train_NG">
                                                                {(provided) => (
                                                                    <div ref={provided.innerRef} {...provided.droppableProps} className="img-container">
                                                                        {panelDatasetThird?.train?.NG &&
                                                                            panelDatasetThird.train.NG.map((img, index) => (
                                                                                ((index >= (trainNgPage - 1) * NumPerPage) && (index < (trainNgPage * NumPerPage))) &&
                                                                                <DraggableAspectCard key={img.segment_uuid} index={index} item={img}
                                                                                    onHover={(img: string): void => sethoverItem(img)}
                                                                                    onShiftSelect={handleShiftSelect}
                                                                                />
                                                                            ))}
                                                                        {provided.placeholder}
                                                                    </div>
                                                                )}
                                                            </Droppable>
                                                            <div className='my-page-row'>
                                                                <Stack spacing={2}>
                                                                    <Pagination count={Math.ceil(panelDatasetThird.train.NG.length / NumPerPage)} color="primary" variant="outlined" shape="rounded" onChange={(e, v) => setTrainNgPage(v)} page={trainNgPage} />
                                                                </Stack>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="my-train-val-wrapper">
                                                <div className="my-train-val-title">
                                                    Val

                                                </div>
                                                <div className="my-pass-ng-container">
                                                    <div style={{ width: '50%', position: 'relative' }}>
                                                        <div className={valNum < 1 ? 'my-pass-ng-wrapper' : 'my-pass-ng-wrapper'} onClick={(e) => dispatch(setToggleArea(3))} onDoubleClick={(e) => { e.stopPropagation(); handleAreaSelectAll(3) }} style={{ backgroundColor: (selectedArea === 3) ? '#D9FFFF' : '#FAFAFD' }}>

                                                            <CustomTab label="PASS" value={panelDatasetThird.val.PASS.length} warn={(valNum < 1) ? false : false} focus={(selectedArea === 3) ? true : false}></CustomTab>

                                                            <Droppable droppableId="val_PASS">
                                                                {(provided) => (
                                                                    <div ref={provided.innerRef} {...provided.droppableProps} className="img-container">
                                                                        {panelDatasetThird?.val?.PASS &&
                                                                            panelDatasetThird.val.PASS.map((img, index) => (
                                                                                ((index >= (valPassPage - 1) * NumPerPage) && (index < (valPassPage * NumPerPage))) &&
                                                                                <DraggableAspectCard key={img.segment_uuid} index={index} item={img}
                                                                                    onHover={(img: string): void => sethoverItem(img)}
                                                                                    onShiftSelect={handleShiftSelect}
                                                                                />
                                                                            ))}
                                                                        {provided.placeholder}
                                                                    </div>
                                                                )}
                                                            </Droppable>
                                                            <div className='my-page-row'>
                                                                <Stack spacing={2}>
                                                                    <Pagination count={Math.ceil(panelDatasetThird.val.PASS.length / NumPerPage)} color="primary" variant="outlined" shape="rounded" onChange={(e, v) => setValPassPage(v)} page={valPassPage} />
                                                                </Stack>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div style={{ width: '50%', position: 'relative' }}>
                                                        <div className={valNum < 1 ? 'my-pass-ng-wrapper' : 'my-pass-ng-wrapper'} onClick={(e) => dispatch(setToggleArea(4))} onDoubleClick={(e) => { e.stopPropagation(); handleAreaSelectAll(4) }} style={{ backgroundColor: (selectedArea === 4) ? '#D9FFFF' : '#FAFAFD' }}>

                                                            <CustomTab label="NG" value={panelDatasetThird.val.NG.length} warn={(valNum < 1) ? false : false} focus={(selectedArea === 4) ? true : false}></CustomTab>

                                                            <Droppable droppableId="val_NG">
                                                                {(provided) => (
                                                                    <div ref={provided.innerRef} {...provided.droppableProps} className="img-container">
                                                                        {panelDatasetThird?.val?.NG &&
                                                                            panelDatasetThird.val.NG.map((img, index) => (
                                                                                ((index >= (valNgPage - 1) * NumPerPage) && (index < (valNgPage * NumPerPage))) &&
                                                                                <DraggableAspectCard key={img.segment_uuid} index={index} item={img}
                                                                                    onHover={(img: string): void => sethoverItem(img)}
                                                                                    onShiftSelect={handleShiftSelect}
                                                                                />
                                                                            ))}
                                                                        {provided.placeholder}
                                                                    </div>
                                                                )}
                                                            </Droppable>
                                                            <div className='my-page-row'>
                                                                <Stack spacing={2}>
                                                                    <Pagination count={Math.ceil(panelDatasetThird.val.NG.length / NumPerPage)} color="primary" variant="outlined" shape="rounded" onChange={(e, v) => setValNgPage(v)} page={valNgPage} />
                                                                </Stack>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="my-golden-delete-container">
                                            <div className="my-golden-wrapper">
                                                <div className="my-train-val-title" >
                                                    <div style={{ position: 'relative' }}>
                                                        Golden
                                                        {goldenNum < 1 &&
                                                            <div className='my-warnning-tag-2' style={{ width: 110, position: 'absolute', top: 5, left: -118, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <FontAwesomeIcon icon={faCircleInfo} color="white" style={{ width: 16, height: 16 }} size="4x" />
                                                                <div style={{ paddingTop: 2 }}> Need one.</div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                <Droppable droppableId="train_GOLDEN">
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                            className={`flex-row-center ${goldenNum < 1 ? 'my-golden-img-container-shadow-warn' : 'my-golden-img-container-shadow'}`}
                                                            onDoubleClick={(e) => { e.stopPropagation(); handleAreaSelectAll(5) }}
                                                            onClick={(e) => dispatch(setToggleArea(5))}
                                                            style={{ backgroundColor: (selectedArea === 5) ? '#D9FFFF' : '#FAFAFD' }}
                                                        >
                                                            {panelDatasetThird?.train?.GOLDEN &&
                                                                panelDatasetThird.train.GOLDEN.map((img, index) => (
                                                                    <DraggableAspectCard key={img.segment_uuid} index={index} item={img} isGolden
                                                                        onHover={(img: string): void => sethoverItem(img)}
                                                                        onShiftSelect={handleShiftSelect}
                                                                    />
                                                                ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </div>
                                            <div className="my-delete-wrapper">
                                                <div className="my-train-val-title" >
                                                    Delete
                                                </div>

                                                <Droppable droppableId="train_DELETE">
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.droppableProps} className="my-img-container-shadow"
                                                            onDoubleClick={(e) => { e.stopPropagation(); handleAreaSelectAll(6) }}
                                                            onClick={(e) => dispatch(setToggleArea(6))}
                                                            style={{ backgroundColor: (selectedArea === 6) ? '#D9FFFF' : '#FAFAFD', height: 'calc(100vh - 471px)' }}>
                                                            {panelDatasetThird?.train?.DELETE &&
                                                                panelDatasetThird.train.DELETE.map((img, index) => (
                                                                    ((index >= (trainDeletePage - 1) * NumPerPage) && (index < (trainDeletePage * NumPerPage))) &&
                                                                    <DraggableAspectCard key={img.segment_uuid} index={index} item={img}
                                                                        onHover={(img: string): void => sethoverItem(img)}
                                                                        onShiftSelect={handleShiftSelect}
                                                                    />
                                                                ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                                <div className='my-page-del-row'>
                                                    <Stack spacing={2}>
                                                        <Pagination count={Math.ceil((panelDatasetThird.train.DELETE ? (panelDatasetThird.train.DELETE.length) : 0) / NumPerPage)} color="primary" variant="outlined" shape="rounded" siblingCount={0} boundaryCount={0} onChange={(e, v) => setTrainDeletePage(v)} page={trainDeletePage} />
                                                    </Stack>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </DragDropContext>
                        </div>
                    </div>
                    <ConfirmAspectDialog {...{ openConfirmDialog, setOpenConfirmDialog, handleConfirm, confirmAttribute }} />
                    <ConfirmAspectDialog
                        openConfirmDialog={openConfirmLeaveDialog}
                        setOpenConfirmDialog={setOpenConfirmLeaveDialog}
                        handleConfirm={handleConfirmLeave}
                        confirmAttribute={confirmLeaveAttribute}
                    />
                    <RatioAspectDialog
                        {...{
                            openRatioDialog,
                            setOpenRatioDialog,
                            trainPass,
                            setTrainPass,
                            trainNg,
                            setTrainNg,
                            valPass,
                            setValPass,
                            valNg,
                            setValNg,
                            adjustRatio,
                        }}
                    />
                    <TrainingDialog {...{
                        currentProject,
                        setPageKey,
                    }}
                        ref={trainingDialogRef}
                    />
                    <HintDialog
                        ref={hintDialogRef}
                        aspect={true}
                    />
                    <WarningDialog
                        openWarningDialog={openWarningDialog}
                        setOpenWarningDialog={setOpenWarningDialog}
                        warningAttribute={warningGoldenCheckAttribute}
                    />
                    <LoadingOverlay show={isLoading} />
                </div>

            </ThemeProvider >
            <Utility ref={utilityRef} />
        </>
    );
};

export default SetAttributePageAspect;
