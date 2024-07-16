function getAllFormsXpath(){
    const data = [];

    document.querySelectorAll('form').forEach(el => {
        data.push(generateElementFullXpath(el))
    })

    return data;
}

function formSelectionProcess(xpathToHighlight, xpathToNadir){
    const elToHighlight = getElementByXpath(xpathToHighlight);
    
    elToHighlight.style.backgroundColor = 'yellow';
    elToHighlight.style.padding = 4;
    elToHighlight.scrollIntoView();
    
    if(xpathToNadir !== ''){
        const elToNadir = getElementByXpath(xpathToNadir);
        elToNadir.style.backgroundColor = '';
        elToNadir.style.padding = 0;
    }
}

function handelFunctionCalls(request, sender, sendResponse){
    switch (request.functionName) {
        case 'GET_FORMS_LIST':
            sendResponse({ 
                responseFrom: 'GET_FORMS_LIST', 
                status: 200,
                data: getAllFormsXpath()
            })
        break;

        case 'FORM_SELECTION_PROC':
            formSelectionProcess(request.payload.xpathToHighlight, request.payload.xpathToNadir)
            sendResponse({ 
                responseFrom: 'FORM_SELECTION_PROC', 
                status: 200,
                data: null
            })
        break
    
        default:
        break;
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.type === 'FUNCTION_CALL'){
        handelFunctionCalls(request, sender, sendResponse)
    }
    
    if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
});

function generateElementFullXpath(element) {
    var path = [];
    
    while (element) {
        var tagName = element.nodeName;
        
        if (element.parentElement) {
            var siblings = element.parentElement.children;
            var sameTagSiblings = Array.from(siblings).filter(sibling => sibling.nodeName === tagName);
            
            if (sameTagSiblings.length > 1) {
                var index = Array.prototype.indexOf.call(sameTagSiblings, element);
                tagName += "[" + (index + 1) + "]";
            }
        }
        
        path.unshift(tagName);
        element = element.parentElement;
    }
    
    return "/" + path.join("/").toUpperCase();
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
