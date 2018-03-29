pragma solidity ^0.4.19;

contract ReservationManager {

	address owner;

	struct Room {
    bytes32 name;
    bool available;
    address reservationOwner;
	}

  mapping (bytes32 => Room[]) timeSlotsReservations;
  mapping (bytes32 => uint) roomsIndex;

  mapping (address => string) authorizedUsers;

  function ReservationManager() public {
    owner = msg.sender;
    authorizeNewUser(msg.sender, "admin");
  }

	//// public functions
	function isAuthorized() public view returns (bool) {
		return bytes(authorizedUsers[msg.sender]).length != 0;
	}

  //// authorized users functions
	// get the current state of the agenda
	function getReservationStatus(bytes32 slot, bytes32 room) public view returns (bool, address) {
		require(isAuthorized());
		require(existsReservation(slot, room));
		bool available = timeSlotsReservations[slot][roomsIndex[room] - 1].available;
		address reservationOwner =  timeSlotsReservations[slot][roomsIndex[room] - 1].reservationOwner;
		return (available, reservationOwner);
	}

	function existsReservation(bytes32 slot, bytes32 room) private view returns (bool) {
		if(roomsIndex[room] == 0){
				return false;
		} else {
				return (timeSlotsReservations[slot][roomsIndex[room] - 1].name == room);
		}
	}

	function getUserCompany() public view returns (string) {
		require(isAuthorized());
		return authorizedUsers[msg.sender];
	}

	// make or cancel reservations
  event agendaModification(
    bytes32 timeslot,
    bytes32 room,
    address reservationOwner,
    string modificationType
  );

  function makeReservation(bytes32 slot, bytes32 room) public {
    require(isAuthorized());
    require(existsReservation(slot, room));
		require(isAvailable(slot, room));

    timeSlotsReservations[slot][roomsIndex[room] - 1].available = false;
    timeSlotsReservations[slot][roomsIndex[room] - 1].reservationOwner = msg.sender;

    agendaModification(slot, room, msg.sender, "reservation");
  }

  function cancelReservation(bytes32 slot, bytes32 room) public {
    require(isAuthorized());
    require(existsReservation(slot, room));
		require(isReservationOwner(slot, room, msg.sender));

    timeSlotsReservations[slot][roomsIndex[room] - 1].available = true;
    timeSlotsReservations[slot][roomsIndex[room] - 1].reservationOwner = address(0);

    agendaModification(slot, room, msg.sender, "cancellation");
  }

	function isAvailable(bytes32 slot, bytes32 room) private view returns (bool) {
		return timeSlotsReservations[slot][roomsIndex[room] - 1].available;
	}

	function isReservationOwner(bytes32 slot, bytes32 room, address rowner) private view returns (bool) {
		return timeSlotsReservations[slot][roomsIndex[room] - 1].reservationOwner == rowner;
	}

  //// owner's functions
  function authorizeNewUser(address newUser, string company) public {
    require(msg.sender == owner);
    authorizedUsers[newUser] = company;
  }

	function resetReservationsForSlot(bytes32 slot, bytes32[] rooms) public {
		require(msg.sender == owner);
		Room memory newRoom = Room(0, true, address(0));
		for(uint i=0; i<rooms.length; i++){
		    newRoom.name = rooms[i];
		    roomsIndex[rooms[i]] = timeSlotsReservations[slot].push(newRoom);
		}
	}

}
