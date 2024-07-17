import { useContext, useEffect, useState } from 'react';
import Input from './Input/Input';
import './App.css';
import FormSelector from './FormSelector/FormSelector';
import TabContext from './context/tab-context';
import AlertContext from './context/alert-context';
import ErrorContext from './context/error-context';
import AutomationCtrl from './AutomationCtrl/AutomationCtrl';


function App() {
	const [currentTabIndex, setCurrentTabIndexState] = useState(0);
	const [selectedForm, setSelectedForm] = useState(null);
	const [processedData, setProcessedData] = useState(null);
	const alertCtx = useContext(AlertContext);
	const tabCtx = useContext(TabContext);
	const errorCtx = useContext(ErrorContext);

	useEffect(() => {
		(async () => {
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ['service-worker.js']
			}).then(_ => {
				tabCtx.setTabData(tab);
			}).catch(err => {
				errorCtx.setError("Failed to initialize scripts")
			})
		})();
	}, [])

	function selectForm(xpath){
		setSelectedForm(xpath);
		setCurrentTabIndexState(currentTabIndex + 1);
	}

	return (
		<>
			<header>
				<h2>Rera Plot Selection Automator</h2>
			</header>
			<aside>
				<h4 className='alert'>{alertCtx.alert}</h4>
				{ errorCtx.error !== '' && <h2 className='alert'>{errorCtx.error}</h2>}
			</aside>
			
			{
				errorCtx.error === '' && (
					<>
						<nav>
							<div className='tab-conatiner'>
								{
									['Selector', 'Input', 'Automation Controller'].map((tab, index) => (
										<div 
											className={`tab ${currentTabIndex === index? 'selected' : ''}`} 
											key={tab}
											onClick={e => setCurrentTabIndexState(index)}
										>
											{tab}
										</div>
									))
								}
							</div>
						</nav>
						<main>
							{[
								<FormSelector 
									selectForm={selectForm} 
								/>,
								<Input 
									selectedForm={selectedForm} 
									setCurrentTabIndexState={setCurrentTabIndexState} 
									setProcessedData={setProcessedData}
								/>,
								<AutomationCtrl 
									processedData={processedData} 
									setCurrentTabIndexState={setCurrentTabIndexState} 
								/>
							][currentTabIndex]}
						</main>
						<footer>
							<h3>Coded with ❤ by Manoj</h3>
						</footer>
					</>
				)
			}
		</>	
	);
}

export default App;
