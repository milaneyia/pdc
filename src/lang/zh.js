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
            hello: '大家好，万众期待的 Pending Cup 2020作图比赛又来了！',
            history: 'Pending杯，源于华人社区的比赛。自2013年由 NatsumeRin 赞助举办第一届以来，现在已经举办到了第8届。在历届比赛中，Pending杯 以激发创新、鼓励新人为基本原则进行规则与奖项设置，因此出现了许多优秀作品与潜力新人。本届比赛也将一如既往举行。',
        },
        ruleset: {
            title: '比赛规则',
            note: '请仔细阅读此规则，违反规则的参赛者视情节轻重将会扣分直至取消参赛资格！',
            rules: [
                '参赛者的提交谱面时间不能晚于提交截止日期。',
                '参赛者不能提交无法读取或未完成的谱面。',
                '参赛者可以使用自定义音效。',
                '参赛者不能修改谱面中的Title, Artist, MP3, Source, Tags项目，但可以自定义预览点。',
                '参赛者不能为谱面添加背景、视频、皮肤或Storyboard（包括Storyboard音效），但可以修改Combo颜色。',
                '参赛者必须独立完成谱面，不能提交合作完成的谱面。',
                '在比赛结果公布前，参赛谱面不能以任何形式被公开或传播；参赛者不能向评委提供有助于辨识谱面作者的信息。',
                '本届比赛无需报名，参赛选手直接提交作品。',
                '禁止使用小号参赛。',
                '提交作品应遵守Ranking Criteria。',
                '提交作品即代表参赛者同意并遵守以上所有规则。',
                '鉴于本届PDC采用新规则，如有任何争议，组委会将保留最终决定权。',
            ],
        },
        songs: {
            title: '比赛曲目',
            description: '本次比赛共计三组歌曲，参赛者可以参加全部三组歌曲的角逐，但在每一组歌曲内参赛者仅能选择一首歌曲创作谱面。',
        },
        mapping: {
            title: '谱面制作',
            rules: [
                '参赛者需把模版中的Creator改成参赛者ID，例如"Mafumafu"。',
                '参赛者只需完成一个难度，如果提交多个难度，会以难度星级最高的为准。',
                '只允许使用下列难度名：Easy/Normal/Hard/Insane/Expert/Extra',
            ],
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
