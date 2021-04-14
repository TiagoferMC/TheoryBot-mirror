export function validateNote(note) {
    if (note.charAt(2)) return 0;

    switch (note.charAt(0).toUpperCase()) {
        case "A":
        case "B":
        case "C":
        case "D":
        case "E":
        case "F":
        case "G":
            switch (note.charAt(1).toLowerCase()) {
                case "b":
                case "#":
                case "":
                    return 1;
                default:
                    return 0;
            }
            break;
        default:
            return 0;
    }
}

export function noteToInt(note) {
    let noteNum = 0;

    switch (note.charAt(0)) {
        case "C":
            noteNum = 0;
            break;
        case "D":
            noteNum = 2;
            break;
        case "E":
            noteNum = 4;
            break;
        case "F":
            noteNum = 5;
            break;
        case "G":
            noteNum = 7;
            break;
        case "A":
            noteNum = 9;
            break;
        case "B":
            noteNum = 11;
            break;
        default:
            return "Error converting notes to numbers";
    }

    switch (note.charAt(1)) {
        case "b":
            noteNum--;
            break;
        case "#":
            noteNum++;
            break;
        default:
            // Do nothing
    }

    return noteNum;
}

export function noteLetterToInt(note) {
    let noteNum = 0;

    switch (note.charAt(0)) {
        case "A":
            noteNum = 0;
            break;
        case "B":
            noteNum = 1;
            break;
        case "C":
            noteNum = 2;
            break;
        case "D":
            noteNum = 3;
            break;
        case "E":
            noteNum = 4;
            break;
        case "F":
            noteNum = 5;
            break;
        case "G":
            noteNum = 6;
            break;
        default:
            return "Error converting notes to numbers";
    }

    return noteNum;
}

export function interval(note1, note2) {
    const note1Num = noteToInt(note1);
    const note2Num = noteToInt(note2);

    const note1LetterNum = noteLetterToInt(note1);
    const note2LetterNum = noteLetterToInt(note2);

    const noSemitones = (note2Num - note1Num + 12) % 12;
    const noInterval = ((note2LetterNum - note1LetterNum + 7) % 7) + 1;

    switch (noInterval) {
        case 1:
            switch (noSemitones) {
                case 9:
                    return "Triple Diminished Octave (dddim8)";
                case 10:
                    return "Double Diminished Octave (ddim8)";
                case 11:
                    return "Diminished Octave (dim8)";
                case 0:
                    return "Perfect Octave (P8)";
                case 1:
                    return "Augmented Unison (Aug1)";
                case 2:
                    return "Double Augmented Unison (AAug1)";
                case 3:
                    return "Triple Augmented Unison (AAAug1)";
                default:
                    return -1;
            }
            break;
        case 2:
            switch (noSemitones) {
                case 10:
                    return "Triple Diminished Second (dddim2)";
                case 11:
                    return "Double Diminished Second (ddim2)";
                case 0:
                    return "Diminished Second (dim2)";
                case 1:
                    return "Minor Second (m2)";
                case 2:
                    return "Major Second (M2)";
                case 3:
                    return "Augmented Second (Aug2)";
                case 4:
                    return "Double Augmented Second (AAug2)";
                case 5:
                    return "Triple Augmented Second (AAAug2)";
                default:
                    return -1;
            }
            break;
        case 3:
            switch (noSemitones) {
                case 0:
                    return "Triple Diminished Third (dddim3)";
                case 1:
                    return "Double Diminished Third (ddim3)";
                case 2:
                    return "Diminished Third (dim3)";
                case 3:
                    return "Minor Third (m3)";
                case 4:
                    return "Major Third (M3)";
                case 5:
                    return "Augmented Third (Aug3)";
                case 6:
                    return "Double Augmented Third (AAug3)";
                case 7:
                    return "Triple Augmented Third (AAAug3)";
                default:
                    return -1;
            }
            break;
        case 4:
            switch (noSemitones) {
                case 2:
                    return "Triple Diminished Fourth (dddim4)";
                case 3:
                    return "Double Diminished Fourth (ddim4)";
                case 4:
                    return "Diminished Fourth (dim4)";
                case 5:
                    return "Perfect Fourth (P4)";
                case 6:
                    return "Augmented Fourth (Aug4) / TriTone (TT)";
                case 7:
                    return "Double Augmented Fourth (AAug4)";
                case 8:
                    return "Triple Augmented Fourth (AAAug4)";
                default:
                    return -1;
            }
            break;
        case 5:
            switch (noSemitones) {
                case 4:
                    return "Triple Diminished Fifth (dddim5)";
                case 5:
                    return "Double Diminished Fifth (ddim5)";
                case 6:
                    return "Diminished Fifth (dim5) / TriTone (TT)";
                case 7:
                    return "Perfect Fifth (P5)";
                case 8:
                    return "Augmented Fifth (Aug5)";
                case 9:
                    return "Double Augmented Fifth (AAug5)";
                case 10:
                    return "Triple Augmented Fifth (AAAug5)";
                default:
                    return -1;
            }
            break;
        case 6:
            switch (noSemitones) {
                case 5:
                    return "Triple Diminished Sixth (dddim6)";
                case 6:
                    return "Double Diminished Sixth (ddim6)";
                case 7:
                    return "Diminished Sixth (dim6)";
                case 8:
                    return "Minor Sixth (m6)";
                case 9:
                    return "Major Sixth (M6)";
                case 10:
                    return "Augmented Sixth (Aug6)";
                case 11:
                    return "Double Augmented Sixth (AAug6)";
                case 0:
                    return "Triple Augmented Sixth (AAAug6)";
                default:
                    return -1;
            }
            break;
        case 7:
            switch (noSemitones) {
                case 7:
                    return "Triple Diminished Seventh (dddim7)";
                case 8:
                    return "Double Diminished Seventh (ddim7)";
                case 9:
                    return "Diminished Seventh (dim7)";
                case 10:
                    return "Minor Seventh (m7)";
                case 11:
                    return "Major Seventh (M7)";
                case 0:
                    return "Augmented Seventh (Aug7)";
                case 1:
                    return "Double Augmented Seventh (AAug7)";
                case 2:
                    return "Triple Augmented Seventh (AAAug7)";
                default:
                    return -1;
            }
            break;
        default:
            return "Error parsing note number";
    }
}
