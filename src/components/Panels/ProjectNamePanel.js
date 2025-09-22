import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { faCube, faSearch, faFolder } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faHouse, faImage, faBolt, faPercent, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faCheckToSlot, faEllipsis, faFileCircleCheck, faFolderPlus, faScissors } from '@fortawesome/free-solid-svg-icons';


const ProjectNamePanel = (props) => {
    const [show, setShow] = React.useState(false);
    const [hoverItem1, setHoverItem1] = React.useState('');
    const [hoverItem2, setHoverItem2] = React.useState('');

    const { projectName, aspect } = props;


    return (

        <div className={`my-project-name-panel${aspect ? '-aspect' : ''}`}>
            <div className={`my-project-name-panel-icon-box${aspect ? '-aspect' : ''}`}>
                {
                    (aspect) ?
                        <div className='my-project-type-icon-2-aspect'>
                            <FontAwesomeIcon icon={faScissors} style={{ width: 25, height: 25 }} />
                        </div>
                        :
                        <div className='my-project-type-icon-container'>
                            <div className='my-project-type-icon-inner'>
                                <FontAwesomeIcon icon={faImage} className='my-project-type-icon-raw' />
                            </div>
                        </div>
                }


            </div>

        
            <div className={`my-project-name-panel-title${aspect ? '-aspect' : ''}`}>
                {projectName}
            </div>
        </div>
    );


};


export default ProjectNamePanel;