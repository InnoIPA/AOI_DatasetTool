import React, { Dispatch, FormEventHandler, SetStateAction, useEffect } from 'react';
import { Dialog, ThemeProvider } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { theme,theme2 } from '../page/ProjectPage';
import { ProgressType } from '../page/type';

import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import CircularProgress from '@mui/joy/CircularProgress';
import { CssVarsProvider } from '@mui/joy/styles';
import { useCountUp } from 'use-count-up';

const useStyles = makeStyles()(() => ({
    customDialog: {
        borderRadius: 4,
        '.MuiPaper-root': {
            width: '50%',
            height: '60%',
            maxWidth: 500,
            maxHeight: 360,
            backgroundColor: '#FFFCF9',
        },
    },
}));

type ProgressDialog = {
    openProgressDialog: boolean;
    setOpenProgressDialog: Dispatch<SetStateAction<boolean>>;
    progressAttribute: ProgressType;
    projectAspect?: boolean | null; 
};

const ProgressDialog = (props: ProgressDialog) => {
    const { openProgressDialog, setOpenProgressDialog, progressAttribute, projectAspect } = props;
    const { classes, cx } = useStyles();

    const [isLoading, setIsLoading] = React.useState(false);
    const [buttonLabel, setButtonLabel] = React.useState('Start');



    const { value: value1, reset: resetValue1 } = useCountUp({
        isCounting: isLoading,
        duration: 1,
        start: 0,
        end: 25,
        onComplete: () => {
            setIsLoading(false);
            setButtonLabel('Reset');
        },
    });

    const { value: value2, reset } = useCountUp({
        isCounting: true,
        duration: 1,
        start: 0,
        end: 75,
    });

    const handleButtonClick = () => {
        if (isLoading) {
            setIsLoading(false);
            setButtonLabel('Start');
            resetValue1();
        } else if (buttonLabel === 'Reset') {
            setButtonLabel('Start');
            resetValue1();
        } else {
            setIsLoading(true);
            setButtonLabel('Reset');
        }
    };

    useEffect(() => {
       
        console.log('projectAspect',projectAspect)



    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Dialog open={openProgressDialog} className={cx(classes.customDialog)} >
                <div className="dialog-container justify-content-center align-items-center mt-4">
                    <div className="title-style">{progressAttribute.message}</div>

                    <div className="dialog-content mt-1">
                        <CssVarsProvider>
                            <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={8}>

                                <Stack spacing={2}>
                                    <CircularProgress size="lg" determinate value={progressAttribute.percent as number} color={(projectAspect)?"primary":"danger"} variant="solid"
                                        sx={{
                                            "--CircularProgress-size": "150px",
                                            "--CircularProgress-trackThickness": "15px",
                                            "--CircularProgress-progressThickness": "15px",
                                        }}
                                    >
                                        <Typography  level="h2">{progressAttribute.percent}%</Typography>
                                    </CircularProgress>

                                </Stack>
                            </Stack>
                        </CssVarsProvider>
                    </div>

                </div>
            </Dialog>
        </ThemeProvider>
    );
};

export default ProgressDialog;
