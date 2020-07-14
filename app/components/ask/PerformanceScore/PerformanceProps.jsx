import { BADGE, PERFORMANCE } from 'appConstants/user';
import { colors } from 'styles/colors';

import bronzeImg from 'assets/images/badges/bronze.svg';
import silverImg from 'assets/images/badges/silver.svg';
import goldImg from 'assets/images/badges/gold.svg';
import platinumImg from 'assets/images/badges/platinum.svg';

import searchCardImg from 'assets/images/accomplishments/search-card.png';
import createCardImg from 'assets/images/accomplishments/create-card.png';
import markHelpfulImg from 'assets/images/accomplishments/mark-helpful.png';
import addSlackImg from 'assets/images/accomplishments/add-slack.png';

import profilePictureImg from 'assets/images/accomplishments/profile-picture.png';
import externalVerifyImg from 'assets/images/accomplishments/external-verify.png';

import allUpdatedImg from 'assets/images/accomplishments/all-updated.png';
import addSubscriberImg from 'assets/images/accomplishments/add-subscriber.png';

import slackFindImg from 'assets/images/accomplishments/slack-find.png';
import existingKnowledgeImg from 'assets/images/accomplishments/existing-knowledge.png';

export const GET_STARTED_PERFORMANCE_CUTOFF = 60;

export const PROGRESS_BAR_STYLES = {
  // How long animation takes to go from one percentage to another, in seconds
  pathTransitionDuration: 0.5,

  // Colors
  textColor: colors.gold.reg,
  pathColor: colors.purple.reg,

  textSize: '30px'
};

export const BADGE_PROPS = {
  [BADGE.BRONZE]: {
    imgSrc: bronzeImg,
    textClassName: 'badge-bronze'
  },
  [BADGE.SILVER]: {
    imgSrc: silverImg,
    textClassName: 'badge-silver'
  },
  [BADGE.GOLD]: {
    imgSrc: goldImg,
    textClassName: 'badge-gold'
  },
  [BADGE.PLATINUM]: {
    imgSrc: platinumImg,
    textClassName: 'badge-platinum'
  }
};

export const ACCOMPLISHMENTS = {
  [PERFORMANCE.CREATE_CARD]: {
    label: 'Create your first card',
    imgSrc: searchCardImg
  },
  [PERFORMANCE.SEARCH_OPEN]: {
    label: 'Search for a card and open it',
    imgSrc: searchCardImg
  },
  [PERFORMANCE.MARK_HELPFUL]: {
    label: 'Mark a card as helpful',
    imgSrc: markHelpfulImg
  },
  [PERFORMANCE.ADD_INTEGRATIONS]: {
    label: "Add my team's integrations",
    imgSrc: addSlackImg
  },

  [PERFORMANCE.ADD_PROFILE_PICTURE]: {
    label: 'Add a profile picture',
    imgSrc: profilePictureImg
  },
  [PERFORMANCE.VERIFY_EXTERNAL]: {
    label: 'Verify an external document',
    imgSrc: externalVerifyImg
  },

  [PERFORMANCE.ALL_UP_TO_DATE]: {
    label: 'Keep all your cards up to date',
    imgSrc: allUpdatedImg
  },
  [PERFORMANCE.ADD_SUBSCRIBER]: {
    label: 'Add a subscriber to one of your cards',
    imgSrc: addSubscriberImg
  },
  [PERFORMANCE.CREATE_CARD_RECENT]: {
    label: 'Created a card this past week',
    imgSrc: createCardImg
  },

  [PERFORMANCE.OPEN_EXTERNAL_DOC]: {
    label: 'Open a document from your integrations',
    imgSrc: existingKnowledgeImg
  },
  [PERFORMANCE.USE_SLACK_FIND]: {
    label: 'Use /find on slack',
    imgSrc: slackFindImg
  }
};
