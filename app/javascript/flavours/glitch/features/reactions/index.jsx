import PropTypes from 'prop-types';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { Helmet } from 'react-helmet';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import { debounce } from 'lodash';

import MoodIcon from '@/material-icons/400-24px/mood.svg?react';
import RefreshIcon from '@/material-icons/400-24px/refresh.svg?react';
import { Account } from 'flavours/glitch/components/account';
import { Icon }  from 'flavours/glitch/components/icon';

import { fetchReactions, expandReactions } from '../../actions/interactions';
import ColumnHeader from '../../components/column_header';
import { LoadingIndicator } from '../../components/loading_indicator';
import ScrollableList from '../../components/scrollable_list';
import Column from '../ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.reacted_by', defaultMessage: 'Reacted by' },
  refresh: { id: 'refresh', defaultMessage: 'Refresh' },
});

const mapStateToProps = (state, props) => ({
  reactions: state.getIn(['status_reactions', 'reactions', props.params.statusId, 'items']),
  hasMore: !!state.getIn(['status_reactions', 'reactions', props.params.statusId, 'next']),
  isLoading: state.getIn(['status_reactions', 'reactions', props.params.statusId, 'isLoading'], true),
});

class Reactions extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    reactions: ImmutablePropTypes.orderedSet,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    multiColumn: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  UNSAFE_componentWillMount () {
    if (!this.props.reactions) {
      this.props.dispatch(fetchReactions(this.props.params.statusId));
    }
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  setRef = c => {
    this.column = c;
  };

  handleRefresh = () => {
    this.props.dispatch(fetchReactions(this.props.params.statusId));
  };

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandReactions(this.props.params.statusId));
  }, 300, { leading: true });

  render () {
    const { intl, reactions, hasMore, isLoading, multiColumn } = this.props;

    if (!reactions) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    const emptyMessage = <FormattedMessage id='status.reactions.empty' defaultMessage='No one has reacted to this post yet. When someone does, they will show up here.' />;

    return (
      <Column ref={this.setRef}>
        <ColumnHeader
          icon='mood'
          iconComponent={MoodIcon}
          title={intl.formatMessage(messages.heading)}
          onClick={this.handleHeaderClick}
          showBackButton
          multiColumn={multiColumn}
          extraButton={(
            <button type='button' className='column-header__button' title={intl.formatMessage(messages.refresh)} aria-label={intl.formatMessage(messages.refresh)} onClick={this.handleRefresh}><Icon id='refresh' icon={RefreshIcon} /></button>
          )}
        />

        <ScrollableList
          scrollKey='reactions'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          bindToDocument={!multiColumn}
        >
          {reactions.map(r =>
            <Account key={r.id} id={r.account} withNote={false} overlayEmoji={r} />,
          )}
        </ScrollableList>

        <Helmet>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }
}

export default connect(mapStateToProps)(injectIntl(Reactions));
