let toUpdate = null;
let previouslyUpdated = null;
let selectedform = null;
let formsTableBodyChildren = null;

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

function formSelection(xpath){
    selectedform = getElementByXpath(xpath);
    formsTableBodyChildren = selectedform.querySelector('table').querySelector('tbody').children
    console.clear();
    console.log(selectedform);
    console.log(formsTableBodyChildren);
}

function highlighRowToUpdate(request, sender, sendResponse){
    try{
        const data = request.payload.siteNo
        const stratergy = request.payload.stratergy

        for(let child of formsTableBodyChildren){
            const siteNo = child.querySelector('input[type=text]:disabled').value;

            if(!siteNo){
                throw new Error('Row selection failed!')
            }

            console.clear();
            console.log({ siteNo, data, stratergy });

            if(stratergy === 'perfect-match' && siteNo.toUpperCase() === data.toUpperCase()){
                toUpdate = child;
                child.style.backgroundColor = 'yellow';
                toUpdate.scrollIntoView({ block: 'center' });
                return sendResponse({ status: 200, data: null })
            }
            
            if(stratergy === 'similar-match' && (siteNo.toUpperCase().includes(data.toUpperCase()) || data.toUpperCase().includes(siteNo.toUpperCase()))){
                toUpdate = child;
                child.style.backgroundColor = 'yellow';
                toUpdate.scrollIntoView({ block: 'center' });
                return sendResponse({ status: 200, data: null })
            }
        }

        sendResponse({ status: 500, data: null })
    } catch(err) {
        console.log(err);
        sendResponse({ 
            status: 500,
            data: null
        })
    }
}

function updateRow(request, sender, sendResponse){
    try{
        const isAOSAppCell = toUpdate.children[1];
        const isSalesDeedAppCell = toUpdate.children[2];

        const [isAOSAppCell_inp_true, isAOSAppCell_inp_false] = isAOSAppCell.querySelectorAll('input[type=radio]')
        const [isSalesDeedAppCell_inp_true, isSalesDeedAppCell_inp_false] = isSalesDeedAppCell.querySelectorAll('input[type=radio]')

        if(request.payload.data[0]){
            isAOSAppCell_inp_true.checked = true;
        } else {
            isAOSAppCell_inp_false.checked = true;
        }
        
        if(request.payload.data[1]){
            isSalesDeedAppCell_inp_true.checked = true;
        } else {
            isSalesDeedAppCell_inp_false.checked = true;
        }

        toUpdate.style.backgroundColor = '#7dca7d'
        toUpdate = null;

        sendResponse({ status: 200, data: null })
    } catch(err) {
        console.log(err);
        sendResponse({ 
            status: 500,
            data: null
        })
    }
}

function handelFunctionCalls(request, sender, sendResponse){
    switch (request.functionName) {
        case 'GET_FORMS_LIST':
            sendResponse({ 
                status: 200,
                data: getAllFormsXpath()
            })
        break;

        case 'FORM_SELECTION_PROC':
            formSelectionProcess(request.payload.xpathToHighlight, request.payload.xpathToNadir)
            sendResponse({ 
                status: 200,
                data: null
            })
        break;

        case 'FORM_SELECTION':
            formSelection(request.payload.xpath)
            sendResponse({ 
                status: 200,
                data: null
            })
        break;

        case 'HIGHLIGHT_ROW_TO_UPDATE':
            highlighRowToUpdate(request, sender, sendResponse)
        break;

        case 'ROW_UPDATE':
            updateRow(request, sender, sendResponse)
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
