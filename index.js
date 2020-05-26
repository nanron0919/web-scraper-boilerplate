const cheerio = require('cheerio');
const axios = require('axios');

(async () => {
    const res = await axios.get('http://www.cpbl.com.tw/schedule/index/2020-05-26.html?&date=2020-05-01&gameno=01&sfieldsub=&sgameno=01');
    const $ = cheerio(res.data);
    const scheduleBlocks = $.find('.one_block');

    const teamMap = {
        'B04': '富邦悍將',
        'AJL011': 'Rakuten Monkeys',
        'L01': '統一7-ELEVEn獅',
        'E02': '中信兄弟',
    };
    const parseTeamId = (imgEl) => {
        const src = imgEl.attr('src');

        return src.replace(/^.*\/(\w+)_logo_01\.png/, '$1');
    };

    const games = scheduleBlocks.map((i, el) => {
        const block = cheerio(el);
        const teams = block.find('.schedule_team');

        return {
            guest: parseTeamId(teams.find('td:first-child img')),
            home: parseTeamId(teams.find('td:last-child img')),
            venue: teams.find('td:nth-child(2)').text(),
        };
    }).get();

    console.log(games);
})();