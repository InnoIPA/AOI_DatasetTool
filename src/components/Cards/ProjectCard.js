import { useEffect } from 'react';
import CustomTooltip from '../../components/Tooltips/CustomTooltip';
import { cloneDeep } from 'lodash';
import { faCheckToSlot, faEllipsis, faFileCircleCheck, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomButton from '../../components/Buttons/CustomButton';


import { datasetToolProjectAPI_B, downloadDatasetAPI, projectCoverAPI } from '../../APIPath';

const ProjectCard = (props) => {

    const { project } = props;

    const handleClickProject = (e, project) => {
        e.stopPropagation();
        props.handleClickProject(e, project)
    }

    const handleClickEditBtn = (e, project) => {
        e.stopPropagation();
        props.handleClickEditBtn(e, project)
    }

    const handleClickDeleteBtn = (e, project) => {
        e.stopPropagation();
        props.handleClickDeleteBtn(e, project)
    }

    const handleClickMoreBtn = (e, project) => {
        e.stopPropagation();
        props.handleClickMoreBtn(e, project)
    }

    const calculateWidth = (first, second, third, fifth) => {
        return (first ? 29 : 0) + (second ? 29 : 0) + (third ? 29 : 0) + (fifth ? 29 : 0);
    };

    return (
        

                <div
                    key={project.project_uuid}
                    className={(project.project_high_aspect) ? 'project-container-aspect' : 'project-container'}
                    onClick={(e) => handleClickProject(e, project)}

                >
                    <div className="name-container">
                        <div
                            style={{
                                width: `calc(100% - ${calculateWidth(
                                    project.project_status.copy_to_local.status === 'running',
                                    project.project_status.generate_zip?.status === 'running',
                                    project.project_status.init,
                                    !project.project_status.init && !!project.export_uuid,
                                )}px)`,
                            }}
                        >
                            <CustomTooltip title={project.project_name}>
                                <div className="my-note text-truncate">{project.project_name}</div>
                            </CustomTooltip>

                        </div>
                        <div className="icon-button-container">

                            {project.project_status?.copy_to_local.status === 'running' && (
                                <CustomTooltip title={"Loading copy to local."}>
                                    <div className="loading-icon" />
                                </CustomTooltip>
                            )}

                            {project.project_status?.generate_zip?.status === 'running' && (
                                <CustomTooltip title={"Generating zip."}>
                                    <div className="loading-icon" />
                                </CustomTooltip>
                            )}

                            {project.project_status?.init && (
                                <CustomTooltip title={"Already converted."}>
                                    <FontAwesomeIcon icon={faCheckToSlot} color="#444" />
                                </CustomTooltip>
                            )}

                            {!project.project_status?.init && !!project.export_uuid && (
                                <CustomTooltip title={"Already exported."}>
                                    <FontAwesomeIcon icon={faFileCircleCheck} color="#444" />
                                </CustomTooltip>
                            )}
                        </div>
                    </div>
                    <div className="project-img">
                        <img src={projectCoverAPI(project.project_uuid)} alt="project img" className={`my-project-img ${(project.project_high_aspect ? 'filter-aspect' : 'filter-normal')}`} />
                    </div>
                    <div>Note</div>
                    <div className="note-container">
                        <CustomTooltip title={project.annotation}>
                            <div className="my-note text-truncate">{project.annotation}</div>
                        </CustomTooltip>

                    </div>
                    <div className="button-container">
                        <div className='d-flex flex-row justify-content-start gap-2'>
                            <CustomButton name={(project.project_high_aspect) ? 'view-aspect' : 'view'} text="Edit" width={96} height={32} onClick={(e) => handleClickEditBtn(e, project)} />
                            <CustomButton name={(project.project_high_aspect) ? 'view-aspect' : 'view'} text="Delete" width={96} height={32} onClick={(e) => handleClickDeleteBtn(e, project)} />

                        </div>
                        <CustomButton name={(project.project_high_aspect) ? "more-aspect" : "more"} width={32} height={32} onClick={(e) => handleClickMoreBtn(e, project)} />

                    </div>
                
            
            {/* <div className="my-back" style={{ width: 277, height: 320 }}>
                        <div
                            key={project.project_uuid}
                            className={(project.project_high_aspect) ? 'project-container-aspect' : 'project-container'}
                            onClick={(e) => handleClickProject(e, project)}
                        >
                            <div className="name-container">
                                <div
                                    style={{
                                        width: `calc(100% - ${calculateWidth(
                                            project.project_status.copy_to_local.status === 'running',
                                            project.project_status.generate_zip?.status === 'running',
                                            project.project_status.init,
                                            !project.project_status.init && !!project.export_uuid,
                                        )}px)`,
                                    }}
                                >
                                    <CustomTooltip title={project.project_name}>
                                        <div className="my-note text-truncate">{project.project_name}</div>
                                    </CustomTooltip>

                                </div>
                                <div className="icon-button-container">

                                    {project.project_status?.copy_to_local.status === 'running' && (
                                        <CustomTooltip title={"Loading copy to local."}>
                                            <div className="loading-icon" />
                                        </CustomTooltip>
                                    )}

                                    {project.project_status?.generate_zip?.status === 'running' && (
                                        <CustomTooltip title={"Generating zip."}>
                                            <div className="loading-icon" />
                                        </CustomTooltip>
                                    )}

                                    {project.project_status?.init && (
                                        <CustomTooltip title={"Already converted."}>
                                            <FontAwesomeIcon icon={faCheckToSlot} color="#444" />
                                        </CustomTooltip>
                                    )}

                                    {!project.project_status?.init && !!project.export_uuid && (
                                        <CustomTooltip title={"Already exported."}>
                                            <FontAwesomeIcon icon={faFileCircleCheck} color="#444" />
                                        </CustomTooltip>
                                    )}
                                </div>
                            </div>
                            <div className="project-img">
                                <img src={projectCoverAPI(project.project_uuid)} alt="project img" className={`my-project-img ${(project.project_high_aspect ? 'filter-aspect' : '')}`} />
                            </div>
                            <div>Note</div>
                            <div className="note-container">
                                <CustomTooltip title={project.annotation}>
                                    <div className="my-note text-truncate">{project.annotation}</div>
                                </CustomTooltip>

                            </div>
                            <div className="button-container">
                                <CustomButton name={(project.project_high_aspect) ? 'view-aspect' : 'view'} text="Edit" width={96} height={32} onClick={(e) => handleClickEditBtn(e, project)} />
                                <CustomButton name={(project.project_high_aspect) ? 'view-aspect' : 'view'} text="Delete" width={96} height={32} onClick={(e) => handleClickDeleteBtn(e, project)} />
                                <CustomButton name={(project.project_high_aspect) ? "more-aspect" : "more"} width={32} height={32} onClick={(e) => handleClickMoreBtn(e, project)} />
                            </div>
                        </div>

                    </div> */}
        </div>


    )
}

export default ProjectCard;