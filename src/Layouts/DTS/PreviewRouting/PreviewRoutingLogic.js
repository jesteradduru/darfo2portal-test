export const getLegendDescription = (legend, text) => {
    switch(legend){
        case 'for_information':
            return 'For your information/file & reference';
        case 'for_review':
            return 'For your review/comments/recommendation/validation';
        case 'draft_reply':
            return 'Draft reply/For your acknowledgement: ' + text;
        case 'rush':
            return 'Rush';
        case 'urgent':
            return 'Urgent';
        case 'for_circulation':
            return 'For circulation & dissemination';
        case 'for_schedule':
            return 'For schedule';
        case 'attend':
            return 'Attend/Represent Me';
        case 'consolidate':
            return text;
        default:
            return 'For your appropriate action'
    }
}