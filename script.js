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

const checkChildrenStyled = (node, tag) => {
    if (!node.childNodes || node.childNodes.length === 0) {
        return false;
    }
    return Array.from(node.childNodes).reduce((acc, childNode) => {
        if (childNode.localName === tag) {
            return true;
        }

        if (acc) {
            return acc
        }

        return checkChildrenStyled(childNode, tag);
    }, false)
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

const setHeader = (tag, className) => {
    const selection = document.getSelection();
    if (selection && !selection.isCollapsed) {
        const selection = document.getSelection();
        const range = new Range();
        range.setStart(getLeftNode(selection), getLeftOffset(selection));
        range.setEnd(getRightNode(selection), getRightOffset(selection));

        const header = document.createElement(tag)
        header.appendChild(range.extractContents());
        header.className = className;
        return range.insertNode(header);
    }
}

const setTag = tag => {
    const selection = document.getSelection();
    if (selection && !selection.isCollapsed) {
        const range = new Range();
        range.setStart(getLeftNode(selection), getLeftOffset(selection));
        range.setEnd(getRightNode(selection), getRightOffset(selection));

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
    if (event.target.parentNode && event.target.parentNode.id === 'head-1') {
        setHeader('h1', 'header1-text')
    }
    if (event.target.parentNode && event.target.parentNode.id === 'head-2') {
        setHeader('h2', 'header2-text')
    }
    if (event.target.parentNode && event.target.parentNode.id === 'bold') {
        setTag('b')
    }
    if (event.target.parentNode && event.target.parentNode.id === 'italic') {
        setTag('i')
    }
});

