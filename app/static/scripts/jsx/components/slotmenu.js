import { slots } from '../managervars.js';

export default class SlotMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlighted: undefined
    }
  }

  selectSlot(slot){
    this.setState({highlighted: slot});
    this.props.chooseSlot(slot);
  }

  render() {
    var self = this;
    var slotsToRender = [];
    for (var i=0; i<slots.length; i++) {
      (
        function(wi){
          slotsToRender.push(
            <div className={ slots[wi] == self.state.highlighted ? 'slot highlighted' : 'slot regular' } onClick={ () => self.selectSlot(slots[wi]) }>{slots[wi]}</div>
          );
        }
      )(i)
    }
    return (
      <div className="slotmenu"> { slotsToRender } </div>
    )
  }
}
