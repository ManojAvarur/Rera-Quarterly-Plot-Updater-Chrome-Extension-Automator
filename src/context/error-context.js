import { createContext, useState } from "react";

const ErrorContext  = createContext({
    error: '',
    setError: function(){}
});

function ErrorContextProvider({ children }){
    const [error, setError] = useState('');

    return <ErrorContext.Provider value={{ error, setError }}>
        {children}
    </ErrorContext.Provider>
}

export default ErrorContext;
export { ErrorContextProvider };