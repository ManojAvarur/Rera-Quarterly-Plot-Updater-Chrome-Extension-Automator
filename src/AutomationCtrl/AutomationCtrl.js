import { useContext, useEffect, useState } from "react";
import './AutomationCtrl.css'
import TabContext from "../context/tab-context";
import ErrorContext from "../context/error-context";
import AlertContext from "../context/alert-context";

function AutomationCtrl(props){
    const { tabData } = useContext(TabContext);
    const { setError } = useContext(ErrorContext);
    const { alert, setAlert } = useContext(AlertContext);
    const [matchStratergy, setMatchStratergy] = useState('perfect-match');
    const [processedData, setProcessedData] = useState({ currentIndex: -1, upcommingIndex: -1, data: props.processedData});

    useEffect(() => {
        if(processedData.data?.length === 0 || !processedData.data){
            setAlert('Please select the form in action and the data to process to proceed further!');
            props.setCurrentTabIndexState(0);
        }
    }, [])

    // Execute the change
    useEffect(() => {
        if(processedData.currentIndex === -1) return;

        (async () => {
            try{
                const response = await chrome.tabs.sendMessage(
                    tabData.id, {
                        type: "FUNCTION_CALL",
                        functionName: "ROW_UPDATE",
                        payload: {
                            data: processedData.data[processedData.currentIndex][1]
                        }
                    }
                );

                if(response.status !== 200){
                    return setAlert('Updation failed!')
                }

                if(alert !== '') setAlert('');
            } catch(err) {
                console.log(err);
                setAlert('Updation failed!');
            }
        })()
    }, [processedData.currentIndex])

    // Select the next change
    useEffect(() => {
        if(processedData.upcommingIndex === -1) return;

        (async () => {
            try{
                // console.log(processedData.upcommingIndex);
                const siteNo = String(processedData.data[processedData.upcommingIndex][0]);
                console.log(siteNo);

                const response = await chrome.tabs.sendMessage(
                    tabData.id, {
                        type: "FUNCTION_CALL",
                        functionName: "HIGHLIGHT_ROW_TO_UPDATE",
                        payload: {
                            siteNo,
                            stratergy: matchStratergy
                        }
                    }
                );

                if(response.status !== 200){
                    return setAlert('Selection failed!')
                }

                if(alert !== '') setAlert('');
            } catch(err) {
                console.log(err);
                setAlert('Selection failed!');
            }
        })()
    }, [processedData.upcommingIndex])

    function startExecution(){  
        setProcessedData(prev => ({ ...prev, upcommingIndex: 0 }))
    }

    function execute(){
        if(processedData.currentIndex >= (processedData.data.length - 1)){
            setAlert('No more data to process!');
            return setProcessedData(prev => ({ ...prev, currentIndex: -1, upcommingIndex: -1 }))
        }

        if(processedData.currentIndex < processedData.upcommingIndex){
            return setProcessedData(prev => ({ ...prev, currentIndex: ++prev.currentIndex }))
        }

        if((processedData.upcommingIndex + 1) === processedData.data.length){
            return setProcessedData(prev => ({ ...prev, currentIndex: ++prev.currentIndex, upcommingIndex: -2 }))
        }
        
        setProcessedData(prev => ({ ...prev, upcommingIndex: ++processedData.upcommingIndex }))
    }

    return (
        <>
            <h2 className="ac-title">Excution controller</h2>
            <p className="ac-strategy-label"><strong><em>Site No.</em></strong> Match Strategy</p>

            <div className="ac-actions-caontiner">
                <input 
                    type="radio" 
                    id="perfect-match" 
                    value="perfect-match" 
                    name="strategy" 
                    checked={matchStratergy === 'perfect-match'}
                    onChange={e => setMatchStratergy('perfect-match')}
                    disabled={processedData.upcommingIndex !== -1}
                />
                <label htmlFor="perfect-match">Perfect Match</label>
                
                <input 
                    type="radio" 
                    id="similar-match" 
                    value="similar-match" 
                    name="strategy" 
                    checked={matchStratergy === 'similar-match'}
                    onChange={e => setMatchStratergy('similar-match')}
                    disabled={processedData.upcommingIndex !== -1}
                />
                <label htmlFor="similar-match">Similar Match</label>
            </div>

            <div className="ac-actions-caontiner">
                <div className="ac-itr-btns">
                    {
                        processedData.upcommingIndex === -1 && (
                            <button className="ac-btn" onClick={startExecution}>Start Execution</button>
                        )
                    } 
                    {
                        processedData.upcommingIndex !== -1 && (
                            <button className="ac-btn" onClick={execute}>Execute & Proceed</button>
                        )
                    }
                </div>
            </div>
        </>
    )
}

// Access form
// Access Table's body from Form 

export default AutomationCtrl;