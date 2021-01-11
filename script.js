const setHeader = (tag, className) => {
    const selection = document.getSelection();
    if (selection && !selection.isCollapsed) {
        const oldContent = document.createTextNode(selection.toString());
        const newElement = document.createElement(tag);
        newElement.append(oldContent);
        newElement.className = className;
        selection.deleteFromDocument();
        if (selection.anchorNode.parentElement.id === 'edit-area') {
            selection.anchorNode.before(newElement);
        } else {
            selection.anchorNode.parentElement.before(newElement);
        }
    }
}

const setTag = (tag) => {
    const selection = document.getSelection();
    if (selection && !selection.isCollapsed) {
        const oldContent = document.createTextNode(selection.toString());
        const range = selection.getRangeAt(0);
        const newElement = document.createElement(tag);
        newElement.append(oldContent);
        selection.deleteFromDocument();
        range.insertNode(newElement);
    }
}

document.querySelector('#head-1').addEventListener('click', () =>  setHeader('h1', 'header1-text'));
document.querySelector('#head-2').addEventListener('click', () =>  setHeader('h2', 'header2-text'));
document.querySelector('#bold').addEventListener('click', () =>  setTag('b'));
document.querySelector('#italic').addEventListener('click', () =>  setTag('i'));

