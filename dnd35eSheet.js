var skill_array = [
    "Abrir_cerraduras",
    "Artesania",
    "Averiguar_intenciones",
    "Avistar",
    "Buscar",
    "Concentracion",
    "Conocimiento_de_conjuros",
    "Descifrar_escritura",
    "Diplomacia",
    "Disfrazarse",
    "Enganar",
    "Equilibrio",
    "Escapismo",
    "Esconderse",
    "Escuchar",
    "Falsificar",
    "Interpretar",
    "Intimidar",
    "Inutilizar_mecanismo",
    "Juego_de_manos",
    "Montar",
    "Moverse_sigilosamente",
    "Nadar",
    "Oficio",
    "Piruetas",
    "Reunir_informacion",
    "Saber_arcano",
    "Saber_arq_ing",
    "Saber_dungeons",
    "Saber_geografia",
    "Saber_historia",
    "Saber_local",
    "Saber_planos",
    "Saber_naturaleza",
    "Saber_nobleza",
    "Saber_religion",
    "Saltar",
    "Sanar",
    "Supervivencia",
    "Tasacion",
    "Trato_con_animales",
    "Trepar",
    "Usar_objeto_magico",
    "Uso_de_cuerdas"
]
let trackedIds = {};
const mexp = new Mexp();

const carringCapacity = {
    1: { "LightLoad": "3 lb. or less", "MediumLoad": "4-6 lb.", "HeavyLoad": "7-10 lb." },
    2: { "LightLoad": "6 lb. or less", "MediumLoad": "7-13 lb.", "HeavyLoad": "14-20 lb." },
    3: { "LightLoad": "10 lb. or less", "MediumLoad": "11-20 lb.", "HeavyLoad": "21-30 lb." },
    4: { "LightLoad": "13 lb. or less", "MediumLoad": "14-26 lb.", "HeavyLoad": "27-40 lb." },
    5: { "LightLoad": "16 lb. or less", "MediumLoad": "17-33 lb.", "HeavyLoad": "34-50 lb." },
    6: { "LightLoad": "20 lb. or less", "MediumLoad": "21-40 lb.", "HeavyLoad": "41-60 lb." },
    7: { "LightLoad": "23 lb. or less", "MediumLoad": "24-46 lb.", "HeavyLoad": "47-70 lb." },
    8: { "LightLoad": "26 lb. or less", "MediumLoad": "27-53 lb.", "HeavyLoad": "54-80 lb." },
    9: { "LightLoad": "30 lb. or less", "MediumLoad": "31-60 lb.", "HeavyLoad": "61-90 lb." },
    10: { "LightLoad": "33 lb. or less", "MediumLoad": "34-66 lb.", "HeavyLoad": "67-100 lb." },
    11: { "LightLoad": "38 lb. or less", "MediumLoad": "39-76 lb.", "HeavyLoad": "77-115 lb." },
    12: { "LightLoad": "43 lb. or less", "MediumLoad": "44-86 lb.", "HeavyLoad": "87-130 lb." },
    13: { "LightLoad": "50 lb. or less", "MediumLoad": "51-100 lb.", "HeavyLoad": "101-150 lb." },
    14: { "LightLoad": "58 lb. or less", "MediumLoad": "59-116 lb.", "HeavyLoad": "117-175 lb." },
    15: { "LightLoad": "66 lb. or less", "MediumLoad": "67-133 lb.", "HeavyLoad": "134-200 lb." },
    16: { "LightLoad": "76 lb. or less", "MediumLoad": "77-153 lb.", "HeavyLoad": "154-230 lb." },
    17: { "LightLoad": "86 lb. or less", "MediumLoad": "87-173 lb.", "HeavyLoad": "174-260 lb." },
    18: { "LightLoad": "100 lb. or less", "MediumLoad": "101-200 lb.", "HeavyLoad": "201-300 lb." },
    19: { "LightLoad": "116 lb. or less", "MediumLoad": "117-233 lb.", "HeavyLoad": "234-350 lb." },
    20: { "LightLoad": "133 lb. or less", "MediumLoad": "134-266 lb.", "HeavyLoad": "267-400 lb." },
    21: { "LightLoad": "153 lb. or less", "MediumLoad": "154-306 lb.", "HeavyLoad": "307-460 lb." },
    22: { "LightLoad": "173 lb. or less", "MediumLoad": "174-346 lb.", "HeavyLoad": "347-520 lb." },
    23: { "LightLoad": "200 lb. or less", "MediumLoad": "201-400 lb.", "HeavyLoad": "401-600 lb." },
    24: { "LightLoad": "233 lb. or less", "MediumLoad": "234-466 lb.", "HeavyLoad": "467-700 lb." },
    25: { "LightLoad": "266 lb. or less", "MediumLoad": "267-533 lb.", "HeavyLoad": "534-800 lb." },
    26: { "LightLoad": "306 lb. or less", "MediumLoad": "307-613 lb.", "HeavyLoad": "614-920 lb." },
    27: { "LightLoad": "346 lb. or less", "MediumLoad": "347-693 lb.", "HeavyLoad": "694-1,040 lb." },
    28: { "LightLoad": "400 lb. or less", "MediumLoad": "401-800 lb.", "HeavyLoad": "801-1,200 lb." },
    29: { "LightLoad": "466 lb. or less", "MediumLoad": "467-933 lb.", "HeavyLoad": "934-1,400 lb." }
};


window.onload = function () {
    let originalDiv = document.getElementById('infomacros');
    let clonedDiv = originalDiv.cloneNode(true);
    document.getElementById('infomacrosintab').appendChild(clonedDiv);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// GENERIC SHEET CODE ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var clearStorageButton = undefined;
function initSheet() {
    let inputs = document.querySelectorAll("input,button,textarea, select"); //------------- Agregado select a la lista de cosas que se guardan
    for (let input of inputs) {
        if (input.id != undefined && input.id != "clear-storage") {
            input.addEventListener("change", function () {
                onInputChange(input)
            });

            let titleSibling = findFirstSiblingWithClass(input, "field-title");
            if (titleSibling != null) {
                titleSibling.id = `${input.id}-field-title`;
            }
            let descSibling = findFirstSiblingWithClass(input, "field-desc");
            if (descSibling != null) {
                descSibling.id = `${input.id}-field-desc`;
            }

            let finalInput = input; //otherwise the input can change which breaks the onchange handler
            if (titleSibling == null && input.dataset.modifier != undefined) {
                //manual fix for melee/ranged attack buttons being formatted differently
                titleSibling = finalInput;
                finalInput = document.getElementById(finalInput.dataset.modifier);
            }

            if (titleSibling != null && titleSibling.dataset.diceType != undefined) {
                titleSibling.classList.add("interactible-title");
                titleSibling.style.cursor = "pointer";
                titleSibling.addEventListener("click", function () {
                    TS.dice.putDiceInTray([createDiceRoll(titleSibling, finalInput)]);
                    //we are not checking for success or failure here, but could easily by adding a .then (success) and .catch (failure)
                });
                input.setAttribute("aria-labelledby", titleSibling.id);
                if (descSibling != null) {
                    input.setAttribute("aria-describedby", descSibling.id);
                }
            } else if (titleSibling != null) {
                titleSibling.setAttribute("for", input.id);
                if (descSibling != null) {
                    input.setAttribute("aria-describedby", descSibling.id);
                }
            }
        }
    }
}

function onInputChange(input) {
    //handles input changes to store them in local storage

    let data;
    // get already stored data
    TS.localStorage.campaign.getBlob().then((storedData) => {
        //parse stored blob as json, but also handle if it's empty by
        //defaulting to an empty json document "{}" if stored data is false
        data = JSON.parse(storedData || "{}");
        if (input.type == "checkbox") {
            data[input.id] = input.checked ? "on" : "off";
        } else {
            data[input.id] = input.value;
        }
        //set new data, handle response
        TS.localStorage.campaign.setBlob(JSON.stringify(data)).then(() => {
            //if storing the data succeeded, enable the clear storage button
            clearStorageButton.classList.add("danger");
            clearStorageButton.disabled = false;
            clearStorageButton.textContent = "Clear Character Sheet";
        }).catch((setBlobResponse) => {
            TS.debug.log("Failed to store change to local storage: " + setBlobResponse.cause);
            console.error("Failed to store change to local storage:", setBlobResponse);
        });
    }).catch((getBlobResponse) => {
        TS.debug.log("Failed to load data from local storage: " + getBlobResponse.cause);
        console.error("Failed to load data from local storage:", getBlobResponse);
    });

    if (input.id == "abilities-text") {
        let actions = parseActions(input.value);
        addActions(actions);
    }
}

function findFirstSiblingWithClass(element, className) {
    let siblings = element.parentElement.children;
    for (let sibling of siblings) {
        if (sibling.classList.contains(className)) {
            return sibling;
        }
    }
    return null;
}

function createDiceRoll(clickElement, inputElement) {
    let modifierString = "";
    if (clickElement.dataset.modifier != "no-mod" && inputElement != null) {
        modifierString = inputElement.value >= 0 ? "+" + inputElement.value : inputElement.value;
    }
    let label = "";
    if (clickElement.dataset.label != undefined) {
        label = clickElement.dataset.label;
    } else {
        label = clickElement.textContent;
    }
    let roll = `${clickElement.dataset.diceType}${modifierString == '+' ? '' : modifierString}`

    //this returns a roll descriptor object. we could be using TS.dice.makeRollDescriptor(`${roll}+${modifierString}`) instead
    //depends mostly on personal preference. using makeRollDescriptor can be safer through updates, but it's also less efficient
    //and would ideally need error handling on the return value (and can be rate limited)
    return { name: label, roll: roll };
}

function parseActions(text) {
    let results = text.matchAll(/(.*) (\d{0,2}d\d{1,2}[+-]?\d*) ?(.*)/gi);
    let actions = [];
    for (let result of results) {
        let action = {
            title: result[1],
            dice: result[2],
            description: result[3]
        }
        actions.push(action);
    }
    return actions;
}

function addActions(results) {
    //remove old actions
    let oldActions = document.querySelectorAll("[id^=list-action]");
    for (let oldAction of oldActions) {
        oldAction.remove();
    }

    //add new actions
    let template = document.getElementById("abilities-template");
    let container = template.parentElement;
    for (let i = 0; i < results.length; i++) {
        let clonedAction = template.content.firstElementChild.cloneNode(true);
        clonedAction.id = "list-action" + i;
        let title = clonedAction.querySelector("[id=abilities-template-title]");
        title.removeAttribute("id");
        title.textContent = results[i]["title"];

        let description = clonedAction.querySelector("[id=abilities-template-desc]");
        description.removeAttribute("id");
        description.textContent = results[i]["description"];

        let button = clonedAction.querySelector("[id=abilities-template-button]");
        button.id = "action-button" + i;
        button.dataset.diceType = results[i]["dice"];
        button.dataset.label = results[i]["title"];
        button.addEventListener("click", function () {
            TS.dice.putDiceInTray([createDiceRoll(button, null)]);
            //we are not checking for success or failure here, but could easily by adding a .then (success) and .catch (failure)
        });

        container.insertBefore(clonedAction, document.getElementById("abilities-text").parentElement);
    }
}

function populateTHAC0(event) {
    let matrix = document.getElementById("thac0-matrix");
    let children = matrix.children;
    let remainingElements = 9;
    for (let child of children) {
        if (child.classList.contains("field-data-short")) {
            child.textContent = event.target.value - remainingElements;
            remainingElements--;
        }
    }
}

function loadStoredData() {
    TS.localStorage.campaign.getBlob().then((storedData) => {
        //localstorage blobs are just unstructured text.
        //this means we can store whatever we like, but we also need to parse it to use it.
        let data = JSON.parse(storedData || "{}");
        delete data.spelltype; //--------------------------------------------------------excluir objeto de info de conjuros
        delete data.inventory; //--------------------------------------------------------excluir objeto de inventario
        delete data.macros; //--------------------------------------------------------excluir objeto de inventario         
        if (Object.entries(data).length > 0) {
            clearStorageButton.classList.add("danger");
            clearStorageButton.disabled = false;
            clearStorageButton.textContent = "Clear Character Sheet";
        }
        let keyCount = 0;
        for (let [key, value] of Object.entries(data)) {

            if (key === 'charaligment') continue;  //Variable name changed
            keyCount++;
            let element = document.getElementById(key);
            element.value = value;
            if (key == "thac0") {
                element.dispatchEvent(new Event('change'));
            } else if (element.type == "checkbox") {
                element.checked = value == "on" ? true : false;
            } else if (key == "abilities-text") {
                let results = parseActions(element.value);
                addActions(results);
            }
        }
        //adding some log information to the symbiote log
        //this doesn't have particular importance, but is here to show how it's done
        TS.debug.log(`Loaded ${keyCount} values from storage`);
        recalculate(); //--------------------------------------------------------35E RECALCULATE ALL DATA AFTER LOADING SAVED DATA
    });
}

function clearSheet() {
    //clear stored data
    TS.localStorage.campaign.deleteBlob().then(() => {
        //if the delete succeeded (.then), set the UI to reflect that
        clearStorageButton.classList.remove("danger");
        clearStorageButton.disabled = true;
        clearStorageButton.textContent = "Character Sheet Empty";
    }).catch((deleteResponse) => {
        //if the delete failed (.catch), write a message to symbiote log
        TS.debug.log("Failed to delete local storage: " + deleteResponse.cause);
        console.error("Failed to delete local storage:", deleteResponse);
    });

    //clear sheet inputs
    let inputs = document.querySelectorAll("input,textarea");
    for (let input of inputs) {
        switch (input.type) {
            case "button":
                break;
            case "checkbox":
                input.checked = false;
                break;
            default:
                input.value = "";
                break;
        }
    }
    location.reload(); //------------------------------------------------Reload the sheet after clearing data 
}

function onStateChangeEvent(msg) {
    if (msg.kind === "hasInitialized") {
        //the TS Symbiote API has initialized and we can begin the setup. think of this as "init".
        clearStorageButton = document.getElementById("clear-storage");
        loadStoredData();
        initSheet();
        initCustomobjects();
        zeroingInputs();
        reloadSpellist();
        reloadInventory();
        loadMacros();
        //recalculate();  
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
/////////////////////////////////////////////////////////////////////// DND 35e /////////////////////////////////////////////////////////// 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// -------------------------------------------------------------------TABS--
// Funcion para abrir pestañas 
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Pestaña abierta por default
document.getElementById("btab1").click();

function zeroingInputs() {
    var elements = document.getElementsByClassName("number-input");
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].value === '') {
            elements[i].value = 0;
        }
    }

    elements = document.getElementsByClassName("ability-base");
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].value === '') {
            elements[i].value = 10;
        }
    }
}

// --------------------------------------------------------------RECALCULATE
function recalculate() {

    updateModifier('STR');
    updateModifier('DEX');
    updateModifier('CON');
    updateModifier('INT');
    updateModifier('WIS');
    updateModifier('CHA');
    updateBab();
    reloadSizemods();
}

//////////////////////////////////////////// input updates ////////////////////// 

//Actualizacion de abilty scores
function updateModifier(ability) {
    let modBase = parseInt(document.getElementById(`char${ability}base`).value);
    let modRac = parseInt(document.getElementById(`char${ability}modrac`).value);
    let modItem = parseInt(document.getElementById(`char${ability}moditem`).value);
    let modExtra = parseInt(document.getElementById(`char${ability}modextra`).value);
    let modTemp = parseInt(document.getElementById(`char${ability}modtemp`).value);

    let total = modBase + modRac + modItem + modExtra + modTemp;
    let modifier = Math.floor((total - 10) / 2);

    document.getElementById(`TOT${ability}`).innerHTML = total;

    //Actualizar todos los campos que tengan como clase la habilidad (ej: MODSTR)
    let elements = document.getElementsByClassName(`MOD${ability}`);
    for (let i = 0; i < elements.length; i++) {
        elements[i].innerHTML = modifier;
    }

    //-----------------Actualizar modificadores dependientes de las habilidades
    if (ability === 'STR') { updateCarringcap(); }
    if (ability === 'CON') { updateSaving('FOR'); }
    if (ability === 'WIS') { updateSaving('WIL'); }
    if (ability === 'DEX') {
        updateSaving('REF');
        updatecharCA();
    }
    // Actualizar habilidades
    for (let skill of skill_array) {
        updateSkill(skill);
    }
}

function updateCarringcap() {

    const charStr = document.getElementById('TOTSTR').innerHTML;

    document.getElementById('carga-l').innerHTML = carringCapacity[charStr].LightLoad;
    document.getElementById('carga-m').innerHTML = carringCapacity[charStr].MediumLoad;
    document.getElementById('carga-p').innerHTML = carringCapacity[charStr].HeavyLoad;

}

//Actualizacion de salvaciones     
function updateSaving(saving) {

    let modBase = parseInt(document.getElementById(`char${saving}base`).value);
    let charabmod = parseInt(document.getElementById(`char${saving}abmod`).innerHTML);
    let charmodextra1 = parseInt(document.getElementById(`char${saving}modextra1`).value);
    let charmodextra2 = parseInt(document.getElementById(`char${saving}modextra2`).value);
    let charmodextra3 = parseInt(document.getElementById(`char${saving}modextra3`).value);
    let charmodextra4 = parseInt(document.getElementById(`char${saving}modextra4`).value);

    let modifier = modBase + charabmod + charmodextra1 + charmodextra2 + charmodextra3 + charmodextra4;

    document.getElementById(`SAV${saving}`).innerHTML = modifier;
}

//Actualizacion de CA
function updatecharCA() {
    let chararmor = parseInt(document.getElementById(`chararmor`).value);
    let charsize = parseInt(document.getElementById(`charsize`).value);
    let charshield = parseInt(document.getElementById(`charshield`).value);
    let characnatural = parseInt(document.getElementById(`characnatural`).value);
    let characeesquiva = parseInt(document.getElementById(`characeesquiva`).value);
    let characex1 = parseInt(document.getElementById(`characex1`).value);
    let characex2 = parseInt(document.getElementById(`characex2`).value);
    let characex3 = parseInt(document.getElementById(`characex3`).value);
    let chardex = parseInt(document.getElementById('MODDEX').innerHTML);
    let chardeflection = parseInt(document.getElementById(`chardeflection`).value);

    let CATOTAL = 10 + chararmor + charshield + chardex + charsize + chardeflection + characnatural + characeesquiva + characex1 + characex2 + characex3;
    let CATOUCH = 10 + chardex + charsize + chardeflection + characeesquiva + characex1 + characex2 + characex3;

    document.getElementById('CATOTAL').innerHTML = CATOTAL;
    document.getElementById('CATOUCH').innerHTML = CATOUCH;

}

//Actualizacion de habilidades      
function updateSkill(skill) {

    let charmod = parseInt(document.getElementById(`${skill}_abilitymod`).innerHTML);
    let ranks = parseInt(document.getElementById(`${skill}_ranks`).value);
    let modextra1 = parseInt(document.getElementById(`${skill}_extra1`).value);
    let modextra2 = parseInt(document.getElementById(`${skill}_extra2`).value);
    let modextra3 = parseInt(document.getElementById(`${skill}_extra3`).value);

    let modifier = charmod + ranks + modextra1 + modextra2 + modextra3;

    document.getElementById(`${skill}_mod`).innerHTML = modifier;
}
// Actualizacion de BAB
function updateBab() {

    const bab1 = document.getElementById('bab1').value;
    let bab2 = bab1 >= 6 ? bab1 - 5 : 0;
    let bab3 = bab2 >= 6 ? bab2 - 5 : 0;
    let bab4 = bab3 >= 6 ? bab3 - 5 : 0;

    const babClasses1 = document.getElementsByClassName('bab1');
    const babClasses2 = document.getElementsByClassName('bab2');
    const babClasses3 = document.getElementsByClassName('bab3');
    const babClasses4 = document.getElementsByClassName('bab4');

    for (let i = 0; i < babClasses1.length; i++) {
        babClasses1[i].innerHTML = bab1;
    }

    for (let i = 0; i < babClasses2.length; i++) {
        babClasses2[i].innerHTML = bab2;
    }

    for (let i = 0; i < babClasses3.length; i++) {
        babClasses3[i].innerHTML = bab3;
    }

    for (let i = 0; i < babClasses4.length; i++) {
        babClasses4[i].innerHTML = bab4;
    }
}

function reloadSizemods() {
    const charsizemod = document.getElementById('charsize').value;
    let charsizemodspans = document.getElementsByClassName('charsizemod');
    for (let i = 0; i < charsizemodspans.length; i++) {
        charsizemodspans[i].innerHTML = charsizemod;
    }
    updatecharCA();
}

//////////////////////////////////////////// ROLLING BUTTONS  ///////////////////////

// ROLL AN ABILITY CHECK
function rollAbility(ability) {
    let txtcheck = '';
    if (ability === 'STR') { txtcheck = 'Fuerza' }
    if (ability === 'DEX') { txtcheck = 'Destreza' }
    if (ability === 'CON') { txtcheck = 'Constitucion' }
    if (ability === 'INT') { txtcheck = 'Inteligencia' }
    if (ability === 'WIS') { txtcheck = 'Sabiduria' }
    if (ability === 'CHA') { txtcheck = 'Carisma' }
    let name = txtcheck;  // Capitalize first letter
    let dice = "1d20";

    let typeStr = parseInt(document.getElementById(`MOD${ability}`).innerHTML) < 0 ? "-" : "+";

    let modifier = Math.abs(parseInt(document.getElementById(`MOD${ability}`).innerHTML));

    dice = dice + typeStr + modifier;

    TS.dice.putDiceInTray([{ name: name, roll: dice }], false);

}
/**** ROLL FOR INITIATIVE ****/
function rollIniciative() {
    let name = 'Iniciativa';
    let dice = "1d20";
    let modifier = parseInt(document.getElementById(`modinit`).value) + parseInt(document.getElementById(`MODDEX`).innerHTML);

    let typeStr = modifier < 0 ? "-" : "+";

    modifier = Math.abs(modifier);

    dice = dice + typeStr + modifier;

    TS.dice.putDiceInTray([{ name: name, roll: dice }], false);

}
// ROLL SAVING THROWS
function rollSaving(saving) {
    let txtcheck = '';
    if (saving === 'FOR') { txtcheck = 'Fortaleza' }
    if (saving === 'REF') { txtcheck = 'Reflejos' }
    if (saving === 'WIL') { txtcheck = 'Voluntad' }
    let name = txtcheck;  // Capitalize first letter
    let dice = "1d20";

    let modifier = parseInt(document.getElementById(`SAV${saving}`));

    let typeStr = modifier < 0 ? "-" : "+";

    modifier = Math.abs(modifier);

    dice = dice + typeStr + modifier;

    TS.dice.putDiceInTray([{ name: name, roll: dice }], false);

}
// ROLL TOUCH ATTACK MELEE OR RANGED
function rollTouch(touch) {
    let txtcheck = '';
    let modifier = 0;
    const sizemod = parseInt(document.getElementById(`charsize`).value);
    if (touch === 'M') {
        txtcheck = 'Melee touch attack';
        modifier = parseInt(document.getElementById(`bab1`).value) + parseInt(document.getElementById(`MODSTR`).innerHTML);
        const extramod = parseInt(document.getElementById('tamextramod').value);
        modifier = modifier + extramod;
    }
    if (touch === 'R') {
        txtcheck = 'Ranged touch attack';
        modifier = parseInt(document.getElementById(`bab1`).value) + parseInt(document.getElementById(`MODDEX`).innerHTML);
        const extramod = parseInt(document.getElementById('tarextramod').value);
        modifier = modifier + extramod;
    }
    let name = txtcheck;
    let dice = "1d20";

    modifier = modifier + sizemod;

    let typeStr = modifier < 0 ? "-" : "+";

    modifier = Math.abs(modifier);

    dice = dice + typeStr + modifier;

    TS.dice.putDiceInTray([{ name: name, roll: dice }], false);

}
// ROLL A SKILL
function rollSkill(skill) {

    let charmod = parseInt(document.getElementById(`${skill}_abilitymod`).innerHTML);
    let ranks = parseInt(document.getElementById(`${skill}_ranks`).value);
    let modextra1 = parseInt(document.getElementById(`${skill}_extra1`).value);
    let modextra2 = parseInt(document.getElementById(`${skill}_extra2`).value);
    let modextra3 = parseInt(document.getElementById(`${skill}_extra3`).value);

    let modifier = charmod + ranks + modextra1 + modextra2 + modextra3;

    let dice = "1d20";

    let typeStr = modifier < 0 ? "-" : "+";

    modifier = Math.abs(modifier);

    dice = dice + typeStr + modifier;

    TS.dice.putDiceInTray([{ name: skill, roll: dice }], false);

}
// ROLL ATTACK, SINGLE OR FULL ATTACK
function rollatk(isFullattack, weaponNumber) {

    let name = document.getElementById(`skill_${weaponNumber}_name`).value;
    let caratk = document.getElementById(`skill_${weaponNumber}_caratk`).value;
    let modtatk = parseInt(document.getElementById(`skill_${weaponNumber}_modtatk`).value);
    const bab1 = parseInt(document.getElementById(`bab1`).value);
    const sizemod = parseInt(document.getElementById(`charsize`).value);

    //let caratkval = parseInt(document.getElementById(`MOD${caratk}`).innerHTML);
    let caratkval = caratk === '0' ? 0 : parseInt(document.getElementById(`MOD${caratk}`).innerHTML);

    let modifier = modtatk + caratkval + bab1 + sizemod;
    let modifier2 = modifier - 5;
    let modifier3 = modifier - 10;
    let modifier4 = modifier - 15;

    const typeStr = modifier < 0 ? "-" : "+";
    const typeStr2 = modifier2 < 0 ? "-" : "+";
    const typeStr3 = modifier3 < 0 ? "-" : "+";
    const typeStr4 = modifier4 < 0 ? "-" : "+";

    modifier = Math.abs(modifier);
    modifier2 = Math.abs(modifier2);
    modifier3 = Math.abs(modifier3);
    modifier4 = Math.abs(modifier4);

    const dice = '1d20' + typeStr + modifier;
    const dice2 = '1d20' + typeStr2 + modifier2;
    const dice3 = '1d20' + typeStr3 + modifier3;
    const dice4 = '1d20' + typeStr4 + modifier4;

    const faname = '<style="Title"><color="red">' + name.toUpperCase() + '   FULL ATTACK </style>';
    name = name + " Attack";

    if (isFullattack === '1') {

        TS.dice.putDiceInTray([{ name: name + ' 1', roll: dice },
        { name: name + ' 2', roll: dice2 },
        { name: name + ' 3', roll: dice3 },
        { name: name + ' 4', roll: dice4 }], false);
    } else {
        TS.dice.putDiceInTray([{ name: name, roll: dice }], false);
    }
}


// ROLL DAMAGE
function rolldanho(isCritic, weaponNumber) {

    let name = document.getElementById(`skill_${weaponNumber}_name`).value;
    let dices = document.getElementById(`skill_${weaponNumber}_dicedanho`).value;
    let card = document.getElementById(`skill_${weaponNumber}_cardanho`).value;
    let modtd = parseInt(document.getElementById(`skill_${weaponNumber}_modtdanho`).value);

    //let caratkval = parseInt(document.getElementById(`MOD${card}`).innerHTML);
    let caratkval = card === '0' ? '0' : parseInt(document.getElementById(`MOD${card}`).innerHTML);

    let modifier = caratkval + modtd;

    let typeStr = modifier < 0 ? "-" : "+";

    modifier = Math.abs(modifier);

    const numberOfdices = dices.split('d')[0];
    const diceType = dices.split('d')[1];

    let isQuietroll = false;

    let isd2 = false;
    if (diceType === '2') {
        isQuietroll = true;
        isd2 = true;
        dices = numberOfdices + 'd4';
    }

    let isd3 = false;
    if (diceType === '3') {
        isQuietroll = true;
        isd3 = true;
        dices = numberOfdices + 'd6';
    }

    let dice = dices + typeStr + modifier;

    // name = name + " Damage ";

    if (isCritic === '1') {

        name = 'Critical ' + name;
        const critMultiplier = parseInt(document.getElementById('crt-multiplier' + weaponNumber).value);
        const critDices = dices.split('d');
        const critDicesnumber = critMultiplier * parseInt(critDices[0]);
        const rollDice = critDicesnumber + 'd' + critDices[1];
        const critModifier = critMultiplier * modifier;
        const roll = rollDice + typeStr + critModifier;

        TS.dice.putDiceInTray([{ name: name, roll: roll }], isQuietroll).then((diceSetResponse) => {
            if (isd2) { trackedIds[diceSetResponse] = 'isCritical_isd2' } else {
                if (isd3) { trackedIds[diceSetResponse] = 'isCritical_isd3' }
            }
        });

        //rollcritic(name, dice, weaponNumber);

    } else {

        TS.dice.putDiceInTray([{ name: name, roll: dice }], isQuietroll).then((diceSetResponse) => {
            if (isd2) { trackedIds[diceSetResponse] = 'isd2' } else {
                if (isd3) { trackedIds[diceSetResponse] = 'isd3' }
            }
        });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////  WEAPONS 

const textarea_wpns = document.getElementsByClassName('weapons-txtarea');
for (var i = 0; i < textarea_wpns.length; i++) {
    textarea_wpns[i].addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    textarea_wpns[i].addEventListener('click', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////INVENTORY TEXTAREA 

const textarea_inv = document.getElementById('inventario-textarea');

textarea_inv.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});
textarea_inv.addEventListener('click', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

///////////////////////////////////////////////////////////////////////////////////////////////////////// GENERIC

const textarea_gen = document.getElementById('abilities-text');

textarea_gen.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

textarea_gen.addEventListener('click', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

///////////////////////////////////////////////////////////////////////////////////////////////////////// BIO TEXAREA 

const bio_txtarea = document.getElementById('bio_txtarea');

bio_txtarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});
bio_txtarea.addEventListener('click', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

const others_txtarea = document.getElementById('others_txtarea');

others_txtarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});
others_txtarea.addEventListener('click', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

///////////////////////////////// Botones colapsables

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}


/////////////////////////////////////////////////////////////// SPELLS //////////////////////////////////////////////////////

//ADD A SPELL WITH THE BUTTON
function addSpell(type, lvl) {

    //Calcular CD
    let car = document.getElementById(type + '_car').value;
    let car_mod = parseInt(document.getElementById('MOD' + car).innerHTML);
    let cdvalue = 10 + parseInt(lvl) + 0 + car_mod;

    let spellDetails = { nombre: 'Nuevo conjuro', usados: '0', preparados: '0', cd: cdvalue, modcd: '0', descrp: 'Descripcion conjuro / CD = 10 + nivel conjuro + caracteristica + modificador extra', macro: 'Ataque con fuerza:1d20_STR, Danho:1d20_STR+5' };
    let rndid = generateRandomID();

    let row = `<tr>
    <td style="width: 120px;"><input onchange="updateSpellstorage('${rndid}')" style="width: 120px;" value="${spellDetails.nombre}"></td> 
    <td style="width: 30px;"><input onchange="updateSpellstorage('${rndid}')" type="number" style="width: 30px;" value="${spellDetails.usados}"></td>
    <td style="width: 30px;"><input onchange="updateSpellstorage('${rndid}')" type="number" style="width: 30px;" value="${spellDetails.preparados}"></td>
    <td style="text-align: center; width: 30px;"><span style="width: 30px;">${spellDetails.cd}</span></td>
    <td style="width: 30px;"><input onchange="updateSpellstorage('${rndid}')" type="number" style="width: 30px;" value="${spellDetails.modcd}"></td>
    <td style="flex-grow: 1;"><textarea spellcheck="false" class="spell-description" onchange="updateSpellstorage('${rndid}')" style="flex-grow: 1;">${spellDetails.descrp}</textarea></td>
    <td><button onclick="deletethisrow('${rndid}')" style="background-color: red; width: 30px; height: 30px;">X</button></td>
  </tr>`;

    let rowMacro = `<tr>
    <td colspan="6"><textarea spellcheck="false" id='${rndid}-macro-textarea' style="width: 450px" onchange="updateSpellstorage('${rndid}')">${spellDetails.macro}</textarea></td>  
    <td><button onclick="runMacro('${rndid}-macro-textarea')">Run</button></td>      
    </tr>`;

    // ADD ROW TO TABLE 
    let newRow = document.createElement('tr');
    newRow.id = rndid;
    newRow.innerHTML = row;

    let newRowmacro = document.createElement('tr');
    newRowmacro.id = rndid + '-macro';
    newRowmacro.innerHTML = rowMacro;

    document.getElementById(`${type}_lvl_${lvl}`).appendChild(newRow);
    document.getElementById(`${type}_lvl_${lvl}`).appendChild(newRowmacro);

    // SAVE TO LOCALSTORAGE 
    let lvlindex = 'lvl' + lvl;
    TS.localStorage.campaign.getBlob().then((storedData) => {
        let data = JSON.parse(storedData || "{}");
        data.spelltype[type][lvlindex][rndid] = spellDetails;

        TS.localStorage.campaign.setBlob(JSON.stringify(data));
    });
}

// Reload all spell list from file
function reloadSpellist() {

    let types = ['divine', 'arcane'];

    for (let type of types) {

        for (let i = 0; i < 10; i++) {

            let table = document.getElementById(type + '_lvl_' + i); //divine_lvl2

            for (let i = table.rows.length - 1; i >= 2; i--) {
                table.deleteRow(i);
            }
        }
    }

    TS.localStorage.campaign.getBlob().then((storedData) => {
        let data = JSON.parse(storedData || "{}");
        let spelltype = data.spelltype;

        if (typeof data.spelltype !== 'undefined') {

            for (let type of types) {

                // Iterate over each spell level in the 'divine' and 'arcane' category
                for (let lvl in spelltype[type]) {

                    // Iterate over each spell in the current level
                    for (let spell in spelltype[type][lvl]) {
                        //let rndid = generateRandomID();
                        let spellDetails = spelltype[type][lvl][spell];

                        //Calcular CD 
                        let car = document.getElementById(type + '_car').value;
                        let car_mod = parseInt(document.getElementById('MOD' + car).innerHTML);
                        let cdvalue = 10 + parseInt(lvl.slice(3)) + parseInt(spellDetails.modcd) + car_mod;
                        spellDetails.cd = cdvalue;
                        // Create a new table row and populate it with the spell details
                        let row = `<tr>
          <td style="width: 120px;"><input onchange="updateSpellstorage('${spell}')" style="width: 120px;" value="${spellDetails.nombre}"></td>
          <td style="width: 30px;"><input onchange="updateSpellstorage('${spell}')" type="number" style="width: 30px;" value="${spellDetails.usados}"></td>
          <td style="width: 30px;"><input onchange="updateSpellstorage('${spell}')" type="number" style="width: 30px;" value="${spellDetails.preparados}"></td> 
          <td style="text-align: center; width: 30px;"><span style="width: 30px;">${spellDetails.cd}</span></td>
          <td style="width: 30px;"><input onchange="updateSpellstorage('${spell}')" type="number" style="width: 30px;" value="${spellDetails.modcd}"></td>
          <td style="flex-grow: 1;"><textarea spellcheck="false" onchange="updateSpellstorage('${spell}')" style="flex-grow: 1;">${spellDetails.descrp}</textarea></td>
          <td><button onclick="deletethisrow('${spell}')" style="background-color: red; width: 30px; height: 30px;">X</button></td>
        </tr>`;

                        let rowmacro = `<tr> 
        <td colspan="6" ><textarea spellcheck="false" id='${spell}-macro-textarea' style="width: 450px" onchange="updateSpellstorage('${spell}')">${spellDetails.macro}</textarea></td>
        <td><button onclick="runMacro('${spell}-macro-textarea')">Run</button></td>
        </tr>`;

                        // Append the new row to the table 

                        let newRow = document.createElement('tr');
                        newRow.id = spell;
                        newRow.innerHTML = row;

                        let newRowmacro = document.createElement('tr');
                        newRowmacro.id = spell + '-macro';
                        newRowmacro.innerHTML = rowmacro;

                        lvlnumber = lvl.slice(3);

                        document.getElementById(`${type}_lvl_${lvlnumber}`).appendChild(newRow);
                        document.getElementById(`${type}_lvl_${lvlnumber}`).appendChild(newRowmacro);

                    }
                }
            }
        }
    });
}

//Funcion para generar un id random de 10 caracteres
function generateRandomID() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Funcion para borrar fila  de spell o cualquier tabla dependiendo de la id de la fila (row) 
function deletethisrow(rowid) {

    let spellrow = document.getElementById(rowid);
    type_lvl = spellrow.parentNode.id; // ex: divine_lvl_0
    let idParts = type_lvl.split("_");
    let lvlindex = idParts[1] + idParts[2];

    TS.localStorage.campaign.getBlob().then((storedData) => {
        data = JSON.parse(storedData || "{}");
        delete data.spelltype[idParts[0]][lvlindex][rowid]
        TS.localStorage.campaign.setBlob(JSON.stringify(data));
    })

    document.getElementById(rowid).remove();
    document.getElementById(rowid + '-macro').remove();

}

// Store spell data in localstorage when any field is edited
function updateSpellstorage(rowid) {

    let spellrow = document.getElementById(rowid);

    type_lvl = spellrow.parentNode.id; // ex: divine_lvl_0

    let idParts = type_lvl.split("_");
    let lvlindex = idParts[1] + idParts[2];

    let nombre = spellrow.cells[0].childNodes[0].value; //name
    let usados = spellrow.cells[1].childNodes[0].value; //usados
    let preparados = spellrow.cells[2].childNodes[0].value; //preparados
    let modcd = spellrow.cells[4].childNodes[0].value; //modcd
    let descrp = spellrow.cells[5].childNodes[0].value; //descripcion

    let car = document.getElementById(idParts[0] + '_car').value;
    let car_mod = parseInt(document.getElementById('MOD' + car).innerHTML);

    let cdvalue = 10 + parseInt(idParts[2]) + parseInt(modcd) + car_mod;

    spellrow.cells[3].childNodes[0].innerHTML = cdvalue;

    //Macro row
    let macroTextarea = document.getElementById(rowid + '-macro-textarea').value;

    TS.localStorage.campaign.getBlob().then((storedData) => {
        data = JSON.parse(storedData || "{}");

        data.spelltype[idParts[0]][lvlindex][rowid] = {
            nombre: nombre,
            usados: usados,
            preparados: preparados,
            cd: cdvalue,
            modcd: modcd,
            descrp: descrp,
            macro: macroTextarea
        };
        TS.localStorage.campaign.setBlob(JSON.stringify(data));
    });
}

//Function to run spell macros 
function runMacro(rndidmacro) {

    let input = document.getElementById(rndidmacro).value;
    //input = input.trim();
    //let regex = /\s+/g;
    const regex = /[\n\r]/g;
    input = input.replace(regex, "");

    //VALIDATE CHARACTERS
    if (!isValidInput(input)) {
        TS.chat.send('Invalid input', 'campaign');
        return;
    }

    //CONVERT CONSTANT TO VALUES
    let DAM = document.getElementById('divine_car').value;
    let DAM1 = document.getElementById('divine_carml1').value;
    let DAM2 = document.getElementById('divine_carml2').value;
    let DAM3 = document.getElementById('divine_carml3').value;
    let AAM = document.getElementById('arcane_car').value;
    let AAM1 = document.getElementById('arcane_carml1').value;
    let AAM2 = document.getElementById('arcane_carml2').value;
    let AAM3 = document.getElementById('arcane_carml3').value;

    let validConstant = {
        'STR': parseInt(document.getElementById('MODSTR').innerHTML),
        'DEX': parseInt(document.getElementById('MODDEX').innerHTML),
        'CON': parseInt(document.getElementById('MODCON').innerHTML),
        'INT': parseInt(document.getElementById('MODINT').innerHTML),
        'WIS': parseInt(document.getElementById('MODWIS').innerHTML),
        'CHA': parseInt(document.getElementById('MODCHA').innerHTML),
        'ACL': parseInt(document.getElementById('arcane_casterlvl').value),
        'ACL1': parseInt(document.getElementById('arcane_mcasterlvl1').value),
        'ACL2': parseInt(document.getElementById('arcane_mcasterlvl2').value),
        'ACL3': parseInt(document.getElementById('arcane_mcasterlvl3').value),
        'AAM': parseInt(document.getElementById('MOD' + AAM).innerHTML),
        'AAM1': parseInt(document.getElementById('MOD' + AAM1).innerHTML),
        'AAM2': parseInt(document.getElementById('MOD' + AAM2).innerHTML),
        'AAM3': parseInt(document.getElementById('MOD' + AAM3).innerHTML),
        'DCL': parseInt(document.getElementById('divine_casterlvl').value),
        'DCL1': parseInt(document.getElementById('divine_mcasterlvl1').value),
        'DCL2': parseInt(document.getElementById('divine_mcasterlvl2').value),
        'DCL3': parseInt(document.getElementById('divine_mcasterlvl3').value),
        'DAM': parseInt(document.getElementById('MOD' + DAM).innerHTML),
        'DAM1': parseInt(document.getElementById('MOD' + DAM1).innerHTML),
        'DAM2': parseInt(document.getElementById('MOD' + DAM2).innerHTML),
        'DAM3': parseInt(document.getElementById('MOD' + DAM3).innerHTML),
        'BAB1': parseInt(document.getElementById('bab1').value),
        'BAB2': parseInt(document.getElementById('bab2').innerHTML),
        'BAB3': parseInt(document.getElementById('bab3').innerHTML),
        'BAB4': parseInt(document.getElementById('bab4').innerHTML),
        'FORM': parseInt(document.getElementById('SAVFOR').innerHTML),
        'REFM': parseInt(document.getElementById('SAVREF').innerHTML),
        'WILM': parseInt(document.getElementById('SAVWIL').innerHTML)
    };
    //Replaces Variables with numbers
    input = parseExpression(input, validConstant);

    //Set the input with limits [a|b] -> a<b => a, a>b=>b. Ej: 5|6 + 6|5 - 5|5 returns 5+5-5
    input = proccessLimiter(input);

    //CHECK IF THE ROLL SHOULD BE HIDDEN AND SHOW ONLY RESULTS
    const isHidden = input.includes('hidden:') ? true : false;
    input = isHidden ? input.replace("hidden:", "") : input;

    //START PARSING AND EVALUATION
    let totalmod = [];
    let result = [];
    let userComments = [];
    let fakeDice = false;
    let customDices = [];
    let entries = input.split(',');
    // PROCCESS EACH MACRO SPEARATED BY COMMA
    for (let i = 0; i < entries.length; i++) {
        let parts = entries[i].split(':');
        // if this is a part @:helloworld 
        if (parts[0].includes('@')) {
            userComments.push(parts[1]);
            continue;
        }
        // if this is a part something:NdM+n
        let name = parts[0];
        let dice = '';
        let mod = '';

        if (parts[1].includes('_')) {

            let rollParts = parts[1].split('_');
            dice = rollParts[0];
            mod = rollParts[1];
        } else {
            dice = parts[1];
            if (dice.includes('+') || dice.includes('-')) {
                TS.chat.send('error, use _ after dice for the first modifier <br> instead of + or -', 'campaign');
                return;
            }
        }

        let dices = dice.split('d');
        let numberOfdices;
        ///evaluate number of dices to roll
        try {
            numberOfdices = mexp.eval(dices[0]);
        } catch (error) {
            TS.chat.send('error in number of dices', 'campaign');
            return;
        }

        //Validate type of dice
        let typeOfdices = dices[1];
        if (!['2', '3', '4', '6', '8', '10', '12', '20', '100'].includes(typeOfdices)) {

            TS.chat.send('error in type of dice', 'campaign');
            return;
        }

        dice = numberOfdices + 'd' + typeOfdices;

        if (typeOfdices === '2' || typeOfdices === '3') {
            fakeDice = true;
            let fakemod = mod === '' ? '0' : mod;
            fakemod = mexp.eval(fakemod);
            let modsign = fakemod > 0 ? '+' : '-';
            customDices.push(name + '^' + dice + '_' + modsign + ':' + Math.abs(fakemod));
            continue;
        }

        if (mod === '') {
            result.push({ name: name, roll: dice });
        } else {
            // Evaluate the expression for mod
            try {
                totalmod[i] = mexp.eval(mod);
            } catch (error) {
                TS.chat.send('error in modifier', 'campaign');
                return;
            }
            let modsign = totalmod[i] > 0 ? '+' : '-';
            result.push({ name: name, roll: dice + modsign + Math.abs(totalmod[i]) });
        }
    }

    if (result.length > 0) {
        TS.dice.putDiceInTray(result, isHidden).then((diceSetResponse) => {
            trackedIds[diceSetResponse] = isHidden ? 'isHidden_isMacro' : 'isMacro';
            trackedIds[diceSetResponse + '-comments'] = userComments;
            trackedIds[diceSetResponse + '-fakedice'] = fakeDice ? customDices : '';//Save an array of d2 and d3 
            //trackedIds[diceSetResponse] = 'isHidden'; // Save the id of the rolls        
        });
    } else {
        macroCustomdice(customDices, false);
    }

}

// PARSE USER CONSTANTS
function parseExpression(expression, validConstant) {
    let parsedExpression = expression;
    for (let key in validConstant) {
        let value = validConstant[key];
        let regex = new RegExp(key, 'g');
        parsedExpression = parsedExpression.replace(regex, value);
    }
    return parsedExpression;
}

// PARSE USER LIMITERS, [a|b] -> a<b => a, a>b=>b 
function proccessLimiter(str) {

    result = str.replace(/\[(\d+)\|(\d+)\]/g, function (_, num1, num2) {
        return Math.min(num1, num2);
    });

    return result;
}

//Validar input de macro
function isValidInput(input) {

    // Define the allowed characters in the input
    let allowedChars = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789_:+-*/,()|[]@ ';
    // Split the input into an array of characters
    let inputArray = input.split('');
    // Check if every character in the input is allowed
    return inputArray.every(char => allowedChars.includes(char));
}

function macroCustomdice(customDices, withNormalDice) {
    let cDmsg = '';
    for (let dices of customDices) {

        let name = dices.split('^')[0];
        dices = dices.split('^')[1];

        let dice = dices.split('_')[0];
        let mod = dices.split('_')[1];
        let modsign = mod.split(':')[0];
        let modval = mod.split(':')[1];
        let nOfdices = dice.split('d')[0]; //number of dices
        let tOfdices = dice.split('d')[1]; //type of dices

        if (tOfdices === '2' || tOfdices === '3') {
            let eachDiceResult = [];
            for (let i = 0; i < nOfdices; i++) {
                eachDiceResult.push(Math.floor(Math.random() * parseInt(tOfdices)) + 1);
            }
            let diceSum = eachDiceResult.join('+');
            diceSum = diceSum + modsign + modval;
            let result = mexp.eval(diceSum);

            cDmsg = cDmsg + `<color="red">${name}, ${nOfdices}d${tOfdices} ${modsign} ${modval}: <color="green">${diceSum} = <color="white">${result}<br>`

        }
    }

    if (withNormalDice) {
        return cDmsg;
    } else {
        splitMessageAndSend(cDmsg);

    }
}

function splitMessageAndSend(msg) {

    // Split the string into an array of lines
    let lines = msg.split('<br>');
    let linesArray = [];
    // Loop through the array of lines
    for (let i = 0; i < lines.length; i += 4) {
        // Get a slice of the array containing 4 lines and join them into a string
        let element = lines.slice(i, i + 4).join('<br>') + '<br>';

        // Add an additional <br> tag if it's not the last element
        //if (i + 4 < lines.length) {
        //    element += '<br>';
        //}
        linesArray.push(element);
    }
    for (let fourLines of linesArray) {
        TS.chat.send(fourLines, "campaign");
    }

}


// EVALUTE ROLLS RESULTS BASED ON THE trackedIds object
async function handleRollResult(rollEvent) {

    let roll = rollEvent.payload;

    if (trackedIds[roll.rollId] == undefined) {
        //if we haven't tracked that roll, ignore it because it's not from us
        return;
    }
    if (rollEvent.kind == "rollResults") {        //user rolled the dice we tracked and there's a new result for us to look at

        const idCustom = trackedIds[roll.rollId]; // String containing a custom id like 'isd3' 'isCritical'

        //const multiplier = parseInt(document.getElementById('crt-multiplier'+ rndidmacro).value);  trackedIds[diceSetResponse] = 'isd3';
        let msg = '';
        if (idCustom.includes('isMacro')) {
            
            let promises = [];
            let userComments = trackedIds[roll.rollId + '-comments'];
            let customDices = trackedIds[roll.rollId + '-fakedice'];
            let isFakeRoll = false;
            let cDmsg = '';

            //Eval custom dices -- customDices.push(dice + '_' + modsign + ':' + Math.abs(fakemod)); --
            ///1d2_-:1,1d2_+:5            
            // If a custom dice is rolled (1d2 or 1d3)
            if (customDices !== '') {
                cDmsg = macroCustomdice(customDices, true);
                isFakeRoll = true;
            }

            //Get standard dices
            for (let group of rollEvent.payload.resultsGroups) {
                let promise = TS.dice.evaluateDiceResultsGroup(group).then((value) => {
                    msg = msg + '<color="red">' + group.name + ': <color="green">' + value + '<br>';
                });
                promises.push(promise);
            }

            Promise.all(promises).then(() => {
                msg = isFakeRoll ? msg + cDmsg : msg;
                msg = msg + userComments.join('<br>');

                //Divide message to get around the 400 chars limit, dividing the message if there are more than 4 lines in the msg.
                splitMessageAndSend(msg);

            });
        }

        /* if (idCustom.includes('isCritical')) {
            let name = rollEvent.payload.resultsGroups[0].name;
            msg = '<align="center"><style="Title"><color="red">' + name + '</style><br>';

        } */

        if (idCustom.includes('isd3')) {

            for (let group of rollEvent.payload.resultsGroups) {

                const diceResults = group.result.operands[0].results; //array with the dices result
                const mod = group.result.operands[1].value;

                let results = [];
                for (let result of diceResults) {
                    let d3Conversion = Math.round(result / 2);
                    results.push(d3Conversion);
                    //msg = msg  + ` - 1d6 = ${result} >>> 1d3 = ${d3Conversion} - ` ;
                }

                let rollGroup = [{ "name": group.name + '<br>(convertido a d3)', "result": { "operator": "+", "operands": [{ "kind": "d6", "results": results }, { "value": mod }] } }]
                //msg = '<align="center"><color="red">El resultado del d6 se convirtio en d3 <br>[ 1,2 = 1 ] - [ 3,4 = 2 ] - [ 5,6 = 3 ]<br>';
                TS.dice.sendDiceResult(rollGroup, roll.rollId);
            }
            //TS.chat.send(msg, 'campaign');
        }

        if (idCustom.includes('isd2')) {

            for (let group of rollEvent.payload.resultsGroups) {

                const diceResults = group.result.operands[0].results; //array with the dices result
                const mod = group.result.operands[1].value;

                let results = [];
                for (let result of diceResults) {
                    let d2Conversion = Math.round(result / 2);
                    results.push(d2Conversion);
                    //msg = msg  + ` - 1d4 = ${result} >>> 1d2 = ${d2Conversion} - ` ;
                }

                let rollGroup = [{ "name": group.name + '<br>(convertido a d2)', "result": { "operator": "+", "operands": [{ "kind": "d4", "results": results }, { "value": mod }] } }]
                //msg = '<align="center"><color="red">El resultado del d4 se convirtio en d2 <br>[ 1,2 = 1 ] - [ 3,4 = 2 ] <br>';
                TS.dice.sendDiceResult(rollGroup, roll.rollId);
            }
            //TS.chat.send(msg, 'campaign');
        }
    }
    console.log(trackedIds)
    trackedIds = {};
    console.log(trackedIds)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////// INVENTARIO //////////////////////////////////////////////////////

//ADD AN ITEM WITH THE BUTTON
function addInventoryItem() {

    let itemDetails = { item: 'nombre', cantidad: '0', pesoxunidad: '0', pesototal: '0', detalles: 'detalles' };
    let rndid = generateRandomID();

    let row = `<tr>
    <td style="width: 200px; font-size:14px;"><input type="text" onchange="updateInventory('${rndid}');" value="${itemDetails.item}"></td>
    <td style="width: 30px;  font-size:14px;"><input type="number" onchange="updateInventory('${rndid}');" value="${itemDetails.cantidad}"></td>
    <td style="width: 30px;  font-size:14px;"><input type="number" onchange="updateInventory('${rndid}');" value="${itemDetails.pesoxunidad}"></td>
    <td style="width: 30px;  font-size:16px; text-align: center;"><span id="pesototal-${rndid}">${itemDetails.pesototal}</span></td>
    <td style="width: 200px; font-size:14px;"><textarea spellcheck="false" onchange="updateInventory('${rndid}');" >${itemDetails.detalles}</textarea></td>
    <td><button onclick="deletethisitemrow('${rndid}')" style="background-color: red; width: 30px; height: 30px;">X</button></td>
  </tr>`
    // ADD ROW TO TABLE
    let newRow = document.createElement('tr');
    newRow.id = rndid;
    newRow.innerHTML = row;
    document.getElementById(`inventory-table`).appendChild(newRow);

    // SAVE TO LOCALSTORAGE 
    TS.localStorage.campaign.getBlob().then((storedData) => {
        let data = JSON.parse(storedData || "{}");
        data.inventory[rndid] = itemDetails;

        TS.localStorage.campaign.setBlob(JSON.stringify(data));
    });
}

// Delete item from inventory
function deletethisitemrow(rowid) {

    TS.localStorage.campaign.getBlob().then((storedData) => {
        data = JSON.parse(storedData || "{}");
        delete data.inventory[rowid];

        let Totalweight = 0.00;
        for (const item in data.inventory) {
            Totalweight += parseFloat(data.inventory[item].pesototal);
        }

        coinsPc = parseFloat((0.02) * document.getElementById('pc').value);
        coinsPp = parseFloat((0.02) * document.getElementById('pp').value);
        coinsPo = parseFloat((0.02) * document.getElementById('po').value);
        coinsPpt = parseFloat((0.02) * document.getElementById('ppt').value);

        Totalweight = Totalweight + coinsPc + coinsPp + coinsPo + coinsPpt;

        document.getElementById('Totalweight').innerHTML = ' ' + Totalweight.toFixed(2);

        TS.localStorage.campaign.setBlob(JSON.stringify(data));
    })

    document.getElementById(rowid).remove();
}

// Update inventory when editing input field
function updateInventory(rowid) {

    let itemrow = document.getElementById(rowid);

    let itemDetails = {};

    itemDetails.item = itemrow.cells[0].childNodes[0].value;
    itemDetails.cantidad = itemrow.cells[1].childNodes[0].value;
    itemDetails.pesoxunidad = itemrow.cells[2].childNodes[0].value;
    itemDetails.pesototal = parseFloat(itemDetails.cantidad * itemDetails.pesoxunidad).toFixed(2);
    itemDetails.detalles = itemrow.cells[4].childNodes[0].value;

    document.getElementById(`pesototal-${rowid}`).innerHTML = itemDetails.pesototal;


    TS.localStorage.campaign.getBlob().then((storedData) => {
        data = JSON.parse(storedData || "{}");

        data.inventory[rowid] = itemDetails;

        let Totalweight = 0.00;
        for (const item in data.inventory) {
            Totalweight += parseFloat(data.inventory[item].pesototal);
        }

        coinsPc = parseFloat((0.02) * document.getElementById('pc').value);
        coinsPp = parseFloat((0.02) * document.getElementById('pp').value);
        coinsPo = parseFloat((0.02) * document.getElementById('po').value);
        coinsPpt = parseFloat((0.02) * document.getElementById('ppt').value);

        Totalweight = Totalweight + coinsPc + coinsPp + coinsPo + coinsPpt;

        document.getElementById('Totalweight').innerHTML = ' ' + Totalweight.toFixed(2);

        TS.localStorage.campaign.setBlob(JSON.stringify(data));
    });
}

function updateCoin() {
    TS.localStorage.campaign.getBlob().then((storedData) => {
        data = JSON.parse(storedData || "{}");

        let Totalweight = 0.00;
        for (const item in data.inventory) {
            Totalweight += parseFloat(data.inventory[item].pesototal);
        }

        coinsPc = parseFloat((0.02) * document.getElementById('pc').value);
        coinsPp = parseFloat((0.02) * document.getElementById('pp').value);
        coinsPo = parseFloat((0.02) * document.getElementById('po').value);
        coinsPpt = parseFloat((0.02) * document.getElementById('ppt').value);

        Totalweight = Totalweight + coinsPc + coinsPp + coinsPo + coinsPpt;

        document.getElementById('Totalweight').innerHTML = ' ' + Totalweight.toFixed(2);

        TS.localStorage.campaign.setBlob(JSON.stringify(data));
    });
}

// Reload all inventory items from file
function reloadInventory() {

    let table = document.getElementById('inventory-table');
    for (let i = table.rows.length - 1; i >= 1; i--) {
        table.deleteRow(i);
    }

    TS.localStorage.campaign.getBlob().then((storedData) => {
        let data = JSON.parse(storedData || "{}");
        let inventory = data.inventory;

        if (typeof data.inventory !== 'undefined') {

            for (let item in inventory) {

                let itemDetails = inventory[item];

                let row = `<tr>
            <td style="width: 200px; font-size:14px;"><input type="text" onchange="updateInventory('${item}');" value="${itemDetails.item}"></td>
            <td style="width: 30px;  font-size:14px;"><input type="number" onchange="updateInventory('${item}');" value="${itemDetails.cantidad}"></td>
            <td style="width: 30px;  font-size:14px;"><input type="number" onchange="updateInventory('${item}');" value="${itemDetails.pesoxunidad}"></td>
            <td style="width: 30px;  font-size:16px text-align: center;"><span id="pesototal-${item}">${itemDetails.pesototal}</span></td>
            <td style="width: 200px; font-size:14px;"><textarea spellcheck="false" onchange="updateInventory('${item}');" >${itemDetails.detalles}</textarea></td>
            <td><button onclick="deletethisitemrow('${item}')" style="background-color: red; width: 30px; height: 30px;">X</button></td>
          </tr>`

                // Append the new row to the table 
                let newRow = document.createElement('tr');
                newRow.id = item;
                newRow.innerHTML = row;

                document.getElementById('inventory-table').appendChild(newRow);

            }

            let Totalweight = 0.00;
            for (const item in data.inventory) {
                Totalweight += parseFloat(data.inventory[item].pesototal);

            }

            coinsPc = parseFloat((0.02) * document.getElementById('pc').value);
            coinsPp = parseFloat((0.02) * document.getElementById('pp').value);
            coinsPo = parseFloat((0.02) * document.getElementById('po').value);
            coinsPpt = parseFloat((0.02) * document.getElementById('ppt').value);

            Totalweight = Totalweight + coinsPc + coinsPp + coinsPo + coinsPpt;

            document.getElementById('Totalweight').innerHTML = ' ' + Totalweight.toFixed(2);
        }
    });
}
///////////////////////////////////////////////////// MACROS TAB /////////////////////////////////////////

// AGREGAR  MACRO
function addnewMacro() {

    let rndid = generateRandomID();

    let macro = 'roll:1d20_INT+1';

    TS.localStorage.campaign.getBlob().then((storedData) => {
        data = JSON.parse(storedData || "{}");

        data.macros[rndid] = macro;

        TS.localStorage.campaign.setBlob(JSON.stringify(data)).then(() => {
            loadMacros();
        });
    });
}

// CARGAR MACROS DESDE MEMORIA
function loadMacros() {

    document.getElementById('macrotablesdiv').innerHTML = '';

    TS.localStorage.campaign.getBlob().then((storedData) => {
        data = JSON.parse(storedData || "{}");

        let macros = data.macros;

        for (let macroid in macros) {

            let macroTxt = macros[macroid];

            let newMacrotable = `
            <table">
        <tbody>
        <tr>
            <td><button onclick="runMacro('${macroid}-macro-textarea')">Run Macro</button></td> 
            <td><textarea spellcheck="false" id='${macroid}-macro-textarea' style="width: 350px;" onchange="updateMacrostorage('${macroid}')">${macroTxt}</textarea></td>  
            <td rowspan="2"><button style="background-color:red;" onclick="deleteMacrotable('${macroid}-macro');" ><b>x</b></button></td>
        </tr>
        </tbody>
        </table>
            `
            let newTablemacro = document.createElement('table');

            newTablemacro.id = macroid + '-macro';
            newTablemacro.style.border = '1px solid white';
            newTablemacro.style.margin = '1em';
            newTablemacro.innerHTML = newMacrotable;

            document.getElementById('macrotablesdiv').appendChild(newTablemacro);
        }
    });
}
// BORRAR TABLAS
function deleteMacrotable(tableid) {

    let macroid = tableid.split('-');
    macroid = macroid[0];

    let tbl = document.getElementById(tableid);
    if (tbl) tbl.parentNode.removeChild(tbl);

    TS.localStorage.campaign.getBlob().then((storedData) => {
        data = JSON.parse(storedData || "{}");
        delete data.macros[macroid];

        TS.localStorage.campaign.setBlob(JSON.stringify(data));
    });
}

// GUARDAR AL EDITAR 
function updateMacrostorage(macroid) {

    TS.localStorage.campaign.getBlob().then((storedData) => {
        data = JSON.parse(storedData || "{}");

        data.macros[macroid] = document.getElementById(`${macroid}-macro-textarea`).value;

        TS.localStorage.campaign.setBlob(JSON.stringify(data));
    });
}
/*      <tr>
            <td style="text-align: center;"><button onclick="validateMacro('${macroid}-macro')">Validar</button></td>
            <td style="background-color: white;text-align: center;"><span id="${macroid}-macro-validation" style="color:black">OK</span></td>
        </tr>
*/

/////////////////////////////////////////////////////////////////////////////////////////////////
function initCustomobjects() {

    TS.localStorage.campaign.getBlob().then((storedData) => {
        let data = JSON.parse(storedData || "{}");

        //Initialize Inventory object
        if (typeof data.inventory === 'undefined') {

            let inventory = {};

            data['inventory'] = inventory;

            TS.localStorage.campaign.setBlob(JSON.stringify(data));
            console.log('Inventory object created');
        } else {
            console.log('Inventory object already exists');
        }

        //Initialize Macros object
        if (typeof data.macros === 'undefined') {

            let macros = {};

            data['macros'] = macros;

            TS.localStorage.campaign.setBlob(JSON.stringify(data));
            console.log('macros object created');
        } else {
            console.log('macros object already exists');
        }

        //Initialize Spell object
        if (typeof data.spelltype === 'undefined') {

            let spelltype = {
                arcane: {
                    lvl0: {},
                    lvl1: {},
                    lvl2: {},
                    lvl3: {},
                    lvl4: {},
                    lvl5: {},
                    lvl6: {},
                    lvl7: {},
                    lvl8: {},
                    lvl9: {}
                },
                divine: {
                    lvl0: {},
                    lvl1: {},
                    lvl2: {},
                    lvl3: {},
                    lvl4: {},
                    lvl5: {},
                    lvl6: {},
                    lvl7: {},
                    lvl8: {},
                    lvl9: {}
                }
            }

            data['spelltype'] = spelltype;
            // Store updated data with the new row  
            TS.localStorage.campaign.setBlob(JSON.stringify(data));
            console.log('Spells object created');
        } else {
            console.log('Spells object already exists');
        }
    });
}


/* 

var skills = {
    "Abrir_cerraduras": "DEX",
    "Artesania": "INT",
    "Averiguar_intenciones": "WIS",
    "Avistar": "WIS",
    "Buscar": "INT",
    "Concentracion": "CON",
    "Conocimiento_de_conjuros": "INT",
    "Descifrar_escritura": "INT",
    "Diplomacia": "CHA",
    "Disfrazarse": "CHA",
    "Enganar": "CHA",
    "Equilibrio": "DEX",
    "Escapismo": "DEX",
    "Esconderse": "DEX",
    "Escuchar": "WIS",
    "Falsificar": "INT",
    "Interpretar": "CHA",
    "Intimidar": "CHA",
    "Inutilizar_mecanismo": "INT",
    "Juego_de_manos": "DEX",
    "Montar": "DEX",
    "Moverse_sigilosamente": "DEX",
    "Nadar": "STR",
    "Oficio": "WIS",
    "Piruetas": "DEX",
    "Reunir_informacion": "CHA",
    "Saber_arcano": "INT",
    "Saber_arq_ing": "INT",
    "Saber_dungeons": "INT",
    "Saber_geografia": "INT",
    "Saber_historia": "INT",
    "Saber_local": "INT",
    "Saber_planos": "INT",
    "Saber_naturaleza": "INT",
    "Saber_nobleza": "INT",
    "Saber_religion": "INT",
    "Saltar": "STR",
    "Sanar": "WIS",
    "Supervivencia": "WIS",
    "Tasacion": "INT",
    "Trato_con_animales": "CHA",
    "Trepar": "STR",
    "Usar_objeto_magico": "CHA",
    "Uso_de_cuerdas": "DEX"
};

*/