/**
 * LiveScore Pro 2026 v2.2
 * - Player names displayed on field under position
 * - Auto-trim squad when reducing match size
 * - Game location in settings and output
 * - No playtime on match result page
 */

const FORMATION_TEMPLATES = {
    3: [{ name: '1-2', positions: ['GK', 'LW', 'RW'] }, { name: '2-1', positions: ['LB', 'RB', 'ST'] }],
    4: [{ name: '2-2', positions: ['LB', 'RB', 'LW', 'RW'] }, { name: '1-2-1', positions: ['GK', 'LM', 'RM', 'ST'] }],
    5: [{ name: '2-1-2', positions: ['LB', 'RB', 'CM', 'LW', 'RW'] }, { name: '1-2-2', positions: ['GK', 'LB', 'RB', 'LW', 'RW'] }],
    6: [{ name: '2-2-2', positions: ['LB', 'RB', 'LM', 'RM', 'LW', 'RW'] }, { name: '3-2-1', positions: ['LB', 'CB', 'RB', 'LM', 'RM', 'ST'] }],
    7: [{ name: '2-3-2', positions: ['LB', 'RB', 'LM', 'CM', 'RM', 'LW', 'RW'] }, { name: '3-3-1', positions: ['LB', 'CB', 'RB', 'LM', 'CM', 'RM', 'ST'] }],
    8: [{ name: '3-3-2', positions: ['LB', 'CB', 'RB', 'LM', 'CM', 'RM', 'LS', 'RS'] }],
    9: [{ name: '3-3-3', positions: ['LB', 'CB', 'RB', 'LM', 'CM', 'RM', 'LW', 'ST', 'RW'] }],
    10: [{ name: '4-4-2', positions: ['LB', 'LCB', 'RCB', 'RB', 'LM', 'LCM', 'RCM', 'RM', 'LS', 'RS'] }],
    11: [
        { name: '4-4-2', positions: ['GK', 'LB', 'LCB', 'RCB', 'RB', 'LM', 'LCM', 'RCM', 'RM', 'LS', 'RS'] },
        { name: '4-3-3', positions: ['GK', 'LB', 'LCB', 'RCB', 'RB', 'LCM', 'CDM', 'RCM', 'LW', 'ST', 'RW'] },
        { name: '4-2-3-1', positions: ['GK', 'LB', 'LCB', 'RCB', 'RB', 'LCDM', 'RCDM', 'LW', 'CAM', 'RW', 'ST'] },
        { name: '3-5-2', positions: ['GK', 'LCB', 'CB', 'RCB', 'LWB', 'LCM', 'CDM', 'RCM', 'RWB', 'LS', 'RS'] },
    ],
};

function getSquadSize(matchSize) {
    const subsMap = { 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 6 };
    return matchSize + (subsMap[matchSize] || 3);
}

const LOGO_BASE_URL = 'https://raw.githubusercontent.com/luukhopman/football-logos/master/logos';

const LOGO_DATABASE = {
    'Denmark': {
        flag: '🇩🇰',
        teams: [
            { name: 'FC Copenhagen', logo: `${LOGO_BASE_URL}/fc copenhagen.png` },
            { name: 'Brøndby IF', logo: `${LOGO_BASE_URL}/brondby.png` },
            { name: 'FC Midtjylland', logo: `${LOGO_BASE_URL}/fc midtjylland.png` },
            { name: 'FC Nordsjælland', logo: `${LOGO_BASE_URL}/fc nordsjaelland.png` },
            { name: 'Aalborg BK', logo: `${LOGO_BASE_URL}/aalborg bk.png` },
            { name: 'AGF Aarhus', logo: `${LOGO_BASE_URL}/agf.png` },
            { name: 'Silkeborg IF', logo: `${LOGO_BASE_URL}/silkeborg.png` },
            { name: 'Randers FC', logo: `${LOGO_BASE_URL}/randers fc.png` },
            { name: 'Viborg FF', logo: `${LOGO_BASE_URL}/viborg.png` },
            { name: 'Lyngby BK', logo: `${LOGO_BASE_URL}/lyngby.png` },
            { name: 'Vejle BK', logo: `${LOGO_BASE_URL}/vejle boldklub.png` },
            { name: 'Allerød FK', logo: null },
            { name: 'Hillerød GI', logo: null },
        ]
    },
    'England': {
        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        teams: [
            { name: 'Manchester United', logo: `${LOGO_BASE_URL}/manchester united.png` },
            { name: 'Liverpool', logo: `${LOGO_BASE_URL}/liverpool.png` },
            { name: 'Manchester City', logo: `${LOGO_BASE_URL}/manchester city.png` },
            { name: 'Chelsea', logo: `${LOGO_BASE_URL}/chelsea.png` },
            { name: 'Arsenal', logo: `${LOGO_BASE_URL}/arsenal.png` },
            { name: 'Tottenham', logo: `${LOGO_BASE_URL}/tottenham hotspur.png` },
        ]
    },
    'Spain': {
        flag: '🇪🇸',
        teams: [
            { name: 'Real Madrid', logo: `${LOGO_BASE_URL}/real madrid.png` },
            { name: 'Barcelona', logo: `${LOGO_BASE_URL}/barcelona.png` },
            { name: 'Atlético Madrid', logo: `${LOGO_BASE_URL}/atletico madrid.png` },
            { name: 'Sevilla', logo: `${LOGO_BASE_URL}/sevilla.png` },
        ]
    },
    'Germany': {
        flag: '🇩🇪',
        teams: [
            { name: 'Bayern Munich', logo: `${LOGO_BASE_URL}/bayern munich.png` },
            { name: 'Borussia Dortmund', logo: `${LOGO_BASE_URL}/borussia dortmund.png` },
            { name: 'RB Leipzig', logo: `${LOGO_BASE_URL}/rb leipzig.png` },
            { name: 'Bayer Leverkusen', logo: `${LOGO_BASE_URL}/bayer leverkusen.png` },
        ]
    },
    'Italy': {
        flag: '🇮🇹',
        teams: [
            { name: 'Juventus', logo: `${LOGO_BASE_URL}/juventus.png` },
            { name: 'AC Milan', logo: `${LOGO_BASE_URL}/ac milan.png` },
            { name: 'Inter Milan', logo: `${LOGO_BASE_URL}/inter.png` },
            { name: 'Napoli', logo: `${LOGO_BASE_URL}/napoli.png` },
        ]
    },
    'France': {
        flag: '🇫🇷',
        teams: [
            { name: 'Paris Saint-Germain', logo: `${LOGO_BASE_URL}/paris saint-germain.png` },
            { name: 'Marseille', logo: `${LOGO_BASE_URL}/marseille.png` },
            { name: 'Lyon', logo: `${LOGO_BASE_URL}/lyon.png` },
            { name: 'Monaco', logo: `${LOGO_BASE_URL}/monaco.png` },
        ]
    },
    'Netherlands': {
        flag: '🇳🇱',
        teams: [
            { name: 'Ajax', logo: `${LOGO_BASE_URL}/ajax.png` },
            { name: 'PSV', logo: `${LOGO_BASE_URL}/psv eindhoven.png` },
            { name: 'Feyenoord', logo: `${LOGO_BASE_URL}/feyenoord.png` },
        ]
    },
    'Portugal': {
        flag: '🇵🇹',
        teams: [
            { name: 'Benfica', logo: `${LOGO_BASE_URL}/benfica.png` },
            { name: 'Porto', logo: `${LOGO_BASE_URL}/fc porto.png` },
            { name: 'Sporting CP', logo: `${LOGO_BASE_URL}/sporting cp.png` },
        ]
    },
};

const state = {
    isRunning: false,
    seconds: 0,
    interval: null,
    homeScore: 0,
    awayScore: 0,
    matchSize: 5,
    formation: '2-1-2',
    teamName: 'MY TEAM',
    teamLogo: null,
    awayTeamName: 'OPPONENT',
    awayTeamLogo: null,
    matchDate: formatDate(new Date()),
    matchTime: formatTimeOfDay(new Date()),
    matchLocation: '',
    goals: [],
    players: [],
    pitchSlots: [],
    draggedPlayer: null,
    showSettings: false,
    settingsTab: 'team',
    logoSearchCountry: '',
    logoSearchQuery: '',
    showSaveResult: false,
};

function initializePlayers(matchSize) {
    const squadSize = getSquadSize(matchSize);
    return Array.from({ length: squadSize }, (_, i) => ({
        id: i + 1, name: `Player ${i + 1}`, timeOnPitch: 0, onPitch: false, number: i + 1
    }));
}

state.players = initializePlayers(state.matchSize);
state.pitchSlots = new Array(state.matchSize).fill(null);

let clockElement = null;
let playerTimeElements = {};

function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDate(date) {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
}

function formatTimeOfDay(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function updateTimeDisplays() {
    if (clockElement) clockElement.textContent = formatTime(state.seconds);
    const stickyTime = document.getElementById('stickyTime');
    if (stickyTime) stickyTime.textContent = formatTime(state.seconds);
    Object.keys(playerTimeElements).forEach(playerId => {
        const player = state.players.find(p => p.id === parseInt(playerId));
        if (player && playerTimeElements[playerId]) {
            playerTimeElements[playerId].textContent = formatTime(player.timeOnPitch);
        }
    });
}

function startTimer() {
    if (state.isRunning) return;
    state.isRunning = true;
    state.interval = setInterval(() => {
        state.seconds++;
        state.pitchSlots.forEach(playerId => {
            if (playerId !== null) {
                const player = state.players.find(p => p.id === playerId);
                if (player) player.timeOnPitch++;
            }
        });
        updateTimeDisplays();
    }, 1000);
    render();
}

function stopTimer() {
    if (!state.isRunning) return;
    state.isRunning = false;
    clearInterval(state.interval);
    state.interval = null;
    render();
}

function toggleTimer() { state.isRunning ? stopTimer() : startTimer(); }

function resetMatch() {
    if (!confirm('Reset the entire match?')) return;
    stopTimer();
    state.seconds = 0;
    state.homeScore = 0;
    state.awayScore = 0;
    state.goals = [];
    state.matchDate = formatDate(new Date());
    state.matchTime = formatTimeOfDay(new Date());
    state.pitchSlots = new Array(state.matchSize).fill(null);
    state.players.forEach(p => { p.timeOnPitch = 0; p.onPitch = false; });
    render();
}

function setMatchSize(size) {
    const currentOnPitch = state.pitchSlots.filter(id => id !== null);
    
    // Remove players from pitch if reducing size
    if (size < currentOnPitch.length) {
        currentOnPitch.slice(size).forEach(playerId => {
            const player = state.players.find(p => p.id === playerId);
            if (player) player.onPitch = false;
        });
    }
    
    state.matchSize = size;
    const newSquadSize = getSquadSize(size);
    
    // AUTO-TRIM: Remove extra players when reducing match size
    if (state.players.length > newSquadSize) {
        // First, remove players from pitch who will be deleted
        const playersToRemove = state.players.slice(newSquadSize);
        playersToRemove.forEach(p => {
            if (p.onPitch) {
                const slotIdx = state.pitchSlots.findIndex(id => id === p.id);
                if (slotIdx !== -1) state.pitchSlots[slotIdx] = null;
            }
        });
        // Trim the players array
        state.players = state.players.slice(0, newSquadSize);
    }
    
    // Add players if needed
    while (state.players.length < newSquadSize) {
        const newNum = state.players.length + 1;
        state.players.push({ id: Date.now() + newNum, name: `Player ${newNum}`, timeOnPitch: 0, onPitch: false, number: newNum });
    }
    
    const formations = FORMATION_TEMPLATES[size];
    if (formations?.length > 0) state.formation = formations[0].name;
    
    const newSlots = new Array(size).fill(null);
    currentOnPitch.slice(0, size).forEach((playerId, i) => {
        // Only keep players that still exist
        if (state.players.find(p => p.id === playerId)) {
            newSlots[i] = playerId;
        }
    });
    state.pitchSlots = newSlots;
    render();
}

function setFormation(formationName) { state.formation = formationName; render(); }

function handleLogoUpload(event, target) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        if (target === 'home') state.teamLogo = e.target.result;
        else state.awayTeamLogo = e.target.result;
        render();
    };
    reader.readAsDataURL(file);
}

function selectLogoFromDatabase(logoUrl, teamName, target) {
    if (target === 'home') { state.teamLogo = logoUrl; state.teamName = teamName; }
    else { state.awayTeamLogo = logoUrl; state.awayTeamName = teamName; }
    state.logoSearchCountry = '';
    state.logoSearchQuery = '';
    render();
}

function clearLogo(target) {
    if (target === 'home') state.teamLogo = null;
    else state.awayTeamLogo = null;
    render();
}

function addPlayerToPitch(playerId, slotIndex) {
    const player = state.players.find(p => p.id === playerId);
    if (!player || player.onPitch) return false;
    let targetSlot = slotIndex ?? state.pitchSlots.findIndex(id => id === null);
    if (targetSlot === -1) return false;
    const existingId = state.pitchSlots[targetSlot];
    if (existingId !== null) {
        const existingPlayer = state.players.find(p => p.id === existingId);
        if (existingPlayer) existingPlayer.onPitch = false;
    }
    state.pitchSlots[targetSlot] = playerId;
    player.onPitch = true;
    render();
    return true;
}

function removePlayerFromPitch(playerId) {
    const slotIndex = state.pitchSlots.findIndex(id => id === playerId);
    if (slotIndex === -1) return;
    const player = state.players.find(p => p.id === playerId);
    if (player) player.onPitch = false;
    state.pitchSlots[slotIndex] = null;
    render();
}

function scoreGoal(playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;
    state.homeScore++;
    state.goals.push({
        id: Date.now(), time: state.seconds, scorer: player.name, team: 'home',
        teamName: state.teamName, homeScore: state.homeScore, awayScore: state.awayScore
    });
    render();
}

function scoreAwayGoal() {
    state.awayScore++;
    state.goals.push({
        id: Date.now(), time: state.seconds, scorer: state.awayTeamName, team: 'away',
        teamName: state.awayTeamName, homeScore: state.homeScore, awayScore: state.awayScore
    });
    render();
}

function openSettings(tab = 'team') { state.showSettings = true; state.settingsTab = tab; render(); }
function closeSettings() { state.showSettings = false; render(); }
function updateTeamName(name) { state.teamName = name || 'MY TEAM'; }
function updateAwayTeamName(name) { state.awayTeamName = name || 'OPPONENT'; }
function updateMatchDate(date) { state.matchDate = date; render(); }
function updateMatchTime(time) { state.matchTime = time; render(); }
function updateMatchLocation(location) { state.matchLocation = location; render(); }
function updatePlayerName(playerId, name) {
    const player = state.players.find(p => p.id === playerId);
    if (player) player.name = name || `Player ${player.number}`;
}
function addPlayer() {
    const newNum = state.players.length + 1;
    state.players.push({ id: Date.now(), name: `Player ${newNum}`, timeOnPitch: 0, onPitch: false, number: newNum });
    render();
}
function removePlayer(playerId) {
    if (state.players.length <= state.matchSize) { alert('Cannot remove: minimum players needed'); return; }
    const player = state.players.find(p => p.id === playerId);
    if (player?.onPitch) removePlayerFromPitch(playerId);
    state.players = state.players.filter(p => p.id !== playerId);
    render();
}

// Drag and Drop
function handleDragStart(e, playerId) {
    state.draggedPlayer = playerId;
    e.target.classList.add('dragging');
    document.body.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', playerId);
    // Create custom drag image
    const dragGhost = e.target.cloneNode(true);
    dragGhost.style.cssText = 'position:absolute;top:-1000px;opacity:0.8;transform:scale(1.1);';
    document.body.appendChild(dragGhost);
    e.dataTransfer.setDragImage(dragGhost, 30, 30);
    setTimeout(() => dragGhost.remove(), 0);
}
function handleDragEnd(e) {
    state.draggedPlayer = null;
    e.target.classList.remove('dragging');
    document.body.classList.remove('is-dragging');
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
}
function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }
function handleDragEnter(e) { 
    e.preventDefault();
    const slot = e.target.closest('.pitch-slot');
    if (slot) slot.classList.add('drag-over'); 
}
function handleDragLeave(e) { 
    const slot = e.target.closest('.pitch-slot');
    if (slot && !slot.contains(e.relatedTarget)) slot.classList.remove('drag-over'); 
}
function handleDrop(e, slotIndex) {
    e.preventDefault();
    document.body.classList.remove('is-dragging');
    e.target.closest('.pitch-slot')?.classList.remove('drag-over');
    const playerId = parseInt(e.dataTransfer.getData('text/plain'));
    if (!playerId) return;
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;
    if (player.onPitch) {
        const fromSlot = state.pitchSlots.findIndex(id => id === playerId);
        if (fromSlot !== -1) {
            if (state.pitchSlots[slotIndex] === null) {
                state.pitchSlots[fromSlot] = null;
                state.pitchSlots[slotIndex] = playerId;
            } else {
                const temp = state.pitchSlots[slotIndex];
                state.pitchSlots[slotIndex] = playerId;
                state.pitchSlots[fromSlot] = temp;
            }
        }
    } else {
        if (state.pitchSlots[slotIndex] !== null) {
            const existingPlayer = state.players.find(p => p.id === state.pitchSlots[slotIndex]);
            if (existingPlayer) existingPlayer.onPitch = false;
        }
        state.pitchSlots[slotIndex] = playerId;
        player.onPitch = true;
    }
    render();
}

function handleTouchStart(e, playerId) {
    state.draggedPlayer = playerId;
    const el = e.target.closest('.bench-player');
    if (el) el.classList.add('dragging');
    document.body.classList.add('is-dragging');
}
function handleTouchMove(e) {
    if (!state.draggedPlayer) return;
    e.preventDefault();
    const touch = e.touches[0];
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const slot = element?.closest('.pitch-slot');
    if (slot) slot.classList.add('drag-over');
}
function handleTouchEnd(e) {
    if (!state.draggedPlayer) return;
    const touch = e.changedTouches[0];
    const slot = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.pitch-slot');
    if (slot) {
        const slotIndex = parseInt(slot.dataset.slot);
        const player = state.players.find(p => p.id === state.draggedPlayer);
        if (player && !player.onPitch) {
            if (state.pitchSlots[slotIndex] !== null) {
                const existingPlayer = state.players.find(p => p.id === state.pitchSlots[slotIndex]);
                if (existingPlayer) existingPlayer.onPitch = false;
            }
            state.pitchSlots[slotIndex] = state.draggedPlayer;
            player.onPitch = true;
        }
    }
    state.draggedPlayer = null;
    document.body.classList.remove('is-dragging');
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    render();
}

// Save Result as Image
function showSaveResult() { state.showSaveResult = true; render(); setTimeout(generateResultImage, 100); }
function closeSaveResult() { state.showSaveResult = false; render(); }

function generateResultImage() {
    const canvas = document.getElementById('resultCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 1080;
    
    // Calculate dynamic height based on content
    const goalRows = Math.max(state.goals.length, 1);
    const squadRows = Math.ceil(state.players.length / 2);
    const baseHeight = 750; // Header + score
    const goalSectionHeight = 70 + goalRows * 44;
    const squadSectionHeight = 70 + squadRows * 36;
    const height = baseHeight + goalSectionHeight + squadSectionHeight + 80;
    
    canvas.width = width;
    canvas.height = height;
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0e17');
    gradient.addColorStop(0.5, '#111827');
    gradient.addColorStop(1, '#0a0e17');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Header background
    ctx.fillStyle = '#1a2332';
    ctx.fillRect(0, 0, width, 280);
    
    // Title
    ctx.fillStyle = '#00e676';
    ctx.font = 'bold 44px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MATCH RESULT', width / 2, 55);
    
    // Date and Time
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.fillText(`${state.matchDate}  •  ${state.matchTime}`, width / 2, 105);
    
    // Location
    let headerY = 145;
    if (state.matchLocation) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '26px Arial';
        ctx.fillText(`📍 ${state.matchLocation}`, width / 2, headerY);
        headerY += 40;
    }
    
    // Match type
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '26px Arial';
    ctx.fillText(`${state.matchSize}v${state.matchSize}  •  ${state.formation}  •  ${formatTime(state.seconds)}`, width / 2, headerY);
    
    // Score box
    const scoreBoxY = 310;
    roundRect(ctx, 50, scoreBoxY, width - 100, 220, 16);
    ctx.fillStyle = '#1a2332';
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(state.teamName, width / 2 - 90, scoreBoxY + 60);
    ctx.textAlign = 'left';
    ctx.fillText(state.awayTeamName, width / 2 + 90, scoreBoxY + 60);
    
    ctx.font = 'bold 100px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#00e676';
    ctx.fillText(state.homeScore.toString(), width / 2 - 110, scoreBoxY + 170);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(':', width / 2, scoreBoxY + 160);
    ctx.fillText(state.awayScore.toString(), width / 2 + 110, scoreBoxY + 170);
    
    // Goal Log
    let yPos = scoreBoxY + 250;
    roundRect(ctx, 50, yPos, width - 100, goalSectionHeight, 16);
    ctx.fillStyle = '#1a2332';
    ctx.fill();
    
    ctx.fillStyle = '#00e676';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('⚽ GOAL LOG', 85, yPos + 35);
    
    yPos += 60;
    if (state.goals.length === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '22px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No goals scored', width / 2, yPos + 5);
    } else {
        state.goals.forEach(goal => {
            ctx.font = '22px Arial';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#00e676';
            ctx.fillText(formatTime(goal.time), 85, yPos);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${goal.homeScore}-${goal.awayScore}`, 175, yPos);
            ctx.fillStyle = goal.team === 'away' ? '#ff5252' : 'rgba(255,255,255,0.7)';
            const scorer = goal.team === 'home' ? `${state.teamName} - ${goal.scorer}` : goal.scorer;
            ctx.fillText(`⚽ ${scorer}`, 270, yPos);
            yPos += 44;
        });
    }
    
    // Squad
    yPos = scoreBoxY + 250 + goalSectionHeight + 20;
    roundRect(ctx, 50, yPos, width - 100, squadSectionHeight, 16);
    ctx.fillStyle = '#1a2332';
    ctx.fill();
    
    ctx.fillStyle = '#00e676';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`👥 ${state.teamName} SQUAD`, 85, yPos + 35);
    
    yPos += 60;
    const colWidth = (width - 140) / 2;
    state.players.forEach((player, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = 85 + col * colWidth;
        const y = yPos + row * 36;
        const onPitch = state.pitchSlots.includes(player.id);
        ctx.fillStyle = onPitch ? '#00e676' : 'rgba(255,255,255,0.5)';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${onPitch ? '●' : '○'} ${player.number}. ${player.name}`, x, y);
    });
    
    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('LiveScore Pro 2026', width / 2, height - 25);
    
    const downloadBtn = document.getElementById('downloadResultBtn');
    if (downloadBtn) {
        downloadBtn.href = canvas.toDataURL('image/png');
        downloadBtn.download = `match-result-${state.matchDate}.png`;
    }
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function getFormationRows(formationName, matchSize) {
    // Parse formation like "4-4-2" or "2-1-2" into rows from back to front
    const parts = formationName.split('-').map(n => parseInt(n));
    
    // Define position labels for each row based on count
    const positionsByRow = {
        1: { back: ['GK'], mid: ['CM'], front: ['ST'] },
        2: { back: ['LB', 'RB'], mid: ['LM', 'RM'], front: ['LS', 'RS'] },
        3: { back: ['LB', 'CB', 'RB'], mid: ['LM', 'CM', 'RM'], front: ['LW', 'ST', 'RW'] },
        4: { back: ['LB', 'LCB', 'RCB', 'RB'], mid: ['LM', 'LCM', 'RCM', 'RM'], front: ['LW', 'LS', 'RS', 'RW'] },
        5: { back: ['LWB', 'LB', 'CB', 'RB', 'RWB'], mid: ['LM', 'LCM', 'CM', 'RCM', 'RM'], front: ['LW', 'LS', 'ST', 'RS', 'RW'] },
    };
    
    const rows = [];
    let slotIndex = 0;
    
    // Check if first number is 1 (goalkeeper)
    if (parts[0] === 1 && matchSize >= 7) {
        rows.push({ positions: ['GK'], slotStart: slotIndex });
        slotIndex += 1;
        parts.shift();
    }
    
    parts.forEach((count, idx) => {
        const rowType = idx === 0 ? 'back' : (idx === parts.length - 1 ? 'front' : 'mid');
        const positions = positionsByRow[count]?.[rowType] || Array(count).fill('').map((_, i) => `P${slotIndex + i + 1}`);
        rows.push({ positions: positions.slice(0, count), slotStart: slotIndex });
        slotIndex += count;
    });
    
    return rows;
}

function renderFormationLayout() {
    const formations = FORMATION_TEMPLATES[state.matchSize] || [];
    const currentFormation = formations.find(f => f.name === state.formation);
    const rows = getFormationRows(state.formation, state.matchSize);
    
    let slotIndex = 0;
    return rows.map((row, rowIdx) => {
        const rowHtml = row.positions.map((position, posIdx) => {
            const actualSlotIndex = slotIndex;
            slotIndex++;
            const playerId = state.pitchSlots[actualSlotIndex];
            const player = playerId ? state.players.find(p => p.id === playerId) : null;
            
            return `<div class="pitch-slot ${playerId ? 'filled' : 'empty'}" data-slot="${actualSlotIndex}" ondragover="handleDragOver(event)" ondragenter="handleDragEnter(event)" ondragleave="handleDragLeave(event)" ondrop="handleDrop(event, ${actualSlotIndex})">
                ${player ? `
                    <div class="pitch-player" draggable="true" ondragstart="handleDragStart(event, ${player.id})" ondragend="handleDragEnd(event)" onclick="scoreGoal(${player.id})">
                        <div class="player-position">${position}</div>
                        <div class="player-avatar">${player.number}</div>
                        <div class="player-name-tag">${player.name}</div>
                        <div class="player-time" data-player-time="${player.id}">${formatTime(player.timeOnPitch)}</div>
                        <button class="player-sub-btn" onclick="event.stopPropagation(); removePlayerFromPitch(${player.id})" title="Sub out">↓</button>
                    </div>
                ` : `
                    <span class="slot-position">${position}</span>
                    <span class="slot-number">${actualSlotIndex + 1}</span>
                `}
            </div>`;
        }).join('');
        
        return `<div class="formation-row" data-row="${rowIdx}" style="--players-in-row: ${row.positions.length}">${rowHtml}</div>`;
    }).reverse().join(''); // Reverse so forwards are at top
}

function render() {
    const app = document.getElementById('app');
    playerTimeElements = {};
    const formations = FORMATION_TEMPLATES[state.matchSize] || [];
    const benchPlayers = state.players.filter(p => !p.onPitch);
    const squadSize = getSquadSize(state.matchSize);
    const subsCount = squadSize - state.matchSize;
    
    app.innerHTML = `
        <header class="app-header">
            <div class="header-top">
                <h1 class="app-title">LIVESCORE PRO</h1>
                <div class="header-actions">
                    <button class="btn btn-secondary btn-icon" onclick="showSaveResult()" title="Save Result">📸</button>
                    <button class="btn btn-secondary btn-icon" onclick="openSettings('team')" title="Settings">⚙️</button>
                </div>
            </div>
            <div class="clock-section">
                <div class="match-clock">
                    <div class="clock-time" id="mainClock">${formatTime(state.seconds)}</div>
                    <div class="clock-label">Match Time</div>
                    <div class="clock-controls">
                        <button class="btn ${state.isRunning ? 'btn-danger' : 'btn-primary'}" onclick="toggleTimer()">${state.isRunning ? '⏸ Pause' : '▶ Start'}</button>
                        <button class="btn btn-secondary" onclick="resetMatch()">↺ Reset</button>
                    </div>
                </div>
            </div>
        </header>
        <div class="sticky-scoreboard">
            <div class="scoreboard-compact">
                <div class="team-side home" onclick="openSettings('home-logo')">
                    <div class="team-badge-sm">${state.teamLogo ? `<img src="${state.teamLogo}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="badge-initials" style="display:none">${getInitials(state.teamName)}</span>` : `<span class="badge-initials">${getInitials(state.teamName)}</span>`}</div>
                    <div class="team-name-sm">${state.teamName}</div>
                </div>
                <div class="score-center-sticky">
                    <div class="score-row">
                        <span class="score-num home">${state.homeScore}</span>
                        <span class="score-sep">:</span>
                        <span class="score-num away">${state.awayScore}</span>
                    </div>
                    <div class="score-time" id="stickyTime">${formatTime(state.seconds)}</div>
                </div>
                <div class="team-side away">
                    <div class="team-badge-sm" onclick="openSettings('away-logo')">${state.awayTeamLogo ? `<img src="${state.awayTeamLogo}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="badge-initials" style="display:none">${getInitials(state.awayTeamName)}</span>` : `<span class="badge-initials">${getInitials(state.awayTeamName)}</span>`}</div>
                    <div class="team-name-sm">${state.awayTeamName}</div>
                    <button class="away-goal-btn-sm" onclick="event.stopPropagation(); scoreAwayGoal()">⚽ Goal</button>
                </div>
            </div>
        </div>
        <main class="main-content">
            <div class="pitch-container">
                <div class="pitch-markings"><div class="center-line"></div><div class="center-circle"></div><div class="penalty-area"></div></div>
                <div class="pitch-formation" id="pitchFormation">
                    ${renderFormationLayout()}
                </div>
            </div>
            <div class="match-config">
                <div class="config-row">
                    <label class="config-label">Match</label>
                    <select class="config-select" onchange="setMatchSize(parseInt(this.value))">${[3,4,5,6,7,8,9,10,11].map(s => `<option value="${s}" ${state.matchSize === s ? 'selected' : ''}>${s}v${s}</option>`).join('')}</select>
                </div>
                <div class="config-row">
                    <label class="config-label">Formation</label>
                    <select class="config-select" onchange="setFormation(this.value)">${formations.map(f => `<option value="${f.name}" ${state.formation === f.name ? 'selected' : ''}>${f.name}</option>`).join('')}</select>
                </div>
            </div>
            <div class="bench-container">
                <div class="bench-header"><h2 class="bench-title">📋 BENCH</h2><span class="player-count">${benchPlayers.length}/${subsCount} subs</span></div>
                <div class="bench-players">${benchPlayers.length === 0 ? '<div class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-text">All players on pitch</div></div>' : benchPlayers.map(player => `<div class="bench-player" draggable="true" ondragstart="handleDragStart(event, ${player.id})" ondragend="handleDragEnd(event)" ontouchstart="handleTouchStart(event, ${player.id})" ontouchmove="handleTouchMove(event)" ontouchend="handleTouchEnd(event)"><div class="player-avatar">${player.number}</div><div class="bench-player-info"><span class="player-name">${player.name}</span><span class="player-time">${formatTime(player.timeOnPitch)}</span></div></div>`).join('')}</div>
                <button class="btn btn-secondary edit-squad-btn" onclick="openSettings('players')">✏️ Edit Squad</button>
            </div>
            <div class="goal-log-container">
                <div class="goal-log-header"><h2 class="goal-log-title">⚽ GOAL LOG</h2></div>
                <div class="goal-log-list">${state.goals.length === 0 ? '<div class="empty-state"><div class="empty-state-text">No goals yet</div></div>' : state.goals.map(goal => `<div class="goal-entry ${goal.team}"><span class="goal-time">${formatTime(goal.time)}</span><span class="goal-score">${goal.homeScore}-${goal.awayScore}</span><span class="goal-icon">⚽</span><span class="goal-scorer">${goal.team === 'home' ? `${state.teamName} - ${goal.scorer}` : goal.scorer}</span></div>`).join('')}</div>
            </div>
        </main>
        ${state.showSettings ? renderSettingsModal() : ''}
        ${state.showSaveResult ? renderSaveResultModal() : ''}
    `;
    clockElement = document.getElementById('mainClock');
    document.querySelectorAll('[data-player-time]').forEach(el => { playerTimeElements[el.dataset.playerTime] = el; });
}

function renderSettingsModal() {
    return `<div class="modal-overlay" onclick="if(event.target === this) closeSettings()"><div class="modal"><div class="modal-header"><h2 class="modal-title">Settings</h2><button class="modal-close" onclick="closeSettings()">×</button></div><div class="settings-tabs"><button class="settings-tab ${state.settingsTab === 'team' ? 'active' : ''}" onclick="state.settingsTab='team'; render()">Team</button><button class="settings-tab ${state.settingsTab === 'home-logo' || state.settingsTab === 'away-logo' ? 'active' : ''}" onclick="state.settingsTab='home-logo'; render()">Logos</button><button class="settings-tab ${state.settingsTab === 'players' ? 'active' : ''}" onclick="state.settingsTab='players'; render()">Squad</button></div>
    ${state.settingsTab === 'team' ? `<div class="form-group"><label class="form-label">Your Team Name</label><input type="text" class="form-input" value="${state.teamName}" onchange="updateTeamName(this.value)" placeholder="Team name"></div><div class="form-group"><label class="form-label">Opponent Name</label><input type="text" class="form-input" value="${state.awayTeamName}" onchange="updateAwayTeamName(this.value)" placeholder="Opponent"></div><div class="form-group"><label class="form-label">📍 Match Location</label><input type="text" class="form-input" value="${state.matchLocation}" onchange="updateMatchLocation(this.value)" placeholder="Stadium or pitch name"></div><div class="form-row"><div class="form-group half"><label class="form-label">Match Date</label><input type="text" class="form-input" value="${state.matchDate}" onchange="updateMatchDate(this.value)" placeholder="DD-MM-YYYY"></div><div class="form-group half"><label class="form-label">Kick-off</label><input type="text" class="form-input" value="${state.matchTime}" onchange="updateMatchTime(this.value)" placeholder="HH:MM"></div></div>` : ''}
    ${state.settingsTab === 'home-logo' || state.settingsTab === 'away-logo' ? `<div class="logo-target-tabs"><button class="logo-tab ${state.settingsTab === 'home-logo' ? 'active' : ''}" onclick="state.settingsTab='home-logo'; render()">${state.teamName}</button><button class="logo-tab ${state.settingsTab === 'away-logo' ? 'active' : ''}" onclick="state.settingsTab='away-logo'; render()">${state.awayTeamName}</button></div><div class="current-logo"><div class="logo-preview ${(state.settingsTab === 'home-logo' ? state.teamLogo : state.awayTeamLogo) ? 'has-logo' : ''}">${(state.settingsTab === 'home-logo' ? state.teamLogo : state.awayTeamLogo) ? `<img src="${state.settingsTab === 'home-logo' ? state.teamLogo : state.awayTeamLogo}" alt="" onerror="this.style.display='none'">` : ''}<span class="preview-initials">${getInitials(state.settingsTab === 'home-logo' ? state.teamName : state.awayTeamName)}</span></div>${(state.settingsTab === 'home-logo' ? state.teamLogo : state.awayTeamLogo) ? `<button class="btn btn-danger btn-sm" onclick="clearLogo('${state.settingsTab === 'home-logo' ? 'home' : 'away'}')">Remove</button>` : ''}</div><div class="form-group"><label class="form-label">Upload from Device</label><label class="file-upload-btn">📁 Choose Image<input type="file" accept="image/*" onchange="handleLogoUpload(event, '${state.settingsTab === 'home-logo' ? 'home' : 'away'}')" hidden></label></div>` : ''}
    ${state.settingsTab === 'players' ? `<div class="squad-info"><span class="squad-size">${state.matchSize}v${state.matchSize}</span><span class="squad-detail">${state.matchSize} on pitch + ${getSquadSize(state.matchSize) - state.matchSize} subs = ${getSquadSize(state.matchSize)} total</span></div><div class="player-list-edit">${state.players.map((player, idx) => `<div class="player-edit-row"><span class="player-edit-num">${idx + 1}</span><input type="text" value="${player.name}" onchange="updatePlayerName(${player.id}, this.value)" placeholder="Player name"><button class="btn-remove-player" onclick="removePlayer(${player.id})" ${state.players.length <= state.matchSize ? 'disabled' : ''}>×</button></div>`).join('')}</div><button class="add-player-btn" onclick="addPlayer()">+ Add Player</button>` : ''}
    <button class="btn btn-primary modal-done-btn" onclick="closeSettings()">Done</button></div></div>`;
}

function renderSaveResultModal() {
    return `<div class="modal-overlay" onclick="if(event.target === this) closeSaveResult()"><div class="modal modal-large"><div class="modal-header"><h2 class="modal-title">Save Match Result</h2><button class="modal-close" onclick="closeSaveResult()">×</button></div><div class="result-preview"><canvas id="resultCanvas" style="max-width:100%;height:auto;border-radius:12px;"></canvas></div><div class="save-actions"><a id="downloadResultBtn" class="btn btn-primary" href="#" download="match-result.png">📥 Download Image</a><button class="btn btn-secondary" onclick="closeSaveResult()">Close</button></div></div></div>`;
}

function init() {
    const saved = localStorage.getItem('livescore-pro-v2');
    if (saved) {
        try { Object.assign(state, JSON.parse(saved)); state.isRunning = false; state.interval = null; } catch (e) {}
    }
    setInterval(() => { const s = { ...state }; delete s.interval; localStorage.setItem('livescore-pro-v2', JSON.stringify(s)); }, 5000);
    render();
}

document.addEventListener('DOMContentLoaded', init);
