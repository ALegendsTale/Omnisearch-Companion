import { createElement, X as XIcon } from "lucide";
import Storage, { SettingsType } from "../../utils/storage";
import { SettingsField } from "./SettingsField";
import _ from 'lodash'
import { Header } from "../../Header";

customElements.define('settings-field', SettingsField);

const xIcon = createElement(XIcon);
xIcon.style.stroke = 'black';

const template = document.createElement('template');
template.innerHTML = `<style>
:host {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    background-color: var(--grey);
    width: 100%;
}

#settings-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100vh;
}

#settings-content {
    display: flex;
    flex-direction: column;
    background-color: var(--off-white);
    border-radius: 5px;
    font-size: 1rem;
    padding: 5%;
    margin-bottom: 5%;
    flex-wrap: nowrap;
    color: var(--dark);
    width: 80%;
    overflow-y: scroll;
    scrollbar-width: thin;
}

h3 {
    color: var(--light-purple);
    font-weight: bold;
    font-family: Inter;
    font-size: 1.25rem;
    margin: 5%;
}

form {
    display: flex;
    flex-direction: column;
}

#open-settings {
    display: flex;
    align-self: flex-end;
    justify-content: center;
    width: 50%;
    text-align: center;
    color: var(--dark);
}
</style>`

export class Settings extends HTMLElement {
    container: HTMLDivElement
    contentContainer: HTMLDivElement
    heading: Header
    subHeading: HTMLHeadingElement
    form: HTMLFormElement
    port: SettingsField
    notesShown: SettingsField
    notesScore: SettingsField
    openSettingsButton: HTMLButtonElement
    storage: Storage
    settings: SettingsType

    constructor(display?: boolean){
        super();
        // Storage
        this.storage = new Storage();
        this.settings = {
            port: '',
            notesShown: '',
            notesScore: ''
        }
        // Create shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.append(template.content.cloneNode(true));

        this.container = shadow.appendChild(document.createElement('div'));
        this.container.id = 'settings-container'

        this.heading = this.container.appendChild(new Header(true));

        this.subHeading = this.container.appendChild(document.createElement('h3'));
        this.subHeading.innerText = 'Settings';

        this.contentContainer = this.container.appendChild(document.createElement('div'));
        this.contentContainer.id = 'settings-content'

        // Form items
        this.form = this.contentContainer.appendChild(document.createElement('form'));
        this.form.acceptCharset = 'UTF-8'
        // Port settings
        this.port = this.form.appendChild(new SettingsField('Port', 'Set this to the same port that your Omnisearch server is set to.'));
        // Notes shown settings
        this.notesShown = this.form.appendChild(new SettingsField('Notes Shown', 'The number of notes shown per query.'));
        // Notes score settings
        this.notesScore = this.form.appendChild(new SettingsField('Notes Score', 'Filter notes by how closely they relate to your query. Score ranges from 0 - 100.'));

        // Close & open buttons
        this.heading.button.title = 'Close settings and save';
        this.heading.button.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.saveSettings();
            this.toggleDisplay();
        })

        this.openSettingsButton = this.contentContainer.appendChild(document.createElement('button'));
        this.openSettingsButton.id = 'open-settings';
        this.openSettingsButton.innerText = 'Open Settings';
        this.openSettingsButton.addEventListener('click', (e) => {
            e.preventDefault();
            browser.runtime.openOptionsPage();
        })

        // Show settings as an embed
        if(display){
            this.style.display = 'flex';
            this.heading.button.style.display = 'none';
            this.openSettingsButton.style.display = 'none';
        }
        // Show settings as a toggle
        else{
            this.style.display = 'none';
        }
    }
    connectedCallback() {
        this.loadSettings();
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {

    }

    /**
     * Toggle the display of the settings menu
     */
    public toggleDisplay() {
        this.style.display = this.style.display === 'none' ? 'flex' : 'none';
    }

    private async loadSettings() {
        this.settings = await this.storage.getSettingsStorage();
        this.port.input.value = this.settings.port;
        this.notesShown.input.value = this.settings.notesShown;
        this.notesScore.input.value = this.settings.notesScore;
    }

    private async saveSettings() {
        const settings = {
            port: this.port.input.value,
            notesShown: this.notesShown.input.value,
            notesScore: this.notesScore.input.value
        }
        // Only save if settings have been changed
        if(!_.isEqual(this.settings, settings)){
            await this.storage.setSettingsStorage(settings);
            this.settings = settings;
        }
    }
}