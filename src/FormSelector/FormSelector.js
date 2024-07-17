import { useContext, useEffect, useState } from "react";
import './FormSelector.css';
import TabContext from "../context/tab-context";
import ErrorContext from "../context/error-context";
import AlertContext from "../context/alert-context";

function FormSelector(props){
    const [formsArray, setFormsArray] = useState({ currentItrIndex: -1, previousIndex: -1, data: []});
    const { tabData } = useContext(TabContext);
    const { setError } = useContext(ErrorContext);
    const { alert, setAlert } = useContext(AlertContext);

    useEffect(() => {
        if(!tabData?.id) return;

        (async () => {
            try{
                const response = await chrome.tabs.sendMessage(
                    tabData.id, {
                        type: "FUNCTION_CALL",
                        functionName: "GET_FORMS_LIST"
                    }
                );
    
                if(response.status !== 200){
                    setError('Failed to fetch forms list. Try closing the extension and re-opening it back!')
                }
                
                if(response?.data?.length <= 0){
                    setError('No forms found! Extension only works in Karantaka Rera website!')
                }

                setFormsArray(prev => ({ ...prev, data: response.data }))
            } catch(err) {
                console.log(err);
                setError('Process failed')
            }
        })()
    }, [tabData?.id])

    useEffect(() => {
        if(formsArray.currentItrIndex === -1) return;
        
        (async () => {
            try{
                const response = await chrome.tabs.sendMessage(
                    tabData.id, {
                        type: "FUNCTION_CALL",
                        functionName: "FORM_SELECTION_PROC",
                        payload: {
                            xpathToHighlight: formsArray.data[formsArray.currentItrIndex],
                            xpathToNadir: formsArray.data[formsArray.previousIndex] || ''
                        }
                    }
                );

                if(response.status !== 200){
                    setError('Element selection failed!')
                }

                if(alert !== '') setAlert('');
            } catch(err) {
                console.log(err);
                setAlert('Element selection failed!');
            }
        })()
    }, [formsArray.currentItrIndex])

    async function formIterHandler(type){
        const currentIndex = formsArray.currentItrIndex;
        let newIndex;
        if(formsArray.data.length === 0){
            return setAlert('No forms found!');
        }

        if(props.alert !== ''){
            setAlert('');
        }

        if(type === '+'){
            if((currentIndex + 1) === formsArray.data.length){
                newIndex = 0
            } else {
                newIndex = currentIndex + 1
            }
        }

        if(type === '-'){
            if(currentIndex <= 0){
                newIndex = formsArray.data.length - 1
            } else {
                newIndex = currentIndex - 1
            }
        }

        setFormsArray(prev => ({ ...prev, currentItrIndex: newIndex, previousIndex: currentIndex }))
    }

    async function formSelection(){
        const response = await chrome.tabs.sendMessage(
            tabData.id, {
                type: "FUNCTION_CALL",
                functionName: "FORM_SELECTION",
                payload: {
                    xpath: formsArray.data[formsArray.currentItrIndex],
                }
            }
        );

        if(response.status !== 200){
            return setError('Form selection failed!')
        }

        if(alert !== '') setAlert('');

        props.selectForm(formsArray.data[formsArray.currentItrIndex])
    }

    return (
        <>
            <p className="fs-title">Please select the form in action</p>
            {
                formsArray.currentItrIndex !== -1 &&
                <p className="fs-current-index">Current Index: {formsArray.currentItrIndex + 1}</p>
            }
            <div className="fs-actions-caontiner">
                <div className="fs-itr-btns">
                    <button className="fs-btn" onClick={e => formIterHandler('-')}>&lt; Prev</button>
                    <button className="fs-btn" onClick={e => formIterHandler('+')}>Next &gt;</button>
                </div>
            </div>
            <div className="fs-actions-caontiner">
                <button className="fs-btn" onClick={formSelection}>Select</button>
            </div>
        </>
    )
}

export default FormSelector;