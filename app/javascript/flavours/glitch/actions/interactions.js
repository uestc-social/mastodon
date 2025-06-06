import { boostModal, favouriteModal } from 'flavours/glitch/initial_state';

import api, { getLinks } from '../api';

import { fetchRelationships } from './accounts';
import { importFetchedAccounts, importFetchedStatus } from './importer';
import { unreblog, reblog } from './interactions_typed';
import { openModal } from './modal';

export const REACTIONS_EXPAND_REQUEST = 'REACTIONS_EXPAND_REQUEST';
export const REACTIONS_EXPAND_SUCCESS = 'REACTIONS_EXPAND_SUCCESS';
export const REACTIONS_EXPAND_FAIL    = 'REACTIONS_EXPAND_FAIL';

export const REBLOGS_EXPAND_REQUEST = 'REBLOGS_EXPAND_REQUEST';
export const REBLOGS_EXPAND_SUCCESS = 'REBLOGS_EXPAND_SUCCESS';
export const REBLOGS_EXPAND_FAIL = 'REBLOGS_EXPAND_FAIL';

export const FAVOURITE_REQUEST = 'FAVOURITE_REQUEST';
export const FAVOURITE_SUCCESS = 'FAVOURITE_SUCCESS';
export const FAVOURITE_FAIL    = 'FAVOURITE_FAIL';

export const UNFAVOURITE_REQUEST = 'UNFAVOURITE_REQUEST';
export const UNFAVOURITE_SUCCESS = 'UNFAVOURITE_SUCCESS';
export const UNFAVOURITE_FAIL    = 'UNFAVOURITE_FAIL';

export const REACTIONS_FETCH_REQUEST = 'REACTIONS_FETCH_REQUEST';
export const REACTIONS_FETCH_SUCCESS = 'REACTIONS_FETCH_SUCCESS';
export const REACTIONS_FETCH_FAIL    = 'REACTIONS_FETCH_FAIL';

export const REBLOGS_FETCH_REQUEST = 'REBLOGS_FETCH_REQUEST';
export const REBLOGS_FETCH_SUCCESS = 'REBLOGS_FETCH_SUCCESS';
export const REBLOGS_FETCH_FAIL    = 'REBLOGS_FETCH_FAIL';

export const FAVOURITES_FETCH_REQUEST = 'FAVOURITES_FETCH_REQUEST';
export const FAVOURITES_FETCH_SUCCESS = 'FAVOURITES_FETCH_SUCCESS';
export const FAVOURITES_FETCH_FAIL    = 'FAVOURITES_FETCH_FAIL';

export const FAVOURITES_EXPAND_REQUEST = 'FAVOURITES_EXPAND_REQUEST';
export const FAVOURITES_EXPAND_SUCCESS = 'FAVOURITES_EXPAND_SUCCESS';
export const FAVOURITES_EXPAND_FAIL = 'FAVOURITES_EXPAND_FAIL';

export const PIN_REQUEST = 'PIN_REQUEST';
export const PIN_SUCCESS = 'PIN_SUCCESS';
export const PIN_FAIL    = 'PIN_FAIL';

export const UNPIN_REQUEST = 'UNPIN_REQUEST';
export const UNPIN_SUCCESS = 'UNPIN_SUCCESS';
export const UNPIN_FAIL    = 'UNPIN_FAIL';

export const BOOKMARK_REQUEST = 'BOOKMARK_REQUEST';
export const BOOKMARK_SUCCESS = 'BOOKMARKED_SUCCESS';
export const BOOKMARK_FAIL    = 'BOOKMARKED_FAIL';

export const UNBOOKMARK_REQUEST = 'UNBOOKMARKED_REQUEST';
export const UNBOOKMARK_SUCCESS = 'UNBOOKMARKED_SUCCESS';
export const UNBOOKMARK_FAIL    = 'UNBOOKMARKED_FAIL';

export const REACTION_UPDATE = 'REACTION_UPDATE';

export const REACTION_ADD_REQUEST = 'REACTION_ADD_REQUEST';
export const REACTION_ADD_SUCCESS = 'REACTION_ADD_SUCCESS';
export const REACTION_ADD_FAIL    = 'REACTION_ADD_FAIL';

export const REACTION_REMOVE_REQUEST = 'REACTION_REMOVE_REQUEST';
export const REACTION_REMOVE_SUCCESS = 'REACTION_REMOVE_SUCCESS';
export const REACTION_REMOVE_FAIL    = 'REACTION_REMOVE_FAIL';

export * from "./interactions_typed";

export function favourite(status) {
  return function (dispatch) {
    dispatch(favouriteRequest(status));

    api().post(`/api/v1/statuses/${status.get('id')}/favourite`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(favouriteSuccess(status));
    }).catch(function (error) {
      dispatch(favouriteFail(status, error));
    });
  };
}

export function unfavourite(status) {
  return (dispatch) => {
    dispatch(unfavouriteRequest(status));

    api().post(`/api/v1/statuses/${status.get('id')}/unfavourite`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unfavouriteSuccess(status));
    }).catch(error => {
      dispatch(unfavouriteFail(status, error));
    });
  };
}

export function favouriteRequest(status) {
  return {
    type: FAVOURITE_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function favouriteSuccess(status) {
  return {
    type: FAVOURITE_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function favouriteFail(status, error) {
  return {
    type: FAVOURITE_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function unfavouriteRequest(status) {
  return {
    type: UNFAVOURITE_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function unfavouriteSuccess(status) {
  return {
    type: UNFAVOURITE_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function unfavouriteFail(status, error) {
  return {
    type: UNFAVOURITE_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function bookmark(status) {
  return function (dispatch) {
    dispatch(bookmarkRequest(status));

    api().post(`/api/v1/statuses/${status.get('id')}/bookmark`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(bookmarkSuccess(status, response.data));
    }).catch(function (error) {
      dispatch(bookmarkFail(status, error));
    });
  };
}

export function unbookmark(status) {
  return (dispatch) => {
    dispatch(unbookmarkRequest(status));

    api().post(`/api/v1/statuses/${status.get('id')}/unbookmark`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unbookmarkSuccess(status, response.data));
    }).catch(error => {
      dispatch(unbookmarkFail(status, error));
    });
  };
}

export function bookmarkRequest(status) {
  return {
    type: BOOKMARK_REQUEST,
    status: status,
  };
}

export function bookmarkSuccess(status, response) {
  return {
    type: BOOKMARK_SUCCESS,
    status: status,
    response: response,
  };
}

export function bookmarkFail(status, error) {
  return {
    type: BOOKMARK_FAIL,
    status: status,
    error: error,
  };
}

export function unbookmarkRequest(status) {
  return {
    type: UNBOOKMARK_REQUEST,
    status: status,
  };
}

export function unbookmarkSuccess(status, response) {
  return {
    type: UNBOOKMARK_SUCCESS,
    status: status,
    response: response,
  };
}

export function unbookmarkFail(status, error) {
  return {
    type: UNBOOKMARK_FAIL,
    status: status,
    error: error,
  };
}

export function fetchReactions(id) {
  return (dispatch, getState) => {
    dispatch(fetchReactionsRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/reactions`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      const accounts = response.data.map(item => item.account);
      dispatch(importFetchedAccounts(accounts));
      dispatch(fetchReactionsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(accounts.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchReactionsFail(id, error));
    });
  };
}

export function fetchReactionsRequest(id) {
  return {
    type: REACTIONS_FETCH_REQUEST,
    id,
  };
}

export function fetchReactionsSuccess(id, reactions, next) {
  return {
    type: REACTIONS_FETCH_SUCCESS,
    id,
    reactions,
    next,
  };
}

export function fetchReactionsFail(id, error) {
  return {
    type: REACTIONS_FETCH_FAIL,
    id,
    error,
  };
}

export function expandReactions(id) {
  return (dispatch, getState) => {
    const url = getState().getIn(['status_reactions', 'reactions', id, 'next']);
    if (url === null) {
      return;
    }

    dispatch(expandReactionsRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      const accounts = response.data.map(item => item.account);

      dispatch(importFetchedAccounts(accounts));
      dispatch(expandReactionsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(accounts.map(item => item.id)));
    }).catch(error => dispatch(expandReactionsFail(id, error)));
  };
}

export function expandReactionsRequest(id) {
  return {
    type: REACTIONS_EXPAND_REQUEST,
    id,
  };
}

export function expandReactionsSuccess(id, reactions, next) {
  return {
    type: REACTIONS_EXPAND_SUCCESS,
    id,
    reactions,
    next,
  };
}

export function expandReactionsFail(id, error) {
  return {
    type: REACTIONS_EXPAND_FAIL,
    id,
    error,
  };
}

export function fetchReblogs(id) {
  return (dispatch) => {
    dispatch(fetchReblogsRequest(id));

    api().get(`/api/v1/statuses/${id}/reblogged_by`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchReblogsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchReblogsFail(id, error));
    });
  };
}

export function fetchReblogsRequest(id) {
  return {
    type: REBLOGS_FETCH_REQUEST,
    id,
  };
}

export function fetchReblogsSuccess(id, accounts, next) {
  return {
    type: REBLOGS_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function fetchReblogsFail(id, error) {
  return {
    type: REBLOGS_FETCH_FAIL,
    id,
    error,
  };
}

export function expandReblogs(id) {
  return (dispatch, getState) => {
    const url = getState().getIn(['user_lists', 'reblogged_by', id, 'next']);
    if (url === null) {
      return;
    }

    dispatch(expandReblogsRequest(id));

    api().get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandReblogsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => dispatch(expandReblogsFail(id, error)));
  };
}

export function expandReblogsRequest(id) {
  return {
    type: REBLOGS_EXPAND_REQUEST,
    id,
  };
}

export function expandReblogsSuccess(id, accounts, next) {
  return {
    type: REBLOGS_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function expandReblogsFail(id, error) {
  return {
    type: REBLOGS_EXPAND_FAIL,
    id,
    error,
  };
}

export function fetchFavourites(id) {
  return (dispatch) => {
    dispatch(fetchFavouritesRequest(id));

    api().get(`/api/v1/statuses/${id}/favourited_by`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchFavouritesSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchFavouritesFail(id, error));
    });
  };
}

export function fetchFavouritesRequest(id) {
  return {
    type: FAVOURITES_FETCH_REQUEST,
    id,
  };
}

export function fetchFavouritesSuccess(id, accounts, next) {
  return {
    type: FAVOURITES_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function fetchFavouritesFail(id, error) {
  return {
    type: FAVOURITES_FETCH_FAIL,
    id,
    error,
  };
}

export function expandFavourites(id) {
  return (dispatch, getState) => {
    const url = getState().getIn(['user_lists', 'favourited_by', id, 'next']);
    if (url === null) {
      return;
    }

    dispatch(expandFavouritesRequest(id));

    api().get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandFavouritesSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => dispatch(expandFavouritesFail(id, error)));
  };
}

export function expandFavouritesRequest(id) {
  return {
    type: FAVOURITES_EXPAND_REQUEST,
    id,
  };
}

export function expandFavouritesSuccess(id, accounts, next) {
  return {
    type: FAVOURITES_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function expandFavouritesFail(id, error) {
  return {
    type: FAVOURITES_EXPAND_FAIL,
    id,
    error,
  };
}

export function pin(status) {
  return (dispatch) => {
    dispatch(pinRequest(status));

    api().post(`/api/v1/statuses/${status.get('id')}/pin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(pinSuccess(status));
    }).catch(error => {
      dispatch(pinFail(status, error));
    });
  };
}

export function pinRequest(status) {
  return {
    type: PIN_REQUEST,
    status,
    skipLoading: true,
  };
}

export function pinSuccess(status) {
  return {
    type: PIN_SUCCESS,
    status,
    skipLoading: true,
  };
}

export function pinFail(status, error) {
  return {
    type: PIN_FAIL,
    status,
    error,
    skipLoading: true,
  };
}

export function unpin (status) {
  return (dispatch) => {
    dispatch(unpinRequest(status));

    api().post(`/api/v1/statuses/${status.get('id')}/unpin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unpinSuccess(status));
    }).catch(error => {
      dispatch(unpinFail(status, error));
    });
  };
}

export function unpinRequest(status) {
  return {
    type: UNPIN_REQUEST,
    status,
    skipLoading: true,
  };
}

export function unpinSuccess(status) {
  return {
    type: UNPIN_SUCCESS,
    status,
    skipLoading: true,
  };
}

export function unpinFail(status, error) {
  return {
    type: UNPIN_FAIL,
    status,
    error,
    skipLoading: true,
  };
}

function toggleReblogWithoutConfirmation(status, visibility) {
  return (dispatch) => {
    if (status.get('reblogged')) {
      dispatch(unreblog({ statusId: status.get('id') }));
    } else {
      dispatch(reblog({ statusId: status.get('id'), visibility }));
    }
  };
}

export function toggleReblog(statusId, skipModal = false) {
  return (dispatch, getState) => {
    const state = getState();
    let status = state.statuses.get(statusId);

    if (!status)
      return;

    // The reblog modal expects a pre-filled account in status
    // TODO: fix this by having the reblog modal get a statusId and do the work itself
    status = status.set('account', state.accounts.get(status.get('account')));

    const missing_description_setting = state.getIn(['local_settings', 'confirm_boost_missing_media_description']);
    const missing_description = status.get('media_attachments').some(item => !item.get('description'));
    if (missing_description_setting && missing_description && !status.get('reblogged')) {
      dispatch(openModal({ modalType: 'BOOST', modalProps: { status, onReblog: (status, privacy) => dispatch(toggleReblogWithoutConfirmation(status, privacy)), missingMediaDescription: true } }));
    } else if (boostModal && !skipModal) {
      dispatch(openModal({ modalType: 'BOOST', modalProps: { status, onReblog: (status, privacy) => dispatch(toggleReblogWithoutConfirmation(status, privacy)) } }));
    } else {
      dispatch(toggleReblogWithoutConfirmation(status));
    }
  };
}

export function toggleFavourite(statusId, skipModal = false) {
  return (dispatch, getState) => {
    const state = getState();
    let status = state.statuses.get(statusId);

    if (!status)
      return;

    // The favourite modal expects a pre-filled account in status
    // TODO: fix this by having the reblog modal get a statusId and do the work itself
    status = status.set('account', state.accounts.get(status.get('account')));

    if (status.get('favourited')) {
      dispatch(unfavourite(status));
    } else {
      if (favouriteModal && !skipModal) {
        dispatch(openModal({ modalType: 'FAVOURITE', modalProps: { status, onFavourite: (status) => dispatch(favourite(status)) } }));
      } else {
        dispatch(favourite(status));
      }
    }
  };
}

export const addReaction = (statusId, name, url) => (dispatch, getState) => {
  const status = getState().get('statuses').get(statusId);
  let alreadyAdded = false;
  if (status) {
    const reaction = status.get('reactions').find(x => x.get('name') === name);
    if (reaction && reaction.get('me')) {
      alreadyAdded = true;
    }
  }
  if (!alreadyAdded) {
    dispatch(addReactionRequest(statusId, name, url));
  }

  // encodeURIComponent is required for the Keycap Number Sign emoji, see:
  // <https://github.com/glitch-soc/mastodon/pull/1980#issuecomment-1345538932>
  api(getState).post(`/api/v1/statuses/${statusId}/react/${encodeURIComponent(name)}`).then((response) => {
    dispatch(importFetchedStatus(response.data));
    dispatch(addReactionSuccess(statusId, name));
  }).catch(err => {
    if (!alreadyAdded) {
      dispatch(addReactionFail(statusId, name, err));
    }
  });
};

export const addReactionRequest = (statusId, name, url) => ({
  type: REACTION_ADD_REQUEST,
  id: statusId,
  name,
  url,
});

export const addReactionSuccess = (statusId, name) => ({
  type: REACTION_ADD_SUCCESS,
  id: statusId,
  name,
});

export const addReactionFail = (statusId, name, error) => ({
  type: REACTION_ADD_FAIL,
  id: statusId,
  name,
  error,
});

export const removeReaction = (statusId, name) => (dispatch, getState) => {
  dispatch(removeReactionRequest(statusId, name));

  api(getState).post(`/api/v1/statuses/${statusId}/unreact/${encodeURIComponent(name)}`).then((response) => {
    dispatch(importFetchedStatus(response.data));
    dispatch(removeReactionSuccess(statusId, name));
  }).catch(err => {
    dispatch(removeReactionFail(statusId, name, err));
  });
};

export const removeReactionRequest = (statusId, name) => ({
  type: REACTION_REMOVE_REQUEST,
  id: statusId,
  name,
});

export const removeReactionSuccess = (statusId, name) => ({
  type: REACTION_REMOVE_SUCCESS,
  id: statusId,
  name,
});

export const removeReactionFail = (statusId, name) => ({
  type: REACTION_REMOVE_FAIL,
  id: statusId,
  name,
});
