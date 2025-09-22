import { FunctionComponent } from 'react';
import PropTypes, { InferProps } from 'prop-types';


export type InferenceResultPageAspectProps = {
    projectData: ProjectDataType[];
    setPageKey: Dispatch<SetStateAction<PageKeyType>>;
    setCurrentProject: Dispatch<SetStateAction<ProjectDataType>>;
    };

type IRPProps = InferProps<typeof InferenceResultPageAspectProps>


const InferenceResultPageAspect: FunctionComponent<IRPProps>;
 
export default InferenceResultPageAspect;