import { useContext, useEffect, useRef } from "react";
import AlertContext from "../context/alert-context";

function Input(props){
    const { alert, setAlert } = useContext(AlertContext);
    const dataRef = useRef();
    const delimiterRef = useRef();

    useEffect(() => {
        if(!props.selectedForm){
            setAlert('Please select the form in action to proceed further!');
            props.setCurrentTabIndexState(0);
        }

    }, []);

    function processData(){
        const data = dataRef.current.value;
        const delimiter = delimiterRef.current.value;

        if(data.trim() === ''){
            setAlert('Data cannot be empty');
            return
        }

        if(delimiter.trim() === ''){
            setAlert('Delimiter cannot be empty');
            return
        }

        if(alert !== ''){
            setAlert('');
        }

        const processedData = [];
        for(let line of data.split('\n')){
            line = line?.trim();

            if(line === '' || !line) continue;

            const lineSplit = line.split(delimiter);

            if(lineSplit.length !== 2) continue;

            let iS_AOS_Applicable = false;
            let Is_Sales_Deed_Applicable = false;

            if(lineSplit[1].trim() === 'Registered'){
                iS_AOS_Applicable = true;
                Is_Sales_Deed_Applicable = true;
            } else if(lineSplit[1].trim() === 'Agreement Received & Executed') {
                iS_AOS_Applicable = true;
                Is_Sales_Deed_Applicable = false;
            }

            if(Is_Sales_Deed_Applicable === null && iS_AOS_Applicable === null){
                continue;
            }

            processedData.push([
                lineSplit[0].trim(),
                [iS_AOS_Applicable, Is_Sales_Deed_Applicable]
            ])
        }

        props.setProcessedData(processedData);
        props.setCurrentTabIndexState(prev => ++prev)
    }

    return (
        <>
            <label htmlFor="data">Data</label>
            <textarea 
                rows='20' 
                id="data" 
                style={{ 
                    width: '100%', 
                    resize: 'none', 
                    marginBottom: 20, 
                    fontSize: 17  
                }} 
                ref={dataRef}
            />

            <label htmlFor="delimiter">Delimiter</label>
            <input 
                type="text" 
                id="delimiter" 
                defaultValue='| ^-^ |' 
                style={{ 
                    fontSize: 17, 
                    marginBottom: 20 
                }}
                ref={delimiterRef}
            />

            <div style={{ margin: 'auto' }}>
                <button onClick={processData}>Save</button>
            </div>
        </>
    )
}

export default Input;