# Navajo Clan Relationship Application

Compare clan relationships between two people with **proper Navajo orthography** including high tones, nasal vowels, barred L, and glottal stops.

## ✨ Perfect Orthography Examples

- **Áshįįhį** (Salt) - Group 7
- **Dééł diné** (Crane) - Group 11
- **Bééh diné** (Deer) - Group 11
- **Dził táíaánii** (Near the Mountain) - Group 1
- **Azee'tsoh Diné** (Big Medicine People) - Group 1

All clan names display with correct:
- **á, é, í, ó** - High tones
- **ą, ę, į, ǫ** - Nasal vowels (ogonek)
- **ł** - Barred L
- **'** - Glottal stops

## 🚀 Quick Start

```bash
python3 navajo_clan_app.py
```

## 📋 Features

### 1. Proper Navajo Orthography ✓
Every clan name uses correct Navajo writing system with all diacritical marks.

### 2. English Translations ✓
All 144 clans show both Navajo and English names:
```
Áshįįhį | Salt
Dééł diné | Crane
Bééh diné | Deer
```

### 3. Comprehensive Database ✓
- **144 clans** across 18 groups
- Traditional Navajo clans (Groups 1-9)
- Adopted clans from other tribes (Groups 10-18)

### 4. Detailed Comparison ✓
- Position-by-position analysis (1st, 2nd, 3rd, 4th)
- Exact clan match detection (🚫)
- Shared group identification (⚠️)
- Clear "no conflict" indicators (✓)

## 📖 How It Works

1. **Enter Names**: First and second person's names
2. **Select Clans**: Each person selects 4 clans from the numbered list
3. **View Results**: Detailed comparison with any matches highlighted

### Selection Display

```
#     Navajo Name                         English Name                        Group
----------------------------------------------------------------------------------------------------
29    Dééł diné                           Crane                               Group 11 (Light Green)
60    Kinyaaáíanii                        Towering House                      Group 1
```

## 🎯 Clan Groups

### Traditional Navajo Clans

**Group 1 (White)** - Bear Protector
- Kinyaaáíanii (Towering House)
- Dził táíaánii (Near the Mountain)
- Azee'tsoh Diné (Big Medicine People)
- Plus 6 more clans

**Group 2 (Blue)** - Cougar Protector
- Honíghíahnii (One Who Walks Around)
- Tóáahanį (Near the Water)
- Plus 6 more clans

**Group 3 (Yellow)** - Big Snake Protector
- Tódįcháiiánii (Bitter Water)
- Bééh bitooánii (Deer Spring)
- Plus 10 more clans

**Group 4 (Black)** - Porcupine Protector
- Hashtłáishnii (Mud Clan)
- Tó tsohnii (Big Water)
- Plus 4 more clans

**Group 7 (Brown)**
- Áshįįhį (Salt) ⭐
- Dib' łizhinį (Black Sheep)
- Maáii Deeshgiizhnii (Coyote Pass-Jemez)
- Plus 4 more clans

### Adopted Clans

**Group 11 (Light Green)** - Hopi
- 29 clans including Dééł diné (Crane), Bééh diné (Deer)

**Groups 12-18** - Other tribes and nations

## 📊 Example Comparison

```
====================================================================================================
CLAN COMPARISON RESULTS
====================================================================================================

John's Clans:
  1. Kinyaaáíanii (Towering House) - Group 1
  2. Honíghíahnii (One Who Walks Around) - Group 2
  3. Tódįcháiiánii (Bitter Water) - Group 3
  4. Hashtłáishnii (Mud Clan) - Group 4

Mary's Clans:
  1. Dził táíaánii (Near the Mountain) - Group 1
  2. Tóáahanį (Near the Water) - Group 2
  3. Bééh bitooánii (Deer Spring) - Group 3
  4. Tó tsohnii (Big Water) - Group 4

====================================================================================================
POSITION-BY-POSITION COMPARISON:
====================================================================================================

1st Clan Comparison:
  John: Kinyaaáíanii (Towering House) - Group 1
  Mary: Dził táíaánii (Near the Mountain) - Group 1
  ⚠️  GROUP MATCH: Both clans are in Group 1
```

## 📁 Project Files

| File | Purpose |
|------|---------|
| `navajo_clan_app.py` | Main application - **RUN THIS** |
| `clans_with_english.txt` | Database (144 clans) |
| `fix_clan_database.py` | Rebuild database from PDF |
| `clans.pdf` | Original source document |
| `README.md` | This file |
| `FIXED_SUMMARY.md` | What was fixed |
| `CLAN_EXAMPLES.md` | Clan examples by group |

## 🔤 Navajo Orthography Guide

| Character | Name | Sound | Example |
|-----------|------|-------|---------|
| **á** | High tone A | Pronounced higher | Ásh**í**įh**í** |
| **ł** | Barred L | Like "tl" | Dzi**ł** |
| **į** | Nasal I | Through nose | Ásh**įį**hį |
| **'** | Glottal stop | Brief pause | diné**'** |
| **éé** | Long high E | Held longer | D**éé**ł |

## 🎓 Cultural Significance

Navajo (Diné) clan relationships determine:
- Family kinship and social structure
- Traditional marriage compatibility
- Cultural responsibilities and protocols
- Community identity and belonging

This application helps identify clan connections, which are fundamental to Diné culture and tradition.

## 🛠️ Rebuilding Database

If you need to rebuild the database from the PDF:

```bash
python3 fix_clan_database.py
```

This will:
- Extract clans from `clans.pdf`
- Apply proper Navajo orthography
- Parse English translations
- Generate `clans_with_english.txt`

## ✅ Verification

Check that orthography is working:

```bash
grep "Áshįįhį\|Dééł\|Bééh" clans_with_english.txt
```

You should see perfect Navajo characters, not garbled text!

## 🙏 Acknowledgments

Clan data sourced from Chinle Unified School District No. 24 Curriculum Center.

## 📝 License

This application is provided for educational and cultural purposes.

---

**Ready to use!** Just run: `python3 navajo_clan_app.py`
