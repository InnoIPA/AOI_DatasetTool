import React, { Dispatch, FormEventHandler, SetStateAction, useEffect } from 'react';
import ResultCardAspect from '../Cards/ResultCardAspect';

const ResultCardListAspect = (props) => {

    const { data } = props;

    const handleLabelToggle = (mySegmentUuid,myImageUuid,myEvent) => {

        console.log('(2) handle label toggle ===>', mySegmentUuid, myImageUuid,myEvent);

        props.onChange(mySegmentUuid,myImageUuid,myEvent);
    }

    return (
        <div className='my-card-list-container'>
            {/* {
                props.data.map((item, i) => (
                    <div key={`resultList_${i}`} >
                        <ResultCardAspect data={item} onChange={() => handleLabelToggle(item.imageUuid)} resultList={props.data}></ResultCardAspect>
                    </div>
                ))
            } */}

            {
                data.map((item, i) => (
                    <div key={`resultList_${i}`} >
                        <ResultCardAspect data={item} onChange={handleLabelToggle}></ResultCardAspect>
                    </div>
                ))
            }
        </div>
    );
};

export default ResultCardListAspect;

