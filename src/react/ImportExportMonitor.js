import React, { PropTypes, findDOMNode, Component } from 'react';
import LogMonitorEntry from 'redux-devtools/lib/react/LogMonitorEntry';
import ReactZeroClipboard from 'react-zeroclipboard';

export default class LogMonitor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputOpen: false,
      importValue: ''
    };
  }

  static propTypes = {
    computedStates: PropTypes.array.isRequired,
    currentStateIndex: PropTypes.number.isRequired,
    monitorState: PropTypes.object.isRequired,
    stagedActions: PropTypes.array.isRequired,
    skippedActions: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    commit: PropTypes.func.isRequired,
    rollback: PropTypes.func.isRequired,
    sweep: PropTypes.func.isRequired,
    toggleAction: PropTypes.func.isRequired,
    jumpToState: PropTypes.func.isRequired,
    setMonitorState: PropTypes.func.isRequired,
    recomputeStates: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired
  };

  static defaultProps = {
    select: (state) => state,
    monitorState: {isVisible: true}
  };

  componentWillReceiveProps(nextProps) {
    const node = findDOMNode(this);
    if (!node) {
      this.scrollDown = true;
    } else if (
      this.props.stagedActions.length < nextProps.stagedActions.length
    ) {
      const scrollableNode = node.parentElement;
      const { scrollTop, offsetHeight, scrollHeight } = scrollableNode;

      this.scrollDown = Math.abs(
        scrollHeight - (scrollTop + offsetHeight)
      ) < 20;
    } else {
      this.scrollDown = false;
    }
  }

  componentDidUpdate() {
    const node = findDOMNode(this);
    if (!node) {
      return;
    }

    if (this.scrollDown) {
      const scrollableNode = node.parentElement;
      const { offsetHeight, scrollHeight } = scrollableNode;

      scrollableNode.scrollTop = scrollHeight - offsetHeight;
      this.scrollDown = false;
    }
  }

  handleImport() {
    let importValue = JSON.parse(this.state.importValue);
    let { committedState, stagedActions } = importValue;

    this.toggleInput();
    this.props.recomputeStates(committedState, stagedActions);
  }

  getStateAndActions() {
    return JSON.stringify({
      committedState: this.props.computedStates[0].state,
      stagedActions: this.props.stagedActions
    });
  }

  handleInputChange(event) {
    this.setState({
      importValue: event.target.value
    });
  }

  toggleInput() {
    this.setState({
      inputOpen: !this.state.inputOpen
    });
  }

  renderInput() {
    return (
      <div>
        <input type='text' name='import' onChange={::this.handleInputChange}/>
        <a onClick={::this.handleImport}
           style={{ textDecoration: 'underline', cursor: 'hand' }}>
          <small>Save</small>
        </a>
      </div>
    );
  }

  render() {
    const { monitorState, skippedActions, stagedActions, computedStates, select } = this.props;

    const serializedState = this.getStateAndActions();

    const input = this.state.inputOpen ? this.renderInput() : <div></div>;

    return (
      <div style={{
        fontFamily: 'monospace',
        position: 'relative',
        padding: '1rem',
        color: 'black'
      }}>
        <div>
          <div style={{
            paddingBottom: '.5rem'
          }}>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <a style={{ textDecoration: 'underline', cursor: 'hand' }}>
              <ReactZeroClipboard text={serializedState}>
                <small>Export</small>
              </ReactZeroClipboard>
            </a>
            <a onClick={::this.toggleInput}
               style={{ textDecoration: 'underline', cursor: 'hand' }}>
              <small>Import</small>
            </a>
          </div>
        </div>
        {input}
      </div>
    );
  }
}
