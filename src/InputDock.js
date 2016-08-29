import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { saveAs } from 'file-saver';

export default class InputDock extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    appState: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.saveStateToDisk = this.saveStateToDisk.bind(this);
    this.loadStateFromDisk = this.loadStateFromDisk.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  saveStateToDisk() {
    saveAs(new File([this.props.appState], "appState.json", {type: "text/json;charset=utf-8"}))
  }

  loadStateFromDisk(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.props.onSubmit(reader.result);
    }

    reader.readAsText(file)
  }

  render() {
    return (
      <div>
        <button style={{ flex: 1 }} onClick={this.saveStateToDisk}>Save State</button>
        <br/><br/>
        Load State <input type="file" id="fileInput" onChange={this.loadStateFromDisk}/>
      </div>
    );
  }
}
