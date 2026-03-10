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
});
