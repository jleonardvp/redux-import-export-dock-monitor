import React, { PropTypes, Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { ActionCreators } from 'redux-devtools';

const { importState } = ActionCreators;

import reducer from './reducers';
import InputDock from './InputDock';

export default class ImportExportMonitor extends Component {
  static update = reducer;

  constructor(props) {
    super(props);

    this.handleImport = this.handleImport.bind(this);
    this.getStateAndActions = this.getStateAndActions.bind(this);
  }

  static propTypes = {
    dispatch: PropTypes.func,
    computedStates: PropTypes.array,
    stagedActionIds: PropTypes.array,
    actionsById: PropTypes.object,
    currentStateIndex: PropTypes.number,
    committedState: PropTypes.object,
    monitorState: PropTypes.shape({
      initialScrollTop: PropTypes.number
    }),
    stagedActions: PropTypes.array,
    skippedActionIds: PropTypes.array,
    nextActionId: PropTypes.number,
    select: PropTypes.func.isRequired
  };

  static defaultProps = {
    select: (state) => state
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleImport(newState) {
    try {
      const appState = JSON.parse(newState);
      this.props.dispatch(importState(appState));
    } catch (e) {
      console.warn('Invalid app state JSON passed into the input prompt: ', e);
      this.props.dispatch(importState(this.getStateAndActions()));
    }
  }

  getStateAndActions() {
    return {
      monitorState: this.props.monitorState,
      actionsById: this.props.actionsById,
      nextActionId: this.props.nextActionId,
      stagedActionIds: this.props.stagedActionIds,
      skippedActionIds: this.props.skippedActionIds,
      committedState: this.props.committedState,
      computedStates: [], // trigger instrument.recomputeStates()
      currentStateIndex: this.props.currentStateIndex
    };
  }

  render() {
    const appState = JSON.stringify(this.getStateAndActions());

    return (
      <InputDock
        appState={appState}
        onSubmit={this.handleImport}
      />
    );
  }
}
