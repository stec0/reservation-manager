export default class Logo extends React.Component {
  render() {
    var className = 'logo ' + this.props.location;
    var imgsrc = '/static/images/' + this.props.userCompany + '.png';
    return (
      <div>
        { this.props.userCompany ? <img className ={ className } src={ imgsrc }/> : null}
      </div>
    );
  }
}
