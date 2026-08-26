import { createContext, useState } from "react"

export const ConfigContext = createContext()

let setConfigRef

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({
        app: {
            theme: 'light'
        }
    })

    setConfigRef = setConfig

    return (
        <ConfigContext.Provider value={{ config }}>
            { children }
        </ConfigContext.Provider>
    )
}

export const updateConfig = (partialConfig) => {
    if (setConfigRef) {
        setConfigRef(prev => ({ ...prev, ...partialConfig }));
    }
};