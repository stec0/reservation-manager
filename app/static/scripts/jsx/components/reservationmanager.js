import Admin from './admin';
import Instructions from './instructions';
import Popup from './popup';
import RoomBar from './roombar';
import SlotMenu from './slotmenu';
import Welcome from './welcome';

import { abi, contract_address } from '../contractinfos';
import { rooms, slots } from '../managervars.js';

export default class ReservationManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomOccupation: this.props.initialRoomOccupation,
      showAdmin: undefined,
      chosenSlot: undefined,
      userAuthorized: undefined,
      userAddress: undefined,
      userCompany: undefined,
      userName: undefined,
      showPopup: false,
      popupText: undefined,
      targetRoom: undefined,
      targetOccupation: undefined
    }
  }

  componentWillMount() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      window.web3js = new Web3(web3.currentProvider);
    } else {
      document.getElementById("app").innerHTML('Please install Metamask to use this app')
    }

    // Creating our contract instance
    window.rm = web3js.eth.contract(abi).at(contract_address);

    // Adapting the app to the user
    this.isUserAuthorized(this.customApp);

  }

  isUserAuthorized = (callback) => {
    rm.isAuthorized(
      (e, r) => {
        this.setState(
          {
            userAuthorized: r,
            userCompany: !r ? 'unknown' : undefined
          }
        );
        if(r) {
          callback();
        }
      }
    );
  }

  customApp = () => {
    this.setState({userAddress: web3js.eth.accounts[0]});
    this.getUserName();
    this.getUserCompany();
    this.getRoomOccupation();
  }

  getUserName = () => {
    fetch(
      '/name/' + web3js.eth.accounts[0],
      {
        method: 'get',
        headers: {'Content-Type':'application/json'}
      }
    ).then(
      (r) => {
        return r.json()
      }
    ).then(
      (r) => {
        this.setState({userName: r['name']});
      }
    );
  }

  getUserCompany = () => {
    rm.getUserCompany(
      (e, r) => {
        let showAdmin = (r=="admin") ? true : false;
        this.setState({showAdmin: showAdmin, userCompany: r});
      }
    );
  }

  getRoomOccupation = () => {
    let inputSlots = slots.map(web3js.fromAscii);
    let inputRooms = rooms.map(web3js.fromAscii);
    let userAddress = web3js.eth.accounts[0];
    let roomOccupation = {};
    let self = this;
    for(var i=0; i<slots.length; i++){
      roomOccupation[slots[i]] = {};
      for(var j=0; j<rooms.length; j++){
        // wrapping to save current context
        (
          function(wi, wj){
            rm.getReservationStatus(
              inputSlots[wi],
              inputRooms[wj],
              (e, r) => {
                let occ;
                if(r[0]) {
                  occ = "available";
                } else if(r[1] == userAddress) {
                  occ = "reserved";
                } else {
                  occ = "occupied";
                }
                roomOccupation[slots[wi]][rooms[wj]] = {
                  occupation: occ,
                  owner: r[1]
                }
                self.setState({roomOccupation: roomOccupation});
              }
            );
          }
        )(i,j)
      }
    }
  }

  registerUserName = (userName) => {
    let payload = {
      "address": web3js.eth.accounts[0],
      "name": userName
    };
    fetch(
      '/register',
      {
        method: 'post',
        body: JSON.stringify(payload)
      }
    ).then(
      (r) => {
        if(r.status == '200') {
          this.setState({userName: userName});
        }
      }
    );
  }

  eraseUserName = () => {
    fetch(
      '/erase/' + web3js.eth.accounts[0],
      {
        method: 'get',
        headers: {'Content-Type':'application/json'}
      }
    ).then(
      (r) => {
        if(r.status == '200') {
          this.setState({userName: null});
        }
      }
    )
  }

  addNewUser(address, company){
    rm.authorizeNewUser(
      address,
      company,
      (e, r) => {
        // add flash message to validate action?
        console.log(
          "user " + address + " of company " + company + " is now authorized"
        );
      }
    );
    document.getElementById('address').value = "";
  }

  resetReservations() {
    let inputSlots = slots.map(web3js.fromAscii);
    let inputRooms = rooms.map(web3js.fromAscii);
    for(var i=0; i<inputSlots.length; i++){
      (
        function(wi){
          rm.resetReservationsForSlot(
            inputSlots[i],
            inputRooms,
            (e, r) => {
                console.log("Reservations have been resetted for slot " + slots[wi] + " and " + inputRooms.length + " rooms.");
            }
          );
        }
      )(i)
    }
  }

  openPopup = (targetSlot, targetRoom, targetOccupation, owner) => {
    let popupText;

    switch(targetOccupation) {
      case 'available':
        popupText = "Are you sure you want to cancel your reservation for this room ?";
        break;
      case 'reserved':
        popupText = "Are you sure you want to make a reservation for this room ?";
        break;
      case 'occupied':
        popupText = "This room has been reserved by " + owner + ". You can't modify someone else's reservation."
    }

    this.setState(
      {
        roomOccupation: this.state.roomOccupation,
        showPopup: true,
        popupText: popupText,
        targetSlot: targetSlot,
        targetRoom: targetRoom,
        targetOccupation: targetOccupation
      }
    );
  }

  confirmPopup = () => {
    switch(this.state.targetOccupation){
      case "reserved":
        this.makeReservation();
        break;
      case "available":
        this.cancelReservation();
        break;
      case "occupied":
        this.updateAfterAgendaChange();
        this.discardPopup();
    }
  }

  makeReservation() {
    let tSlot = web3js.fromAscii(this.state.targetSlot);
    let tRoom = web3js.fromAscii(this.state.targetRoom);
    document.getElementById("btn").setAttribute("disabled", "disabled");
    rm.makeReservation(
      tSlot,
      tRoom,
      (e, r) => {
        if(!e) {
          this.updateAfterAgendaChange();
          console.log(
            "User " + web3js.eth.accounts[0] + " made a reservation for slot "
            + this.state.targetSlot + " and room " + this.state.targetRoom);
        }
        this.discardPopup();
      }
    )
  }

  cancelReservation() {
    let tSlot = web3js.fromAscii(this.state.targetSlot);
    let tRoom = web3js.fromAscii(this.state.targetRoom);
    document.getElementById("btn").setAttribute("disabled", "disabled");
    rm.cancelReservation(
      tSlot,
      tRoom,
      (e, r) => {
        if(!e) {
          this.updateAfterAgendaChange();
          console.log(
            "User " + web3js.eth.accounts[0] + " cancelled her reservation for slot "
            + this.state.targetSlot + " and room " + this.state.targetRoom);
        }
        this.discardPopup();
      }
    )
  }

  updateAfterAgendaChange() {
    let newRoomOccupation = this.state.roomOccupation;
    newRoomOccupation[this.state.targetSlot][this.state.targetRoom]["occupation"] = this.state.targetOccupation;
    this.setState(
      {
        roomOccupation: newRoomOccupation
      }
    );
  }

  discardPopup = () => {
    document.getElementById("btn").removeAttribute("disabled");
    this.setState(
      {
        showPopup: false,
        popupText: undefined,
        targetRoom: undefined,
        targetSlot: undefined,
        targetOccupation: undefined
      }
    );
  }

  chooseSlot = (slot) => {
    this.setState({chosenSlot: slot});
  }

  render() {
    return (
        <div>
            <Welcome userAuthorized={this.state.userAuthorized} userAddress={this.state.userAddress} userName={this.state.userName} userCompany={this.state.userCompany} registerUserName={this.registerUserName} eraseUserName={this.eraseUserName}/>
            { this.state.showAdmin ? <Admin resetReservations={this.resetReservations} addNewUser={this.addNewUser}/> : null }
            { this.state.userAuthorized ? <Instructions /> : null }
            { this.state.userAuthorized ? <SlotMenu chooseSlot={this.chooseSlot}/> : null }
            { this.state.chosenSlot ? <RoomBar slotName={this.state.chosenSlot} roomOccupation={this.state.roomOccupation[this.state.chosenSlot]} openPopup={this.openPopup}/> : null }
            { this.state.showPopup ? <Popup text={this.state.popupText} confirmPopup={this.confirmPopup} discardPopup={this.discardPopup} /> : null }
        </div>
    )
  }
}
