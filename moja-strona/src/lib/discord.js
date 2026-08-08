import { getLang } from './i18n.js';

const DISCORD_ID = '751089335998218440';

const statusColors = {
    online: '#23a55a',
    idle: '#f0b232',
    dnd: '#f23f43',
    offline: '#80848e',
};

const statusLabels = {
    online: 'Online',
    idle: 'Zaraz wracam',
    dnd: 'Nie przeszkadzać',
    offline: 'Offline',
};
const statusLabelsEn = {
    online: 'Online',
    idle: 'Away',
    dnd: 'Do Not Disturb',
    offline: 'Offline',
};

const activityTypes = {
    0: 'Gra w',
    1: 'Streamuje',
    2: 'Słucha',
    3: 'Ogląda',
    4: 'Niestandardowy',
    5: 'Konkuruje w',
};
const activityTypesEn = {
    0: 'Playing',
    1: 'Streaming',
    2: 'Listening to',
    3: 'Watching',
    4: 'Custom status',
    5: 'Competing in',
};

function setDiscordPresence(data) {
    const user = data.discord_user;
    const status = data.discord_status;

    const avatar = document.getElementById('discord-avatar');
    let avatarSrc;
    if (user.avatar) {
        const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
        avatarSrc = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=128`;
    } else {
        const idx = (parseInt(user.discriminator, 10) || user.id) % 5;
        avatarSrc = `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
    }
    avatar.src = avatarSrc;

    document.getElementById('discord-name').textContent = user.global_name || user.username;
    document.getElementById('discord-username').textContent = '@' + user.username;

    const color = statusColors[status] || statusColors.offline;

    const dot = document.getElementById('discord-status-dot');
    dot.style.background = color;
    dot.style.boxShadow = `0 0 8px ${color}, 0 0 20px ${color}66`;

    document.getElementById('discord-status-text').textContent = (getLang() === 'en' ? statusLabelsEn : statusLabels)[status] || 'Offline';
    const badge = document.getElementById('discord-status-badge');
    const dot2 = badge.querySelector('span');
    dot2.style.background = color;
    dot2.style.boxShadow = `0 0 6px ${color}, 0 0 14px ${color}66`;

    const activityDiv = document.getElementById('discord-activity');
    const spotify = data.listening_to_spotify && data.spotify;
    const activity = data.activities && !spotify && data.activities.find(a => a.type === 0);

    if (spotify) {
        activityDiv.classList.add('open');
        const iconDiv = document.getElementById('activity-icon');
        iconDiv.innerHTML = `<img src="https://i.scdn.co/image/${spotify.album_art_url.split('/').pop()}" alt="" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML=''">`;
        document.getElementById('activity-name').textContent = (getLang() === 'en' ? 'Listening to' : 'Słucha') + ' ' + spotify.song;
        document.getElementById('activity-detail').textContent = `${spotify.artist} · ${spotify.album}`;
    } else if (activity) {
        activityDiv.classList.add('open');
        const iconDiv = document.getElementById('activity-icon');
        if (activity.assets && activity.assets.large_image) {
            const img = activity.assets.large_image;
            const src = img.startsWith('mp:')
                ? `https://media.discordapp.net/${img.slice(3)}`
                : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
            iconDiv.innerHTML = `<img src="${src}" alt="" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML=''">`;
        } else {
            iconDiv.innerHTML = '';
        }
        const prefix = (getLang() === 'en' ? activityTypesEn : activityTypes)[activity.type] || '';
        document.getElementById('activity-name').textContent = prefix ? `${prefix} ${activity.name}` : activity.name;
        document.getElementById('activity-detail').textContent = activity.details || '';
    } else {
        activityDiv.classList.remove('open');
        document.getElementById('activity-icon').innerHTML = '';
        document.getElementById('activity-name').textContent = '';
        document.getElementById('activity-detail').textContent = '';
    }
}

function fetchPresence() {
    fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}?_=${Date.now()}`)
        .then(r => r.json())
        .then(res => {
            if (res.data) setDiscordPresence(res.data);
        })
        .catch(() => {});
}

export function initDiscord() {
    let timer = null;

    function start() {
        if (timer) return;
        timer = setInterval(fetchPresence, 30000);
    }

    function stop() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stop();
        } else {
            fetchPresence();
            start();
        }
    });

    fetchPresence();
    start();
}
