export default class Popup extends React.Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <p>{this.props.text}</p>
          <button id="btn" onClick={this.props.confirmPopup}>Validate</button>
          <button onClick={this.props.discardPopup}>Cancel</button>
        </div>
      </div>
    );
  }
}
