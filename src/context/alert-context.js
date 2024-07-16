import { createContext, useState } from "react";

const AlertContext  = createContext({
    alert: '',
    setAlert: function(){}
});

function AlertContextProvider({ children }){
    const [alert, setAlert] = useState('');

    return <AlertContext.Provider value={{ alert, setAlert }}>
        {children}
    </AlertContext.Provider>
}

export default AlertContext;
export { AlertContextProvider };