# Navajo Clan Relationship Application

A web and command-line application for comparing Navajo (Diné) clan relationships between two people, featuring proper Navajo orthography and cultural authenticity.

## 🌟 Features

- **Proper Navajo Orthography**: Authentic display of all 144 clans with correct diacritical marks (á, é, í, ł, ą, ę, į, ǫ, ')
- **Dual Language Support**: Navajo names with English translations for all clans
- **Comprehensive Database**: 144 clans organized into 18 groups (traditional Navajo and adopted clans)
- **Relationship Comparison**: Position-by-position analysis to identify exact matches, group conflicts, or clear relationships
- **Cultural Design**: Interface honors Navajo tradition with sacred colors (White, Turquoise, Yellow, Black) and corn imagery
- **Two Versions**: Modern web interface and Python CLI

## 🚀 Quick Start

### Web Version (Recommended)
Open `index.html` in your browser - works offline, no server needed.

### Python CLI Version
```bash
python3 navajo_clan_app.py
```

## 📖 Cultural Significance

In Navajo (Diné) tradition, clan relationships determine:
- Family kinship and social structure
- Traditional marriage compatibility
- Cultural responsibilities and protocols
- Community identity and belonging

Each person has four clans:
1. **Born to** - Mother's clan
2. **Born for** - Father's clan
3. **Maternal Grandfather's** clan
4. **Paternal Grandfather's** clan

This application helps identify shared clans between two people, which is essential for understanding kinship relationships in Diné culture.

## 🎯 Clan Groups

The database includes:

**Traditional Navajo Clans (Groups 1-9)**
- Group 1 (Bear Protector): Kinyaaáíanii, Dził táíaánii, Azeeátsoh Diné, and more
- Group 2 (Cougar Protector): Honíghíahnii, Tóáahanį, and more
- Group 3 (Big Snake Protector): Tódįcháiiánii, Bééh bitooánii, and more
- Group 4 (Porcupine Protector): Hashtłáishnii, Tó tsohnii, and more
- Groups 5-9: Additional traditional clans

**Adopted Clans (Groups 10-18)**
- Group 11: Hopi clans (29 clans including Dééł diné, Bééh diné)
- Groups 12-18: Clans from other tribes and nations

## 🔤 Navajo Orthography

This application uses authentic Navajo writing:

| Character | Description | Example |
|-----------|-------------|---------|
| **á, é, í, ó** | High tone vowels | Ásh**í**įh**í** |
| **ą, ę, į, ǫ** | Nasal vowels | Ásh**įį**hį |
| **ł** | Barred L (like "tl") | Dzi**ł** |
| **'** | Glottal stop | diné**'** |
| **éé, áá** | Long vowels | D**éé**ł |

## 📱 Web Interface

The web version features:
- Responsive design for desktop, tablet, and mobile
- Sacred colors bar (red, turquoise, yellow, black)
- Corn stalk border decorations
- Intuitive dropdown menus with clan selection
- Real-time comparison results
- No installation required - just open and use

## 💻 Technical Details

**Web Version:**
- Pure HTML5, CSS3, and vanilla JavaScript
- No dependencies or frameworks
- Works completely offline
- Mobile-optimized with touch-friendly controls

**Python CLI Version:**
- Python 3.x
- No external dependencies
- Cross-platform compatible

**Database:**
- `clans_with_english.txt` - Primary clan database
- `clans_data.js` - JavaScript version for web app
- Sourced from Chinle Unified School District No. 24 Curriculum Center

## 📁 Project Structure

```
navajo-app/
├── index.html              # Web application (main entry)
├── app.js                  # Web app logic
├── clans_data.js          # Clan database for web
├── navajo_clan_app.py     # Python CLI version
├── clans_with_english.txt # Master clan database
├── cornstalk3.png         # Cultural decoration
└── README.md              # Documentation
```

## 🛠️ Development

**Rebuilding the Database:**
```bash
python3 fix_clan_database.py
```

This extracts clans from `clans.pdf` and applies proper Navajo orthography.

**Testing:**
```bash
python3 test_clans.py
```

## 🙏 Acknowledgments

- Clan data sourced from Chinle Unified School District No. 24 Curriculum Center
- Developed to preserve and honor Navajo (Diné) cultural traditions
- Built with respect for proper Navajo language orthography

## 📝 License

This application is provided for educational and cultural purposes.

## 🌐 Usage

This tool is intended to:
- Help Diné people understand clan relationships
- Educate others about Navajo kinship systems
- Preserve proper Navajo language orthography
- Honor Diné cultural traditions

**Note:** Clan relationships carry significant cultural meaning. This tool provides information but should be used in conjunction with traditional knowledge and cultural guidance.

---

**Diné bizaad yáłti' - Speaking the Navajo language**
