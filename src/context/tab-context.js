import { createContext, useState } from "react";

const TabContext  = createContext({
    tabData: {},
    setTabData: function(){}
});

function TabContextProvider({ children }){
    const [tabData, setTabData] = useState(null);

    return <TabContext.Provider value={{ tabData, setTabData }}>
        {children}
    </TabContext.Provider>
}

export default TabContext;
export { TabContextProvider };