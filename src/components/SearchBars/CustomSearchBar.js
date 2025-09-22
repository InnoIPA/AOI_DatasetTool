import React, { useEffect, useState } from 'react';

import OutsideClickHandler from 'react-outside-click-handler';
import { set,filter } from 'lodash';

import CustomInput from '../Inputs/CustomInput';


const CustomSearchBar = (props) => {

    const [showList, setShowList] = useState([]);
    const [show, setShow] = useState(false);

    const inputRef = React.createRef();

    const handleChange=(value)=>{
        //props.onChange(value);
        console.log(value);

        const filterList = filter(Object.keys(props.data), function(val){
            return val.toLowerCase().indexOf(value.toLowerCase())>-1;
        });

        setShowList(filterList);
    }

    const handleFocus=()=>{
        console.log('focus');
        setShow(true);
    }

    const handleFocusOut=()=>{
       
        setShow(false);
        
    }

    const handleSelect=(item)=>{
        console.log(item);
        props.onSelect(item);
        setShow(false);
        inputRef.current.setInputValue('');
        if (props.data)
            setShowList(Object.keys(props.data));
    }

    useEffect(() => {
        
        if (props.data)
        setShowList(Object.keys(props.data));

    }, [props.data]);

    return (
        <OutsideClickHandler onOutsideClick={handleFocusOut}>
            <div style={{padding:6,position:'relative',zIndex:99999}}>
                <CustomInput width={'100%'} height={30} placeholder="Search" onChange={handleChange} onFocus={handleFocus} ref={inputRef}/>
                {
                    (show)&&
                    
                        <div className='my-search-list-container'>
                        {
                            showList.map((item,index)=>{
                                return (
                                    <div key={index} className="my-component-item-1" style={{}} onClick={()=>handleSelect(item)}>
                                        {item}
                                    </div>
                                )
                            })
                        }
                        {
                            showList.length==0&&
                            <div className="my-component-item-1" style={{}}>
                                No data found
                            </div>
                        }
                        
                        </div>
                    
                  
                }
            </div>
       </OutsideClickHandler>
    );
};

export default CustomSearchBar;
