function getClientInfo() {
    return {
        "name": "Korean Tweaks",
        "category": "Unofficial language support",
        "author": "Dannyu NDos",
        "versionNumber": 0,
        "minEditorVersion": 131330,
        "type": "SidePanelSection"
    };
}

const TITLE = "ENGLISH TWEAKS";
const MESSAGE = "Select notes with English lyrics, and press the button below.";
const BUTTON_TEXT = "Set to British pronunciation";
function getTranslations(langCode) {
    if (langCode == "ja-jp") {
        return [
            [TITLE, "英語の調整"],
            [MESSAGE, "英語の歌詞が書かれた音符を選択して、ボタンを押してください。"],
            [BUTTON_TEXT, "発音をイギリス英語に設定"]
        ];
    }
    else if (langCode == "zh-cn") {
        return [
            [TITLE, "英语调整"],
            [MESSAGE, "选择写有英文歌词的音符们，按下按键。"],
            [BUTTON_TEXT, "设置为英式发音"]
        ];
    }
    else if (langCode == "zh-tw") {
        return [
            [TITLE, "英語調整"],
            [MESSAGE, "選擇寫有英文歌詞的音符們，按下按鍵。"],
            [BUTTON_TEXT, "设置为英式发音"]
        ];
    }
    else if (langCode == "ko-kr") {
        return [
            [TITLE, "영어 발음 조정"],
            [MESSAGE, "영어 가사가 적힌 음표들을 선택하고, 버튼을 눌러주세요."],
            [BUTTON_TEXT, "영국식 발음으로 설정"]
        ];
    }
    else if (langCode == "fr-fr") {
        return [
            [TITLE, "RÉGLAGES DE L'ANGLAIS"],
            [MESSAGE, "Sélectionnez des notes avec les paroles en anglais, et appuyez sur le bouton."],
            [BUTTON_TEXT, "Régler la prononciation britannique"]
        ];
    }
    else if (langCode == "es-la") {
        return [
            [TITLE, "AJUSTES EN INGLÉS"],
            [MESSAGE, "Seleccione notas con las letras en inglés, y apriete el botón."],
            [BUTTON_TEXT, "Ajustar la pronunciación británica"]
        ];
    }
}

function isVowel(language, symbol) {
    switch (language) {
        case "english":
            return ["ae", "aa", "ao", "ih", "eh", "ah", "uh", "ey", "ow", "iy", "uw", "ay", "aw", "oy", "ax", "er"].indexOf(symbol) != -1;
        case "mandarin":
            return ["a", "A", "o", "U", "7", "@", "i", "i\\", "i`", "u", "y", "AU", "@U", "ia", "ie", "iAU", "i@U", "iE", "iA", "iU", "ua", "uo", "U@", "uA", "yE", "y{"].indexOf(symbol) != -1;
        case "japanese":
            return ["a", "i", "u", "e", "o", "N"].indexOf(symbol) != -1;
        case "cantonese":
            return ["a", "6", "E", "e", "i", "I", "O", "o", "u", "U", "9", "8", "y", "m=", "N="].indexOf(symbol) != -1;
        case "spanish":
            return ["a", "e", "i", "o", "u"].indexOf(symbol) != -1;
        case "korean":
            return ["6", "V", "e_o", "o", "u", "M", "i"].indexOf(symbol) != -1;
        default:
            return null;
    }
}

function tweakEnglish(note, phones, nextVowelLang, nextVowelSymbol) {
    var newPhones = [];
    for (var i = 0; i < phones.length; ++i) {
        if (phones[i] == "er") {
            newPhones.push("ax");
            if (null == phones[i + 1] ? isVowel(nextVowelLang, nextVowelSymbol) : isVowel("english", phones[i + 1])) {
                newPhones.push("r");
            }
        }
        else if (["aa", "ao"].indexOf(phones[i]) != -1) {
            newPhones.push(phones[i]);
            if (phones[i + 1] == "r" && (null == phones[i + 2] ? !isVowel(nextVowelLang, nextVowelSymbol) : !isVowel("english", phones[i + 2]))) {
                ++i;
            }
        }
        else {
            newPhones.push(phones[i]);
        }
    }
    const newPhonemeSymbols = newPhones.join(" ");
    if (phones.join(" ") != newPhonemeSymbols) {
        note.setPhonemes(newPhonemeSymbols);
    }
}

var buttonValue = SV.create("WidgetValue");
buttonValue.setValueChangeCallback(function () {
    const mainEditor = SV.getMainEditor();
    const selectedNotes = mainEditor.getSelection().getSelectedNotes();
    const noteGroupRef = mainEditor.getCurrentGroup();
    const noteGroup = noteGroupRef.getTarget();
    const attributes = SV.getComputedAttributesForGroup(noteGroupRef);
    for (var i = 0; i < selectedNotes.length; ++i) {
        const note = selectedNotes[i];
        const j = note.getIndexInParent();
        const phonemes = attributes[j]["phonemes"];
        const nextPhonemes = null == attributes[j + 1] ? null : attributes[j + 1]["phonemes"];
        if (phonemes[0]["language"] == "english") {
            tweakEnglish(note, phonemes.map(function (p) { return p["symbol"]; }),
                nextPhonemes == null ? null : nextPhonemes[0]["language"],
                nextPhonemes == null ? null : nextPhonemes[0]["symbol"]);
        }
    }
});

function getSidePanelSectionState() {
    return {
        "title": SV.T(TITLE),
        "rows": [
            {
                "type": "Label",
                "text": SV.T(MESSAGE),
            },
            {
                "type": "Container",
                "columns": [
                    {
                        "type": "Button",
                        "text": SV.T(BUTTON_TEXT),
                        "value": buttonValue
                    }
                ]
            }
        ]
    };
}
