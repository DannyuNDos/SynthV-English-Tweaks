function getClientInfo() {
    return {
        "name": "English Tweaks",
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
            [BUTTON_TEXT, "设定为英式发音"]
        ];
    }
    else if (langCode == "zh-tw") {
        return [
            [TITLE, "英語調整"],
            [MESSAGE, "選擇寫有英文歌詞的音符們，按下按鍵。"],
            [BUTTON_TEXT, "設定為英式發音"]
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
        case "french":
            return ["a", "e", "E", "@", "i", "o", "O", "9", "2", "u", "y", "E_~", "A_~", "O_~"].indexOf(symbol) != -1;
        case "german":
            return ["a", "2", "6", "9", "@", "e", "E", "i", "I", "o", "O", "u", "U", "y", "Y", "Oy", "aU", "ai"].indexOf(symbol) != -1;
        case "portuguese":
            return ["a", "6", "E", "{", "e", "i", "O", "o", "u", "6~", "e~", "i~", "o~", "u~"].indexOf(symbol) != -1;
        default:
            return null;
    }
}

function tweakEnglish(note, phones, nextVowelLang, nextVowelSymbol, fallback, germanContinued) {
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
        else if (!fallback && ["ih", "eh", "uh"].indexOf(phones[i]) != -1 && "r" == phones[i + 1]) {
            return true;
        }
        else {
            newPhones.push(phones[i]);
        }
    }
    const newPhonemeSymbols = newPhones.join(" ");
    if (newPhonemeSymbols != phones.join(" ") || germanContinued) {
        note.setPhonemes(newPhonemeSymbols);
    }
    return false;
}

function tweakEnglish_GermanDelegate(note, phones, nextVowelLang, nextVowelSymbol) {
    var newPhones = [];
    for (var i = 0; i < phones.length; ++i) {
        if (phones[i] == "er") {
            newPhones.push("@");
            if (null == phones[i + 1] ? isVowel(nextVowelLang, nextVowelSymbol) : isVowel("english", phones[i + 1])) {
                newPhones.push("R");
            }
        }
        else if (["aa", "ao"].indexOf(phones[i]) != -1) {
            newPhones.push("aa" == phones[i] ? "a" : "O");
            if (phones[i + 1] == "r" && (null == phones[i + 2] ? !isVowel(nextVowelLang, nextVowelSymbol) : !isVowel("english", phones[i + 2]))) {
                ++i;
            }
        }
        else if (["ih", "eh", "uh"].indexOf(phones[i]) != -1 && "r" == phones[i + 1]) {
            switch (phones[i]) {
                case "ih":
                    newPhones.push("I");
                    break;
                case "eh":
                    newPhones.push("E");
                    break;
                case "uh":
                    newPhones.push("U");
                    break;
            }
            newPhones.push(":6");
            ++i;
        }
        else switch (phones[i]) {
            case "ae": case "eh":
                newPhones.push("E");
                break;
            case "ah":
                newPhones.push("6");
                break;
            case "aw":
                newPhones.push("aU");
                break;
            case "ax":
                newPhones.push("@");
                break;
            case "ay":
                newPhones.push("ai");
                break;
            case "ey":
                newPhones.push("e");
                newPhones.push("j");
                break;
            case "ih":
                newPhones.push("I");
                break;
            case "iy":
                newPhones.push("i");
                break;
            case "ow":
                newPhones.push("o");
                break;
            case "oy":
                newPhones.push("Oy");
                break;
            case "uh":
                newPhones.push("U");
                break;
            case "uw":
                newPhones.push("u");
                break;
            case "ch":
                newPhones.push("tS");
                break;
            case "dh": case "dx": case "th": case "w":
                return true;
            case "dr":
                newPhones.push("d");
                newPhones.push("R");
                break;
            case "hh":
                newPhones.push("h");
                break;
            case "jh":
                newPhones.push("d");
                newPhones.push("Z");
                break;
            case "ng":
                newPhones.push("N");
                break;
            case "r":
                newPhones.push("R");
                break;
            case "sh":
                newPhones.push("S");
                break;
            case "tr":
                newPhones.push("tS");
                newPhones.push("R");
                break;
            case "y":
                newPhones.push("j");
                break;
            case "zh":
                newPhones.push("Z");
                break;
            default:
                newPhones.push(phones[i]);
                break;
        }
    }
    const newPhonemeSymbols = newPhones.join(" ");
    note.setPhonemes(newPhonemeSymbols);
    return false;
}

var buttonValue = SV.create("WidgetValue");
buttonValue.setValueChangeCallback(function () {
    const mainEditor = SV.getMainEditor();
    const selectedNotes = mainEditor.getSelection().getSelectedNotes().sort(function (note1, note2) { return note1.getOnset() - note2.getOnset(); });
    const noteGroupRef = mainEditor.getCurrentGroup();
    const noteGroup = noteGroupRef.getTarget();
    const attributes = SV.getComputedAttributesForGroup(noteGroupRef);
    const noteForGermanDelegate = [];
    const germanContinued = false;
    for (var i = 0; i < selectedNotes.length; ++i) {
        const note = selectedNotes[i];
        germanContinued = germanContinued && note.getLyrics() == "+";
        const j = note.getIndexInParent();
        const phonemes = attributes[j]["phonemes"];
        const nextPhonemes = null == attributes[j + 1] ? null : attributes[j + 1]["phonemes"];
        if (phonemes[0]["language"] == "english") {
            const englishNotGood = tweakEnglish(note, phonemes.map(function (p) { return p["symbol"]; }),
                nextPhonemes == null ? null : nextPhonemes[0]["language"],
                nextPhonemes == null ? null : nextPhonemes[0]["symbol"],
                false,
                germanContinued
            );
            if (englishNotGood) {
                const germanNotGood = tweakEnglish_GermanDelegate(note, phonemes.map(function (p) { return p["symbol"]; }),
                    nextPhonemes == null ? null : nextPhonemes[0]["language"],
                    nextPhonemes == null ? null : nextPhonemes[0]["symbol"]
                );
                if (germanNotGood) {
                    tweakEnglish(note, phonemes.map(function (p) { return p["symbol"]; }),
                        nextPhonemes == null ? null : nextPhonemes[0]["language"],
                        nextPhonemes == null ? null : nextPhonemes[0]["symbol"],
                        true,
                        germanContinued
                    );
                }
                else {
                    noteForGermanDelegate.push(note);
                    germanContinued = true;
                }
            }
        }
    }
    for (var i = 0; i < noteForGermanDelegate.length; ++i) {
        noteForGermanDelegate[i].setLanguageOverride("german");
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
