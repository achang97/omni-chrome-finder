import { USER_BADGE } from 'appConstants/profile';
import { colors } from 'styles/colors';

import bronzeImg from 'assets/images/badges/bronze.svg';
import silverImg from 'assets/images/badges/silver.svg';
import goldImg from 'assets/images/badges/gold.svg';
import platinumImg from 'assets/images/badges/platinum.svg';

import searchCardImg from 'assets/images/accomplishments/search-card.png';
import createCardImg from 'assets/images/accomplishments/create-card.png';
import flagOutdatedImg from 'assets/images/accomplishments/flag-outdated.png';
import markHelpfulImg from 'assets/images/accomplishments/mark-helpful.png';
import contextSearchImg from 'assets/images/accomplishments/context-search.png';

import profilePictureImg from 'assets/images/accomplishments/profile-picture.png';
import ownFourImg from 'assets/images/accomplishments/own-four.png';

import allUpdatedImg from 'assets/images/accomplishments/all-updated.png';
import addSubscriberImg from 'assets/images/accomplishments/add-subscriber.png';
import addTagImg from 'assets/images/accomplishments/add-tag.png';

import addSlackImg from 'assets/images/accomplishments/add-slack.png';
import addDriveImg from 'assets/images/accomplishments/add-drive.png';
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
  [USER_BADGE.BRONZE]: {
    imgSrc: bronzeImg,
    textClassName: 'badge-bronze'
  },
  [USER_BADGE.SILVER]: {
    imgSrc: silverImg,
    textClassName: 'badge-silver'
  },
  [USER_BADGE.GOLD]: {
    imgSrc: goldImg,
    textClassName: 'badge-gold'
  },
  [USER_BADGE.PLATINUM]: {
    imgSrc: platinumImg,
    textClassName: 'badge-platinum'
  }
};

export const ACCOMPLISHMENT_IMAGES = {
  'Make your first card': {
    imgSrc: searchCardImg
  },
  'Search for a card and open it': {
    imgSrc: searchCardImg
  },
  'Create a card in the extension': {
    imgSrc: createCardImg
  },
  'Flag a card as out of date': {
    imgSrc: flagOutdatedImg
  },
  'Mark a card as helpful': {
    imgSrc: markHelpfulImg
  },
  'Highlight, right click, and search Omni': {
    imgSrc: contextSearchImg
  },

  'Add a profile picture': {
    imgSrc: profilePictureImg
  },
  'Own at least 4 cards': {
    imgSrc: ownFourImg
  },

  'Keep all your cards up to date': {
    imgSrc: allUpdatedImg
  },
  'Add a subscriber to one of your cards': {
    imgSrc: addSubscriberImg
  },
  'Add a tag to one of your cards': {
    imgSrc: addTagImg
  },
  'Created a card this past week': {
    imgSrc: createCardImg
  },

  'Add the Slack integration': {
    imgSrc: addSlackImg
  },
  'Add the Google Drive integration': {
    imgSrc: addDriveImg
  },
  'Open a document from your integrations': {
    imgSrc: existingKnowledgeImg
  },
  'Use /find on slack': {
    imgSrc: slackFindImg
  }
};
