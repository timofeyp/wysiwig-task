const isBackwards = sel => {
    const rg = document.createRange();
    rg.setStart(sel.anchorNode, sel.anchorOffset);
    rg.setEnd(sel.focusNode, sel.focusOffset);
    return !rg.toString();
}

const getLeftNode = sel => isBackwards(sel) ? sel.focusNode : sel.anchorNode;
const getLeftOffset = sel => isBackwards(sel) ? sel.focusOffset : sel.anchorOffset;
const getRightNode = sel => isBackwards(sel) ? sel.anchorNode : sel.focusNode;
const getRightOffset= sel => isBackwards(sel) ? sel.anchorOffset : sel.focusOffset;

const checkParentsStyled = (node, tag) => {
    if (!node.parentNode || node.id === 'edit-area') {
        return false;
    }
    if (node.parentNode.localName && node.parentNode.localName === tag) {
        return true;
    }
    return checkParentsStyled(node.parentNode, tag);
}

const getTextNodesBetween = (nodes) => {
    const textNodes = [];

    const getTextNodes = (nodes) => {
        nodes.forEach(node => {
            if (node.nodeType == 3) {
                textNodes.push(node);
            } else {
                return getTextNodes(node.childNodes);
            }
        })
    }

    getTextNodes(nodes);

    return textNodes;
};

const getRange = () => {
    const selection = document.getSelection();
    const isSelectionOfEdit = document.getElementById('edit-area').contains(selection.baseNode);
    if (selection && isSelectionOfEdit && !selection.isCollapsed) {
        const selection = document.getSelection();
        const range = new Range();
        range.setStart(getLeftNode(selection), getLeftOffset(selection));
        range.setEnd(getRightNode(selection), getRightOffset(selection));

        return range
    }
}

const setHeader = (tag, className) => {
    const range = getRange();

    if (range) {
        const header = document.createElement(tag)
        header.appendChild(range.extractContents());
        header.className = className;
        const style =  window.getComputedStyle(header, null);
        setTimeout(() => header.style.fontSize = style.fontSize, 0)
        return range.insertNode(header);
    }
}

const setTag = tag => {
    const range = getRange();
    if (range) {
        const clone = range.cloneContents();
        const textNodes = getTextNodesBetween(clone.childNodes);
        const parentStyledElement = document.createElement(tag);

        textNodes.forEach(node => {
            let newNode = document.createTextNode(node.nodeValue);
            if (tag !== 'i' && checkParentsStyled(node, 'i')) {
                const iParent = document.createElement('i');
                iParent.className = 'italic-text';
                iParent.appendChild(newNode);
                newNode = iParent;
            }
            if (tag !== 'b' && checkParentsStyled(node, 'b')) {
                const bParent = document.createElement('b');
                bParent.className = 'bold-text';
                bParent.appendChild(newNode);
                newNode = bParent;
            }
            parentStyledElement.appendChild(newNode);
        })

        range.deleteContents();
        range.insertNode(parentStyledElement);
    }
}

document.querySelector('#toolkit').addEventListener('click', (event) => {
    if (event.target.id === 'head-1' || (event.target.parentNode && event.target.parentNode.id === 'head-1')) {
        setHeader('h1', 'header1-text')
    }
    if (event.target.id === 'head-2' || (event.target.parentNode && event.target.parentNode.id === 'head-2')) {
        setHeader('h2', 'header2-text')
    }
    if (event.target.id === 'bold' || (event.target.parentNode && event.target.parentNode.id === 'bold')) {
        setTag('b')
    }
    if (event.target.id === 'italic' || (event.target.parentNode && event.target.parentNode.id === 'italic')) {
        setTag('i')
    }
});

