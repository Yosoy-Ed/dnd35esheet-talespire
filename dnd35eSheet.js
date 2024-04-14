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
        if (Object.entries(data).length > 0) {
            clearStorageButton.classList.add("danger");
            clearStorageButton.disabled = false;
            clearStorageButton.textContent = "Clear Character Sheet";
        }
        let keyCount = 0;
        for (let [key, value] of Object.entries(data)) {
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
        //initSpellist('I');// argument R to reset spells    
        //initInventory('I');// argument R to reset inventory  
        initCustomobjects();
        zeroingInputs();
        reloadSpellist();
        reloadInventory();        
        //recalculate();  
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
/////////////////////////////////////////////////////////////////////// DND 35e /////////////////////////////////////////////////////////// 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// -------------------------------------------------------------------TABS-
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

    console.log(charsize)

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

    document.getElementById('bab2').innerText = bab2;
    document.getElementById('bab3').innerText = bab3;
    document.getElementById('bab4').innerText = bab4;
}

function reloadSizemods() {
    const charsizemod = document.getElementById('charsize').value;
    let charsizemodspans = document.getElementsByClassName('charsizemod');
    for (let i=0; i < charsizemodspans.length; i++) {
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

    let caratkval = parseInt(document.getElementById(`MOD${caratk}`).innerHTML);

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

    name = name + " Attack";

    if (isFullattack === '1') {
        TS.chat.send('FULL ATTACK', 'campaign');
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

    let caratkval = parseInt(document.getElementById(`MOD${card}`).innerHTML);

    let modifier = caratkval + modtd;

    let typeStr = modifier < 0 ? "-" : "+";

    modifier = Math.abs(modifier);

    let dice = dices + typeStr + modifier;

    name = name + " Damage";

    if (isCritic === '1') {

        name = name + 'Critical ';
        const critMultiplier = parseInt(document.getElementById('crt-multiplier' + weaponNumber).value);
        const critDices = dices.split('d');
        const critDicesnumber = critMultiplier * parseInt(critDices[0]);
        const rollDice = critDicesnumber + 'd' + critDices[1];
        const critModifier = critMultiplier * modifier;
        const roll = rollDice + typeStr + critModifier;

        const msg = '<color="red">' + name.toUpperCase() + ': ' + roll;

        TS.chat.send(msg, 'campaign');

        TS.dice.putDiceInTray([{ name: name, roll: roll }], false);

        //rollcritic(name, dice, weaponNumber);

    } else {

        TS.dice.putDiceInTray([{ name: name, roll: dice }], false);
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
    <td style="flex-grow: 1;"><textarea class="spell-description" onchange="updateSpellstorage('${rndid}')" style="flex-grow: 1;">${spellDetails.descrp}</textarea></td>
    <td><button onclick="deletethisrow('${rndid}')" style="background-color: red; width: 30px; height: 30px;">X</button></td>
  </tr>`;

    let rowMacro = `<tr>
    <td colspan="6"><textarea id='${rndid}-macro-textarea' style="width: 450px" onchange="updateSpellstorage('${rndid}')">${spellDetails.macro}</textarea></td>  
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
          <td style="flex-grow: 1;"><textarea onchange="updateSpellstorage('${spell}')" style="flex-grow: 1;">${spellDetails.descrp}</textarea></td>
          <td><button onclick="deletethisrow('${spell}')" style="background-color: red; width: 30px; height: 30px;">X</button></td>
        </tr>`;

                        let rowmacro = `<tr> 
        <td colspan="6" ><textarea id='${spell}-macro-textarea' style="width: 450px" onchange="updateSpellstorage('${spell}')">${spellDetails.macro}</textarea></td>
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
    input = input.trim();
    let regex = /\s+/g;
    input = input.replace(regex, "");

    if (!isValidInput(input)) {
        console.log('Invalid input')
        return;
    }

    const STR = parseInt(document.getElementById('MODSTR').innerHTML);
    const DEX = parseInt(document.getElementById('MODDEX').innerHTML);
    const CON = parseInt(document.getElementById('MODCON').innerHTML);
    const INT = parseInt(document.getElementById('MODINT').innerHTML);
    const WIS = parseInt(document.getElementById('MODWIS').innerHTML);
    const CHA = parseInt(document.getElementById('MODCHA').innerHTML);
    const ACL = parseInt(document.getElementById('arcane_casterlvl').value);
    const ACL1 = parseInt(document.getElementById('arcanemc1name').value);
    const ACL2 = parseInt(document.getElementById('arcanemc2name').value);
    const ACL3 = parseInt(document.getElementById('arcanemc3name').value);
    let AAM = document.getElementById('arcane_car').value;
    AAM = parseInt(document.getElementById('MOD' + AAM).innerHTML);
    let AAM1 = document.getElementById('arcane_carml1').value;
    AAM1 = parseInt(document.getElementById('MOD' + AAM1).innerHTML);
    let AAM2 = document.getElementById('arcane_carml2').value;
    AAM2 = parseInt(document.getElementById('MOD' + AAM2).innerHTML);
    let AAM3 = document.getElementById('arcane_carml3').value;
    AAM3 = parseInt(document.getElementById('MOD' + AAM3).innerHTML);
    const DCL = parseInt(document.getElementById('divine_casterlvl').value);
    const DCL1 = parseInt(document.getElementById('divinemc1name').value);
    const DCL2 = parseInt(document.getElementById('divinemc2name').value);
    const DCL3 = parseInt(document.getElementById('divinemc3name').value);
    let DAM = document.getElementById('divine_car').value;
    DAM = parseInt(document.getElementById('MOD' + DAM).innerHTML);
    let DAM1 = document.getElementById('divine_carml1').value;
    DAM1 = parseInt(document.getElementById('MOD' + DAM1).innerHTML);
    let DAM2 = document.getElementById('divine_carml2').value;
    DAM2 = parseInt(document.getElementById('MOD' + DAM2).innerHTML);
    let DAM3 = document.getElementById('divine_carml3').value;
    DAM3 = parseInt(document.getElementById('MOD' + DAM3).innerHTML);

    const isHidden = input.includes('hidden:') ? true : false;
    input = isHidden ? input.replace("hidden:", "") : input;

    let totalmod = [];
    let result = [];
    let entries = input.split(',');
    //MACRO:1d20+STR
    for (let i = 0; i < entries.length; i++) {
        let parts = entries[i].split(':');
        let name = parts[0];
        let dice = '';
        let mod = '';

        if (parts[1].includes('_')) {

            let rollParts = parts[1].split('_');
            dice = rollParts[0];
            mod = rollParts[1];
        } else {
            dice = parts[1];
        }

        let dices = dice.split('d');
        let numberOfdices = eval(dices[0]);
        let typeOfdices = dices[1];
        dice = numberOfdices + 'd' + typeOfdices;

        if (mod === '') {
            result.push({ name: name, roll: dice });
        } else {
            // Evaluate the expression for mod
            totalmod[i] = eval(mod);
            let modsign = totalmod[i] > 0 ? '+' : '-';
            result.push({ name: name, roll: dice + modsign + Math.abs(totalmod[i]) });
        }
    }
    TS.dice.putDiceInTray(result, isHidden).then((diceSetResponse) => {
        trackedIds[diceSetResponse] = isHidden; // Save the id of the rolls
    });
}

async function handleRollResult(rollEvent) {

    let roll = rollEvent.payload;

    if (trackedIds[roll.rollId] == undefined) {
        //if we haven't tracked that roll, ignore it because it's not from us
        return;
    }
    if (rollEvent.kind == "rollResults") {        //user rolled the dice we tracked and there's a new result for us to look at

        const isHidden = trackedIds[roll.rollId];
        console.log()
        //const multiplier = parseInt(document.getElementById('crt-multiplier'+ rndidmacro).value);

        if (isHidden) {

            let msg = '';
            let promises = [];

            for (let group of rollEvent.payload.resultsGroups) {
                let promise = TS.dice.evaluateDiceResultsGroup(group).then((value) => {
                    msg = msg + '<color="red">' + group.name + ': <color="green">' + value + '<br>';
                });
                promises.push(promise);
            }

            Promise.all(promises).then(() => {
                TS.chat.send(msg, "campaign");
            });
        }
    }
}

//Validar input de macro
function isValidInput(input) {

    // Define the allowed characters in the input
    let allowedChars = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789_:+-*/,() ';
    // Split the input into an array of characters
    let inputArray = input.split('');
    // Check if every character in the input is allowed
    return inputArray.every(char => allowedChars.includes(char));
}

function initSpellist(reset) { //R as input for reset the spells

    TS.localStorage.campaign.getBlob().then((storedData) => {

        let data = JSON.parse(storedData || "{}");

        if (typeof data.spelltype === 'undefined' || reset === 'R') {

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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////// INVENTARIO //////////////////////////////////////////////////////

function initInventory(reset) { //R as input for reset inventory

    TS.localStorage.campaign.getBlob().then((storedData) => {
        let data = JSON.parse(storedData || "{}");

        if (typeof data.inventory === 'undefined' || reset === 'R') {

            let inventory = {};

            data['inventory'] = inventory;
            // Store updated data with the new row  
            TS.localStorage.campaign.setBlob(JSON.stringify(data));
            console.log('Inventory object created');
        } else {
            console.log('Inventory object already exists');
        }
    });
}
///////////////////////////////////////

//ADD AN ITEM WITH THE BUTTON
function addInventoryItem() {

    let itemDetails = { item: 'nombre', cantidad: '0', pesoxunidad: '0', pesototal: '0', detalles: 'detalles' };
    let rndid = generateRandomID();

    let row = `<tr>
    <td style="width: 200px; font-size:14px;"><input type="text" onchange="updateInventory(${rndid});" value="${itemDetails.item}"></td>
    <td style="width: 30px;  font-size:14px;"><input type="number" onchange="updateInventory(${rndid});" value="${itemDetails.cantidad}"></td>
    <td style="width: 30px;  font-size:14px;"><input type="number" onchange="updateInventory(${rndid});" value="${itemDetails.pesoxunidad}"></td>
    <td style="width: 30px;  font-size:16px; text-align: center;"><span id="pesototal-${rndid}">${itemDetails.pesototal}</span></td>
    <td style="width: 200px; font-size:14px;"><textarea onchange="updateInventory(${rndid});" >${itemDetails.detalles}</textarea></td>
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

        let Totalweight = 0;
        for (const item in data.inventory) {
            Totalweight += parseInt(data.inventory[item].pesototal);
        }

        document.getElementById('Totalweight').innerHTML = Totalweight;

        TS.localStorage.campaign.setBlob(JSON.stringify(data));
    })

    document.getElementById(rowid).remove();
}

// Update inventory when editing input field
function updateInventory(rowid) {

    let itemrow = rowid;

    let itemDetails = {};

    itemDetails.item = itemrow.cells[0].childNodes[0].value;
    itemDetails.cantidad = itemrow.cells[1].childNodes[0].value;
    itemDetails.pesoxunidad = itemrow.cells[2].childNodes[0].value;
    itemDetails.pesototal = itemDetails.cantidad * itemDetails.pesoxunidad;
    itemDetails.detalles = itemrow.cells[4].childNodes[0].value;

    document.getElementById(`pesototal-${rowid.id}`).innerHTML = itemDetails.pesototal;

    TS.localStorage.campaign.getBlob().then((storedData) => {
        data = JSON.parse(storedData || "{}");

        data.inventory[rowid.id] = itemDetails;

        let Totalweight = 0;
        for (const item in data.inventory) {
            Totalweight += parseInt(data.inventory[item].pesototal);
        }

        document.getElementById('Totalweight').innerHTML = Totalweight;

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
            <td style="width: 200px; font-size:14px;"><input type="text" onchange="updateInventory(${item});" value="${itemDetails.item}"></td>
            <td style="width: 30px;  font-size:14px;"><input type="number" onchange="updateInventory(${item});" value="${itemDetails.cantidad}"></td>
            <td style="width: 30px;  font-size:14px;"><input type="number" onchange="updateInventory(${item});" value="${itemDetails.pesoxunidad}"></td>
            <td style="width: 30px;  font-size:16px text-align: center;"><span id="pesototal-${item}">${itemDetails.pesototal}</span></td>
            <td style="width: 200px; font-size:14px;"><textarea onchange="updateInventory(${item});" >${itemDetails.detalles}</textarea></td>
            <td><button onclick="deletethisitemrow('${item}')" style="background-color: red; width: 30px; height: 30px;">X</button></td>
          </tr>`

                // Append the new row to the table
                let newRow = document.createElement('tr');
                newRow.id = item;
                newRow.innerHTML = row;

                document.getElementById('inventory-table').appendChild(newRow);

            }

            let Totalweight = 0;
            for (const item in data.inventory) {
                Totalweight += parseInt(data.inventory[item].pesototal);
            }

            document.getElementById('Totalweight').innerHTML = Totalweight;
        }
    });
}

function initCustomobjects() {

    TS.localStorage.campaign.getBlob().then((storedData) => {
        let data = JSON.parse(storedData || "{}");

        //Initialize Inventory object
        if (typeof data.inventory === 'undefined') {

            let inventory = {};

            data['inventory'] = inventory;
            // Store updated data with the new row  
            TS.localStorage.campaign.setBlob(JSON.stringify(data));
            console.log('Inventory object created');
        } else {
            console.log('Inventory object already exists');
        }


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