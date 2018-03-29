import { rooms, slots } from './managervars';
import ReservationManager from './components/reservationmanager';

var initialRoomOccupation = {};
for(var i=0; i<slots.length; i++){
  initialRoomOccupation[slots[i]] = {};
  for(var j=0; j<rooms.length; j++){
    initialRoomOccupation[slots[i]][rooms[j]] = {
      "occupation": "occupied",
      "owner": undefined
    }
  }
}

ReactDOM.render(
  <div>
    <ReservationManager initialRoomOccupation={ initialRoomOccupation }/>
  </div>,
  document.getElementById('app')
);
