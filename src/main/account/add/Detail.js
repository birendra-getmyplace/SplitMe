import React, {PropTypes, Component} from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import Paper from 'material-ui-build/src/Paper';
import TextField from 'material-ui-build/src/TextField';
import ListItem from 'material-ui-build/src/List/ListItem';
import IconPeople from 'material-ui-build/src/svg-icons/social/people';
import IconSync from 'material-ui-build/src/svg-icons/notification/sync';
import Toggle from 'material-ui-build/src/Toggle';
import {connect} from 'react-redux';

import config from 'config';
import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import accountAddActions from 'main/account/add/actions';
import MemberAvatar from 'main/member/Avatar';
import MemberAdd from 'main/member/Add';

const styles = {
  listItemBody: {
    margin: '-16px 0 0',
  },
  listItemNested: {
    margin: '-16px 0 0 -16px',
  },
};

class AccountDetail extends Component {
  static propTypes = {
    account: PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  handleChangeName = (event) => {
    this.props.dispatch(accountAddActions.changeName(event.target.value));
  };

  handleAddMember = (member) => {
    this.props.dispatch(accountAddActions.addMember(member));
  };

  handleToggleShare = (event, toggle) => {
    this.props.dispatch(accountAddActions.toggleShare(toggle));
  };

  onChangeEmail = (memberId, event) => {
    this.props.dispatch(accountAddActions.changeMemberEmail(event.target.value, memberId));
  };

  render() {
    const {
      account,
    } = this.props;

    return (
      <Paper rounded={false}>
        <ListItem disabled={true}>
          <TextField
            hintText={polyglot.t('account_name_hint')}
            value={account.get('name')}
            fullWidth={true}
            onChange={this.handleChangeName}
            style={styles.listItemBody}
            floatingLabelText={polyglot.t('name')}
            autoFocus={!account.get('_id')}
            data-test="AccountAddName"
          />
        </ListItem>
        <ListItem disabled={true} leftIcon={<IconPeople />}>
          <div>
            {polyglot.t('members')}
            {account.get('members').map((member) => {
              return (
                <ListItem
                  key={member.get('id')} disabled={true}
                  leftAvatar={<MemberAvatar member={member} />}
                >
                  <div data-test="AccountAddMember">
                    {accountUtils.getNameMember(member)}
                  </div>
                  {account.get('share') &&
                    <TextField
                      hintText={polyglot.t('email')}
                      defaultValue={member.get('email')}
                      fullWidth={true}
                      onChange={this.onChangeEmail.bind(this, member.get('id'))}
                    />
                  }
                </ListItem>
              );
            })}
            <MemberAdd onAddMember={this.handleAddMember} />
          </div>
        </ListItem>
        {config.name !== 'production' && (
          <ListItem disabled={true} leftIcon={<IconSync />}>
            <div style={styles.listItemNested}>
              <ListItem
                primaryText={polyglot.t('account_add_shared')}
                rightToggle={
                  <Toggle defaultToggled={account.get('share')} onToggle={this.handleToggleShare} />
                }
              />
            </div>
          </ListItem>
        )}
      </Paper>
    );
  }
}

export default pure(connect()(AccountDetail));