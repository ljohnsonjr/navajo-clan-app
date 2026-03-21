// Navajo Clan Application Logic

// Sanitize HTML to prevent XSS attacks
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Separate clans into Traditional Navajo and Adopted
function categorizeClans() {
    const navajoClans = [];
    const adoptedClans = [];

    clansDatabase.forEach(clan => {
        const groupMatch = clan.group.match(/Group (\d+)/);
        if (groupMatch) {
            const groupNum = parseInt(groupMatch[1]);
            if (groupNum <= 9) {
                navajoClans.push(clan);
            } else {
                adoptedClans.push(clan);
            }
        }
    });

    return { navajoClans, adoptedClans };
}

// Populate select dropdowns
function populateSelects() {
    const { navajoClans, adoptedClans } = categorizeClans();
    const selectIds = [
        'user1-clan1', 'user1-clan2', 'user1-clan3', 'user1-clan4',
        'user2-clan1', 'user2-clan2', 'user2-clan3', 'user2-clan4'
    ];

    selectIds.forEach(id => {
        const select = document.getElementById(id);

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a clan...';
        select.appendChild(defaultOption);

        // Add Traditional Navajo Clans group
        const navajoGroup = document.createElement('optgroup');
        navajoGroup.label = '━━━━━ TRADITIONAL NAVAJO CLANS ━━━━━';
        navajoClans.forEach((clan, index) => {
            const option = document.createElement('option');
            option.value = index + '_navajo';
            option.textContent = `${clan.navajo} (${clan.english})`;
            navajoGroup.appendChild(option);
        });
        select.appendChild(navajoGroup);

        // Add Adopted Clans group
        const adoptedGroup = document.createElement('optgroup');
        adoptedGroup.label = '━━━━━ ADOPTED CLANS ━━━━━';
        adoptedClans.forEach((clan, index) => {
            const option = document.createElement('option');
            option.value = index + '_adopted';
            const displayText = clan.hopi
                ? `${clan.navajo} (${clan.english} / ${clan.hopi}) ${clan.type ? `[${clan.type}]` : ''}`
                : `${clan.navajo} (${clan.english}) ${clan.type ? `[${clan.type}]` : ''}`;
            option.textContent = displayText;
            adoptedGroup.appendChild(option);
        });
        select.appendChild(adoptedGroup);

        // Add special option
        const specialOption = document.createElement('option');
        specialOption.value = 'not-listed';
        specialOption.textContent = 'My clan is not listed';
        select.appendChild(specialOption);
    });
}

// Get clan object from selection value
function getClanFromValue(value) {
    if (value === 'not-listed' || value === '') {
        return {
            navajo: 'Clan not listed',
            english: 'My clan is not in this list',
            group: 'Unknown',
            type: ''
        };
    }

    const [index, category] = value.split('_');
    const { navajoClans, adoptedClans } = categorizeClans();

    if (category === 'navajo') {
        return navajoClans[parseInt(index)];
    } else {
        return adoptedClans[parseInt(index)];
    }
}

// Format clan display name
function formatClanDisplay(clan) {
    let display = clan.english;
    if (clan.hopi) {
        display += ` / ${clan.hopi}`;
    }
    if (clan.type) {
        display += ` (${clan.type})`;
    }
    return display;
}

// Compare clans
function compareClans() {
    const user1Name = document.getElementById('user1-name').value.trim() || 'User 1';
    const user2Name = document.getElementById('user2-name').value.trim() || 'User 2';

    // Get selected clans
    const user1Clans = [
        getClanFromValue(document.getElementById('user1-clan1').value),
        getClanFromValue(document.getElementById('user1-clan2').value),
        getClanFromValue(document.getElementById('user1-clan3').value),
        getClanFromValue(document.getElementById('user1-clan4').value)
    ];

    const user2Clans = [
        getClanFromValue(document.getElementById('user2-clan1').value),
        getClanFromValue(document.getElementById('user2-clan2').value),
        getClanFromValue(document.getElementById('user2-clan3').value),
        getClanFromValue(document.getElementById('user2-clan4').value)
    ];

    // Validate selections
    const allClansSelected = [...user1Clans, ...user2Clans].every(clan => clan !== null);
    if (!allClansSelected) {
        alert('Please select all 4 clans for both people.');
        return;
    }

    // Generate results
    displayResults(user1Name, user1Clans, user2Name, user2Clans);
}

// Display comparison results
function displayResults(user1Name, user1Clans, user2Name, user2Clans) {
    const resultsDiv = document.getElementById('results');
    const positions = ['1st (Born to)', '2nd (Born for)', '3rd (Maternal Grandfather)', '4th (Paternal Grandfather)'];
    
    // Sanitize user names to prevent XSS
    const safeUser1Name = sanitizeHTML(user1Name);
    const safeUser2Name = sanitizeHTML(user2Name);

    let html = `
        <div class="results-header">
            <h2>Clan Comparison Results</h2>
            <p>${safeUser1Name} and ${safeUser2Name}</p>
        </div>

        <div class="clan-lists">
            <div class="clan-list">
                <h3>${safeUser1Name}'s Clans</h3>
                ${user1Clans.map((clan, i) => `
                    <div class="clan-item">
                        <div class="navajo">${i + 1}. ${clan.navajo}</div>
                        <div class="english">${formatClanDisplay(clan)}</div>
                        <div class="group">${clan.group}</div>
                    </div>
                `).join('')}
            </div>

            <div class="clan-list">
                <h3>${safeUser2Name}'s Clans</h3>
                ${user2Clans.map((clan, i) => `
                    <div class="clan-item">
                        <div class="navajo">${i + 1}. ${clan.navajo}</div>
                        <div class="english">${formatClanDisplay(clan)}</div>
                        <div class="group">${clan.group}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="comparison-section">
            <h3>Position-by-Position Comparison</h3>
            ${positions.map((position, i) => {
                const clan1 = user1Clans[i];
                const clan2 = user2Clans[i];
                const comparison = compareTwoClans(clan1, clan2);

                return `
                    <div class="position-comparison">
                        <h4>${position} Clan Comparison</h4>
                        <div class="comparison-pair">
                            <div class="comparison-item">
                                <div class="label">${safeUser1Name}:</div>
                                <div class="navajo">${clan1.navajo}</div>
                                <div class="english">${formatClanDisplay(clan1)}</div>
                                <div class="group">${clan1.group}</div>
                            </div>
                            <div class="comparison-item">
                                <div class="label">${safeUser2Name}:</div>
                                <div class="navajo">${clan2.navajo}</div>
                                <div class="english">${formatClanDisplay(clan2)}</div>
                                <div class="group">${clan2.group}</div>
                            </div>
                        </div>
                        <div class="match-status ${comparison.type}">
                            ${comparison.message}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    // Overall analysis
    const analysis = getOverallAnalysis(safeUser1Name, user1Clans, safeUser2Name, user2Clans);
    html += `
        <div class="overall-analysis">
            <h3>Overall Analysis</h3>
            ${analysis.html}
        </div>
    `;

    resultsDiv.innerHTML = html;
    resultsDiv.classList.add('show');

    // Smooth scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Compare two clans
function compareTwoClans(clan1, clan2) {
    // Skip comparison if either clan is unknown
    if (clan1.group === 'Unknown' || clan2.group === 'Unknown') {
        return {
            type: 'unknown',
            message: 'ℹ️ Cannot compare - one or both clans unknown'
        };
    }

    // Check for exact match
    if (clan1.navajo === clan2.navajo) {
        return {
            type: 'exact',
            message: '✅ EXACT CLAN MATCH: Both have the same clan!'
        };
    }

    // Check for group match
    if (clan1.group === clan2.group) {
        return {
            type: 'group',
            message: `ℹ️ GROUP MATCH: Both clans are in ${clan1.group}`
        };
    }

    return {
        type: 'none',
        message: '✓ Different groups - No relationship'
    };
}

// Get overall analysis
function getOverallAnalysis(user1Name, user1Clans, user2Name, user2Clans) {
    const user1Navajo = user1Clans.filter(c => c.group !== 'Unknown').map(c => c.navajo);
    const user2Navajo = user2Clans.filter(c => c.group !== 'Unknown').map(c => c.navajo);

    const sharedClans = user1Navajo.filter(c => user2Navajo.includes(c) && c !== 'Clan not listed');

    const user1Groups = new Set(user1Clans.filter(c => c.group !== 'Unknown').map(c => c.group));
    const user2Groups = new Set(user2Clans.filter(c => c.group !== 'Unknown').map(c => c.group));
    const sharedGroups = [...user1Groups].filter(g => user2Groups.has(g));

    let html = '';

    if (sharedClans.length > 0) {
        html += `
            <div class="analysis-section">
                <h4>✅ Exact Clan Matches Found</h4>
                <ul class="match-list">
                    ${sharedClans.map(navajo => {
                        const user1Index = user1Clans.findIndex(c => c.navajo === navajo);
                        const user2Index = user2Clans.findIndex(c => c.navajo === navajo);
                        const clan = user1Clans[user1Index];
                        const positions = ['1st', '2nd', '3rd', '4th'];

                        let positionText = '';
                        if (user1Index !== -1) {
                            positionText += `${user1Name}'s ${positions[user1Index]} clan`;
                        }
                        if (user2Index !== -1) {
                            if (positionText) positionText += ', ';
                            positionText += `${user2Name}'s ${positions[user2Index]} clan`;
                        }

                        return `<li>${clan.navajo} (${formatClanDisplay(clan)}) - <em>${positionText}</em></li>`;
                    }).join('')}
                </ul>
            </div>
        `;
    }

    if (sharedGroups.length > 0) {
        html += `
            <div class="analysis-section">
                <h4>ℹ️ Shared Clan Groups</h4>
                ${sharedGroups.map(group => {
                    const user1InGroup = user1Clans.filter(c => c.group === group);
                    const user2InGroup = user2Clans.filter(c => c.group === group);
                    const positions = ['1st', '2nd', '3rd', '4th'];

                    return `
                        <div style="margin-bottom: 15px;">
                            <strong>${group}:</strong>
                            <div style="margin-left: 20px; margin-top: 8px;">
                                <div><strong>${user1Name}:</strong></div>
                                <ul class="match-list">
                                    ${user1InGroup.map(c => {
                                        const index = user1Clans.findIndex(clan => clan.navajo === c.navajo);
                                        return `<li>${c.navajo} (${formatClanDisplay(c)}) - <em>${positions[index]} clan</em></li>`;
                                    }).join('')}
                                </ul>
                                <div style="margin-top: 8px;"><strong>${user2Name}:</strong></div>
                                <ul class="match-list">
                                    ${user2InGroup.map(c => {
                                        const index = user2Clans.findIndex(clan => clan.navajo === c.navajo);
                                        return `<li>${c.navajo} (${formatClanDisplay(c)}) - <em>${positions[index]} clan</em></li>`;
                                    }).join('')}
                                </ul>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    if (sharedClans.length === 0 && sharedGroups.length === 0) {
        html += `
            <div class="no-conflicts">
                ✓ No shared clans or clan groups found.<br>
                ${user1Name} and ${user2Name} do not have any clan relationships.
            </div>
        `;
    }

    const unknownCount = [...user1Clans, ...user2Clans].filter(c => c.group === 'Unknown').length;
    if (unknownCount > 0) {
        html += `
            <div class="analysis-section">
                <h4>ℹ️ Note</h4>
                <p>${unknownCount} clan(s) marked as 'Clan not listed'.</p>
                <p>These were not included in the comparison analysis.</p>
            </div>
        `;
    }

    return { html };
}

// Create custom dropdown modals
function setupCustomDropdowns() {
    const { navajoClans, adoptedClans } = categorizeClans();
    const dropdownConfigs = [
        { id: 'user1-clan1', label: '1st Clan (Born to)', user: 'First Person' },
        { id: 'user1-clan2', label: '2nd Clan (Born for)', user: 'First Person' },
        { id: 'user1-clan3', label: '3rd Clan (Maternal Grandfather)', user: 'First Person' },
        { id: 'user1-clan4', label: '4th Clan (Paternal Grandfather)', user: 'First Person' },
        { id: 'user2-clan1', label: '1st Clan (Born to)', user: 'Second Person' },
        { id: 'user2-clan2', label: '2nd Clan (Born for)', user: 'Second Person' },
        { id: 'user2-clan3', label: '3rd Clan (Maternal Grandfather)', user: 'Second Person' },
        { id: 'user2-clan4', label: '4th Clan (Paternal Grandfather)', user: 'Second Person' }
    ];

    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'dropdown-modal';
    modal.id = 'dropdown-modal';
    modal.innerHTML = `
        <div class="dropdown-modal-content">
            <div class="dropdown-modal-header">
                <button class="dropdown-modal-close" onclick="closeDropdownModal()">&times;</button>
                <div id="modal-title"></div>
            </div>
            <div class="dropdown-modal-body" id="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDropdownModal();
        }
    });

    dropdownConfigs.forEach(config => {
        const select = document.getElementById(config.id);
        const container = select.parentElement;

        // Create custom button
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'custom-select-button';
        button.innerHTML = '<span class="placeholder">Select a clan...</span>';
        button.onclick = () => openDropdownModal(config, navajoClans, adoptedClans, button, select);

        // Hide original select and add custom button
        select.style.display = 'none';
        container.appendChild(button);
    });
}

function openDropdownModal(config, navajoClans, adoptedClans, button, select) {
    const modal = document.getElementById('dropdown-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // Get the actual user name from input field
    const userNameInputId = config.id.includes('user1') ? 'user1-name' : 'user2-name';
    const userNameInput = document.getElementById(userNameInputId);
    const userName = userNameInput.value.trim() || config.user;

    // Add possessive 's
    const possessiveName = userName.endsWith('s') ? `${userName}'` : `${userName}'s`;

    modalTitle.textContent = `${possessiveName} ${config.label}`;

    let html = '';

    // Traditional Navajo Clans
    html += '<div class="clan-group-header">TRADITIONAL NAVAJO CLANS</div>';
    navajoClans.forEach((clan, index) => {
        const displayText = clan.hopi && clan.type
            ? `${clan.english} / ${clan.hopi} (${clan.type})`
            : clan.english;
        html += `
            <div class="clan-option" onclick="selectClan('${config.id}', '${index}_navajo', '${clan.navajo.replace(/'/g, "\\'")}', '${displayText.replace(/'/g, "\\'")}')">
                <div class="navajo-name">${clan.navajo}</div>
                <div class="english-name">${displayText}</div>
            </div>
        `;
    });

    // Adopted Clans
    html += '<div class="clan-group-header">ADOPTED CLANS</div>';
    adoptedClans.forEach((clan, index) => {
        const displayText = clan.hopi
            ? `${clan.english} / ${clan.hopi} ${clan.type ? `(${clan.type})` : ''}`
            : `${clan.english} ${clan.type ? `(${clan.type})` : ''}`;
        html += `
            <div class="clan-option" onclick="selectClan('${config.id}', '${index}_adopted', '${clan.navajo.replace(/'/g, "\\'")}', '${displayText.replace(/'/g, "\\'")}')">
                <div class="navajo-name">${clan.navajo}</div>
                <div class="english-name">${displayText}</div>
            </div>
        `;
    });

    // Special option
    html += '<div class="clan-group-header">SPECIAL OPTIONS</div>';
    html += `
        <div class="clan-option" onclick="selectClan('${config.id}', 'not-listed', 'Clan not listed', 'My clan is not in this list')">
            <div class="navajo-name">Clan not listed</div>
            <div class="english-name">My clan is not in this list</div>
        </div>
    `;

    modalBody.innerHTML = html;
    modal.classList.add('active');
}

function selectClan(selectId, value, navajoName, englishName) {
    const select = document.getElementById(selectId);
    const button = select.nextElementSibling;

    // Set the hidden select value
    select.value = value;

    // Update button text with proper layout
    button.innerHTML = `<span class="navajo-display">${navajoName}</span><span class="english-display">${englishName}</span>`;
    button.classList.add('has-value');

    closeDropdownModal();
}

function closeDropdownModal() {
    const modal = document.getElementById('dropdown-modal');
    modal.classList.remove('active');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    populateSelects();
    setupCustomDropdowns();
    setupIntroductionButtons();
});

// Generate Navajo Introduction
function generateIntroduction(userName, userClans, userNum) {
    const name = userName || `User ${userNum}`;
    
    // Validate that all clans are selected
    const allSelected = userClans.every(clan => clan && clan.navajo !== 'Clan not listed');
    if (!allSelected) {
        alert('Please select all 4 clans before generating an introduction.');
        return;
    }
    
    // Sanitize name for XSS protection
    const safeName = sanitizeHTML(name);
    
    // Get Navajo clan names (without English or extra info)
    const clan1 = userClans[0].navajo;
    const clan2 = userClans[1].navajo;
    const clan3 = userClans[2].navajo;
    const clan4 = userClans[3].navajo;
    
    // Build the Navajo text for copying
    const navajoText = `Yá'át'ééh. Shí éí ${name} yinishyé. ${clan1} nishłį́. ${clan2} báshíshchíín. ${clan3} dashicheii. ${clan4} dashinálí. Ákót'éego Diné nishłį́.`;
    
    // Build beautiful social media-ready introduction
    const introduction = `
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #40E0D0 0%, #2CA89F 100%); padding: 3px; border-radius: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.3);">
            <!-- Sacred Colors Bar -->
            <div style="display: flex; height: 10px; border-radius: 18px 18px 0 0;">
                <div style="flex: 1; background: #B7410E; border-radius: 18px 0 0 0;"></div>
                <div style="flex: 1; background: #40E0D0;"></div>
                <div style="flex: 1; background: #FDB813;"></div>
                <div style="flex: 1; background: #2C2C2C; border-radius: 0 18px 0 0;"></div>
            </div>
            
            <!-- Main Content Card -->
            <div style="background: white; padding: 40px 30px; border-radius: 0 0 18px 18px; position: relative;">
                
                <!-- Decorative Cornstalk Corner Images -->
                <img src="leaderbasket-removebg-preview.png" alt="Wedding basket" class="intro-basket-decoration" style="position: absolute; top: 15px; left: 10px; opacity: 1.0; width: 80px; height: 80px; object-fit: contain;">
                <img src="leaderbasket-removebg-preview.png" alt="Wedding basket" class="intro-basket-decoration" style="position: absolute; top: 15px; right: 10px; opacity: 1.0; width: 80px; height: 80px; object-fit: contain;">
                
                <!-- Title -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <p style="color: #666; margin: 0 0 5px 0; font-size: 0.9em;">Traditional Navajo Introduction</p>
                    <h2 style="color: #40E0D0; font-size: 1.8em; margin: 0; font-weight: 700;">Yá'át'ééh</h2>
                </div>
                
                <!-- Navajo Introduction Text -->
                <div id="intro-text-content" class="intro-text-container" style="background: linear-gradient(to bottom, #FFF9E6, #FFFEF8); border-left: 5px solid #FDB813; border-right: 5px solid #FDB813; padding: 30px 25px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                    <p class="intro-navajo-text" style="font-size: 1.35em; line-height: 2; color: #2C2C2C; margin: 0; text-align: center; font-weight: 500;">
                        <span style="display: block; margin-bottom: 12px;">Shí éí <strong style="color: #B7410E;">${safeName}</strong> yinishyé.</span>
                        <span style="display: block; margin-bottom: 10px;"><strong style="color: #2C2C2C;">${clan1}</strong> nishłį́.</span>
                        <span style="display: block; margin-bottom: 10px;"><strong style="color: #2C2C2C;">${clan2}</strong> báshíshchíín.</span>
                        <span style="display: block; margin-bottom: 10px;"><strong style="color: #2C2C2C;">${clan3}</strong> dashicheii.</span>
                        <span style="display: block; margin-bottom: 15px;"><strong style="color: #2C2C2C;">${clan4}</strong> dashinálí.</span>
                        <span style="display: block;"><strong style="color: #40E0D0;">Ákót'éego Diné nishłį́.</strong></span>
                    </p>
                </div>
                
                <!-- English Translation -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <p style="margin: 0 0 10px 0; font-size: 0.85em; color: #999; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">English Translation:</p>
                    <p style="font-size: 1em; line-height: 1.7; color: #555; margin: 0;">
                        <strong>Hello.</strong> My name is <strong>${safeName}</strong>.<br>
                        I am <strong>${userClans[0].english}</strong> (mother's clan).<br>
                        I am born for <strong>${userClans[1].english}</strong> (father's clan).<br>
                        My maternal grandfather is <strong>${userClans[2].english}</strong>.<br>
                        My paternal grandfather is <strong>${userClans[3].english}</strong>.<br>
                        <strong>In this way, I am Navajo.</strong>
                    </p>
                </div>
                
                <!-- Copy Button -->
                <div style="text-align: center;">
                    <button onclick="copyIntroduction('${navajoText.replace(/'/g, "\\'")}', '${safeName}', event)" style="background: linear-gradient(135deg, #40E0D0, #2CA89F); color: white; border: none; padding: 15px 40px; border-radius: 25px; font-size: 1.1em; font-weight: 600; cursor: pointer; box-shadow: 0 5px 15px rgba(64, 224, 208, 0.4); transition: transform 0.2s, box-shadow 0.2s;">
                        📋 Copy to Share
                    </button>
                    <p style="margin-top: 15px; font-size: 0.85em; color: #999;">Click to copy • Perfect for social media</p>
                </div>
                
                <!-- Bottom Decoration -->
                <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
                    <p style="margin: 0; font-size: 0.8em; color: #999;">Honoring Navajo Tradition</p>
                </div>
            </div>
        </div>
    `;
    
    // Display in modal
    showIntroductionModal(introduction);
}

function copyIntroduction(text, name, event) {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess(event.target);
        }).catch(() => {
            // Fallback to older method
            fallbackCopy(text, event.target);
        });
    } else {
        // Use fallback method
        fallbackCopy(text, event.target);
    }
}

function fallbackCopy(text, button) {
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    
    try {
        textarea.select();
        textarea.setSelectionRange(0, 99999); // For mobile devices
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
            showCopySuccess(button);
        } else {
            alert('Could not copy. Please manually select and copy the text.');
        }
    } catch (err) {
        document.body.removeChild(textarea);
        alert('Could not copy. Please manually select and copy the text.');
    }
}

function showCopySuccess(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '✅ Copied!';
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = 'linear-gradient(135deg, #40E0D0, #2CA89F)';
    }, 2000);
}

function showIntroductionModal(content) {
    // Create or get existing modal
    let modal = document.getElementById('introduction-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'introduction-modal';
        modal.className = 'dropdown-modal';
        modal.innerHTML = `
            <div class="dropdown-modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
                <div class="dropdown-modal-header" style="background: linear-gradient(135deg, #40E0D0, #2CA89F);">
                    <button class="dropdown-modal-close" onclick="closeIntroductionModal()">&times;</button>
                    <div>Your Navajo Introduction</div>
                </div>
                <div class="dropdown-modal-body" id="introduction-body" style="padding: 30px 20px;"></div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeIntroductionModal();
            }
        });
    }
    
    document.getElementById('introduction-body').innerHTML = content;
    modal.classList.add('active');
}

function closeIntroductionModal() {
    const modal = document.getElementById('introduction-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Add button click handlers
function setupIntroductionButtons() {
    // User 1 button
    const user1Button = document.createElement('button');
    user1Button.className = 'compare-button';
    user1Button.textContent = 'Generate My Introduction';
    user1Button.style.marginTop = '10px';
    user1Button.style.background = '#40E0D0';
    user1Button.onclick = () => {
        const userName = document.getElementById('user1-name').value.trim() || 'User 1';
        const userClans = [
            getClanFromValue(document.getElementById('user1-clan1').value),
            getClanFromValue(document.getElementById('user1-clan2').value),
            getClanFromValue(document.getElementById('user1-clan3').value),
            getClanFromValue(document.getElementById('user1-clan4').value)
        ];
        generateIntroduction(userName, userClans, 1);
    };
    
    // User 2 button
    const user2Button = document.createElement('button');
    user2Button.className = 'compare-button';
    user2Button.textContent = 'Generate My Introduction';
    user2Button.style.marginTop = '10px';
    user2Button.style.background = '#40E0D0';
    user2Button.onclick = () => {
        const userName = document.getElementById('user2-name').value.trim() || 'User 2';
        const userClans = [
            getClanFromValue(document.getElementById('user2-clan1').value),
            getClanFromValue(document.getElementById('user2-clan2').value),
            getClanFromValue(document.getElementById('user2-clan3').value),
            getClanFromValue(document.getElementById('user2-clan4').value)
        ];
        generateIntroduction(userName, userClans, 2);
    };
    
    // Insert buttons
    const user1Panel = document.querySelector('.user-panel:nth-of-type(1)');
    const user2Panel = document.querySelector('.user-panel:nth-of-type(2)');
    
    user1Panel.appendChild(user1Button);
    user2Panel.appendChild(user2Button);
}

