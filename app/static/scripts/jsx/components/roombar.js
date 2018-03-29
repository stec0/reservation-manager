import Room from './room'

export default class RoomBar extends React.Component {
  render() {
    var roomsToRender = [];
    var roomsIds = Object.keys(this.props.roomOccupation).sort();
    for (var i=0; i<roomsIds.length; i++) {
      roomsToRender.push(<Room roomName={ roomsIds[i] } occupation={ this.props.roomOccupation[roomsIds[i]]["occupation"] } owner={ this.props.roomOccupation[roomsIds[i]]["owner"] } slotName={ this.props.slotName } openPopup={ this.props.openPopup }/>);
    }
    return (
      <div className="roombar">{ roomsToRender }</div>
    )
  }
}
