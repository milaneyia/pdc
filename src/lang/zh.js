export default {
    login: '请登录以继续',
    nav: {
        home: '赛事主页',
        info: '信息',
        results: '赛事结果',
        voting: '选曲投票',
        submissions: '提交作品',
        login: '登陆账号',
        logout: '登出账号',
    },
    index: {
        links: {
            discord: '加入服务器',
            forumPost: '论坛链接',
            voting: '选曲投票',
            submissions: '提交作品',
        },
        schedule: {
            title: '赛事日程',
            announcement: '赛事公告，选曲提名',
            voting: '选曲投票',
            mapping: '谱面制作',
            judging: '评委评分',
            results: '结果公布',
        },
        prices: {
            title: '奖项设置',
            firstPlace: '冠军',
            secondPlace: '亚军',
            thirdPlace: '季军',
            supporter: '{count} 月 osu!supporter | {count} 月 osu!supporter',
            supporterNote: '(视赞助情况而定)',
        },
        sponsorship: {
            title: '寻求赞助',
            contact: '联系我们',
            detail: '欢迎赞助本届PDC！赞助金额将100%用于为选手(以及评委)提供奖品。赞助将有更高的投票权重并有机会进入组委投票环节。',
        },
    },
    voting: {
        title: '选曲投票',
        description: '选择你最喜欢的歌曲投票，每个列表最多可投3票。',
        fa: '官方艺术家作品',
        others: '其他作品',
    },
    submissions: {
        title: '作品 (.zip) 提交',
        table: {
            song: '曲目',
            date: '提交时间',
            download: '下载',
        },
        deadline: {
            from: '作品提交时间为',
            to: '至',
            submit: '', //This is left blank inteionally.
        },
        input: {
            browse: '浏览',
            placeholder: '.zip 格式 (最高20Mb)',
        },
        save: '保存',
    },
    information: {
        intro: {
            hello: '大家好，万众期待的 Newspaper Cup 2020作图比赛又来了！',
            history: 'NPC是一個製圖比賽，只要你的osu帳號是有效且正當的皆可參加。參加比賽還有機會贏得badge獎章或是osu贊助者標籤！(就跟PDC一樣)',
        },
        ruleset: {
            title: '比赛规则',
            note: '请仔细阅读此规则，违反规则的参赛者视情节轻重将会扣分直至取消参赛资格！',
            rules: [
                {
                    category: '製作圖譜 (這非常重要 這非常重要 這非常重要，請在提交圖譜之前再三確認沒有問題後再提交。)',
                    rules: [
                        '在下載完歌曲後，歌曲資料夾裡會有個.osu檔案，千萬不要更改下列的東西。AudioFilename, AudioLeadIn, Mode, LetterboxInBreaks, WidescreenStoryboard, Title, TitleUnicode, Artist, ArtistUnicode, Source, Tags, BeatmapID, BeatmapSetID 還有除了休息時間外的整個[Events]部分',
                        '如果你覺得timing有疑慮或怪怪的，你可以自行調整。',
                        '圖譜“必須”符合Ranking Criteria。不過像是RC中的難度分布(spread)之類的則除外。',
                        '您的圖譜必須要可以被osu!讀取以及可以被載入到osu!客戶端當中。',
                        '您必須“獨自”完成圖譜，不能以協作或是其他方式完成圖譜。',
                        '在宣布比賽結果之前，不得透漏圖譜內容或是資訊給您(自己)以外的其他人。像是您正在作的類型或是曲目，編輯器內容。並且不能在圖譜中加入有助於認出您身分的任何訊息(ID之類的)，這會使比賽有失公正性。',
                        '比賽評審不能參與比賽',
                        '提交圖譜代表您已經了解並且同意以上規則。',
                        'NPC 2021委員會會保留所有權利(All Rights Reserved)',
                    ],
                },
                {
                    category: '提交圖譜',
                    rules: [
                        '仅通过本网站提交',
                    ],
                },
                {
                    category: '關於裁判圖譜',
                    rules: [
                        '每位評審將會對圖譜進行獨立評分，評審不會知道自己正在評審的圖譜是誰製作的(請看1.6)',
                        '評分單位為百分比，評審的類型如下列 (專長, 圖譜結合力, 創造力, 評審印象分)',
                        '分數將會按照以下公式進行標準化: S* = ( S - S(平均值) ) / SD',
                        'S*是在資格賽的最終得分',
                        'S為原始分數',
                        'S(平均值)為每位評審的原始得分平均的結果',
                        'SD為評審在該回合中給出所有原始分數的標準差',
                        '在每個歌曲組別中，玩家們將會以他們的實際得分進行排名。',
                    ],
                },
                {
                    category: '新手製圖者的標準如下 (你必須符合以下所有列出的條件，才能在此比賽中被定義成新手製圖者)',
                    rules: [
                        '防止小號/分帳',
                        '一. 您的帳號必須在2020年9月10號前創立',
                        '二. 曾經在2020年11月10號前上傳最少一張圖譜',
                        '三. 您至少要有30個kudosus或是2,000次遊玩次數(play counts)或是500,000次總命中次數(Total Hits)',
                        '關於製圖或是摸圖的經驗',
                        '一. 您只能擁有一張難度在Insane(含以上)的進榜或是合格的譜面(難度由osu官網的圖示判定)，並且這包含了在2020年12月10號之前的任何GD(guest difficult)或是協作難度(collab)。',
                        '二. 您擁有的進榜或是合格的“難度”數量總數少於六張，並且這包含了在2020年12月10號之前的任何GD(guest difficult)或是協作難度(collab)。',
                        '三. 您的kudosus必須少於500個，並且“不是”或者“曾經擔任過”有關製圖的osu團隊職位。例如BAT, MAT, BN, QAT, NAT等。',
                        '四. 您從未在製圖比賽中獲得前三名。例如PDC，NPC，MBC，Aspire，Mapping Olympics，o！bwc等。',
                        '五. 成功通過委員會的人工審查判定是否為新手製圖者。',
                        '如果您沒有通過以上條件，請不要難過。因為您還是可以做為一般製圖者參加比賽並贏得比賽獎品。',
                    ],
                },
            ],
        },
        songs: {
            title: '比赛曲目',
            description: '您可以同時參與這兩種類型製圖，但是一種類型中只能選擇一首歌曲(器樂跟人聲各選一首 或是 器樂選一首 或是 人聲選一首)。下載連結: https://drive.google.com/file/d/1kaQsevs3YV72AsieThjsmKh19N-DJGQn | https://pan.baidu.com/s/1lDfx8siRCObFUpGGK-A8yw 提取码：npc2 (Thanks pw384!)',
        },
        rankingPrizes: {
            title: '排名以及獎項',
            description: '在這次NPC2021使用了新的排名系統。排名將會分成樂器演奏組以及人聲演奏組。每個組別的第一名新手製圖者會獲得badge獎章。不過新手製圖者必須要在排名前十五名并且超過六成的比賽參與者才能獲得獎勵。(這是為了確保圖譜質量)',
        },
        criterias: {
            title: '标准',
            criterias: [
                { percentage: '30%', name: '技巧性 ', description: '作品的节奏、排列风格、音效等元素是否展现了一定的技巧？' },
                { percentage: '30%', name: '连贯性', description: '作品节奏、排列风格、音效等元素的使用是否一致？' },
                { percentage: '30%', name: '创新性', description: '在保有适当可玩性的情况下，相比于其他作品是否运用了独创或少见的风格？' },
                { percentage: '10%', name: `评委印象`, description: '评委的个人印象打分。' },
            ],
        },
    },
};
