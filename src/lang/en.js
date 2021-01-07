export default {
    login: 'You need to log in to continue',
    nav: {
        home: 'Home',
        info: 'Information',
        results: 'Results',
        voting: 'Song Voting',
        submissions: 'Submit your entry!',
        login: 'Log In',
        logout: 'Log out',
    },
    index: {
        links: {
            discord: 'Join us!',
            forumPost: 'Forum Post',
            voting: 'Song Voting!',
            submissions: 'Submit your entry!',
        },
        schedule: {
            title: 'Schedule',
            announcement: 'Announcement, Songs Nomination',
            voting: 'Songs Voting',
            mapping: 'Mapping',
            judging: 'Judging',
            results: 'Results Announcement',
        },
        prices: {
            title: 'Prizes',
            firstPlace: '1st place',
            secondPlace: '2nd place',
            thirdPlace: '3rd place',
            supporter: '{count} month of osu!supporter | {count} months of osu!supporter',
            supporterNote: '(depends on sponsorship)',
        },
        sponsorship: {
            title: 'Call-for-Sponsors',
            contact: 'Please contact',
            detail: 'if you would like to become a sponsor for this community-run contest, we are in urgent need of sponsorship for the prizes of winners! Sponsors will have higher voting weights in Songs Voting and have chance to vote with committee on finalizing the songs to use in this contest.',
        },
    },
    voting: {
        title: 'Song Voting',
        description: 'Vote for the songs you like the most by giving up to 3 points on each listing!',
        note: 'Note that some preview links may not be available in your region, e.g. Netease Music is not available outside China Mainland. Please use the artist and title to search for preview links online.',
        fa: 'FA Songs',
        others: 'Rest of Songs',
        results: {
            title: 'Public Song Voting Results',
            description: 'Sum of votes from the voting stage, 1 song will be used from the FA listing and 2 from the rest! Other 3 songs were chosen from the staff',
        },
    },
    submissions: {
        title: '.zip Submissions',
        table: {
            song: 'Song',
            date: 'Submission Date',
            download: 'download',
        },
        deadline: {
            from: 'You have from',
            to: 'to',
            submit: 'to submit your entry',
        },
        input: {
            browse: 'Browse',
            placeholder: '.zip File (20Mb max)',
        },
        save: 'Save',
    },
    information: {
        intro: {
            hello: 'Hello! It is the time to celebrate again the great annual mapping contest – Newspaper Cup!',
            history: 'NPC is now a generic mapping contest that allows every valid user in osu! to participate and win prizes like badge or supporter tags! (just like PDC)',
            moreInfo: {
                go: 'For more detailed information go to the forum post',
                here: 'here',
            },
        },
        ruleset: {
            title: 'Ruleset',
            note: 'Please read the rules carefully. Participants who violate the rules will be in risk of losing points or, under certain circumstances, have themselves disqualified from this contest.',
            rules: [
                {
                    category: 'Beatmapping (Very important! Please check your map before submitting.)',
                    rules: [
                        'Following sections in .osu file provided in the template must be left unchanged: AudioFilename, AudioLeadIn, Mode, LetterboxInBreaks, WidescreenStoryboard, Title, TitleUnicode, Artist, ArtistUnicode, Source, Tags, BeatmapID, BeatmapSetID AND The entire [Events] section except for breaks.',
                        'You CAN modify timing based on your own discretion.',
                        'Ranking Criteria is enforced except for inapplicable items such as spread requirements, etc.',
                        'Your map must be loadable and readable by osu! client.',
                        'You must complete the map on your own effort.',
                        'Your map should not be revealed to anyone other than yourself before the announcement of the contest results. This includes what track or song you are mapping. Your map should not contain information that can help with identifying you.',
                        'Judges cannot participate in the contest.',
                        'Submitting entries means understanding and agreeing the ruleset above.',
                        'All rights reserved to the NPC 2021 Committee.',
                    ],
                },
                {
                    category: 'Submission',
                    rules: [
                        'Only submissions through this website',
                    ],
                },
                {
                    category: 'Judging',
                    rules: [
                        'Each judge will score the submissions independently. Judges will not know the creator of the submissions.',
                        'The unit of scoring is 1%. The categories of Judging are listed below (Expertise, Cohesion, Creativity, Judge’s Impression)',
                        'The score will be standardized per the following method: The final score S* of a submission in the Qualifier Round is obtained by: S* = ( S - S(average) ) / SD, in which S is the Original Score, S(average) is the average of all Original Scores that a judge has given throughout the round and SD is the standard deviation of all Original Scores that a judge has given throughout the round.',
                        'For each song group, participants will be sorted in a descending order according to their Actual Score',
                    ],
                },
                {
                    category: 'Definition of Novice Mapper (You must satisfy ALL the items listed to be considered as a novice mapper)',
                    rules: [
                        'Smurf Prevention:',
                        'i. Your account is created before 2020.9.10;',
                        'ii. You have submitted at least one mapset to osu!BSS before 2020.11.10;',
                        'iii. You have at least 30 kudosus OR 2,000 play counts OR 500,000 TTH.',
                        'Mapping and Modding Experience:',
                        'i. You have, at most, 1 ranked / qualified difficulties of Insane or higher (according to osu! Website icon), this includes your mapset, guest or collab difficulties before 2020.12.10;',
                        'ii. You have less than 6 ranked / qualified difficulties in total, this includes your mapset, guest or collab difficulties before 2020.12.10;',
                        'iii. You have less than 500 kudosus. You are not, or have never been a member of mapping and modding-related osu! teams (BAT, MAT, BN, QAT, NAT, etc.);',
                        'iv. You have never been ranked within first three places of mapping contests (PDC, NPC, MBC, Aspire, Mapping Olympics, o!bwc, etc.);',
                        'v. You pass our case-by-case check of eligibility of being a novice mapper.',
                        'Don’t be sad if you are not eligible to be novice. You can still participate and win badges and prizes as a regular mapper!',
                    ],
                },
            ],
        },
        songs: {
            title: 'Songs',
            description: 'You can participate in both tracks but you can only select one song inside one track. Download template at: https://drive.google.com/file/d/1kaQsevs3YV72AsieThjsmKh19N-DJGQn or at https://pan.baidu.com/s/1lDfx8siRCObFUpGGK-A8yw 提取码：npc2 (Thanks pw384!).',
        },
        rankingPrizes: {
            title: 'Ranking and Prizes',
            description: 'The NPC 2021 uses a new ranking system. Ranking will be split into two tracks: Instrumental Group and Vocal Track. The 1st place of each track and the highest-ranked novice mapper of each track will be awarded a badge (to apply). The novice must ranked <15 AND <40% of participants in each track to receive the prize. (This is to ensure the quality of maps we award to.)',
        },
        criterias: {
            title: 'Criterias',
            criterias: [
                { percentage: '30%', name: 'Expertise', description: 'How well does the submission demonstrate techniques regarding structure, music representation, flow, hitsounding, etc?' },
                { percentage: '30%', name: 'Cohesion', description: 'How consistent is the submission regarding structure, music representation, flow, hitsounding etc especially between different sections?' },
                { percentage: '30%', name: 'Creativity', description: 'How well does the submission show originality and uniqueness compared with the other submissions with reasonable respect to the playability?' },
                { percentage: '10%', name: `Judge's Impression`, description: 'This is the part of the score left to the Judges’ personal preferences on the submission' },
            ],
        },
    },
};
