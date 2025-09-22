import { FunctionComponent } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import { ProjectDataType } from '../page/type';


export type ProjectCardProps = {
    project: ProjectDataType;
    handleClickProject:(e:MouseEvent<HTMLButtonElement>, project: ProjectDataType)=>void;
    handleClickEditBtn: (e: MouseEvent<HTMLButtonElement>, project: ProjectDataType)=>void;
    handleClickDeleteBtn: (e: MouseEvent<HTMLButtonElement>, project: ProjectDataType)=>void;
    handleClickMoreBtn:(e: MouseEvent<HTMLButtonElement>, project: ProjectDataType)=>void;
};

const ProjectCard: FunctionComponent<ProjectCardProps>;

export default ProjectCard;