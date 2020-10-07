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
        title: '.osz Submissions',
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
            placeholder: '.osz File (20Mb max)',
        },
        save: 'Save',
    },
    information: {
        intro: {
            hello: 'Hello! It is the time to celebrate again the great annual mapping contest – Pending Cup!',
            history: 'Pending Cup is originally a Chinese mapping contest, which had its first iteration in 2013 and held by NatsumeRin. Through the past years, Pending Cup has always been a means of encouraging creative mapping and finding new talent across the entire mapping community, and it will always be the core value of the contest. We would strongly encourage and welcome you to participate this event!',
            moreInfo: {
                go: 'For more detailed information go to the forum post',
                here: 'here',
            },
        },
        ruleset: {
            title: 'Ruleset',
            note: 'Please read the rules carefully. Participants who violate the rules will be in risk of losing points or, under certain circumstances, have themselves disqualified from this contest.',
            rules: [
                'Submission deadline is enforced.',
                'Submission must be complete, i.e, loadable and readable by osu! client.',
                'Custom hitsounds are allowed.',
                'Title, Artist, MP3, Source, Tags must NOT be modified. However, preview point can be customized.',
                'No background, video, skin and storyboard (including storyboard hitsounds) are allowed. However, custom combo colors are allowed.',
                'Submission must be finished by the contestant only. No collaboration is allowed.',
                'You cannot provide submission to any other individuals or parties before results are administered to the contestants and announced. Your submission should not contain information that helps Judges to recognize you.',
                'No registration is required to enter the contest. Please directly submit through the website.',
                'No smurfing account / multiaccount is allowed.',
                'Ranking criteria should be obeyed except for apparently not applicable cases such as spread requirements.',
                'Submitting entries means understanding and agreeing the ruleset above.',
                'All rights reserved to the PDC2020 Committee.',
            ],
        },
        songs: {
            title: 'Songs',
            description: 'The contest introduces three groups of songs. Participants are able to compete in all groups, but may only chose ONE song from each group to attend the contest.',
        },
        mapping: {
            title: 'Mapping',
            rules: [
                'Participants have to change the Beatmap Creator in song setup to your OSU! ID, such as "Mafumafu."',
                'One and only one difficulty is allowed. If multiple difficulties are submitted, only the one with the highest star difficulty will be accepted.',
                'Only the following difficulty names are allowed: Easy/Normal/Hard/Insane/Expert/Extra',
            ],
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
