export default class Admin extends React.Component {
  render() {
    return (
      <div className="admin">
      <button onClick={this.props.resetReservations}>Reset reservations</button>
      <input id="address" placeholder='enter user address' />
      <select id="company">
        <option value="coke">Coke</option>
        <option value="pepsi">Pepsi</option>
      </select>
      <button onClick={
        () => this.props.addNewUser(
          document.getElementById('address').value,
          document.getElementById('company').value)
        }>Add a new user</button>
      </div>
    );
  }
}
