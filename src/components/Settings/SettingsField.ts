import { createElement, Undo2 } from "lucide";

const template = document.createElement('template');
template.innerHTML = `<style>
    :host {
        margin-bottom: 10px;
    }

    div {
        display: flex;
        justify-content: space-between;
    }

    div > .name-container {
        display: flex;
        flex-direction: column;
    }

    .name-container > .setting-name {
        font-size: 1rem;
        font-family: Inter;
        margin-bottom: 1%;
        
    }

    .name-container > .setting-description {
        font-size: .6rem;
        font-family: Inter;
    }

    div > .input-container {
        display: flex;
        flex-direction: row;
        height: 24px;
    }

    .input-container > input {
        width: 70px;
        height: 100%;
        padding-left: 10px;
        font-size: .75rem;
        font-family: Inter;
        box-sizing: border-box;
    }

    .input-container > button {
        height: 100%;
        border: none;
        background-color: transparent;
        color: var(--dark);
        box-sizing: border-box;
    }

    .input-container > button:hover {
        color: var(--purple);
        background-color: var(--grey);
    }
</style>`

export class SettingsField extends HTMLElement {
    fieldContainer: HTMLDivElement
    nameContainer: HTMLDivElement
    inputContainer: HTMLDivElement
    name: HTMLSpanElement
    description: HTMLSpanElement
    input: HTMLInputElement
    reset: HTMLButtonElement

    constructor(fieldName: string, fieldDescription: string){
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.append(template.content.cloneNode(true));
        const fieldNameSanitized = fieldName.replace(' ', '-').toLowerCase();
        this.fieldContainer = shadow.appendChild(document.createElement('div'));
        this.nameContainer = this.fieldContainer.appendChild(document.createElement('div'));
        this.nameContainer.className = 'name-container';
        this.inputContainer = this.fieldContainer.appendChild(document.createElement('div'));
        this.inputContainer.className = 'input-container';
        this.name = this.nameContainer.appendChild(document.createElement('span'));
        this.name.className = 'setting-name'
        this.name.innerText = fieldName;
        this.description = this.nameContainer.appendChild(document.createElement('span'));
        this.description.className = 'setting-description'
        this.description.innerText = fieldDescription;
        this.input = this.inputContainer.appendChild(document.createElement('input'));
        this.input.type = 'text';
        this.input.id = `${fieldNameSanitized}-input`;
        this.input.name = fieldNameSanitized;
        this.reset = this.inputContainer.appendChild(document.createElement('button'));
        this.reset.appendChild(createElement(Undo2));

        this.reset.addEventListener('click', (e) => {
            if(confirm(`Reset ${fieldName} to default value?`)){
                console.log(`Reset ${fieldName}`);
            }
        })
    }
    connectedCallback() {

    }
}