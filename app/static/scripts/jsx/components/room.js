export default class Room extends React.Component {

  render() {
    var roomClassName = "room " + this.props.occupation;

    var targetOccupation;
    switch(this.props.occupation) {
      case 'available':
        targetOccupation = 'reserved';
        break;
      case 'reserved':
        targetOccupation = 'available';
        break;
      case 'occupied':
        targetOccupation = 'occupied';
    }

    return (
      <div className={ roomClassName } onClick={ () => this.props.openPopup(this.props.slotName, this.props.roomName, targetOccupation, this.props.owner) }>
        Room {this.props.roomName}
      </div>
    );
  }
}
